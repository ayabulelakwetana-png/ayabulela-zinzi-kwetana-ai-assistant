export const APP_NAME = "StudyEazy AI";
export const APP_TAGLINE = "STUDY SMART. PASS EAZY.";
export const AI_NOTICE = "AI-generated content may require human review.";
export const VERIFY_NOTICE =
  "Use your prescribed textbook, teacher, curriculum materials and official resources to verify important information.";

export const SA_SUBJECTS = [
  "Mathematics",
  "Mathematical Literacy",
  "Physical Sciences",
  "Life Sciences",
  "Accounting",
  "Business Studies",
  "Economics",
  "Geography",
  "History",
  "English",
  "Afrikaans",
  "Computer Applications Technology",
  "Information Technology",
  "Other",
] as const;

export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "Exam Preparation"] as const;

export const LEARNING_STYLES = [
  "Simple Explanation",
  "Detailed Explanation",
  "Examples",
  "Step-by-Step",
  "Exam Focused",
] as const;

export const GRADES = ["Grade 10", "Grade 11", "Grade 12 / Matric"] as const;

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type ToolKey =
  | "study-guide"
  | "summarizer"
  | "planner"
  | "tutor"
  | "assistant"
  | "quiz"
  | "past-paper";

export const TOOLS: {
  key: ToolKey;
  title: string;
  description: string;
  to: string;
  icon: string;
  tone: "blue" | "pink" | "gold";
}[] = [
  {
    key: "study-guide",
    title: "AI Study Guide",
    description: "Turn any matric topic into a full structured study guide.",
    to: "/study-guide",
    icon: "BookOpen",
    tone: "blue",
  },
  {
    key: "summarizer",
    title: "Notes Summarizer",
    description: "Compress long class notes into clean revision material.",
    to: "/summarizer",
    icon: "FileText",
    tone: "pink",
  },
  {
    key: "planner",
    title: "AI Study Planner",
    description: "Build a realistic timetable around your exams and free time.",
    to: "/planner",
    icon: "CalendarDays",
    tone: "gold",
  },
  {
    key: "tutor",
    title: "Subject Tutor",
    description: "A patient tutor that teaches step by step, not just answers.",
    to: "/tutor",
    icon: "GraduationCap",
    tone: "blue",
  },
  {
    key: "assistant",
    title: "AI Assistant",
    description: "Ask anything about your studies in a normal conversation.",
    to: "/assistant",
    icon: "Sparkles",
    tone: "pink",
  },
  {
    key: "quiz",
    title: "AI Quiz Generator",
    description: "Practice with quizzes and see your weak areas instantly.",
    to: "/quiz",
    icon: "ListChecks",
    tone: "gold",
  },
  {
    key: "past-paper",
    title: "Past Paper Assistant",
    description: "Understand exam questions with hints before the solution.",
    to: "/past-paper",
    icon: "FileSearch",
    tone: "blue",
  },
];

export const NAV_MAIN: { label: string; to: string; icon: string }[] = [
  { label: "Dashboard", to: "/dashboard", icon: "LayoutDashboard" },
  { label: "AI Study Guide", to: "/study-guide", icon: "BookOpen" },
  { label: "Notes Summarizer", to: "/summarizer", icon: "FileText" },
  { label: "AI Study Planner", to: "/planner", icon: "CalendarDays" },
  { label: "Subject Tutor", to: "/tutor", icon: "GraduationCap" },
  { label: "AI Assistant", to: "/assistant", icon: "Sparkles" },
  { label: "AI Quiz Generator", to: "/quiz", icon: "ListChecks" },
  { label: "Past Paper Assistant", to: "/past-paper", icon: "FileSearch" },
  { label: "Subjects", to: "/subjects", icon: "Library" },
  { label: "Progress", to: "/progress", icon: "TrendingUp" },
  { label: "Saved Content", to: "/saved", icon: "Bookmark" },
];

export const NAV_OTHER: { label: string; to: string; icon: string }[] = [
  { label: "Settings", to: "/settings", icon: "Settings" },
  { label: "Help & Support", to: "/help", icon: "LifeBuoy" },
];
