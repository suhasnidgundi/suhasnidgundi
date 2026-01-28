import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { databases, DATABASE_ID, COLLECTIONS } from '@/integrations/appwrite/client';
import type { Project, Experience, ContactSubmission, Analytics } from '@/integrations/appwrite/types';
import { FolderOpen, Briefcase, Users, MessageSquare, TrendingUp, Eye } from 'lucide-react';
import { Query } from 'appwrite';
import { startOfDay } from 'date-fns';

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
    projectCount: 0,
    experienceCount: 0,
    visitorCount: 0,
    messageCount: 0,
    unreadMessages: 0,
    todayVisitors: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, experiences, analytics, messages] = await Promise.all([
          databases.listDocuments<Project>(DATABASE_ID, COLLECTIONS.PROJECTS, [Query.limit(1)]),
          databases.listDocuments<Experience>(DATABASE_ID, COLLECTIONS.EXPERIENCES, [Query.limit(1)]),
          databases.listDocuments<Analytics>(DATABASE_ID, COLLECTIONS.ANALYTICS, [Query.limit(1)]),
          databases.listDocuments<ContactSubmission>(DATABASE_ID, COLLECTIONS.CONTACT_SUBMISSIONS),
        ]);

        // Get today's visitors
        const today = startOfDay(new Date()).toISOString();
        const todayAnalytics = await databases.listDocuments<Analytics>(
          DATABASE_ID,
          COLLECTIONS.ANALYTICS,
          [Query.greaterThanEqual('$createdAt', today), Query.limit(1)]
        );

        const unreadCount = messages.documents.filter(m => !m.is_read).length;

        setStats({
          projectCount: projects.total,
          experienceCount: experiences.total,
          visitorCount: analytics.total,
          messageCount: messages.total,
          unreadMessages: unreadCount,
          todayVisitors: todayAnalytics.total,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
      title: 'Total Projects', 
      value: stats.projectCount, 
      icon: FolderOpen, 
      color: 'text-wp-emerald',
      bgColor: 'bg-wp-emerald/10'
    },
    { 
      title: 'Experiences', 
      value: stats.experienceCount, 
      icon: Briefcase, 
      color: 'text-wp-violet',
      bgColor: 'bg-wp-violet/10'
    },
    { 
      title: 'Total Visitors', 
      value: stats.visitorCount, 
      icon: Users, 
      color: 'text-wp-cyan',
      bgColor: 'bg-wp-cyan/10'
    },
    { 
      title: 'Today\'s Visitors', 
      value: stats.todayVisitors, 
      icon: TrendingUp, 
      color: 'text-wp-orange',
      bgColor: 'bg-wp-orange/10'
    },
    { 
      title: 'Messages', 
      value: stats.messageCount, 
      icon: MessageSquare, 
      color: 'text-wp-magenta',
      bgColor: 'bg-wp-magenta/10',
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to your portfolio admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{card.value}</span>
                {card.badge && (
                  <span className="px-2 py-0.5 text-xs bg-destructive text-destructive-foreground rounded-full">
                    {card.badge} new
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to do</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <a 
            href="/admin/projects" 
            className="p-4 border rounded-lg hover:bg-muted transition-colors flex items-center gap-3"
          >
            <FolderOpen className="h-5 w-5 text-wp-emerald" />
            <span>Add New Project</span>
          </a>
          <a 
            href="/admin/experience" 
            className="p-4 border rounded-lg hover:bg-muted transition-colors flex items-center gap-3"
          >
            <Briefcase className="h-5 w-5 text-wp-violet" />
            <span>Add Experience</span>
          </a>
          <a 
            href="/admin/messages" 
            className="p-4 border rounded-lg hover:bg-muted transition-colors flex items-center gap-3"
          >
            <MessageSquare className="h-5 w-5 text-wp-magenta" />
            <span>View Messages</span>
          </a>
          <a 
            href="/admin/analytics" 
            className="p-4 border rounded-lg hover:bg-muted transition-colors flex items-center gap-3"
          >
            <Eye className="h-5 w-5 text-wp-cyan" />
            <span>View Analytics</span>
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
