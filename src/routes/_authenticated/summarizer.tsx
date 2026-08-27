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
import { summarizeNotes } from "@/lib/ai.functions";
import { SA_SUBJECTS } from "@/lib/constants";
import { saveContent } from "@/lib/data";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/summarizer")({
  head: () => ({
    meta: [
      { title: "Notes Summarizer — StudyEazy AI" },
      {
        name: "description",
        content: "Turn long matric class notes into short, clean revision summaries you can actually study.",
      },
      { property: "og:title", content: "Notes Summarizer — StudyEazy AI" },
      { property: "og:description", content: "Compress long class notes into clean revision material." },
    ],
  }),
  component: SummarizerPage,
});

const LENGTHS = ["Short", "Medium", "Detailed"];
const LEVELS = ["Simple", "Standard", "Exam-ready"];

function SummarizerPage() {
  const subjectsQuery = useSubjects();
  const refresh = useRefreshStudyData();
  const run = useServerFn(summarizeNotes);
  const subjectList = (subjectsQuery.data ?? []).map((s) => s.name);
  const list = subjectList.length ? subjectList : [...SA_SUBJECTS];

  const [notes, setNotes] = useState("");
  const [subject, setSubject] = useState("");
  const [length, setLength] = useState("Medium");
  const [level, setLevel] = useState("Standard");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const words = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  const generate = async () => {
    if (notes.trim().length < 40) return toast.error("Paste at least a few sentences of notes.");
    setLoading(true);
    setError("");
    try {
      const res = await run({
        data: { notes: notes.trim(), length, level, ...(subject ? { subject } : {}) },
      });
      setContent(res.content);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not summarize your notes.");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveContent({
        kind: "summary",
        title: subject ? `${subject} notes summary` : "Notes summary",
        subject: subject || null,
        content,
        meta: { length, level, words },
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
        title="Notes Summarizer"
        subtitle="Paste your class notes or a textbook section and get a clean summary with key points and definitions."
      />

      <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <Label htmlFor="notes">Your notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste your notes here..."
          className="min-h-[220px]"
        />
        <p className="mt-1.5 text-xs font-semibold text-muted-foreground">{words} words</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="sm-subject">Subject (optional)</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="sm-subject">
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
          <div>
            <Label htmlFor="sm-length">Summary length</Label>
            <Select value={length} onValueChange={setLength}>
              <SelectTrigger id="sm-length">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LENGTHS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sm-level">Detail level</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger id="sm-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="mt-5 w-full font-bold sm:w-auto" size="lg" onClick={generate} disabled={loading}>
          {loading ? "Summarizing..." : "Summarize notes →"}
        </Button>
        <AiNotice className="mt-4" />
      </section>

      <div className="mt-6">
        {loading ? (
          <LoadingState label="Summarizing your notes..." />
        ) : error ? (
          <ErrorState message={error} onRetry={generate} />
        ) : content ? (
          <AiOutput
            title={subject ? `${subject} summary` : "Notes summary"}
            content={content}
            onSave={save}
            saving={saving}
            onRegenerate={generate}
            editable
            onEdited={setContent}
          />
        ) : (
          <EmptyState
            icon="FileText"
            title="No summary yet"
            description="Paste your notes above and StudyEazy will produce a short summary, key points, definitions and a memory aid."
          />
        )}
      </div>
    </div>
  );
}
