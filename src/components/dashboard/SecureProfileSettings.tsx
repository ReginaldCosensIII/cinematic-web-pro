
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

    // Validate full name
    if (!formData.full_name || formData.full_name.length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters long';
    }

    // Validate password change if attempted
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
    
    // Clear error when user starts typing
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
      // Update profile metadata
      const { error: profileError } = await supabase.auth.updateUser({
        data: { full_name: formData.full_name }
      });

      if (profileError) {
        console.error('Profile update error:', profileError);
        toast.error('Failed to update profile information');
        return;
      }

      // Update password if provided
      if (formData.new_password && formData.current_password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.new_password
        });

        if (passwordError) {
          console.error('Password update error:', passwordError);
          if (passwordError.message.includes('Invalid login credentials')) {
            toast.error('Current password is incorrect');
          } else {
            toast.error('Failed to update password');
          }
          return;
        }

        // Clear password fields on success
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
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Secure Profile Settings
        </CardTitle>
        <CardDescription>
          Update your profile information and security settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              type="text"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              className={errors.full_name ? 'border-red-500' : ''}
              maxLength={100}
              required
            />
            {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email || ''}
              disabled
              className="bg-gray-50"
            />
            <p className="text-sm text-gray-500">Email cannot be changed from this interface</p>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Leave password fields empty if you don't want to change your password
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current_password"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.current_password}
                  onChange={(e) => handleInputChange('current_password', e.target.value)}
                  className={errors.current_password ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.current_password && <p className="text-sm text-red-500">{errors.current_password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <div className="relative">
                <Input
                  id="new_password"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.new_password}
                  onChange={(e) => handleInputChange('new_password', e.target.value)}
                  className={errors.new_password ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.new_password && <p className="text-sm text-red-500">{errors.new_password}</p>}
              {formData.new_password && (
                <div className="text-sm text-gray-600">
                  <p>Password requirements:</p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li className={formData.new_password.length >= 8 ? 'text-green-600' : 'text-red-500'}>
                      At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(formData.new_password) ? 'text-green-600' : 'text-red-500'}>
                      One uppercase letter
                    </li>
                    <li className={/[a-z]/.test(formData.new_password) ? 'text-green-600' : 'text-red-500'}>
                      One lowercase letter
                    </li>
                    <li className={/\d/.test(formData.new_password) ? 'text-green-600' : 'text-red-500'}>
                      One number
                    </li>
                    <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.new_password) ? 'text-green-600' : 'text-red-500'}>
                      One special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.confirm_password}
                  onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                  className={errors.confirm_password ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
            className="w-full"
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
