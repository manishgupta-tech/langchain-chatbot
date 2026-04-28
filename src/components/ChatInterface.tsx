import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Copy, Check, Trash2, Paperclip } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { Message } from "../types";
import { LoadingState } from "./LoadingState";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  isLoading: boolean;
  placeholder?: string;
  showFileUpload?: boolean;
  onFileUpload?: (file: File) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  isLoading,
  placeholder = "Ask a question...",
  showFileUpload = false,
  onFileUpload,
}) => {
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput("");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full glass rounded-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center bg-black/5 dark:bg-white/5">
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">Chat History</h3>
        <button
          onClick={onClearChat}
          className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-[var(--text-secondary)] hover:text-red-500 transition-colors"
          title="Clear Chat"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 chat-scrollbar"
      >
        {messages.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-[var(--text-secondary)] space-y-4">
            <Bot size={48} strokeWidth={1} />
            <p className="text-sm">No messages yet. Start a conversation!</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex w-full gap-4",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                  msg.role === "user" ? "bg-[var(--accent-primary)]" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                )}
              >
                {msg.role === "user" ? <User size={16} className="text-white" /> : <Bot size={16} />}
              </div>
              <div
                className={cn(
                  "max-w-[85%] p-4 rounded-2xl relative group transition-all",
                  msg.role === "user"
                    ? "bg-[var(--accent-primary)] text-white shadow-md"
                    : "glass text-[var(--text-primary)]"
                )}
              >
                <div className={cn(
                  "prose prose-sm max-w-none",
                  msg.role === "user" ? "prose-invert" : "dark:prose-invert"
                )}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                
                {msg.role === "ai" && (
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white/10 dark:bg-black/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 dark:hover:bg-black/40"
                  >
                    {copiedId === msg.id ? (
                      <Check size={14} className="text-emerald-500" />
                    ) : (
                      <Copy size={14} className="text-[var(--text-muted)]" />
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <LoadingState type="chat" />
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-[var(--border-color)] bg-[var(--bg-sidebar)]">
        <form onSubmit={handleSubmit} className="relative">
          {showFileUpload && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onFileUpload?.(e.target.files[0])}
                accept=".pdf,.txt,.doc,.docx"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--hover-bg)] rounded-lg transition-all"
              >
                <Paperclip size={20} />
              </button>
            </div>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)]/50 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
              showFileUpload ? "pl-14" : "pl-6"
            )}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-all shadow-md shadow-indigo-600/20"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
