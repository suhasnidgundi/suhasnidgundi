import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { databases, DATABASE_ID, COLLECTIONS } from '@/integrations/appwrite/client';
import type { Project } from '@/integrations/appwrite/types';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, ExternalLink, Github } from 'lucide-react';
import { Query, ID } from 'appwrite';

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [impactMetric, setImpactMetric] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await databases.listDocuments<Project>(
        DATABASE_ID,
        COLLECTIONS.PROJECTS,
        [Query.orderAsc('display_order')]
      );
      setProjects(response.documents);
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTechStack('');
    setImpactMetric('');
    setScreenshotUrl('');
    setGithubUrl('');
    setLiveUrl('');
    setIsFeatured(false);
    setEditingProject(null);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description || '');
    setTechStack(project.tech_stack.join(', '));
    setImpactMetric(project.impact_metric || '');
    setScreenshotUrl(project.screenshot_url || '');
    setGithubUrl(project.github_url || '');
    setLiveUrl(project.live_url || '');
    setIsFeatured(project.is_featured);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      title,
      description: description || null,
      tech_stack: techStack.split(',').map(t => t.trim()).filter(Boolean),
      impact_metric: impactMetric || null,
      screenshot_url: screenshotUrl || null,
      github_url: githubUrl || null,
      live_url: liveUrl || null,
      is_featured: isFeatured,
      display_order: editingProject?.display_order || projects.length,
    };

    try {
      if (editingProject) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.PROJECTS,
          editingProject.$id,
          projectData
        );
        toast({ title: 'Success', description: 'Project updated successfully' });
      } else {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.PROJECTS,
          ID.unique(),
          projectData
        );
        toast({ title: 'Success', description: 'Project created successfully' });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.PROJECTS, id);
      toast({ title: 'Success', description: 'Project deleted successfully' });
      fetchProjects();
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
                  <Input id="techStack" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="React, Node.js, AWS" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="impactMetric">Impact Metric</Label>
                <Input id="impactMetric" value={impactMetric} onChange={(e) => setImpactMetric(e.target.value)} placeholder="Reduced deployment time by 60%" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input id="githubUrl" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="liveUrl">Live URL</Label>
                  <Input id="liveUrl" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="screenshotUrl">Screenshot URL</Label>
                <Input id="screenshotUrl" value={screenshotUrl} onChange={(e) => setScreenshotUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className="flex items-center gap-2">
                <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                <Label htmlFor="featured">Featured Project</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Cancel</Button>
                <Button type="submit">{editingProject ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project.$id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    {project.is_featured && <Badge variant="secondary">Featured</Badge>}
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  {project.github_url && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {project.live_url && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(project.$id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.tech_stack.map((tech, i) => (
                    <Badge key={i} variant="outline">{tech}</Badge>
                  ))}
                </div>
                {project.impact_metric && (
                  <p className="text-sm text-muted-foreground">📈 {project.impact_metric}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
