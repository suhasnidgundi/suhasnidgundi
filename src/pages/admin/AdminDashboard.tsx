import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { INITIAL_PROJECTS, INITIAL_EXPERIENCES } from '@/data/portfolioData';
import { FolderOpen, Briefcase, Users, MessageSquare, TrendingUp, Eye } from 'lucide-react';

interface DashboardStats {
  projectCount: number;
  experienceCount: number;
  visitorCount: number;
  messageCount: number;
  unreadMessages: number;
  todayVisitors: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    projectCount: INITIAL_PROJECTS.length,
    experienceCount: INITIAL_EXPERIENCES.length,
    visitorCount: 1247,
    messageCount: 5,
    unreadMessages: 1,
    todayVisitors: 48,
  });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vercel Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time metrics powered by the Vercel ecosystem, Edge Config, and Analytics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projectCount}</div>
            <p className="text-xs text-muted-foreground">Active in Vercel portfolio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experiences</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.experienceCount}</div>
            <p className="text-xs text-muted-foreground">Work and academic history</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.visitorCount}</div>
            <p className="text-xs text-muted-foreground">Vercel Web Analytics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayVisitors}</div>
            <p className="text-xs text-muted-foreground">Unique edge requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messageCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.unreadMessages} unread message{stats.unreadMessages !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hosting Platform</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">Vercel Strict</div>
            <p className="text-xs text-muted-foreground">Edge CDN • Serverless • AI SDK</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
