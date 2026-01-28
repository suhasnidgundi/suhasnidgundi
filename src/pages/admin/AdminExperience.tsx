import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { databases, DATABASE_ID, COLLECTIONS } from '@/integrations/appwrite/client';
import type { Experience } from '@/integrations/appwrite/types';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import { Query, ID } from 'appwrite';

const AdminExperience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const { toast } = useToast();

  // Form state
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [experienceType, setExperienceType] = useState('work');
  const [skills, setSkills] = useState('');

  const fetchExperiences = async () => {
    try {
      const response = await databases.listDocuments<Experience>(
        DATABASE_ID,
        COLLECTIONS.EXPERIENCES,
        [Query.orderAsc('display_order')]
      );
      setExperiences(response.documents);
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const resetForm = () => {
    setCompany('');
    setRole('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setIsCurrent(false);
    setExperienceType('work');
    setSkills('');
    setEditingExperience(null);
  };

  const openEditDialog = (experience: Experience) => {
    setEditingExperience(experience);
    setCompany(experience.company);
    setRole(experience.role);
    setDescription(experience.description || '');
    setStartDate(experience.start_date || '');
    setEndDate(experience.end_date || '');
    setIsCurrent(experience.is_current);
    setExperienceType(experience.experience_type);
    setSkills(experience.skills.join(', '));
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const experienceData = {
      company,
      role,
      description: description || null,
      start_date: startDate || null,
      end_date: isCurrent ? null : (endDate || null),
      is_current: isCurrent,
      experience_type: experienceType,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      display_order: editingExperience?.display_order || experiences.length,
    };

    try {
      if (editingExperience) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.EXPERIENCES,
          editingExperience.$id,
          experienceData
        );
        toast({ title: 'Success', description: 'Experience updated successfully' });
      } else {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.EXPERIENCES,
          ID.unique(),
          experienceData
        );
        toast({ title: 'Success', description: 'Experience created successfully' });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchExperiences();
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.EXPERIENCES, id);
      toast({ title: 'Success', description: 'Experience deleted successfully' });
      fetchExperiences();
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'work': return 'bg-wp-emerald/10 text-wp-emerald';
      case 'learning': return 'bg-wp-cyan/10 text-wp-cyan';
      case 'current': return 'bg-wp-violet/10 text-wp-violet';
      default: return 'bg-muted text-muted-foreground';
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
          <h1 className="text-3xl font-bold text-foreground">Experience</h1>
          <p className="text-muted-foreground mt-1">Manage your work experience</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingExperience ? 'Edit Experience' : 'Add New Experience'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} required placeholder="Software Engineer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required placeholder="Tech Company" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="What did you achieve?" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={isCurrent} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={experienceType} onValueChange={setExperienceType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="learning">Learning</SelectItem>
                      <SelectItem value="current">Current</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="current" checked={isCurrent} onCheckedChange={setIsCurrent} />
                <Label htmlFor="current">Currently working here</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js, AWS" />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Cancel</Button>
                <Button type="submit">{editingExperience ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {experiences.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No experiences yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Experience
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {experiences.map((exp) => (
            <Card key={exp.$id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{exp.role}</CardTitle>
                    <Badge className={getTypeColor(exp.experience_type)}>{exp.experience_type}</Badge>
                    {exp.is_current && <Badge variant="secondary">Current</Badge>}
                  </div>
                  <CardDescription>{exp.company}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(exp)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(exp.$id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                </p>
                {exp.description && <p className="text-sm mb-2">{exp.description}</p>}
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill, i) => (
                    <Badge key={i} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminExperience;
