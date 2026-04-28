import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  FileText, 
  GraduationCap, 
  Code, 
  Search, 
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import { cn } from "../lib/utils";
import { useTheme } from "../context/ThemeContext";

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleCollapse }) => {
  const { theme, toggleTheme } = useTheme();
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: FileText, label: "Chat with PDF", path: "/pdf-chat" },
    { icon: GraduationCap, label: "AI Study Assistant", path: "/study-assistant" },
    { icon: Code, label: "AI Code Helper", path: "/code-helper" },
    { icon: Search, label: "Research Summarizer", path: "/summarizer" },
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-navy-800 border-r border-[var(--border-color)] transition-all duration-300 z-50 flex flex-col",
        isCollapsed ? "w-20" : "w-[260px]"
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--accent-primary)] rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">LangChain AI</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-[var(--accent-primary)] rounded-lg flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/20">
            <LayoutDashboard size={20} className="text-white" />
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
              isActive 
                ? "bg-[var(--accent-primary)] text-white shadow-md shadow-indigo-600/10" 
                : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
            )}
          >
            <item.icon size={20} className={cn(isCollapsed && "mx-auto")} />
            {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--border-color)] space-y-1">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-center p-2.5 rounded-xl hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          {!isCollapsed && <span className="ml-3 text-sm font-medium">{theme === 'light' ? "Dark Mode" : "Light Mode"}</span>}
        </button>
        <button 
          onClick={toggleCollapse}
          className="w-full flex items-center justify-center p-2.5 rounded-xl hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
};
