import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminSettings = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your portfolio settings</p>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email || ''} disabled />
          </div>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={user?.name || ''} disabled />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input value={isAdmin ? 'Administrator' : 'User'} disabled />
          </div>
        </CardContent>
      </Card>

      {/* Resume Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Resume</CardTitle>
          <CardDescription>Upload your resume PDF</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Drag and drop your resume PDF here, or click to browse</p>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Resume
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Note: Resume upload functionality requires storage to be properly configured in Appwrite.
          </p>
        </CardContent>
      </Card>

      {/* Admin Note */}
      {!isAdmin && (
        <Card className="border-orange-500/50">
          <CardHeader>
            <CardTitle className="text-orange-500">Limited Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You don't have admin privileges. Contact the site administrator to get admin access 
              for managing projects, experiences, and other content.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminSettings;
