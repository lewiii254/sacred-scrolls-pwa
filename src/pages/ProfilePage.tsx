import { useState, useEffect } from 'react';
import { Layout } from "@/components/Layout";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Calendar, BookOpen, Heart, Star, Trophy, Settings, User, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  preferred_translation: string | null;
  theme: string | null;
  created_at: string;
}

interface UserStats {
  totalNotes: number;
  totalBookmarks: number;
  totalHighlights: number;
  readingStreak: number;
  chaptersRead: number;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalNotes: 0,
    totalBookmarks: 0,
    totalHighlights: 0,
    readingStreak: 0,
    chaptersRead: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [preferredTranslation, setPreferredTranslation] = useState('KJV');
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    if (user) {
      loadProfile();
      loadUserStats();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
        setDisplayName(data.display_name || '');
        setPreferredTranslation(data.preferred_translation || 'KJV');
        setTheme(data.theme || 'system');
      } else {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: user.id,
              display_name: user.email?.split('@')[0] || 'User',
              preferred_translation: 'KJV',
              theme: 'system'
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
        } else if (newProfile) {
          setProfile(newProfile);
          setDisplayName(newProfile.display_name || '');
          setPreferredTranslation(newProfile.preferred_translation || 'KJV');
          setTheme(newProfile.theme || 'system');
        }
      }
    } catch (error) {
      console.error('Error in loadProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    if (!user) return;

    try {
      // Get notes count
      const { count: notesCount } = await supabase
        .from('user_notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get bookmarks count
      const { count: bookmarksCount } = await supabase
        .from('user_bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get highlights count
      const { count: highlightsCount } = await supabase
        .from('user_highlights')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get reading streak
      const { data: streakData } = await supabase
        .from('reading_streaks')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      let currentStreak = 0;
      let totalChapters = 0;

      if (streakData && streakData.length > 0) {
        // Calculate current streak
        const today = new Date();
        let checkDate = new Date(today);
        
        for (const streak of streakData) {
          const streakDate = new Date(streak.date);
          const diffDays = Math.floor((checkDate.getTime() - streakDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 1) {
            currentStreak++;
            totalChapters += streak.chapters_read || 1;
            checkDate = new Date(streakDate);
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }

      setStats({
        totalNotes: notesCount || 0,
        totalBookmarks: bookmarksCount || 0,
        totalHighlights: highlightsCount || 0,
        readingStreak: currentStreak,
        chaptersRead: totalChapters
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const saveProfile = async () => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          preferred_translation: preferredTranslation,
          theme: theme
        })
        .eq('user_id', user.id);

      if (error) {
        toast.error('Failed to save profile');
        console.error('Error saving profile:', error);
      } else {
        toast.success('Profile saved successfully!');
        await loadProfile();
      }
    } catch (error) {
      toast.error('Error saving profile');
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Please sign in to view your profile.</p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const initials = displayName ? displayName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{displayName || 'User'}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Trophy className="h-3 w-3" />
                  <span>{stats.readingStreak} day streak</span>
                </Badge>
                <Badge variant="outline">
                  {stats.chaptersRead} chapters read
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stats.totalNotes}</div>
              <p className="text-sm text-muted-foreground">Notes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">{stats.totalBookmarks}</div>
              <p className="text-sm text-muted-foreground">Bookmarks</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{stats.totalHighlights}</div>
              <p className="text-sm text-muted-foreground">Highlights</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{stats.readingStreak}</div>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Settings */}
        <Tabs defaultValue="settings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={saveProfile} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Reading Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="translation">Preferred Bible Translation</Label>
                  <Select value={preferredTranslation} onValueChange={setPreferredTranslation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KJV">King James Version (KJV)</SelectItem>
                      <SelectItem value="NIV">New International Version (NIV)</SelectItem>
                      <SelectItem value="ESV">English Standard Version (ESV)</SelectItem>
                      <SelectItem value="NLT">New Living Translation (NLT)</SelectItem>
                      <SelectItem value="ASV">American Standard Version (ASV)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
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

                <div className="flex justify-end">
                  <Button onClick={saveProfile} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Daily Devotional Reminders</h4>
                      <p className="text-sm text-muted-foreground">Get notified about your daily devotional</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Reading Plan Progress</h4>
                      <p className="text-sm text-muted-foreground">Track your reading plan milestones</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Weekly Scripture Highlights</h4>
                      <p className="text-sm text-muted-foreground">Receive curated verses and insights</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Reading Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Reading Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Bible Reading Progress</span>
                  <span>{Math.round((stats.chaptersRead / 1189) * 100)}%</span>
                </div>
                <Progress value={(stats.chaptersRead / 1189) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.chaptersRead} of 1,189 chapters completed
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.readingStreak}</div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.chaptersRead}</div>
                  <p className="text-sm text-muted-foreground">Total Chapters</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}