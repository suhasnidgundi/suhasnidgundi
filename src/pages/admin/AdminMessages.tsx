import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { databases, DATABASE_ID, COLLECTIONS } from '@/integrations/appwrite/client';
import type { ContactSubmission } from '@/integrations/appwrite/types';
import { useToast } from '@/hooks/use-toast';
import { Mail, Calendar, Check, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Query } from 'appwrite';

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      const response = await databases.listDocuments<ContactSubmission>(
        DATABASE_ID,
        COLLECTIONS.CONTACT_SUBMISSIONS,
        [Query.orderDesc('$createdAt')]
      );
      setMessages(response.documents);
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.CONTACT_SUBMISSIONS,
        id,
        { is_read: true }
      );
      fetchMessages();
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.CONTACT_SUBMISSIONS, id);
      toast({ title: 'Success', description: 'Message deleted' });
      fetchMessages();
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

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
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-1">
            Contact form submissions 
            {unreadCount > 0 && <Badge className="ml-2" variant="destructive">{unreadCount} unread</Badge>}
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No messages yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg) => (
            <Card key={msg.$id} className={msg.is_read ? 'opacity-75' : 'border-primary/50'}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{msg.name}</CardTitle>
                    {!msg.is_read && <Badge variant="destructive">New</Badge>}
                  </div>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <a href={`mailto:${msg.email}`} className="hover:underline">{msg.email}</a>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(msg.$createdAt), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {!msg.is_read && (
                    <Button variant="ghost" size="icon" onClick={() => markAsRead(msg.$id)} title="Mark as read">
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => deleteMessage(msg.$id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
