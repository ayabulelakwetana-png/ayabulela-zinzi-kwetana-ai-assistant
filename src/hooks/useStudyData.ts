import { useSession } from "@/hooks/useSession";
import {
  computeProgress,
  fetchQuizzes,
  fetchSaved,
  fetchSessions,
  fetchSubjects,
  fetchTasks,
  fetchTopics,
  fetchNotifications,
} from "@/lib/data";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export function useSubjects() {
  const { user } = useSession();
  return useQuery({ queryKey: ["subjects", user?.id], enabled: !!user, queryFn: fetchSubjects });
}
export function useTopics() {
  const { user } = useSession();
  return useQuery({ queryKey: ["topics", user?.id], enabled: !!user, queryFn: fetchTopics });
}
export function useSessions() {
  const { user } = useSession();
  return useQuery({ queryKey: ["sessions", user?.id], enabled: !!user, queryFn: fetchSessions });
}
export function useTasks() {
  const { user } = useSession();
  return useQuery({ queryKey: ["tasks", user?.id], enabled: !!user, queryFn: fetchTasks });
}
export function useQuizzes() {
  const { user } = useSession();
  return useQuery({ queryKey: ["quizzes", user?.id], enabled: !!user, queryFn: fetchQuizzes });
}
export function useSaved() {
  const { user } = useSession();
  return useQuery({ queryKey: ["saved", user?.id], enabled: !!user, queryFn: fetchSaved });
}
export function useNotifications() {
  const { user } = useSession();
  return useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user,
    queryFn: fetchNotifications,
  });
}

/** Everything the dashboard / progress pages need, plus derived progress. */
export function useStudyData() {
  const subjects = useSubjects();
  const topics = useTopics();
  const sessions = useSessions();
  const tasks = useTasks();
  const quizzes = useQuizzes();

  const isLoading =
    subjects.isLoading || topics.isLoading || sessions.isLoading || tasks.isLoading || quizzes.isLoading;
  const error =
    subjects.error || topics.error || sessions.error || tasks.error || quizzes.error || null;

  const progress = useMemo(
    () =>
      computeProgress(
        subjects.data ?? [],
        topics.data ?? [],
        sessions.data ?? [],
        tasks.data ?? [],
        quizzes.data ?? [],
      ),
    [subjects.data, topics.data, sessions.data, tasks.data, quizzes.data],
  );

  return {
    subjects: subjects.data ?? [],
    topics: topics.data ?? [],
    sessions: sessions.data ?? [],
    tasks: tasks.data ?? [],
    quizzes: quizzes.data ?? [],
    progress,
    isLoading,
    error: error as Error | null,
  };
}

export function useRefreshStudyData() {
  const qc = useQueryClient();
  return () => {
    for (const key of ["subjects", "topics", "sessions", "tasks", "quizzes", "saved", "notifications"]) {
      qc.invalidateQueries({ queryKey: [key] });
    }
  };
}
