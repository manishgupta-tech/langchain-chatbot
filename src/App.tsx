import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { HomePage } from "./pages/HomePage";
import { PdfChatPage } from "./pages/PdfChatPage";
import { StudyAssistantPage } from "./pages/StudyAssistantPage";
import { CodeHelperPage } from "./pages/CodeHelperPage";
import { SummarizerPage } from "./pages/SummarizerPage";
import { cn } from "./lib/utils";
import { Menu } from "lucide-react";
import { Toaster } from "sonner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <ErrorBoundary>
          <div className="flex min-h-screen bg-navy-900 overflow-hidden">
          {/* Toaster for notifications */}
          <Toaster 
            position="top-right" 
            richColors 
            closeButton 
            theme="dark"
            toastOptions={{
              className: "glass border-white/10 text-white",
              style: {
                background: "rgba(15, 23, 42, 0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }
            }}
          />

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden fixed top-4 right-4 z-[60] p-2 bg-indigo-600 text-white rounded-lg shadow-lg"
          >
            <Menu size={24} />
          </button>

          {/* Sidebar */}
          <div className={cn(
            "transition-transform duration-300 lg:translate-x-0 z-50",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}>
            <Sidebar 
              isCollapsed={isSidebarCollapsed} 
              toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            />
          </div>

          {/* Mobile Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Main Content */}
          <main 
            className={cn(
              "flex-1 transition-all duration-300 h-screen overflow-y-auto relative",
              isSidebarCollapsed ? "lg:ml-20" : "lg:ml-[260px]"
            )}
          >
            <div className="p-6 md:p-10 lg:p-12 min-h-full">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pdf-chat" element={<PdfChatPage />} />
                <Route path="/study-assistant" element={<StudyAssistantPage />} />
                <Route path="/code-helper" element={<CodeHelperPage />} />
                <Route path="/summarizer" element={<SummarizerPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </ErrorBoundary>
      </ThemeProvider>
    </Router>
  );
}

