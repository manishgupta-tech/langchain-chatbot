import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Brain, Cpu, Zap } from "lucide-react";
import { cn } from "../lib/utils";

interface LoadingStateProps {
  type?: "chat" | "full" | "inline";
  message?: string;
  className?: string;
}

const statusMessages = [
  "Analyzing your request...",
  "Processing context...",
  "Thinking deeply...",
  "Synthesizing information...",
  "Generating response...",
  "Refining output...",
];

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  type = "chat", 
  message, 
  className 
}) => {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const displayMessage = message || statusMessages[statusIndex];

  if (type === "inline") {
    return (
      <div className={cn("flex items-center gap-2 text-indigo-400", className)}>
        <Zap size={14} className="animate-pulse" />
        <span className="text-xs font-medium animate-pulse">{displayMessage}</span>
      </div>
    );
  }

  if (type === "full") {
    return (
      <div className={cn("h-full flex flex-col items-center justify-center space-y-8 p-12", className)}>
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border-2 border-dashed border-indigo-500/30"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border-2 border-indigo-500/50 border-t-transparent"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="text-indigo-400 animate-pulse-glow" size={32} />
          </div>
        </div>
        
        <div className="text-center space-y-3">
          <AnimatePresence mode="wait">
            <motion.p
              key={displayMessage}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-lg font-medium text-[var(--text-primary)] tracking-tight"
            >
              {displayMessage}
            </motion.p>
          </AnimatePresence>
          <p className="text-sm text-[var(--text-secondary)]">This might take a few moments</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex gap-4", className)}>
      <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
        <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400 animate-pulse" />
      </div>
      <div className="glass p-4 rounded-2xl space-y-3 min-w-[120px]">
        <div className="flex space-x-1.5">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
          />
        </div>
        <p className="text-[10px] font-medium text-indigo-400/70 uppercase tracking-widest animate-pulse">
          {displayMessage}
        </p>
      </div>
    </div>
  );
};
