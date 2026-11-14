import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Experience } from '@/data/portfolioData';
import { useExperiences } from '@/hooks/useExperiences';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

const AdminExperience = () => {
  const { data: experiences = [], isLoading } = useExperiences();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [experienceType, setExperienceType] = useState<'work' | 'education' | 'volunteer'>('work');
  const [skills, setSkills] = useState('');

  const resetForm = () => {
    setRole('');
    setCompany('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setIsCurrent(false);
    setExperienceType('work');
    setSkills('');
    setEditingExperience(null);
  };

  const handleEdit = (exp: Experience) => {
    setEditingExperience(exp);
    setRole(exp.role);
    setCompany(exp.company);
    setDescription(exp.description);
    setStartDate(exp.start_date);
    setEndDate(exp.end_date || '');
    setIsCurrent(exp.is_current);
    setExperienceType(exp.experience_type);
    setSkills(exp.skills?.join(', ') || '');
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const skillsArray = skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Partial<Experience> = {
      ...(editingExperience ? { $id: editingExperience.$id } : {}),
      role,
      company,
      description,
      start_date: startDate,
      end_date: isCurrent ? undefined : endDate,
      is_current: isCurrent,
      experience_type: experienceType,
      skills: skillsArray,
    };

    try {
      const res = await fetch('/api/experiences', {
        method: editingExperience ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast({
          title: 'Vercel Blob Storage',
          description: editingExperience
            ? 'Experience updated in Vercel Blob!'
            : 'Experience published to Vercel Blob!',
        });
        queryClient.invalidateQueries({ queryKey: ['experiences'] });
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast({ title: 'Error', description: 'Failed to update Vercel Blob', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Network request failed', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience from Vercel Blob?')) return;
    try {
      const res = await fetch(`/api/experiences?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Deleted', description: 'Experience removed from Vercel Blob.' });
        queryClient.invalidateQueries({ queryKey: ['experiences'] });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete experience', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Experience (Vercel Cloud Blob)</h2>
          <p className="text-muted-foreground">
            Manage your dynamic career history synced with Vercel Blob storage.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" /> Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingExperience ? 'Edit Experience' : 'Add New Experience'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="role">Role / Degree *</Label>
                <Input
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  required
                />
              </div>

              <div>
                <Label htmlFor="company">Company / Institution *</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google or VTU"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experienceType">Type</Label>
                  <Select
                    value={experienceType}
                    onValueChange={(val: 'work' | 'education' | 'volunteer') =>
                      setExperienceType(val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="volunteer">Volunteer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="isCurrent"
                    checked={isCurrent}
                    onCheckedChange={setIsCurrent}
                  />
                  <Label htmlFor="isCurrent">Currently active role</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="e.g. Jan 2023"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="e.g. Present"
                    disabled={isCurrent}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your achievements and responsibilities..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, TypeScript, Vercel, Node.js"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {editingExperience ? 'Save Changes' : 'Create Experience'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading experiences from Vercel Blob...
        </div>
      ) : experiences.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No experiences found in Vercel Blob.</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Your First Experience
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <Card key={exp.$id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{exp.role}</CardTitle>
                    <Badge variant={exp.experience_type === 'work' ? 'default' : 'secondary'}>
                      {exp.experience_type}
                    </Badge>
                    {exp.is_current && <Badge variant="outline" className="text-emerald-600 border-emerald-600">Current</Badge>}
                  </div>
                  <CardDescription className="text-sm font-medium mt-1">
                    {exp.company} • {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date || 'N/A'}
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(exp)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(exp.$id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{exp.description}</p>
                {exp.skills && exp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {exp.skills.map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminExperience;
