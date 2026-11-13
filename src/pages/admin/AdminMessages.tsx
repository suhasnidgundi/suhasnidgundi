import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Mail, Calendar, Check, Trash2 } from 'lucide-react';

interface ContactMessage {
  $id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  createdAt: string;
}

const INITIAL_MESSAGES: ContactMessage[] = [
  {
    $id: 'msg-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@techrecruiter.com',
    message: 'Hi Suhas, loved your Windows XP portfolio! We have an exciting Senior Full Stack role. Would love to connect.',
    is_read: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    $id: 'msg-2',
    name: 'Alex Rivera',
    email: 'alex@innovatecorp.io',
    message: 'Hello Suhas, impressive work on the Digital Campus Inventory system. Are you available for contract development?',
    is_read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>(INITIAL_MESSAGES);
  const { toast } = useToast();

  const markAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.$id === id ? { ...m, is_read: true } : m))
    );
    toast({ title: 'Marked as read' });
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.$id !== id));
    toast({ title: 'Message deleted' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Inquiries</h1>
        <p className="text-muted-foreground">Inquiries submitted via your Vercel serverless contact form.</p>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.$id} className={message.is_read ? 'opacity-80' : 'border-primary/50'}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {message.name}
                    {!message.is_read && <Badge variant="default" className="text-xs">New</Badge>}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Mail className="h-3 w-3" />
                    {message.email}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {!message.is_read && (
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(message.$id)}>
                      <Check className="h-4 w-4 mr-1" />
                      Mark Read
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => deleteMessage(message.$id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground bg-muted/40 p-3 rounded">{message.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminMessages;
