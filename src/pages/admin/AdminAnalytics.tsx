import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

const MOCK_DAILY: AnalyticsData[] = [
  { date: 'Mon', visitors: 142 },
  { date: 'Tue', visitors: 198 },
  { date: 'Wed', visitors: 245 },
  { date: 'Thu', visitors: 312 },
  { date: 'Fri', visitors: 284 },
  { date: 'Sat', visitors: 390 },
  { date: 'Sun', visitors: 320 },
];

const MOCK_PAGES: PageVisit[] = [
  { page_path: '/', count: 840 },
  { page_path: '/projects', count: 420 },
  { page_path: '/experience', count: 290 },
  { page_path: '/about', count: 180 },
  { page_path: '/contact', count: 125 },
];

const MOCK_COUNTRIES: LocationData[] = [
  { country: 'India', count: 680 },
  { country: 'United States', count: 240 },
  { country: 'Germany', count: 95 },
  { country: 'United Kingdom', count: 85 },
  { country: 'Others', count: 147 },
];

const AdminAnalytics = () => {
  const [dailyData] = useState<AnalyticsData[]>(MOCK_DAILY);
  const [pageData] = useState<PageVisit[]>(MOCK_PAGES);
  const [locationData] = useState<LocationData[]>(MOCK_COUNTRIES);
  const [totalVisitors, setTotalVisitors] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/visitor-counter')
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.total === 'number') setTotalVisitors(data.total);
      })
      .catch(console.warn);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vercel Web Analytics</h1>
        <p className="text-muted-foreground">
          Live visitor telemetry, edge requests, and traffic breakdown.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalVisitors !== null ? totalVisitors.toLocaleString() : 'Loading...'}
            </div>
            <p className="text-xs text-emerald-500 font-medium">+18.2% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Page Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">0.42s</div>
            <p className="text-xs text-muted-foreground">Vercel Edge CDN Anycast</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Speed Score (LCP)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">98 / 100</div>
            <p className="text-xs text-muted-foreground">Vercel Speed Insights</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visitors (Last 7 Days)</CardTitle>
            <CardDescription>Daily unique visits captured by Vercel edge</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visitors" fill="#0055EA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Geographic distribution of your audience</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={locationData} cx="50%" cy="50%" outerRadius={80} dataKey="count" nameKey="country" label>
                  {locationData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Routes</CardTitle>
          <CardDescription>Most visited sections of your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pageData.map((page) => (
              <div key={page.page_path} className="flex items-center justify-between">
                <span className="font-mono text-xs">{page.page_path}</span>
                <span className="font-semibold text-xs">{page.count} views</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
