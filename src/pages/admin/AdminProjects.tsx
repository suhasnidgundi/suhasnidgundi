import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { INITIAL_PROJECTS, type Project } from '@/data/portfolioData';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, ExternalLink, Github } from 'lucide-react';

const STORAGE_KEY = 'portfolio_custom_projects';

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

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

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description || '');
    setTechStack(project.tech_stack?.join(', ') || '');
    setImpactMetric(project.impact_metric || '');
    setScreenshotUrl(project.screenshot_url || '');
    setGithubUrl(project.github_url || '');
    setLiveUrl(project.live_url || '');
    setIsFeatured(project.is_featured);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const techArray = techStack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProject) {
      setProjects((prev) =>
        prev.map((p) =>
          p.$id === editingProject.$id
            ? {
                ...p,
                title,
                description,
                tech_stack: techArray,
                impact_metric: impactMetric,
                screenshot_url: screenshotUrl || undefined,
                github_url: githubUrl || undefined,
                live_url: liveUrl || undefined,
                is_featured: isFeatured,
              }
            : p
        )
      );
      toast({ title: 'Success', description: 'Project updated in Vercel state.' });
    } else {
      const newProject: Project = {
        $id: `proj-${Date.now()}`,
        title,
        description,
        tech_stack: techArray,
        impact_metric: impactMetric,
        screenshot_url: screenshotUrl || undefined,
        github_url: githubUrl || undefined,
        live_url: liveUrl || undefined,
        is_featured: isFeatured,
        display_order: projects.length + 1,
      };
      setProjects((prev) => [...prev, newProject]);
      toast({ title: 'Success', description: 'Project added to Vercel portfolio.' });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.$id !== id));
    toast({ title: 'Success', description: 'Project removed.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects Manager</h1>
          <p className="text-muted-foreground">Manage your portfolio projects on Vercel.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
                <Input id="techStack" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="React, TypeScript, Tailwind" />
              </div>
              <div>
                <Label htmlFor="impactMetric">Impact Metric</Label>
                <Input id="impactMetric" value={impactMetric} onChange={(e) => setImpactMetric(e.target.value)} placeholder="40% faster performance" />
              </div>
              <div>
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input id="githubUrl" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="liveUrl">Live URL</Label>
                <Input id="liveUrl" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                <Label htmlFor="isFeatured">Featured Project</Label>
              </div>
              <Button type="submit" className="w-full">
                {editingProject ? 'Update Project' : 'Create Project'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.$id} className="relative group">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                {project.is_featured && <Badge variant="secondary">Featured</Badge>}
              </div>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-3">
                {project.tech_stack?.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
              {project.impact_metric && (
                <p className="text-xs text-emerald-600 font-medium mb-3">{project.impact_metric}</p>
              )}
              <div className="flex justify-between items-center pt-2 border-t">
                <div className="flex gap-2">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(project.$id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;
