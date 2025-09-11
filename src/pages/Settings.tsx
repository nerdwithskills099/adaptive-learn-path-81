import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, Download, Globe, Bell, Shield } from 'lucide-react';

const Settings = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    roll_number: '',
    class_grade: '',
    school_name: '',
    language_preference: 'en',
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        roll_number: profile.roll_number || '',
        class_grade: profile.class_grade || '',
        school_name: profile.school_name || '',
        language_preference: profile.language_preference || 'en',
      });
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Profile updated successfully",
        description: "Your changes have been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      // Fetch assessment data
      const { data: assessments, error } = await supabase
        .from('assessments')
        .select(`
          *,
          assessment_responses (
            *,
            questions (*)
          )
        `)
        .eq('student_id', profile?.id)
        .eq('is_completed', true)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      // Generate PDF content (simplified version)
      const reportData = {
        student: profile,
        assessments: assessments,
        generatedAt: new Date().toISOString(),
      };

      // Create downloadable JSON for now (in real app, this would be PDF)
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assessment-report-${profile?.full_name}-${new Date().toLocaleDateString()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Report downloaded",
        description: "Your assessment report has been downloaded.",
      });
    } catch (error: any) {
      toast({
        title: "Error downloading report",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'hi', label: 'Hindi' },
    { value: 'zh', label: 'Chinese' },
  ];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information and academic details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                {profile?.role === 'student' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="roll_number">Roll Number</Label>
                      <Input
                        id="roll_number"
                        value={profileData.roll_number}
                        onChange={(e) => setProfileData({ ...profileData, roll_number: e.target.value })}
                        placeholder="Enter your roll number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="class_grade">Class/Grade</Label>
                      <Input
                        id="class_grade"
                        value={profileData.class_grade}
                        onChange={(e) => setProfileData({ ...profileData, class_grade: e.target.value })}
                        placeholder="Enter your class/grade"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="school_name">School Name</Label>
                      <Input
                        id="school_name"
                        value={profileData.school_name}
                        onChange={(e) => setProfileData({ ...profileData, school_name: e.target.value })}
                        placeholder="Enter your school name"
                      />
                    </div>
                  </>
                )}
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language Preferences
            </CardTitle>
            <CardDescription>
              Choose your preferred language for the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={profileData.language_preference} 
                  onValueChange={(value) => setProfileData({ ...profileData, language_preference: value })}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdateProfile} disabled={isLoading}>
                Save Language Preference
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports & Downloads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Reports & Downloads
            </CardTitle>
            <CardDescription>
              Download your assessment reports and progress data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Assessment Report</h4>
                  <p className="text-sm text-muted-foreground">
                    Download a comprehensive report of all your assessments and progress.
                  </p>
                </div>
                <Button onClick={handleDownloadReport} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Practice History</h4>
                  <p className="text-sm text-muted-foreground">
                    Download your practice session history and performance data.
                  </p>
                </div>
                <Button variant="outline" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Coming Soon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Manage how you receive notifications about your progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Assessment Reminders</h4>
                  <p className="text-sm text-muted-foreground">
                    Get reminded when it's time for your next assessment.
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Progress Updates</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly progress summaries and achievements.
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Manage your privacy settings and account security.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Data Export</h4>
                  <p className="text-sm text-muted-foreground">
                    Request a copy of all your data stored in our system.
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Export Data
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Account Deletion</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data.
                  </p>
                </div>
                <Button variant="destructive" size="sm" disabled>
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;