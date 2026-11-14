import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjects } from '@/hooks/useProjects';
import { useExperiences } from '@/hooks/useExperiences';
import { FolderOpen, Briefcase, Users, MessageSquare, TrendingUp, Eye } from 'lucide-react';

interface DashboardStats {
  projectCount: number;
  experienceCount: number;
  visitorCount: number;
  todayVisitors: number;
  guestbookCount: number;
}

const AdminDashboard = () => {
  const { data: projects = [] } = useProjects();
  const { data: experiences = [] } = useExperiences();
  const [stats, setStats] = useState<DashboardStats>({
    projectCount: 0,
    experienceCount: 0,
    visitorCount: 0,
    todayVisitors: 0,
    guestbookCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      setIsLoading(true);
      try {
        const [counterRes, gbRes] = await Promise.all([
          fetch('/api/visitor-counter').then((r) => r.json()).catch(() => ({ total: 0, today: 0 })),
          fetch('/api/guestbook').then((r) => r.json()).catch(() => ({ entries: [] })),
        ]);

        setStats({
          projectCount: projects.length,
          experienceCount: experiences.length,
          visitorCount: counterRes.total || 0,
          todayVisitors: counterRes.today || 0,
          guestbookCount: Array.isArray(gbRes) ? gbRes.length : (gbRes.entries?.length || 0),
        });
      } catch (err) {
        console.warn('Failed to load dashboard metrics:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadMetrics();
  }, [projects.length, experiences.length]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vercel Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time metrics powered by the Vercel ecosystem, Blob Storage, Edge Config, and Analytics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">Active in Vercel Blob (projects.json)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experiences</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{experiences.length}</div>
            <p className="text-xs text-muted-foreground">Active in Vercel Blob (experiences.json)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.visitorCount}</div>
            <p className="text-xs text-muted-foreground">Live Vercel Blob / Upstash Counter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayVisitors}</div>
            <p className="text-xs text-muted-foreground">Recorded in current 24h window</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guestbook Signatures</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.guestbookCount}</div>
            <p className="text-xs text-muted-foreground">Live entries in Vercel Blob storage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cloud Infrastructure</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">100% Live</div>
            <p className="text-xs text-muted-foreground">Vercel Edge Network + Serverless</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
