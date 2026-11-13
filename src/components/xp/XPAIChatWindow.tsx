import React, { useState, useRef, useEffect } from 'react';
import XPWindow from './XPWindow';
import SearchIcon from '@/assets/xp/icons/search_icon.png';
import { Send, Sparkles, Trash2, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface XPAIChatWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize?: () => void;
  isMaximized?: boolean;
  zIndex?: number;
  onFocus?: () => void;
  isActive?: boolean;
}

const SUGGESTED_PROMPTS = [
  "What are Suhas's top projects?",
  "Tell me about Suhas's experience",
  "What is Suhas's tech stack?",
  "How can I contact Suhas?",
];

export const XPAIChatWindow: React.FC<XPAIChatWindowProps> = ({
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
  zIndex,
  onFocus,
  isActive,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "👋 Welcome! I am Suhas's interactive AI Portfolio Assistant powered by the Vercel ecosystem.\n\nAsk me anything about Suhas's engineering background, projects, full-stack skillset, or how to get in touch!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || isLoading) return;

    const userMessage: Message = { role: 'user', content: prompt };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantReply = '';

        // Add an empty assistant message first
        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          assistantReply += chunk;

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: 'assistant',
              content: assistantReply,
            };
            return updated;
          });
        }
      } else {
        const text = await response.text();
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: text || "I didn't receive a response." },
        ]);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "⚠️ Sorry, I encountered an issue connecting to the AI endpoint. Please try again or reach out to Suhas directly at suhasnidgundi@gmail.com.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat cleared. What else would you like to know about Suhas?",
      },
    ]);
  };

  return (
    <XPWindow
      title="Windows Assistant — Suhas Portfolio AI"
      icon={<img src={SearchIcon} alt="AI" className="w-4 h-4 object-contain" />}
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      isMaximized={isMaximized}
      zIndex={zIndex}
      onFocus={onFocus}
      isActive={isActive}
      className="w-full h-full flex flex-col font-sans"
    >
      <div className="flex flex-col h-full bg-[#ECE9D8] text-[#222]">
        {/* Retro Toolbar */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#D4D0C8] bg-gradient-to-r from-[#F0EDE1] to-[#E3DFD5] text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-[#003399]">
            <Sparkles className="w-3.5 h-3.5 text-[#0055EA]" />
            <span>Vercel AI SDK • Online</span>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center gap-1 px-2 py-0.5 border border-[#999] hover:bg-[#DDD] active:bg-[#BBB] rounded text-[11px]"
            title="Clear Chat History"
          >
            <Trash2 className="w-3 h-3 text-[#555]" />
            <span>Clear</span>
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white border border-[#7F9DB9] m-2 rounded-sm shadow-inner text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-[#0055EA] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded px-3 py-2 text-[12px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-[#0055EA] text-white rounded-br-none'
                    : 'bg-[#F2F5FA] border border-[#C5D7EF] text-[#1E293B] rounded-bl-none'
                }`}
              >
                {m.content}
              </div>
              {m.role === 'user' && (
                <div className="w-6 h-6 rounded-full bg-[#1E293B] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500 italic text-[11px]">
              <div className="w-6 h-6 rounded-full bg-[#0055EA] text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <span>Thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-3 pb-1 flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="text-[11px] px-2 py-1 bg-[#F5F5F0] hover:bg-[#E0E8F8] border border-[#B0BED9] rounded text-[#003399] transition-colors disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-2 border-t border-[#D4D0C8] flex items-center gap-2 bg-[#ECE9D8]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about Suhas..."
            disabled={isLoading}
            className="flex-1 px-3 py-1.5 border border-[#7F9DB9] rounded bg-white text-xs text-black focus:outline-none focus:ring-1 focus:ring-[#0055EA]"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-b from-[#2E8B57] to-[#1E6B37] text-white border border-[#16502A] rounded font-semibold text-xs shadow hover:brightness-110 active:brightness-95 disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </XPWindow>
  );
};

export default XPAIChatWindow;
