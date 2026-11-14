import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, Bot, User, Trash2, ArrowLeft } from 'lucide-react';
import { useWPTheme } from '@/contexts/WPThemeContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  "What are Suhas's top projects?",
  "Tell me about Suhas's work experience",
  "What is Suhas's tech stack?",
  "How can I contact Suhas?",
];

const WPCortana: React.FC = () => {
  const { cortanaOpen, setCortanaOpen } = useWPTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hey there! I'm Cortana, Suhas's AI portfolio assistant powered by the Vercel cloud ecosystem.\n\nAsk me anything about Suhas's software architecture, systems, projects, or background!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cortanaOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, cortanaOpen]);

  if (!cortanaOpen) return null;

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
          content: '⚠️ Failed to connect to Cortana assistant. Please verify network access.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white font-['Segoe_UI',sans-serif] animate-in fade-in duration-200 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/60 backdrop-blur-md">
        <button
          onClick={() => setCortanaOpen(false)}
          className="flex items-center gap-1.5 text-white/80 active:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[14px] font-light">back</span>
        </button>

        <span className="text-[17px] font-light tracking-wide text-cyan-300">
          cortana
        </span>

        <button
          onClick={() =>
            setMessages([
              {
                role: 'assistant',
                content: "Chat cleared. What else would you like to know about Suhas?",
              },
            ])
          }
          className="p-1.5 text-white/60 hover:text-white active:bg-white/10 rounded"
          title="Clear chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Cortana Halo Animation Banner */}
      <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-b from-cyan-950/40 via-transparent to-transparent">
        {/* Concentric Pulsing Double Ring */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Outer Pulsing Aura */}
          <div
            className={`absolute inset-0 rounded-full border-2 border-cyan-400/40 transition-all duration-700 ${
              isLoading ? 'animate-ping' : 'animate-pulse'
            }`}
          />
          {/* Middle Rotating Ring */}
          <div
            className={`absolute inset-1.5 rounded-full border-2 border-dashed border-cyan-300/80 ${
              isLoading ? 'animate-spin' : ''
            }`}
          />
          {/* Inner Solid Core */}
          <div className="w-12 h-12 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            <Sparkles className="w-6 h-6 text-cyan-300" />
          </div>
        </div>

        <p className="mt-3 text-[13px] text-cyan-200/80 font-light tracking-wider uppercase">
          {isLoading ? 'Cortana is thinking…' : 'What can I help you with?'}
        </p>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3.5">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[88%] p-3.5 text-[14px] leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[hsl(var(--wp-accent))] text-white rounded-l-lg rounded-tr-lg shadow'
                  : 'bg-white/10 text-white/95 rounded-r-lg rounded-tl-lg border border-white/10'
              }`}
            >
              {msg.content}
            </div>
            <span className="text-[10px] text-white/40 mt-1 px-1">
              {msg.role === 'user' ? 'You' : 'Cortana'}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="px-3 py-2 border-t border-white/10 bg-black/50 overflow-x-auto scrollbar-hide flex gap-2">
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="flex-shrink-0 text-[11px] font-medium bg-white/10 hover:bg-white/20 active:bg-[hsl(var(--wp-accent))] text-white/90 px-3 py-1.5 rounded-full border border-white/20 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-black border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Cortana a question..."
          className="flex-1 bg-white/10 text-white placeholder-white/40 text-[14px] px-3.5 py-2.5 rounded border border-white/20 focus:outline-none focus:border-cyan-400"
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className="w-10 h-10 rounded bg-cyan-600 hover:bg-cyan-500 active:scale-95 disabled:opacity-40 flex items-center justify-center text-white transition-all shadow"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default WPCortana;
