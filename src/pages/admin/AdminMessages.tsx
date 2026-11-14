import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Mail, Calendar, MessageSquare, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { getAdminAuthHeaders } from '@/contexts/AuthContext';

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this message from Vercel Blob?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/guestbook?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAdminAuthHeaders(),
      });

      if (res.ok) {
        toast({ title: 'Removed', description: 'Message deleted from Vercel Blob storage.' });
        setMessages((prev) => prev.filter((m) => m.id !== id));
      } else {
        toast({ title: 'Error', description: 'Failed to delete message', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Network error', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

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
            <Card key={msg.id} className="relative group">
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
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(msg.createdAt).toLocaleDateString()} at{' '}
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(msg.id)}
                    disabled={deletingId === msg.id}
                  >
                    {deletingId === msg.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
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
