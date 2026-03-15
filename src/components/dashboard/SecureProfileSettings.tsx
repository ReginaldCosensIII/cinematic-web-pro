
import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Eye, EyeOff, Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface SecureProfileSettingsProps {
  user: User;
  onUpdate?: () => void;
}

interface FormData {
  full_name: string;
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface FormErrors {
  full_name?: string;
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
}

const SecureProfileSettings = ({ user, onUpdate }: SecureProfileSettingsProps) => {
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    full_name: user.user_metadata?.full_name || '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  const validatePassword = (password: string): string[] => {
    const issues = [];
    if (password.length < 8) issues.push('Password must be at least 8 characters long');
    if (!/[A-Z]/.test(password)) issues.push('Password must contain at least one uppercase letter');
    if (!/[a-z]/.test(password)) issues.push('Password must contain at least one lowercase letter');
    if (!/\d/.test(password)) issues.push('Password must contain at least one number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) issues.push('Password must contain at least one special character');
    return issues;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.full_name || formData.full_name.length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters long';
    }
    if (formData.new_password || formData.current_password || formData.confirm_password) {
      if (!formData.current_password) newErrors.current_password = 'Current password is required to change password';
      if (formData.new_password) {
        const passwordIssues = validatePassword(formData.new_password);
        if (passwordIssues.length > 0) newErrors.new_password = passwordIssues[0];
      }
      if (formData.new_password !== formData.confirm_password) newErrors.confirm_password = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    const sanitizedValue = field === 'full_name' ? sanitizeInput(value) : value;
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) { toast.error('Please fix the form errors before submitting'); return; }
    setIsUpdating(true);
    try {
      const { error: profileError } = await supabase.auth.updateUser({ data: { full_name: formData.full_name } });
      if (profileError) { toast.error('Failed to update profile information'); return; }

      if (formData.new_password && formData.current_password) {
        const { error: verifyError } = await supabase.auth.signInWithPassword({ email: user.email!, password: formData.current_password });
        if (verifyError) { toast.error('Current password is incorrect'); return; }
        const { error: passwordError } = await supabase.auth.updateUser({ password: formData.new_password });
        if (passwordError) { toast.error('Failed to update password'); return; }
        try { await supabase.rpc('log_security_event', { p_event_type: 'password_changed', p_user_id: user.id, p_details: { timestamp: new Date().toISOString() } }); } catch {}
        setFormData(prev => ({ ...prev, current_password: '', new_password: '', confirm_password: '' }));
        toast.success('Profile and password updated successfully');
      } else {
        toast.success('Profile updated successfully');
      }
      if (onUpdate) onUpdate();
    } catch { toast.error('An unexpected error occurred'); } finally { setIsUpdating(false); }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="space-y-6 w-full max-w-2xl">
      {/* Theme Preference Card */}
      <Card className="glass-effect border-none bg-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-wdp-text">
            <Palette className="w-5 h-5" />
            Theme Preference
          </CardTitle>
          <CardDescription className="text-wdp-text-secondary">
            Choose your preferred visual theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                theme === 'dark'
                  ? 'border-webdev-gradient-blue bg-webdev-gradient-blue/10'
                  : 'glass-effect hover:border-webdev-gradient-blue/50'
              }`}
            >
              <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-webdev-gradient-blue' : 'text-wdp-text-secondary'}`} />
              <span className={`font-medium ${theme === 'dark' ? 'text-webdev-gradient-blue' : 'text-wdp-text-secondary'}`}>Dark</span>
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                theme === 'light'
                  ? 'border-webdev-gradient-blue bg-webdev-gradient-blue/10'
                  : 'glass-effect hover:border-webdev-gradient-blue/50'
              }`}
            >
              <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-webdev-gradient-blue' : 'text-wdp-text-secondary'}`} />
              <span className={`font-medium ${theme === 'light' ? 'text-webdev-gradient-blue' : 'text-wdp-text-secondary'}`}>Light</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings Card */}
      <Card className="glass-effect border-none bg-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-wdp-text">
            <Shield className="w-5 h-5" />
            Secure Profile Settings
          </CardTitle>
          <CardDescription className="text-wdp-text-secondary">
            Update your profile information and security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-wdp-text">Full Name</Label>
              <Input id="full_name" type="text" value={formData.full_name} onChange={(e) => handleInputChange('full_name', e.target.value)} className={errors.full_name ? 'border-red-500' : ''} maxLength={100} required />
              {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-wdp-text">Email</Label>
              <Input id="email" type="email" value={user.email || ''} disabled className="opacity-50" />
              <p className="text-sm text-wdp-text-secondary">Email cannot be changed from this interface</p>
            </div>

            <Alert className="glass-effect border-none">
              <Shield className="h-4 w-4 text-webdev-gradient-blue" />
              <AlertDescription className="text-wdp-text-secondary">
                Leave password fields empty if you don't want to change your password
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {(['current_password', 'new_password', 'confirm_password'] as const).map((field) => {
                const label = field === 'current_password' ? 'Current Password' : field === 'new_password' ? 'New Password' : 'Confirm New Password';
                const showKey = field === 'current_password' ? 'current' : field === 'new_password' ? 'new' : 'confirm';
                return (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field} className="text-wdp-text">{label}</Label>
                    <div className="relative">
                      <Input id={field} type={showPasswords[showKey] ? 'text' : 'password'} value={formData[field]} onChange={(e) => handleInputChange(field, e.target.value)} className={errors[field] ? 'border-red-500' : ''} />
                      <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-wdp-text-secondary hover:text-wdp-text" onClick={() => togglePasswordVisibility(showKey)}>
                        {showPasswords[showKey] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors[field] && <p className="text-sm text-red-500">{errors[field]}</p>}
                  </div>
                );
              })}
              {formData.new_password && (
                <div className="text-sm text-wdp-text-secondary">
                  <p>Password requirements:</p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li className={formData.new_password.length >= 8 ? 'text-green-400' : 'text-red-400'}>At least 8 characters</li>
                    <li className={/[A-Z]/.test(formData.new_password) ? 'text-green-400' : 'text-red-400'}>One uppercase letter</li>
                    <li className={/[a-z]/.test(formData.new_password) ? 'text-green-400' : 'text-red-400'}>One lowercase letter</li>
                    <li className={/\d/.test(formData.new_password) ? 'text-green-400' : 'text-red-400'}>One number</li>
                    <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.new_password) ? 'text-green-400' : 'text-red-400'}>One special character</li>
                  </ul>
                </div>
              )}
            </div>

            <Button type="submit" variant="glass" className="w-full" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureProfileSettings;
