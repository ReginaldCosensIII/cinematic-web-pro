
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Menu, X, Save, User, Shield, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveProfile = () => {
    toast({
      title: 'Success',
      description: 'Profile settings updated successfully',
    });
  };

  const handlePasswordChange = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Success',
      description: 'Password updated successfully',
    });
    
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  if (!user) {
    return <div>Please log in to access settings.</div>;
  }

  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Mobile Sidebar Toggle */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="fixed top-24 left-4 z-50 glass-effect rounded-xl p-3 border border-webdev-glass-border lg:hidden"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-webdev-silver" />
              ) : (
                <Menu className="w-5 h-5 text-webdev-silver" />
              )}
            </button>
          )}

          <div className="flex gap-4 md:gap-8">
            {/* Sidebar */}
            <div className={`
              ${isMobile ? 'fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out' : 'hidden lg:block w-64 flex-shrink-0'}
              ${sidebarOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'}
            `}>
              {isMobile && (
                <div className="pt-24">
                  <AdminSidebar />
                </div>
              )}
              {!isMobile && <AdminSidebar />}
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobile && sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            <div className="flex-1 min-w-0">
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-light text-webdev-silver mb-2">Admin Settings</h1>
                <p className="text-sm md:text-base text-webdev-soft-gray">Manage your admin account and preferences</p>
              </div>

              <div className="space-y-6">
                {/* Profile Settings */}
                <Card className="glass-effect border-webdev-glass-border">
                  <CardHeader>
                    <CardTitle className="text-webdev-silver flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription className="text-webdev-soft-gray">
                      Update your basic account information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-webdev-silver">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                      />
                    </div>
                    <Button 
                      onClick={handleSaveProfile}
                      variant="glass"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </Button>
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card className="glass-effect border-webdev-glass-border">
                  <CardHeader>
                    <CardTitle className="text-webdev-silver flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Security Settings
                    </CardTitle>
                    <CardDescription className="text-webdev-soft-gray">
                      Change your password and security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-webdev-silver">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-webdev-silver">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-webdev-silver">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                      />
                    </div>
                    <Button 
                      onClick={handlePasswordChange}
                      variant="glass"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </CardContent>
                </Card>

                {/* Preferences */}
                <Card className="glass-effect border-webdev-glass-border">
                  <CardHeader>
                    <CardTitle className="text-webdev-silver flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Preferences
                    </CardTitle>
                    <CardDescription className="text-webdev-soft-gray">
                      Customize your admin dashboard experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-webdev-silver">Dark Mode</Label>
                        <p className="text-sm text-webdev-soft-gray">Use dark theme for the dashboard</p>
                      </div>
                      <Switch
                        checked={darkMode}
                        onCheckedChange={setDarkMode}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-webdev-silver">Email Notifications</Label>
                        <p className="text-sm text-webdev-soft-gray">Receive notifications about system events</p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminSettings;
