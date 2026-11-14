import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Mail, Calendar, MessageSquare, Loader2, RefreshCw } from 'lucide-react';

interface GuestbookMessage {
  id: string;
  name: string;
  company?: string;
  message: string;
  createdAt: string;
  badge?: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/guestbook');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.entries || []);
        setMessages(list);
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load guestbook messages', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Guestbook & Contact Messages</h2>
          <p className="text-muted-foreground">
            Live visitor feedback and contact inquiries stored in Vercel Blob cloud storage.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchMessages} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading live messages from Vercel Blob...
        </div>
      ) : messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No guestbook messages yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card key={msg.id}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{msg.name}</CardTitle>
                    {msg.badge && <Badge variant="secondary">{msg.badge}</Badge>}
                  </div>
                  {msg.company && (
                    <CardDescription className="text-sm font-medium text-emerald-600">
                      {msg.company}
                    </CardDescription>
                  )}
                </div>
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(msg.createdAt).toLocaleDateString()} at{' '}
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap">{msg.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
