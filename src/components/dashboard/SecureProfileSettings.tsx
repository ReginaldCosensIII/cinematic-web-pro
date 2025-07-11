
import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Eye, EyeOff } from 'lucide-react';

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
      if (!formData.current_password) {
        newErrors.current_password = 'Current password is required to change password';
      }

      if (formData.new_password) {
        const passwordIssues = validatePassword(formData.new_password);
        if (passwordIssues.length > 0) {
          newErrors.new_password = passwordIssues[0];
        }
      }

      if (formData.new_password !== formData.confirm_password) {
        newErrors.confirm_password = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    const sanitizedValue = field === 'full_name' ? sanitizeInput(value) : value;
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setIsUpdating(true);

    try {
      const { error: profileError } = await supabase.auth.updateUser({
        data: { full_name: formData.full_name }
      });

      if (profileError) {
        console.error('Profile update error:', profileError);
        toast.error('Failed to update profile information');
        return;
      }

      if (formData.new_password && formData.current_password) {
        // First verify current password by attempting to sign in
        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: user.email!,
          password: formData.current_password
        });

        if (verifyError) {
          console.error('Current password verification failed:', verifyError);
          toast.error('Current password is incorrect');
          return;
        }

        // Current password verified, proceed with password update
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.new_password
        });

        if (passwordError) {
          console.error('Password update error:', passwordError);
          toast.error('Failed to update password');
          return;
        }

        // Log security event for password change
        try {
          await supabase.rpc('log_security_event', {
            p_event_type: 'password_changed',
            p_user_id: user.id,
            p_details: { timestamp: new Date().toISOString() }
          });
        } catch (logError) {
          console.error('Failed to log security event:', logError);
        }

        setFormData(prev => ({
          ...prev,
          current_password: '',
          new_password: '',
          confirm_password: ''
        }));

        toast.success('Profile and password updated successfully');
      } else {
        toast.success('Profile updated successfully');
      }

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Card className="w-full max-w-2xl glass-effect border-webdev-glass-border bg-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-webdev-silver">
          <Shield className="w-5 h-5" />
          Secure Profile Settings
        </CardTitle>
        <CardDescription className="text-webdev-soft-gray">
          Update your profile information and security settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-webdev-silver">Full Name</Label>
            <Input
              id="full_name"
              type="text"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              className={`bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver ${errors.full_name ? 'border-red-500' : ''}`}
              maxLength={100}
              required
            />
            {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-webdev-silver">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email || ''}
              disabled
              className="bg-webdev-darker-gray/50 border-webdev-glass-border text-webdev-soft-gray"
            />
            <p className="text-sm text-webdev-soft-gray">Email cannot be changed from this interface</p>
          </div>

          <Alert className="glass-effect border-webdev-glass-border bg-webdev-darker-gray/30">
            <Shield className="h-4 w-4 text-webdev-gradient-blue" />
            <AlertDescription className="text-webdev-soft-gray">
              Leave password fields empty if you don't want to change your password
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_password" className="text-webdev-silver">Current Password</Label>
              <div className="relative">
                <Input
                  id="current_password"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.current_password}
                  onChange={(e) => handleInputChange('current_password', e.target.value)}
                  className={`bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver ${errors.current_password ? 'border-red-500' : ''}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-webdev-soft-gray hover:text-webdev-silver"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.current_password && <p className="text-sm text-red-500">{errors.current_password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password" className="text-webdev-silver">New Password</Label>
              <div className="relative">
                <Input
                  id="new_password"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.new_password}
                  onChange={(e) => handleInputChange('new_password', e.target.value)}
                  className={`bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver ${errors.new_password ? 'border-red-500' : ''}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-webdev-soft-gray hover:text-webdev-silver"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.new_password && <p className="text-sm text-red-500">{errors.new_password}</p>}
              {formData.new_password && (
                <div className="text-sm text-webdev-soft-gray">
                  <p>Password requirements:</p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li className={formData.new_password.length >= 8 ? 'text-green-400' : 'text-red-400'}>
                      At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(formData.new_password) ? 'text-green-400' : 'text-red-400'}>
                      One uppercase letter
                    </li>
                    <li className={/[a-z]/.test(formData.new_password) ? 'text-green-400' : 'text-red-400'}>
                      One lowercase letter
                    </li>
                    <li className={/\d/.test(formData.new_password) ? 'text-green-400' : 'text-red-400'}>
                      One number
                    </li>
                    <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.new_password) ? 'text-green-400' : 'text-red-400'}>
                      One special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password" className="text-webdev-silver">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.confirm_password}
                  onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                  className={`bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver ${errors.confirm_password ? 'border-red-500' : ''}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-webdev-soft-gray hover:text-webdev-silver"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.confirm_password && <p className="text-sm text-red-500">{errors.confirm_password}</p>}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full glass-effect border border-webdev-glass-border bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple hover:opacity-90 text-white transition-all duration-300"
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SecureProfileSettings;
