import { supabase } from "@/integrations/supabase/client";

export interface SubjectRow {
  id: string;
  name: string;
  exam_date: string | null;
  color: string;
}
export interface TopicRow {
  id: string;
  subject_name: string;
  name: string;
  status: string;
  mastery: number;
  is_weak: boolean;
}
export interface SessionRow {
  id: string;
  subject: string;
  topic: string | null;
  duration_seconds: number;
  completed: boolean;
  started_at: string;
}
export interface TaskRow {
  id: string;
  subject: string;
  topic: string | null;
  day: string;
  start_time: string;
  end_time: string;
  priority: string;
  kind: string;
  completed: boolean;
}
export interface QuizRow {
  id: string;
  subject: string;
  topic: string | null;
  score: number;
  total: number;
  percentage: number;
  weak_areas: string[];
  strengths: string[];
  recommendation: string | null;
  created_at: string;
}
export interface SavedRow {
  id: string;
  kind: string;
  title: string;
  subject: string | null;
  topic: string | null;
  content: string;
  created_at: string;
}
export interface NotificationRow {
  id: string;
  title: string;
  body: string | null;
  kind: string;
  read: boolean;
  created_at: string;
}

export const KIND_LABELS: Record<string, string> = {
  study_guide: "Study guide",
  summary: "Notes summary",
  tutor: "Tutor answer",
  past_paper: "Past paper explanation",
  quiz: "Quiz result",
  assistant: "Assistant answer",
};

async function uid() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("You need to be signed in.");
  return data.user.id;
}

export async function fetchSubjects() {
  const { data, error } = await supabase.from("subjects").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as SubjectRow[];
}

export async function addSubject(name: string, examDate?: string | null) {
  const user_id = await uid();
  const { error } = await supabase
    .from("subjects")
    .insert({ user_id, name, exam_date: examDate || null });
  if (error) throw error;
}

export async function updateSubject(id: string, patch: Partial<SubjectRow>) {
  const { error } = await supabase.from("subjects").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteSubject(id: string) {
  const { error } = await supabase.from("subjects").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchTopics() {
  const { data, error } = await supabase.from("topics").select("*").order("created_at");
  if (error) throw error;
  return (data ?? []) as TopicRow[];
}

export async function upsertTopic(input: {
  subject_name: string;
  name: string;
  status?: string;
  mastery?: number;
  is_weak?: boolean;
}) {
  const user_id = await uid();
  const { data: existing } = await supabase
    .from("topics")
    .select("id")
    .eq("subject_name", input.subject_name)
    .eq("name", input.name)
    .maybeSingle();
  if (existing?.id) {
    const { error } = await supabase
      .from("topics")
      .update({
        ...(input.status ? { status: input.status } : {}),
        ...(input.mastery !== undefined ? { mastery: input.mastery } : {}),
        ...(input.is_weak !== undefined ? { is_weak: input.is_weak } : {}),
      })
      .eq("id", existing.id);
    if (error) throw error;
    return existing.id;
  }
  const { data, error } = await supabase
    .from("topics")
    .insert({
      user_id,
      subject_name: input.subject_name,
      name: input.name,
      status: input.status ?? "in_progress",
      mastery: input.mastery ?? 0,
      is_weak: input.is_weak ?? false,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function fetchSessions() {
  const { data, error } = await supabase
    .from("study_sessions")
    .select("*")
    .order("started_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SessionRow[];
}

export async function recordSession(input: {
  subject: string;
  topic?: string | null;
  duration_seconds: number;
}) {
  const user_id = await uid();
  const { error } = await supabase.from("study_sessions").insert({
    user_id,
    subject: input.subject,
    topic: input.topic ?? null,
    duration_seconds: Math.max(0, Math.round(input.duration_seconds)),
    completed: true,
    ended_at: new Date().toISOString(),
  });
  if (error) throw error;
  await notify(
    "Study session logged",
    `${Math.round(input.duration_seconds / 60)} minutes — ${input.subject}${input.topic ? ` (${input.topic})` : ""}`,
    "session",
  );
}

export async function fetchTasks() {
  const { data, error } = await supabase
    .from("study_tasks")
    .select("*")
    .order("day")
    .order("start_time");
  if (error) throw error;
  return (data ?? []) as TaskRow[];
}

export async function insertTasks(
  tasks: {
    day: string;
    start_time: string;
    end_time: string;
    subject: string;
    topic?: string | null;
    priority?: string;
    kind?: string;
  }[],
) {
  const user_id = await uid();
  const { error } = await supabase
    .from("study_tasks")
    .insert(tasks.map((t) => ({ ...t, topic: t.topic ?? null, user_id })));
  if (error) throw error;
}

export async function updateTask(id: string, patch: Partial<TaskRow>) {
  const { error } = await supabase.from("study_tasks").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from("study_tasks").delete().eq("id", id);
  if (error) throw error;
}

export async function clearTasks() {
  const user_id = await uid();
  const { error } = await supabase.from("study_tasks").delete().eq("user_id", user_id);
  if (error) throw error;
}

export async function fetchQuizzes() {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as QuizRow[];
}

export async function saveQuizAttempt(input: {
  subject: string;
  topic: string;
  difficulty: string;
  questions: unknown;
  answers: unknown;
  score: number;
  total: number;
  percentage: number;
  weak_areas: string[];
  strengths: string[];
  recommendation: string;
}) {
  const user_id = await uid();
  const { error } = await supabase.from("quiz_attempts").insert({ user_id, ...input });
  if (error) throw error;
  await notify(
    "Quiz completed",
    `${input.subject} — ${input.topic}: ${input.score}/${input.total} (${input.percentage}%)`,
    "quiz",
  );
}

export async function fetchSaved() {
  const { data, error } = await supabase
    .from("saved_content")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SavedRow[];
}

export async function saveContent(input: {
  kind: string;
  title: string;
  subject?: string | null;
  topic?: string | null;
  content: string;
  meta?: Record<string, unknown>;
}) {
  const user_id = await uid();
  const { error } = await supabase.from("saved_content").insert({
    user_id,
    kind: input.kind,
    title: input.title,
    subject: input.subject ?? null,
    topic: input.topic ?? null,
    content: input.content,
    meta: input.meta ?? {},
  });
  if (error) throw error;
}

export async function deleteSaved(id: string) {
  const { error } = await supabase.from("saved_content").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(40);
  if (error) throw error;
  return (data ?? []) as NotificationRow[];
}

export async function notify(title: string, body: string, kind = "info") {
  try {
    const user_id = await uid();
    await supabase.from("notifications").insert({ user_id, title, body, kind });
  } catch {
    /* notifications are best-effort */
  }
}

export async function markNotificationsRead() {
  const user_id = await uid();
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user_id)
    .eq("read", false);
  if (error) throw error;
}

/* ---------- progress calculation (transparent, activity based) ---------- */

export interface ProgressSummary {
  sessions: number;
  totalSeconds: number;
  weekSeconds: number;
  quizAverage: number;
  topicsCompleted: number;
  topicsRemaining: number;
  taskCompletion: number;
  revision: number;
  perSubject: {
    subject: string;
    revision: number;
    quizAverage: number;
    hours: number;
    weakTopics: string[];
    examDate: string | null;
    daysLeft: number | null;
  }[];
  weakAreas: string[];
  strongAreas: string[];
}

function pct(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function daysUntil(date: string | null): number | null {
  if (!date) return null;
  const target = new Date(`${date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export function computeProgress(
  subjects: SubjectRow[],
  topics: TopicRow[],
  sessions: SessionRow[],
  tasks: TaskRow[],
  quizzes: QuizRow[],
): ProgressSummary {
  const weekAgo = Date.now() - 7 * 86400000;
  const totalSeconds = sessions.reduce((a, s) => a + s.duration_seconds, 0);
  const weekSeconds = sessions
    .filter((s) => new Date(s.started_at).getTime() >= weekAgo)
    .reduce((a, s) => a + s.duration_seconds, 0);

  const quizAverage = quizzes.length
    ? pct(quizzes.reduce((a, q) => a + q.percentage, 0) / quizzes.length)
    : 0;

  const topicsCompleted = topics.filter((t) => t.status === "completed").length;
  const topicsRemaining = Math.max(0, topics.length - topicsCompleted);
  const topicScore = topics.length ? (topicsCompleted / topics.length) * 100 : 0;

  const studyTasks = tasks.filter((t) => t.kind !== "break");
  const taskCompletion = studyTasks.length
    ? pct((studyTasks.filter((t) => t.completed).length / studyTasks.length) * 100)
    : 0;

  // Study-effort component: 10 completed sessions (or 10 hours) is treated as full effort.
  const sessionScore = Math.min(100, (sessions.length / 10) * 100);
  const timeScore = Math.min(100, (totalSeconds / 36000) * 100);

  const revision = pct(
    topicScore * 0.3 + quizAverage * 0.3 + taskCompletion * 0.2 + ((sessionScore + timeScore) / 2) * 0.2,
  );

  const perSubject = subjects.map((s) => {
    const sTopics = topics.filter((t) => t.subject_name === s.name);
    const sQuiz = quizzes.filter((q) => q.subject === s.name);
    const sSessions = sessions.filter((x) => x.subject === s.name);
    const sTasks = studyTasks.filter((t) => t.subject === s.name);
    const sTopicScore = sTopics.length
      ? (sTopics.filter((t) => t.status === "completed").length / sTopics.length) * 100
      : 0;
    const sQuizAvg = sQuiz.length ? pct(sQuiz.reduce((a, q) => a + q.percentage, 0) / sQuiz.length) : 0;
    const sTaskScore = sTasks.length
      ? (sTasks.filter((t) => t.completed).length / sTasks.length) * 100
      : 0;
    const sEffort = Math.min(100, (sSessions.length / 5) * 100);
    return {
      subject: s.name,
      revision: pct(sTopicScore * 0.35 + sQuizAvg * 0.35 + sTaskScore * 0.15 + sEffort * 0.15),
      quizAverage: sQuizAvg,
      hours: Math.round((sSessions.reduce((a, x) => a + x.duration_seconds, 0) / 3600) * 10) / 10,
      weakTopics: Array.from(
        new Set([
          ...sTopics.filter((t) => t.is_weak).map((t) => t.name),
          ...sQuiz.flatMap((q) => q.weak_areas ?? []),
        ]),
      ).slice(0, 4),
      examDate: s.exam_date,
      daysLeft: daysUntil(s.exam_date),
    };
  });

  const weakAreas = Array.from(
    new Set([
      ...topics.filter((t) => t.is_weak).map((t) => `${t.subject_name}: ${t.name}`),
      ...quizzes.flatMap((q) => (q.weak_areas ?? []).map((w) => `${q.subject}: ${w}`)),
    ]),
  ).slice(0, 8);

  const strongAreas = Array.from(
    new Set([
      ...topics.filter((t) => t.mastery >= 75).map((t) => `${t.subject_name}: ${t.name}`),
      ...quizzes.flatMap((q) => (q.strengths ?? []).map((w) => `${q.subject}: ${w}`)),
    ]),
  ).slice(0, 8);

  return {
    sessions: sessions.length,
    totalSeconds,
    weekSeconds,
    quizAverage,
    topicsCompleted,
    topicsRemaining,
    taskCompletion,
    revision,
    perSubject,
    weakAreas,
    strongAreas,
  };
}

export function formatHours(seconds: number) {
  const h = seconds / 3600;
  if (h >= 1) return `${Math.round(h * 10) / 10}h`;
  return `${Math.round(seconds / 60)}m`;
}
