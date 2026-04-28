export interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  color: string;
}
