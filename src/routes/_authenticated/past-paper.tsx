import { AiOutput } from "@/components/brand/AiOutput";
import { AiNotice, EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/brand/Bits";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRefreshStudyData, useSubjects } from "@/hooks/useStudyData";
import { explainPastPaper } from "@/lib/ai.functions";
import { SA_SUBJECTS } from "@/lib/constants";
import { saveContent } from "@/lib/data";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/past-paper")({
  head: () => ({
    meta: [
      { title: "Past Paper Assistant — StudyEazy AI" },
      {
        name: "description",
        content: "Paste a matric exam question and get hints, method and marking guidance step by step.",
      },
      { property: "og:title", content: "Past Paper Assistant — StudyEazy AI" },
      { property: "og:description", content: "Understand exam questions with hints before the full solution." },
    ],
  }),
  component: PastPaperPage,
});

function PastPaperPage() {
  const subjectsQuery = useSubjects();
  const refresh = useRefreshStudyData();
  const run = useServerFn(explainPastPaper);
  const mine = (subjectsQuery.data ?? []).map((s) => s.name);
  const list = mine.length ? mine : [...SA_SUBJECTS];

  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const analyse = async (revealSolution: boolean) => {
    if (question.trim().length < 10) return toast.error("Paste the exam question first.");
    setLoading(true);
    setError("");
    try {
      const res = await run({ data: { question: question.trim(), subject, revealSolution } });
      setContent(res.content);
      setRevealed(revealSolution);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not analyse this question.");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveContent({
        kind: "past_paper",
        title: `${subject || "Exam"} question breakdown`,
        subject: subject || null,
        content,
        meta: { question, revealed },
      });
      refresh();
      toast.success("Saved to your library");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Past Paper Assistant"
        subtitle="Understand what an exam question is really asking. You get hints and method first — the full solution only when you ask."
      />

      <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <div className="mb-4 max-w-xs">
          <Label htmlFor="pp-subject">Subject (optional)</Label>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger id="pp-subject">
              <SelectValue placeholder="Choose a subject" />
            </SelectTrigger>
            <SelectContent>
              {list.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Label htmlFor="pp-question">Exam question</Label>
        <Textarea
          id="pp-question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Paste the full question, including mark allocations e.g. (4)"
          className="min-h-[180px]"
        />

        <div className="mt-5 flex flex-wrap gap-3">
          <Button size="lg" className="font-bold" onClick={() => analyse(false)} disabled={loading}>
            {loading ? "Analysing..." : "Get hints & method →"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="font-bold"
            onClick={() => analyse(true)}
            disabled={loading}
          >
            Reveal full solution
          </Button>
        </div>
        <AiNotice className="mt-4" verify />
      </section>

      <div className="mt-6">
        {loading ? (
          <LoadingState label="Working through the question..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => analyse(revealed)} />
        ) : content ? (
          <AiOutput
            title={revealed ? "Full worked solution" : "Hints, method & marking guidance"}
            content={content}
            onSave={save}
            saving={saving}
            onRegenerate={() => analyse(revealed)}
            extraActions={
              revealed ? null : (
                <Button size="sm" variant="secondary" className="font-bold" onClick={() => analyse(true)}>
                  Reveal solution
                </Button>
              )
            }
          />
        ) : (
          <EmptyState
            icon="FileSearch"
            title="No question analysed yet"
            description="Paste a past paper question above. StudyEazy explains what it's asking, the command words, the method and how marks are usually awarded."
          />
        )}
      </div>
    </div>
  );
}
