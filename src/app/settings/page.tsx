'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '~/lib/auth-context';
import { useTheme } from '~/components/ThemeProvider';
import { Header } from '~/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Switch } from '~/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';
import { LogOut, Save, Lock, User, Bell, Eye, Palette } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  pageVariants, 
  cardVariants, 
  buttonVariants, 
  inputVariants, 
  containerVariants, 
  itemVariants, 
  notificationVariants,
  spinnerVariants,
  fadeInVariants 
} from '~/lib/animations';

interface UserSettings {
  displayName: string;
  bio: string;
  theme: string;
  defaultPastePublic: boolean;
  emailNotifications: boolean;
  showEmail: boolean;
  allowPublicProfile: boolean;
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [settings, setSettings] = useState<UserSettings>({
    displayName: '',
    bio: '',
    theme: theme,
    defaultPastePublic: true,
    emailNotifications: true,
    showEmail: false,
    allowPublicProfile: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [dataLoading, setDataLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      
      if (data.user) {} // this is so scuffed
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setSettings({
        displayName: user.displayName || '',
        bio: user.bio || '',
        theme: theme,
        defaultPastePublic: user.defaultPastePublic ?? true,
        emailNotifications: user.emailNotifications ?? true,
        showEmail: user.showEmail ?? false,
        allowPublicProfile: user.allowPublicProfile ?? true,
      });
      setDataLoading(false);
    }
  }, [user, router, theme]);

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const profileData = {
        displayName: settings.displayName,
        bio: settings.bio,
      };

      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (settingData: Partial<UserSettings>) => {
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingData),
      });

      if (!response.ok) {
        console.error('Failed to update setting');
      }

      if (settingData.theme && settingData.theme !== theme) {
        setTheme(settingData.theme as 'light' | 'dark' | 'system');
      }
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setPasswordSuccess('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user || dataLoading) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center"
        initial="initial"
        animate="animate"
        variants={pageVariants}
      >
        <motion.div 
          className="text-center"
          initial="initial"
          animate="animate"
          variants={cardVariants}
        >
          <motion.div 
            className="rounded-full h-8 w-8 border-b-2 border-primary mx-auto"
            animate="animate"
            variants={spinnerVariants}
          />
          <motion.p 
            className="mt-2 text-muted-foreground"
            initial="initial"
            animate="animate"
            variants={fadeInVariants}
          >
            Loading...
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <Header 
        title="Account Settings" 
        subtitle="Manage your account preferences and security settings" 
      />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div 
          className="grid gap-6 md:grid-cols-1 lg:grid-cols-3"
          initial="initial"
          animate="animate"
          variants={containerVariants}
        >
          <motion.div 
            className="lg:col-span-2 space-y-6"
            variants={itemVariants}
          >
            <motion.div
              initial="initial"
              animate="animate"
              variants={cardVariants}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your public profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSettingsSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={user.username}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Username cannot be changed
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user.email}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={settings.displayName}
                      onChange={(e) => setSettings(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Your display name (optional)"
                      maxLength={50}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={settings.bio}
                      onChange={(e) => setSettings(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself (optional)"
                      maxLength={500}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      {settings.bio.length}/500 characters
                    </p>
                  </div>

                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-md border border-green-200 dark:border-green-800">
                      {success}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-2">
                    Changes to preferences, privacy, and notifications are saved automatically.
                  </p>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            </motion.div>

            <motion.div
              initial="initial"
              animate="animate"
              variants={cardVariants}
            >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Preferences
                </CardTitle>
                <CardDescription>
                  Customize your experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => {
                      setSettings(prev => ({ ...prev, theme: value }));
                      updateSetting({ theme: value });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Default paste visibility</Label>
                    <p className="text-sm text-muted-foreground">
                      Make new pastes public by default
                    </p>
                  </div>
                  <Switch
                    checked={settings.defaultPastePublic}
                    onCheckedChange={(checked) => {
                      setSettings(prev => ({ ...prev, defaultPastePublic: checked }));
                      updateSetting({ defaultPastePublic: checked });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            </motion.div>

            <motion.div
              initial="initial"
              animate="animate"
              variants={cardVariants}
            >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Privacy
                </CardTitle>
                <CardDescription>
                  Control your privacy and visibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show email on profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your email address on your public profile
                    </p>
                  </div>
                  <Switch
                    checked={settings.showEmail}
                    onCheckedChange={(checked) => {
                      setSettings(prev => ({ ...prev, showEmail: checked }));
                      updateSetting({ showEmail: checked });
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow others to view your profile and public pastes
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowPublicProfile}
                    onCheckedChange={(checked) => {
                      setSettings(prev => ({ ...prev, allowPublicProfile: checked }));
                      updateSetting({ allowPublicProfile: checked });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            </motion.div>

            <motion.div
              initial="initial"
              animate="animate"
              variants={cardVariants}
            >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Manage your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications about your account activity
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => {
                      setSettings(prev => ({ ...prev, emailNotifications: checked }));
                      updateSetting({ emailNotifications: checked });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </motion.div>

          <motion.div 
            className="space-y-6"
            variants={itemVariants}
          >
            <motion.div
              initial="initial"
              animate="animate"
              variants={cardVariants}
            >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your account password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>

                  {passwordError && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-md border border-green-200 dark:border-green-800">
                      {passwordSuccess}
                    </div>
                  )}

                  <Button type="submit" disabled={passwordLoading} className="w-full">
                    {passwordLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Changing...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            </motion.div>

            <motion.div
              initial="initial"
              animate="animate"
              variants={cardVariants}
            >
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>
                  Manage your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Separator />
                <Button
                  variant="destructive"
                  onClick={logout}
                  className="w-full flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}
