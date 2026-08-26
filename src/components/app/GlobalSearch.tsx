import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSaved, useStudyData } from "@/hooks/useStudyData";
import { KIND_LABELS } from "@/lib/data";
import { NAV_MAIN, TOOLS } from "@/lib/constants";
import { useNavigate } from "@tanstack/react-router";

export function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const { subjects, topics, quizzes, tasks } = useStudyData();
  const saved = useSaved();

  const go = (to: string) => {
    onOpenChange(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search subjects, topics, saved guides, quizzes, plans..." />
      <CommandList>
        <CommandEmpty>No results found. Try another subject or topic.</CommandEmpty>

        <CommandGroup heading="Pages & tools">
          {[...NAV_MAIN, ...TOOLS.map((t) => ({ label: t.title, to: t.to }))].map((n, i) => (
            <CommandItem key={`${n.to}-${i}`} value={`page ${n.label}`} onSelect={() => go(n.to)}>
              {n.label}
            </CommandItem>
          ))}
        </CommandGroup>

        {subjects.length ? (
          <CommandGroup heading="Subjects">
            {subjects.map((s) => (
              <CommandItem key={s.id} value={`subject ${s.name}`} onSelect={() => go("/subjects")}>
                {s.name}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {topics.length ? (
          <CommandGroup heading="Topics">
            {topics.map((t) => (
              <CommandItem
                key={t.id}
                value={`topic ${t.subject_name} ${t.name}`}
                onSelect={() => go("/subjects")}
              >
                {t.name}
                <span className="ml-2 text-xs text-muted-foreground">{t.subject_name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {saved.data?.length ? (
          <CommandGroup heading="Saved content">
            {saved.data.map((s) => (
              <CommandItem key={s.id} value={`saved ${s.title} ${s.subject ?? ""}`} onSelect={() => go("/saved")}>
                {s.title}
                <span className="ml-2 text-xs text-muted-foreground">
                  {KIND_LABELS[s.kind] ?? s.kind}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {quizzes.length ? (
          <CommandGroup heading="Quiz history">
            {quizzes.map((q) => (
              <CommandItem key={q.id} value={`quiz ${q.subject} ${q.topic ?? ""}`} onSelect={() => go("/progress")}>
                {q.subject} — {q.topic}
                <span className="ml-2 text-xs text-muted-foreground">{q.percentage}%</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {tasks.length ? (
          <CommandGroup heading="Study plan">
            {tasks.slice(0, 20).map((t) => (
              <CommandItem key={t.id} value={`plan ${t.subject} ${t.topic ?? ""} ${t.day}`} onSelect={() => go("/planner")}>
                {t.day} {t.start_time} — {t.subject}
                {t.topic ? ` (${t.topic})` : ""}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}
