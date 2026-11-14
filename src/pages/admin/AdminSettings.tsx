import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [headline, setHeadline] = useState('');
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState('');

  // Populate local form state when profile data arrives
  const isEditing = name || title || headline || status;
  const currentName = isEditing ? name : (profile?.name || '');
  const currentTitle = isEditing ? title : (profile?.title || '');
  const currentHeadline = isEditing ? headline : (profile?.headline || '');
  const currentStatus = isEditing ? status : (profile?.status || '');

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        name: currentName,
        title: currentTitle,
        headline: currentHeadline,
        status: currentStatus,
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
        body: file,
      });

      if (res.ok) {
        const data = await res.json();
        setUploadedResumeUrl(data.url);
        toast({
          title: 'Vercel Blob Upload',
          description: `Uploaded ${file.name} successfully to Vercel Blob!`,
        });
      } else {
        toast({ title: 'Error', description: 'Blob upload failed', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Network error during upload', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Vercel Cloud Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your dynamic profile metadata and file assets stored in Vercel Blob.
        </p>
      </div>

      {/* Dynamic Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Global Profile Metadata (Vercel Blob & Edge Config)</CardTitle>
          <CardDescription>
            These values power your Windows XP start menu, about dialogs, and AI assistant dynamically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-4">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading live profile...
            </div>
          ) : (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prof-name">Display Name</Label>
                  <Input
                    id="prof-name"
                    value={currentName}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Suhas Nidgundi"
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

              <div className="space-y-2">
                <Label htmlFor="prof-headline">Headline</Label>
                <Input
                  id="prof-headline"
                  value={currentHeadline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Building scalable systems..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prof-status">Live Availability Status</Label>
                <Input
                  id="prof-status"
                  value={currentStatus}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="Available for exciting Full Stack & System Engineering opportunities"
                />
              </div>

              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Profile to Vercel Blob
              </Button>
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
