import React, { useState } from "react";
import { ChatInterface } from "../components/ChatInterface";
import { Message } from "../types";
import { getStudyAssistantResponse } from "../services/api";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

export const StudyAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(1); // Mock user ID

  const examplePrompts = [
    "Explain database normalization with examples",
    "How does operating system paging work?",
    "Explain the basics of machine learning",
    "What is the difference between SQL and NoSQL?"
  ];

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
      const answer = await getStudyAssistantResponse(userId, content);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: answer || "I couldn't generate an explanation for that.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      toast.error("AI Error", {
        description: "Failed to get a response from the study assistant."
      });
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "Sorry, I encountered an error while processing your request.",
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
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">AI Study Assistant</h1>
        <p className="text-[var(--text-secondary)]">Get clear explanations and help with your academic topics.</p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col space-y-6">
        {messages.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="p-4 glass rounded-xl text-left hover:bg-[var(--hover-bg)] transition-all group flex items-start gap-3"
              >
                <Sparkles size={18} className="text-amber-500 shrink-0 mt-1" />
                <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">{prompt}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 min-h-0">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            onClearChat={() => setMessages([])}
            isLoading={isLoading}
            placeholder="Ask a study question..."
          />
        </div>
      </div>
    </div>
  );
};
