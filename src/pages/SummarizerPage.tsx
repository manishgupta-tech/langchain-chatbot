import React, { useState } from "react";
import { Upload, FileText, X, ListChecks, BookOpen, Microscope } from "lucide-react";
import { getResearchSummary } from "../services/api";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { LoadingState } from "../components/LoadingState";
import { toast } from "sonner";

export const SummarizerPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [userId] = useState(1); // Mock user ID
  const [summary, setSummary] = useState<{
    overview: string;
    keyPoints: string;
    methodology: string;
  } | null>(null);

  const handleFileUpload = async (uploadedFile: File) => {
    if (uploadedFile.type !== "application/pdf") {
      toast.error("Invalid file type", {
        description: "Please upload a PDF file."
      });
      return;
    }
    setFile(uploadedFile);
    generateSummary(uploadedFile);
  };

  const generateSummary = async (uploadedFile: File) => {
    setIsLoading(true);
    try {
      const response = await getResearchSummary(userId, uploadedFile);
      
      // Basic parsing of the response into sections
      const sections = response.split(/\d\.\s|\n(?=\d\.)/);
      setSummary({
        overview: sections.find(s => s.toLowerCase().includes("summary"))?.replace(/summary:?/i, "").trim() || response,
        keyPoints: sections.find(s => s.toLowerCase().includes("key points"))?.replace(/key points:?/i, "").trim() || "See overview for details.",
        methodology: sections.find(s => s.toLowerCase().includes("methodology"))?.replace(/methodology:?/i, "").trim() || "See overview for details.",
      });
      toast.success("Summary Generated", {
        description: "The research paper has been analyzed successfully."
      });
    } catch (error) {
      console.error(error);
      toast.error("Analysis failed", {
        description: "Failed to generate a summary for this paper."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Research Paper Summarizer</h1>
        <p className="text-[var(--text-secondary)]">Upload a research paper and get a structured AI-generated summary.</p>
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
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">Upload Research Paper (PDF)</h3>
            <p className="text-[var(--text-secondary)]">We'll extract the core insights for you</p>
          </div>
          <input
            type="file"
            id="paper-upload"
            className="hidden"
            accept=".pdf"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
          <label
            htmlFor="paper-upload"
            className="px-8 py-3 bg-[var(--accent-primary)] hover:opacity-90 text-white rounded-xl font-medium transition-all cursor-pointer shadow-lg shadow-indigo-600/10"
          >
            Select PDF
          </label>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col space-y-6 overflow-hidden">
          <div className="flex items-center justify-between p-4 glass rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600/10 rounded-lg text-[var(--accent-primary)]">
                <FileText size={20} />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{file.name}</p>
            </div>
            <button 
              onClick={() => { setFile(null); setSummary(null); }}
              className="p-2 hover:bg-[var(--hover-bg)] rounded-lg text-[var(--text-muted)] hover:text-red-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2 chat-scrollbar">
            {isLoading ? (
              <LoadingState type="full" message="Analyzing research paper..." />
            ) : (
              <AnimatePresence>
                {summary && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 gap-6 pb-8"
                  >
                    <div className="glass rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-3 text-indigo-500 dark:text-indigo-400">
                        <BookOpen size={20} />
                        <h3 className="font-bold text-lg">Summary Overview</h3>
                      </div>
                      <div className="markdown-body text-[var(--text-primary)]">
                        <ReactMarkdown>{summary.overview}</ReactMarkdown>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-3 text-emerald-500 dark:text-emerald-400">
                          <ListChecks size={20} />
                          <h3 className="font-bold text-lg">Key Points</h3>
                        </div>
                        <div className="markdown-body text-[var(--text-primary)]">
                          <ReactMarkdown>{summary.keyPoints}</ReactMarkdown>
                        </div>
                      </div>

                      <div className="glass rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-3 text-amber-500 dark:text-amber-400">
                          <Microscope size={20} />
                          <h3 className="font-bold text-lg">Methodology</h3>
                        </div>
                        <div className="markdown-body text-[var(--text-primary)]">
                          <ReactMarkdown>{summary.methodology}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
