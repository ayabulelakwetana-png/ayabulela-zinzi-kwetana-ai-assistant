import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRefreshStudyData, useSubjects } from "@/hooks/useStudyData";
import { recordSession, upsertTopic } from "@/lib/data";
import { SA_SUBJECTS } from "@/lib/constants";
import { Pause, Play, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function fmt(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function StudyTimer({
  open,
  onOpenChange,
  initialSubject,
  initialTopic,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialSubject?: string;
  initialTopic?: string;
}) {
  const subjectsQuery = useSubjects();
  const refresh = useRefreshStudyData();
  const options = (subjectsQuery.data ?? []).map((s) => s.name);
  const list = options.length ? options : [...SA_SUBJECTS].filter((s) => s !== "Other");

  const [subject, setSubject] = useState(initialSubject ?? "");
  const [topic, setTopic] = useState(initialTopic ?? "");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (open) {
      setSubject(initialSubject ?? list[0] ?? "");
      setTopic(initialTopic ?? "");
      setSeconds(0);
      setRunning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialSubject, initialTopic]);

  useEffect(() => {
    if (running) {
      timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [running]);

  const finish = async () => {
    if (!subject) return toast.error("Choose a subject first.");
    if (seconds < 10) return toast.error("Study for at least 10 seconds before saving a session.");
    setSaving(true);
    setRunning(false);
    try {
      await recordSession({ subject, topic: topic || null, duration_seconds: seconds });
      if (topic.trim()) await upsertTopic({ subject_name: subject, name: topic.trim(), status: "in_progress" });
      refresh();
      toast.success(`Session saved — ${Math.max(1, Math.round(seconds / 60))} min of ${subject}`);
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save your session.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Study session</DialogTitle>
          <DialogDescription>
            Your time is logged against this subject and counts towards your progress.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="timer-subject">Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="timer-subject">
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
            <Label htmlFor="timer-topic">Topic (optional)</Label>
            <Input
              id="timer-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Trigonometry"
            />
          </div>

          <div className="rounded-2xl bg-blue-light py-6 text-center">
            <p className="text-4xl font-extrabold tabular-nums text-navy">{fmt(seconds)}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-blue">
              {running ? "Studying" : seconds ? "Paused" : "Ready"}
            </p>
          </div>

          <div className="flex gap-2">
            {running ? (
              <Button variant="outline" className="flex-1 font-bold" onClick={() => setRunning(false)}>
                <Pause className="mr-2 h-4 w-4" /> Pause
              </Button>
            ) : (
              <Button className="flex-1 font-bold" onClick={() => setRunning(true)} disabled={!subject}>
                <Play className="mr-2 h-4 w-4" /> {seconds ? "Resume" : "Start"}
              </Button>
            )}
            <Button variant="secondary" className="flex-1 font-bold" onClick={finish} disabled={saving}>
              <Square className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Finish"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
