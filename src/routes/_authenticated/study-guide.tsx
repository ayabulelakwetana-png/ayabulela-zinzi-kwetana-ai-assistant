import { AiOutput } from "@/components/brand/AiOutput";
import { AiNotice, EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/brand/Bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfile } from "@/hooks/useSession";
import { useRefreshStudyData, useSubjects } from "@/hooks/useStudyData";
import { generateStudyGuide } from "@/lib/ai.functions";
import { DIFFICULTIES, LEARNING_STYLES, SA_SUBJECTS } from "@/lib/constants";
import { saveContent, upsertTopic } from "@/lib/data";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/study-guide")({
  head: () => ({
    meta: [
      { title: "AI Study Guide — StudyEazy AI" },
      {
        name: "description",
        content: "Generate structured CAPS-aligned matric study guides for any Grade 12 topic.",
      },
      { property: "og:title", content: "AI Study Guide — StudyEazy AI" },
      {
        property: "og:description",
        content: "Turn any matric topic into a full structured study guide.",
      },
    ],
  }),
  component: StudyGuidePage,
});

const TIMES = ["30 minutes", "1 hour", "2 hours", "A full study day"];

function StudyGuidePage() {
  const profile = useProfile();
  const subjectsQuery = useSubjects();
  const refresh = useRefreshStudyData();
  const run = useServerFn(generateStudyGuide);

  const mySubjects = (subjectsQuery.data ?? []).map((s) => s.name);
  const subjectList = mySubjects.length ? mySubjects : [...SA_SUBJECTS];

  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<string>(DIFFICULTIES[1]);
  const [studyTime, setStudyTime] = useState(TIMES[1]!);
  const [learningStyle, setLearningStyle] = useState<string>(LEARNING_STYLES[1]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!subject) return toast.error("Choose a subject.");
    if (topic.trim().length < 2) return toast.error("Enter the topic you want to study.");
    setLoading(true);
    setError("");
    try {
      const res = await run({
        data: {
          subject,
          topic: topic.trim(),
          difficulty,
          studyTime,
          learningStyle,
          grade: profile.data?.grade ?? "Grade 12 / Matric",
        },
      });
      setContent(res.content);
      await upsertTopic({ subject_name: subject, name: topic.trim(), status: "in_progress" });
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate your study guide.");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveContent({
        kind: "study_guide",
        title: `${subject}: ${topic}`,
        subject,
        topic,
        content,
        meta: { difficulty, studyTime, learningStyle },
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
        title="AI Study Guide"
        subtitle="Pick a subject and topic and StudyEazy builds a complete, structured guide you can revise from."
      />

      <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="sg-subject">Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="sg-subject">
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjectList.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sg-topic">Topic</Label>
            <Input
              id="sg-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Electric circuits, Macbeth Act 1, Cash budgets"
            />
          </div>
          <div>
            <Label htmlFor="sg-difficulty">Difficulty level</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger id="sg-difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sg-time">Study time available</Label>
            <Select value={studyTime} onValueChange={setStudyTime}>
              <SelectTrigger id="sg-time">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="sg-style">Preferred learning style</Label>
            <Select value={learningStyle} onValueChange={setLearningStyle}>
              <SelectTrigger id="sg-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEARNING_STYLES.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="mt-5 w-full font-bold sm:w-auto" size="lg" onClick={generate} disabled={loading}>
          {loading ? "Generating..." : "Generate study guide →"}
        </Button>
        <AiNotice className="mt-4" />
      </section>

      <div className="mt-6">
        {loading ? (
          <LoadingState label="Building your study guide..." />
        ) : error ? (
          <ErrorState message={error} onRetry={generate} />
        ) : content ? (
          <AiOutput
            title={`${subject}: ${topic}`}
            content={content}
            onSave={save}
            saving={saving}
            onRegenerate={generate}
            editable
            onEdited={setContent}
          />
        ) : (
          <EmptyState
            icon="BookOpen"
            title="No study guide yet"
            description="Fill in the subject and topic above, then generate your guide. It will include an overview, key concepts, worked examples, exam tips and a summary."
          />
        )}
      </div>
    </div>
  );
}
