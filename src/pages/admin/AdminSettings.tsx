import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { getAdminAuthHeaders } from '@/contexts/AuthContext';

const AdminSettings = () => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [headline, setHeadline] = useState('');
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [featuredProject, setFeaturedProject] = useState('');
  const [openToWork, setOpenToWork] = useState<boolean | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState('');

  // Populate local form state when profile data arrives
  const currentName = name || (profile?.name || '');
  const currentTitle = title || (profile?.title || '');
  const currentHeadline = headline || (profile?.headline || '');
  const currentStatus = status || (profile?.status || '');
  const currentEmail = email || (profile?.email || '');
  const currentLocation = location || (profile?.location || '');
  const currentGithub = github || (profile?.github || '');
  const currentLinkedin = linkedin || (profile?.linkedin || '');
  const currentWebsite = website || (profile?.website || '');
  const currentAnnouncement = announcement || (profile?.announcement || '');
  const currentFeaturedProject = featuredProject || (profile?.featuredProject || '');
  const currentOpenToWork = openToWork !== null ? openToWork : (profile?.openToWork ?? true);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        name: currentName,
        title: currentTitle,
        headline: currentHeadline,
        status: currentStatus,
        email: currentEmail,
        location: currentLocation,
        github: currentGithub,
        linkedin: currentLinkedin,
        website: currentWebsite,
        announcement: currentAnnouncement,
        featuredProject: currentFeaturedProject,
        openToWork: currentOpenToWork,
      });
      toast({
        title: 'Profile Updated',
        description: 'Profile settings persisted directly to Vercel Blob & Edge Config.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update profile settings',
        variant: 'destructive',
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await fetch(`/api/blob?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        headers: getAdminAuthHeaders(),
        body: file,
      });

      if (res.ok) {
        const data = await res.json();
        setUploadedResumeUrl(data.url);
        // Automatically link uploaded resume to profile
        await updateProfile.mutateAsync({
          resumeUrl: data.url,
          resumeFilename: file.name,
        });
        toast({
          title: 'Vercel Blob Upload',
          description: `Uploaded ${file.name} successfully to Vercel Blob & linked to profile!`,
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      toast({
        title: 'Upload Error',
        description: 'Could not upload file to Vercel Blob.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Vercel Cloud Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your dynamic profile metadata, contact info, and file assets stored in Vercel Blob & Edge Config.
        </p>
      </div>

      {/* Dynamic Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Global Profile Metadata (Vercel Blob & Edge Config)</CardTitle>
          <CardDescription>
            These values power your Windows XP and Windows Phone desktop, menus, about dialogs, and AI assistant dynamically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-4">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading live profile...
            </div>
          ) : (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prof-name">Display Name</Label>
                  <Input
                    id="prof-name"
                    value={currentName}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prof-title">Professional Title</Label>
                  <Input
                    id="prof-title"
                    value={currentTitle}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Full Stack Software Engineer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prof-email">Contact Email</Label>
                  <Input
                    id="prof-email"
                    type="email"
                    value={currentEmail}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prof-location">Location</Label>
                  <Input
                    id="prof-location"
                    value={currentLocation}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prof-headline">Headline</Label>
                <Input
                  id="prof-headline"
                  value={currentHeadline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Building scalable systems..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prof-github">GitHub Profile URL</Label>
                  <Input
                    id="prof-github"
                    value={currentGithub}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prof-linkedin">LinkedIn Profile URL</Label>
                  <Input
                    id="prof-linkedin"
                    value={currentLinkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prof-website">Portfolio Website</Label>
                  <Input
                    id="prof-website"
                    value={currentWebsite}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prof-status">Live Availability Status</Label>
                  <Input
                    id="prof-status"
                    value={currentStatus}
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder="Available for exciting opportunities"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prof-feat">Featured Project Name</Label>
                  <Input
                    id="prof-feat"
                    value={currentFeaturedProject}
                    onChange={(e) => setFeaturedProject(e.target.value)}
                    placeholder="Featured Project Title"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prof-announcement">Live Announcement Banner (Edge Config Broadcast)</Label>
                <Input
                  id="prof-announcement"
                  value={currentAnnouncement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="Welcome to my portfolio!..."
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="prof-open-work"
                  checked={currentOpenToWork}
                  onCheckedChange={(checked) => setOpenToWork(checked)}
                />
                <Label htmlFor="prof-open-work" className="cursor-pointer">
                  Open to Work Badge & Available for Hire Flag
                </Label>
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Profile to Vercel Blob & Edge Config
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Resume Upload to Vercel Blob */}
      <Card>
        <CardHeader>
          <CardTitle>Resume & Documents (Vercel Blob Storage)</CardTitle>
          <CardDescription>Upload resume PDFs and assets directly into your Vercel Blob store.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-8 text-center relative hover:bg-muted/30 transition-colors">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Select any document or resume PDF to upload directly to Vercel Blob Storage
            </p>
            <input
              type="file"
              id="resume-upload-input"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt"
            />
            <Button
              variant="outline"
              disabled={isUploading}
              onClick={() => document.getElementById('resume-upload-input')?.click()}
            >
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              {isUploading ? 'Uploading to Vercel Blob...' : 'Upload File to Vercel Blob'}
            </Button>

            {uploadedResumeUrl && (
              <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Public Vercel Blob URL: {uploadedResumeUrl}</span>
                </div>
                <a
                  href={uploadedResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline"
                >
                  View
                </a>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Storage Backend: Connected natively to Vercel Blob (`@vercel/blob`).
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
