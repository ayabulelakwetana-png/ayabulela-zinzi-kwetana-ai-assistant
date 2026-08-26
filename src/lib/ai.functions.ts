import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const guideSchema = z.object({
  subject: z.string().min(1).max(80),
  topic: z.string().min(2).max(200),
  difficulty: z.string().min(1).max(40),
  studyTime: z.string().min(1).max(40),
  learningStyle: z.string().min(1).max(40),
  grade: z.string().max(40).default("Grade 12 / Matric"),
});

export const generateStudyGuide = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => guideSchema.parse(input))
  .handler(async ({ data }) => {
    const { callAI } = await import("./ai.server");
    const { studyGuidePrompt } = await import("./ai-prompts");
    const content = await callAI([{ role: "user", content: studyGuidePrompt(data) }], {
      temperature: 0.4,
    });
    return { content };
  });

const summarySchema = z.object({
  notes: z.string().min(40, "Add at least a few sentences of notes.").max(20000),
  length: z.string().max(20),
  level: z.string().max(20),
  subject: z.string().max(80).optional(),
});

export const summarizeNotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => summarySchema.parse(input))
  .handler(async ({ data }) => {
    const { callAI } = await import("./ai.server");
    const { summarizerPrompt } = await import("./ai-prompts");
    const content = await callAI([{ role: "user", content: summarizerPrompt(data) }], {
      temperature: 0.3,
    });
    return { content };
  });

const plannerSchema = z.object({
  subjects: z.string().min(1).max(500),
  topics: z.string().max(1000).default(""),
  exams: z.string().max(1000).default(""),
  hoursPerDay: z.string().max(40),
  preferredTimes: z.string().max(120),
  strengths: z.string().max(500).default(""),
  weaknesses: z.string().max(500).default(""),
  days: z.array(z.string().max(20)).min(1),
  breaks: z.string().max(120).default("Short 10 minute breaks"),
});

export const generateStudyPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => plannerSchema.parse(input))
  .handler(async ({ data }) => {
    const { callAI, parseJsonResponse } = await import("./ai.server");
    const { plannerPrompt } = await import("./ai-prompts");
    const raw = await callAI([{ role: "user", content: plannerPrompt(data) }], {
      temperature: 0.3,
    });
    const parsed = parseJsonResponse<{
      tasks: {
        day: string;
        start_time: string;
        end_time: string;
        subject: string;
        topic?: string;
        priority?: string;
        kind?: string;
      }[];
      notes?: string;
    }>(raw);
    const tasks = (parsed.tasks ?? []).slice(0, 80).map((t) => ({
      day: String(t.day ?? "Monday"),
      start_time: String(t.start_time ?? "16:00").slice(0, 5),
      end_time: String(t.end_time ?? "17:00").slice(0, 5),
      subject: String(t.subject ?? "Study"),
      topic: t.topic ? String(t.topic) : null,
      priority: ["high", "medium", "low"].includes(String(t.priority)) ? String(t.priority) : "medium",
      kind: ["study", "break", "revision"].includes(String(t.kind)) ? String(t.kind) : "study",
    }));
    return { tasks, notes: parsed.notes ?? "" };
  });

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      }),
    )
    .min(1)
    .max(40),
  system: z.string().max(6000).optional(),
  subject: z.string().max(80).optional(),
  topic: z.string().max(160).optional(),
  difficulty: z.string().max(40).optional(),
  mode: z.enum(["tutor", "assistant"]).default("assistant"),
  learnerName: z.string().max(80).optional(),
  learnerSubjects: z.array(z.string().max(80)).max(20).optional(),
});

export const chatWithAI = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => chatSchema.parse(input))
  .handler(async ({ data }) => {
    const { callAI } = await import("./ai.server");
    const { tutorSystemPrompt, assistantSystemPrompt } = await import("./ai-prompts");
    const system =
      data.mode === "tutor"
        ? tutorSystemPrompt({
            subject: data.subject || "General studies",
            topic: data.topic || "the requested topic",
            difficulty: data.difficulty || "Intermediate",
          })
        : assistantSystemPrompt(data.learnerName ?? "", data.learnerSubjects ?? []);
    const content = await callAI(
      [{ role: "system" as const, content: system }, ...data.messages],
      { temperature: 0.6 },
    );
    return { content };
  });

const quizSchema = z.object({
  subject: z.string().min(1).max(80),
  topic: z.string().min(2).max(200),
  count: z.number().int().min(3).max(20),
  difficulty: z.string().max(40),
  type: z.enum(["multiple_choice", "true_false", "short_answer", "mixed"]),
});

export const generateQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => quizSchema.parse(input))
  .handler(async ({ data }) => {
    const { callAI, parseJsonResponse, AiError } = await import("./ai.server");
    const { quizPrompt } = await import("./ai-prompts");
    const raw = await callAI([{ role: "user", content: quizPrompt(data) }], { temperature: 0.4 });
    const parsed = parseJsonResponse<{
      questions: {
        id?: number;
        type?: string;
        sub_topic?: string;
        question?: string;
        options?: string[];
        correct_index?: number;
        answer?: string;
        explanation?: string;
      }[];
    }>(raw);
    const questions = (parsed.questions ?? [])
      .filter((q) => q.question)
      .slice(0, data.count)
      .map((q, idx) => ({
        id: idx + 1,
        type: ["multiple_choice", "true_false", "short_answer"].includes(String(q.type))
          ? String(q.type)
          : "multiple_choice",
        sub_topic: q.sub_topic ? String(q.sub_topic) : data.topic,
        question: String(q.question),
        options: Array.isArray(q.options) ? q.options.map((o) => String(o)).slice(0, 6) : [],
        correct_index: typeof q.correct_index === "number" ? q.correct_index : -1,
        answer: q.answer ? String(q.answer) : "",
        explanation: q.explanation ? String(q.explanation) : "",
      }));
    if (!questions.length)
      throw new AiError("No quiz questions could be generated. Try a more specific topic.", 502);
    return { questions };
  });

const pastPaperSchema = z.object({
  question: z.string().min(10, "Paste the exam question first.").max(8000),
  subject: z.string().max(80).default(""),
  revealSolution: z.boolean().default(false),
});

export const explainPastPaper = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => pastPaperSchema.parse(input))
  .handler(async ({ data }) => {
    const { callAI } = await import("./ai.server");
    const { pastPaperPrompt } = await import("./ai-prompts");
    const content = await callAI([{ role: "user", content: pastPaperPrompt(data) }], {
      temperature: 0.35,
    });
    return { content };
  });
