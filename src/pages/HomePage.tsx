import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, GraduationCap, Code, Search, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const tools = [
    {
      id: "pdf-chat",
      title: "Chat with PDF",
      description: "Upload a PDF and ask questions about the document. Extract insights instantly.",
      icon: FileText,
      path: "/pdf-chat",
      color: "from-blue-500 to-indigo-600",
      delay: 0.1
    },
    {
      id: "study-assistant",
      title: "AI Study Assistant",
      description: "Ask study questions and get detailed explanations on any academic topic.",
      icon: GraduationCap,
      path: "/study-assistant",
      color: "from-amber-500 to-orange-600",
      delay: 0.2
    },
    {
      id: "code-helper",
      title: "AI Code Helper",
      description: "Explain code, debug errors, and generate efficient code snippets in any language.",
      icon: Code,
      path: "/code-helper",
      color: "from-emerald-500 to-teal-600",
      delay: 0.3
    },
    {
      id: "summarizer",
      title: "Research Summarizer",
      description: "Upload a research paper and generate a structured summary with key insights.",
      icon: Search,
      path: "/summarizer",
      color: "from-purple-500 to-pink-600",
      delay: 0.4
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight"
        >
          LangChain AI Projects
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-[var(--text-secondary)] max-w-2xl"
        >
          Explore a suite of advanced AI tools powered by LangChain and Gemini API. 
          Designed for researchers, students, and developers.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: tool.delay }}
            whileHover={{ y: -5 }}
            className="glass rounded-3xl p-8 flex flex-col justify-between group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10"
            onClick={() => navigate(tool.path)}
          >
            <div className="space-y-6">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-xl shadow-indigo-500/10 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                <tool.icon size={28} className="text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                  {tool.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--accent-primary)] uppercase tracking-wider">Explore Tool</span>
              <div className="w-10 h-10 rounded-full bg-[var(--hover-bg)] flex items-center justify-center group-hover:bg-[var(--accent-primary)] transition-all group-hover:translate-x-1">
                <ArrowRight size={18} className="text-[var(--text-primary)] group-hover:text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
