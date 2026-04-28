import React, { useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { ChatInterface } from "../components/ChatInterface";
import { Message } from "../types";
import { uploadPdf, chatWithPdf } from "../services/api";
import { motion } from "motion/react";
import { LoadingState } from "../components/LoadingState";
import { toast } from "sonner";

export const PdfChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>("");
  const [userId] = useState(1); // Mock user ID

  const handleFileUpload = async (uploadedFile: File) => {
    if (uploadedFile.type !== "application/pdf") {
      toast.error("Invalid file type", {
        description: "Please upload a PDF file."
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await uploadPdf(uploadedFile);
      setFile(uploadedFile);
      setPdfText(response.text || "");
      toast.success("PDF Uploaded", {
        description: `${uploadedFile.name} has been processed and is ready for chat.`
      });
    } catch (error) {
      toast.error("Upload failed", {
        description: "There was an error processing your PDF. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!file || !pdfText) {
      toast.warning("No PDF found", {
        description: "Please upload a PDF first before asking questions."
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const answer = await chatWithPdf(userId, content, pdfText);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: answer || "I couldn't process that request.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      toast.error("AI Error", {
        description: "Failed to get a response from the AI assistant."
      });
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "Sorry, I encountered an error while analyzing the PDF.",
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
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Chat with PDF</h1>
        <p className="text-[var(--text-secondary)]">Upload a PDF and ask anything about its content.</p>
      </div>

      {!file ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 glass rounded-3xl border-dashed border-2 border-[var(--border-color)] flex flex-col items-center justify-center p-12 space-y-6"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) handleFileUpload(droppedFile);
          }}
        >
          <div className="w-20 h-20 rounded-full bg-indigo-600/10 flex items-center justify-center text-[var(--accent-primary)]">
            <Upload size={40} />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">Drag & Drop PDF here</h3>
            <p className="text-[var(--text-secondary)]">or click to browse from your computer</p>
          </div>
          <input
            type="file"
            id="pdf-upload"
            className="hidden"
            accept=".pdf"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
          <label
            htmlFor="pdf-upload"
            className="px-8 py-3 bg-[var(--accent-primary)] hover:opacity-90 text-white rounded-xl font-medium transition-all cursor-pointer shadow-lg shadow-indigo-600/10"
          >
            Browse Files
          </label>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <div className="flex items-center justify-between p-4 glass rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600/10 rounded-lg text-[var(--accent-primary)]">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{file.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-[var(--text-muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  {isLoading && <LoadingState type="inline" message="Analyzing..." />}
                </div>
              </div>
            </div>
            <button 
              onClick={() => { setFile(null); setMessages([]); }}
              className="p-2 hover:bg-[var(--hover-bg)] rounded-lg text-[var(--text-muted)] hover:text-red-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 min-h-0">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              onClearChat={() => setMessages([])}
              isLoading={isLoading}
              placeholder="Ask a question about this PDF..."
            />
          </div>
        </div>
      )}
    </div>
  );
};
