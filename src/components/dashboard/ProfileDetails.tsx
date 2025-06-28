
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User as UserIcon, Mail, Building, Phone, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ProfileDetailsProps {
  user: User;
}

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

const ProfileDetails = ({ user }: ProfileDetailsProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: user.email || '',
    phone: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
        if (data) {
          setFormData({
            full_name: data.full_name || '',
            username: data.username || '',
            email: user.email || '',
            phone: ''
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          username: formData.username,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });

      setIsEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        email: user.email || '',
        phone: ''
      });
    }
  };

  if (loading) {
    return (
      <div className="glass-effect rounded-2xl p-8 border border-webdev-glass-border">
        <div className="animate-pulse">
          <div className="h-6 bg-webdev-darker-gray rounded mb-4 w-48"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-webdev-darker-gray rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-2xl p-8 border border-webdev-glass-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light text-webdev-silver">Profile Details</h2>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="glass-effect hover:glass-border bg-transparent text-webdev-silver hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)]"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="glass-effect hover:glass-border bg-transparent text-webdev-silver hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)]"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="glass-effect border-webdev-glass-border text-webdev-soft-gray hover:text-webdev-silver"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="full_name" className="text-webdev-silver flex items-center gap-2 mb-2">
              <UserIcon className="w-4 h-4" />
              Full Name
            </Label>
            {isEditing ? (
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver focus:border-webdev-gradient-blue"
              />
            ) : (
              <div className="glass-effect rounded-lg p-3 border border-webdev-glass-border text-webdev-silver">
                {formData.full_name || 'Not provided'}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-webdev-silver flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <div className="glass-effect rounded-lg p-3 border border-webdev-glass-border text-webdev-silver opacity-60">
              {formData.email}
              <span className="text-webdev-soft-gray text-xs ml-2">(Cannot be changed)</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-webdev-silver flex items-center gap-2 mb-2">
              <UserIcon className="w-4 h-4" />
              Username
            </Label>
            {isEditing ? (
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver focus:border-webdev-gradient-blue"
              />
            ) : (
              <div className="glass-effect rounded-lg p-3 border border-webdev-glass-border text-webdev-silver">
                {formData.username || 'Not provided'}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="text-webdev-silver flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            {isEditing ? (
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver focus:border-webdev-gradient-blue"
                placeholder="Coming soon..."
                disabled
              />
            ) : (
              <div className="glass-effect rounded-lg p-3 border border-webdev-glass-border text-webdev-silver opacity-60">
                Coming soon...
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-webdev-glass-border">
        <div className="flex items-center gap-4 text-sm text-webdev-soft-gray">
          <span>Account created: {format(new Date(user.created_at), 'MMMM d, yyyy')}</span>
          <span>•</span>
          <span>Last sign in: {user.last_sign_in_at ? format(new Date(user.last_sign_in_at), 'MMMM d, yyyy') : 'Never'}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
