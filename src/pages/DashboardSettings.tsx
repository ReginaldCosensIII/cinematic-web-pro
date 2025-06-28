
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Settings, Mail, Lock, Trash2, Moon, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DashboardSettings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
      setMessage('Email update sent! Please check your inbox to confirm.');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setIsUpdating(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setMessage('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-webdev-black flex items-center justify-center">
        <div className="text-webdev-silver">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <DashboardSidebar />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 space-y-8">
              <div className="glass-effect rounded-2xl p-8 border border-webdev-glass-border">
                <div className="flex items-center gap-4 mb-8">
                  <Settings className="w-8 h-8 text-webdev-gradient-blue" />
                  <h1 className="text-3xl font-light text-webdev-silver">Settings</h1>
                </div>

                {message && (
                  <div className="mb-6 p-4 rounded-xl glass-effect border border-webdev-glass-border">
                    <p className="text-webdev-silver text-sm">{message}</p>
                  </div>
                )}

                <div className="space-y-8">
                  {/* Email Settings */}
                  <div className="glass-effect rounded-xl p-6 border border-webdev-glass-border">
                    <div className="flex items-center gap-3 mb-4">
                      <Mail className="w-5 h-5 text-webdev-gradient-blue" />
                      <h3 className="text-xl font-light text-webdev-silver">Email Settings</h3>
                    </div>
                    <form onSubmit={handleUpdateEmail} className="space-y-4">
                      <div>
                        <label className="block text-webdev-soft-gray text-sm font-medium mb-2">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="glass-effect bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver focus:border-webdev-gradient-blue"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="glass-effect px-4 py-2 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden group border border-transparent hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)] text-sm disabled:opacity-50"
                      >
                        <span className="relative z-10">
                          {isUpdating ? 'Updating...' : 'Update Email'}
                        </span>
                      </button>
                    </form>
                  </div>

                  {/* Password Settings */}
                  <div className="glass-effect rounded-xl p-6 border border-webdev-glass-border">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock className="w-5 h-5 text-webdev-gradient-blue" />
                      <h3 className="text-xl font-light text-webdev-silver">Password Settings</h3>
                    </div>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div>
                        <label className="block text-webdev-soft-gray text-sm font-medium mb-2">
                          New Password
                        </label>
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="glass-effect bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver focus:border-webdev-gradient-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-webdev-soft-gray text-sm font-medium mb-2">
                          Confirm New Password
                        </label>
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="glass-effect bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver focus:border-webdev-gradient-blue"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isUpdating || !newPassword || newPassword !== confirmPassword}
                        className="glass-effect px-4 py-2 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden group border border-transparent hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)] text-sm disabled:opacity-50"
                      >
                        <span className="relative z-10">
                          {isUpdating ? 'Updating...' : 'Update Password'}
                        </span>
                      </button>
                    </form>
                  </div>

                  {/* Theme Settings */}
                  <div className="glass-effect rounded-xl p-6 border border-webdev-glass-border">
                    <div className="flex items-center gap-3 mb-4">
                      <Moon className="w-5 h-5 text-webdev-gradient-blue" />
                      <h3 className="text-xl font-light text-webdev-silver">Theme Settings</h3>
                    </div>
                    <p className="text-webdev-soft-gray text-sm mb-4">
                      Dark mode is currently enabled. Light mode coming soon.
                    </p>
                    <button
                      disabled
                      className="glass-effect px-4 py-2 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden group border border-transparent hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)] text-sm opacity-50 cursor-not-allowed"
                    >
                      <span className="relative z-10">Toggle Theme (Coming Soon)</span>
                    </button>
                  </div>

                  {/* Account Information */}
                  <div className="glass-effect rounded-xl p-6 border border-webdev-glass-border">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="w-5 h-5 text-webdev-gradient-blue" />
                      <h3 className="text-xl font-light text-webdev-silver">Account Information</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-webdev-soft-gray">Account Created:</span>
                        <span className="text-webdev-silver">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-webdev-soft-gray">Last Sign In:</span>
                        <span className="text-webdev-silver">
                          {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="glass-effect rounded-xl p-6 border border-red-500/20 bg-red-500/5">
                    <div className="flex items-center gap-3 mb-4">
                      <Trash2 className="w-5 h-5 text-red-400" />
                      <h3 className="text-xl font-light text-red-400">Danger Zone</h3>
                    </div>
                    <p className="text-webdev-soft-gray text-sm mb-4">
                      Request account deletion. This action cannot be undone.
                    </p>
                    <button
                      disabled
                      className="glass-effect px-4 py-2 rounded-xl text-red-400 hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden group border border-red-500/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] text-sm opacity-50 cursor-not-allowed"
                    >
                      <span className="relative z-10">Request Account Deletion (Coming Soon)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardSettings;
