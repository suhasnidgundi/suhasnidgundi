import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, Trash2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface WPAIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTIONS = [
  "What are Suhas's top projects?",
  "Tell me about Suhas's experience",
  "What is Suhas's tech stack?",
  "How can I contact Suhas?",
];

const WPAIChatModal = ({ isOpen, onClose }: WPAIChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "👋 Hi! I am Suhas's AI Portfolio Assistant powered by Vercel AI SDK.\n\nAsk me anything about Suhas's projects, experience, skills, or contact info!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (text?: string) => {
    const prompt = (text || input).trim();
    if (!prompt || isLoading) return;

    const userMsg: Message = { role: 'user', content: prompt };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let reply = '';
        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          reply += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const list = [...prev];
            list[list.length - 1] = { role: 'assistant', content: reply };
            return list;
          });
        }
      } else {
        const textReply = await res.text();
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: textReply || 'No response.' },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Failed to connect to AI assistant. Please try again later.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-wp-bg z-50 flex flex-col animate-fade-in"
      onClick={onClose}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-wp-border bg-wp-bg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-wp-cyan" />
          <h2 className="text-wp-text text-[18px] font-light">AI Assistant</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setMessages([
                {
                  role: 'assistant',
                  content: 'Chat cleared. Ask anything about Suhas!',
                },
              ])
            }
            className="w-10 h-10 flex items-center justify-center text-wp-text/60 hover:text-wp-text"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center"
          >
            <X className="w-6 h-6 text-wp-text" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded bg-wp-cyan text-black flex items-center justify-center shrink-0 mt-0.5 font-bold">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[85%] px-3 py-2 text-[14px] leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-wp-accent text-white'
                  : 'bg-wp-tile text-wp-text border border-wp-border'
              }`}
            >
              {m.content}
            </div>
            {m.role === 'user' && (
              <div className="w-7 h-7 rounded bg-wp-border text-wp-text flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-wp-text/60 italic text-[13px]">
            <Sparkles className="w-4 h-4 text-wp-cyan animate-spin" />
            <span>AI is responding...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      <div
        className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-wp-border/50 bg-wp-bg"
        onClick={(e) => e.stopPropagation()}
      >
        {SUGGESTIONS.map((item, i) => (
          <button
            key={i}
            onClick={() => handleSend(item)}
            className="text-[12px] px-2.5 py-1 bg-wp-tile border border-wp-border text-wp-text/80 active:bg-wp-accent active:text-white"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Input */}
      <div
        className="p-3 border-t border-wp-border flex items-center gap-2 bg-wp-bg pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 px-3 py-2 bg-wp-tile border border-wp-border text-wp-text text-[14px] focus:outline-none focus:border-wp-accent"
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className="w-10 h-10 bg-wp-accent text-white flex items-center justify-center disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default WPAIChatModal;
