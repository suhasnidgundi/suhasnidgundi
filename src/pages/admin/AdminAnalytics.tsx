import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { databases, DATABASE_ID, COLLECTIONS } from '@/integrations/appwrite/client';
import type { Analytics } from '@/integrations/appwrite/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { Query } from 'appwrite';

interface AnalyticsData {
  date: string;
  visitors: number;
}

interface PageVisit {
  page_path: string;
  count: number;
}

interface LocationData {
  country: string;
  count: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminAnalytics = () => {
  const [dailyData, setDailyData] = useState<AnalyticsData[]>([]);
  const [pageData, setPageData] = useState<PageVisit[]>([]);
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch all analytics
        const response = await databases.listDocuments<Analytics>(
          DATABASE_ID,
          COLLECTIONS.ANALYTICS,
          [Query.orderDesc('$createdAt'), Query.limit(1000)]
        );

        const analytics = response.documents;

        if (analytics) {
          setTotalVisitors(response.total);

          // Process daily data (last 7 days)
          const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = startOfDay(subDays(new Date(), 6 - i));
            return {
              date: format(date, 'MMM dd'),
              fullDate: format(date, 'yyyy-MM-dd'),
              visitors: 0,
            };
          });

          analytics.forEach((a) => {
            const visitDate = format(new Date(a.$createdAt), 'yyyy-MM-dd');
            const dayData = last7Days.find(d => d.fullDate === visitDate);
            if (dayData) dayData.visitors++;
          });

          setDailyData(last7Days.map(d => ({ date: d.date, visitors: d.visitors })));

          // Process page data
          const pageCounts: Record<string, number> = {};
          analytics.forEach((a) => {
            const path = a.page_path || '/';
            pageCounts[path] = (pageCounts[path] || 0) + 1;
          });
          setPageData(Object.entries(pageCounts)
            .map(([page_path, count]) => ({ page_path, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5));

          // Process location data
          const locationCounts: Record<string, number> = {};
          analytics.forEach((a) => {
            const country = a.visitor_country || 'Unknown';
            locationCounts[country] = (locationCounts[country] || 0) + 1;
          });
          setLocationData(Object.entries(locationCounts)
            .map(([country, count]) => ({ country, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

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
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your portfolio visitors</p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Total Visitors</CardTitle>
          <CardDescription>All-time visitor count</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">{totalVisitors}</p>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Visitors Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Visitors</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {dailyData.some(d => d.visitors > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visitors" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No visitor data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Pages Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages</CardDescription>
          </CardHeader>
          <CardContent>
            {pageData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ page_path, percent }) => `${page_path} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {pageData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No page data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Location Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Locations</CardTitle>
          <CardDescription>Where your visitors come from</CardDescription>
        </CardHeader>
        <CardContent>
          {locationData.length > 0 ? (
            <div className="space-y-2">
              {locationData.map((loc, i) => (
                <div key={i} className="flex justify-between items-center p-2 rounded hover:bg-muted">
                  <span>{loc.country}</span>
                  <span className="font-medium">{loc.count} visits</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No location data yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
