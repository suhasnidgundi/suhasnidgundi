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
import { INITIAL_EXPERIENCES, type Experience } from '@/data/portfolioData';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'portfolio_custom_experiences';

const AdminExperience = () => {
  const [experiences, setExperiences] = useState<Experience[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_EXPERIENCES;
    } catch {
      return INITIAL_EXPERIENCES;
    }
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const { toast } = useToast();

  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [experienceType, setExperienceType] = useState<'work' | 'education' | 'volunteer'>('work');
  const [skills, setSkills] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(experiences));
  }, [experiences]);

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
    setDescription(exp.description || '');
    setStartDate(exp.start_date || '');
    setEndDate(exp.end_date || '');
    setIsCurrent(exp.is_current || false);
    setExperienceType(exp.experience_type || 'work');
    setSkills(exp.skills?.join(', ') || '');
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const skillsArray = skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingExperience) {
      setExperiences((prev) =>
        prev.map((e) =>
          e.$id === editingExperience.$id
            ? {
                ...e,
                role,
                company,
                description,
                start_date: startDate,
                end_date: isCurrent ? undefined : endDate,
                is_current: isCurrent,
                experience_type: experienceType,
                skills: skillsArray,
              }
            : e
        )
      );
      toast({ title: 'Success', description: 'Experience updated.' });
    } else {
      const newExp: Experience = {
        $id: `exp-${Date.now()}`,
        role,
        company,
        description,
        start_date: startDate,
        end_date: isCurrent ? undefined : endDate,
        is_current: isCurrent,
        experience_type: experienceType,
        skills: skillsArray,
        display_order: experiences.length + 1,
      };
      setExperiences((prev) => [...prev, newExp]);
      toast({ title: 'Success', description: 'Experience added to Vercel portfolio.' });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setExperiences((prev) => prev.filter((e) => e.$id !== id));
    toast({ title: 'Success', description: 'Experience removed.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Experience Manager</h1>
          <p className="text-muted-foreground">Manage your work history and education.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingExperience ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="role">Role / Degree *</Label>
                <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="company">Company / Institution *</Label>
                <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={experienceType} onValueChange={(val: any) => setExperienceType(val)}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="2023" />
                </div>
                {!isCurrent && (
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="Present" />
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isCurrent" checked={isCurrent} onCheckedChange={setIsCurrent} />
                <Label htmlFor="isCurrent">Currently working here</Label>
              </div>
              <div>
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js, Vercel" />
              </div>
              <Button type="submit" className="w-full">
                {editingExperience ? 'Update Experience' : 'Create Experience'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {experiences.map((exp) => (
          <Card key={exp.$id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{exp.role}</CardTitle>
                  <CardDescription className="text-sm font-medium text-primary">{exp.company}</CardDescription>
                </div>
                <Badge variant={exp.is_current ? 'default' : 'secondary'}>
                  {exp.is_current ? 'Current' : exp.experience_type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-2">
                {exp.start_date} {exp.end_date ? `- ${exp.end_date}` : exp.is_current ? '- Present' : ''}
              </p>
              {exp.description && <p className="text-xs mb-3 line-clamp-3">{exp.description}</p>}
              <div className="flex flex-wrap gap-1 mb-3">
                {exp.skills?.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-[10px]">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-end gap-1 pt-2 border-t">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(exp)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(exp.$id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminExperience;
