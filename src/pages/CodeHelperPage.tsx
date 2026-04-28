import React, { useState } from "react";
import { ChatInterface } from "../components/ChatInterface";
import { Message } from "../types";
import { getCodeHelperResponse } from "../services/api";
import { Code, Play } from "lucide-react";
import { toast } from "sonner";

export const CodeHelperPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(1); // Mock user ID

  const exampleCode = `def find_max(numbers):
    max_num = max(numbers)
    return max_num

# Example usage:
print(find_max([1, 5, 3, 9, 2]))`;

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const answer = await getCodeHelperResponse(userId, content);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: answer || "I couldn't process that coding request.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      toast.error("AI Error", {
        description: "Failed to get a response from the code helper."
      });
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "Sorry, I encountered an error while helping with your code.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">AI Code Helper</h1>
        <p className="text-[var(--text-secondary)]">Debug, explain, and generate code with AI assistance.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Code Editor Preview */}
        <div className="flex flex-col space-y-4 h-full">
          <div className="flex-1 glass rounded-2xl overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-input)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code size={16} className="text-[var(--accent-primary)]" />
                <span className="text-xs font-mono text-[var(--text-muted)]">main.py</span>
              </div>
              <button className="p-1.5 hover:bg-[var(--hover-bg)] rounded text-emerald-600 transition-colors">
                <Play size={14} />
              </button>
            </div>
            <div className="flex-1 p-6 bg-[var(--bg-sidebar)] font-mono text-sm overflow-auto">
              <pre className="text-[var(--text-primary)]">
                <code>{exampleCode}</code>
              </pre>
            </div>
          </div>
          <div className="p-4 glass rounded-xl">
            <p className="text-xs text-[var(--text-secondary)] italic">
              Tip: You can paste your code in the chat to get explanations or bug fixes.
            </p>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="h-full min-h-0">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            onClearChat={() => setMessages([])}
            isLoading={isLoading}
            placeholder="Ask about code, errors, or logic..."
          />
        </div>
      </div>
    </div>
  );
};
