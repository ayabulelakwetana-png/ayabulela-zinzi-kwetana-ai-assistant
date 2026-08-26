import { StudyTimer } from "@/components/app/StudyTimer";
import { AiNotice, EmptyState, ErrorState, ToolIcon } from "@/components/brand/Bits";
import { LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/useSession";
import { useStudyData } from "@/hooks/useStudyData";
import { TOOLS } from "@/lib/constants";
import { formatHours } from "@/lib/data";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — StudyEazy AI" },
      {
        name: "description",
        content: "Your personalised matric study dashboard: AI tools, progress, exams and activity.",
      },
      { property: "og:title", content: "StudyEazy AI Dashboard" },
      { property: "og:description", content: "Track your matric revision progress and open your AI study tools." },
    ],
  }),
  component: Dashboard,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const profile = useProfile();
  const { subjects, sessions, tasks, quizzes, topics, progress, isLoading, error } = useStudyData();
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerSubject, setTimerSubject] = useState<string | undefined>();
  const [timerTopic, setTimerTopic] = useState<string | undefined>();

  const firstName = profile.data?.first_name || "learner";

  const continueTopics = topics
    .filter((t) => t.status !== "completed")
    .slice(0, 3)
    .map((t) => ({
      subject: t.subject_name,
      topic: t.name,
      pct: progress.perSubject.find((p) => p.subject === t.subject_name)?.revision ?? 0,
    }));

  const upcoming = progress.perSubject
    .filter((s) => s.daysLeft !== null && s.daysLeft >= 0)
    .sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0))
    .slice(0, 4);

  const activity = [
    ...sessions.slice(0, 4).map((s) => ({
      when: s.started_at,
      text: `Study session: ${Math.max(1, Math.round(s.duration_seconds / 60))} minutes — ${s.subject}${s.topic ? ` (${s.topic})` : ""}`,
    })),
    ...quizzes.slice(0, 4).map((q) => ({
      when: q.created_at,
      text: `Completed a ${q.total}-question ${q.subject} quiz — ${q.percentage}%`,
    })),
  ]
    .sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime())
    .slice(0, 5);

  const suggestions = progress.weakAreas.slice(0, 3);

  const startStudying = (subject?: string, topic?: string) => {
    setTimerSubject(subject);
    setTimerTopic(topic);
    setTimerOpen(true);
  };

  if (error) return <ErrorState message={error.message} onRetry={() => window.location.reload()} />;

  return (
    <div className="space-y-8">
      <section className="hero-gradient grid items-center gap-8 rounded-3xl border border-border p-6 shadow-card sm:p-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-blue shadow-sm">
            ✦ Powered by AI
          </span>
          <p className="mt-4 text-sm font-bold text-navy-2">
            {greeting()}, {firstName}. Ready to continue studying?
          </p>
          <h1 className="mt-1 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Your <span className="text-blue">AI</span> Matric Study{" "}
            <span className="text-pink">Assistant</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm font-medium text-navy-2 sm:text-base">
            Learn smarter, revise faster, and prepare with confidence — all from one simple study
            workspace.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" className="font-bold" onClick={() => startStudying()}>
              START STUDYING →
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-navy bg-card font-bold text-navy hover:bg-blue-light"
            >
              <Link to="/tutor">ASK AI TUTOR</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative rounded-3xl bg-card p-6 shadow-lift">
            <LogoMark size={140} />
            <span className="absolute -right-2 -top-2 rounded-lg bg-gold px-2 py-0.5 text-[10px] font-extrabold text-navy">
              Grade 12
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [0, 1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
        ) : (
          <>
            <StatCard label="Study Sessions Completed" value={String(progress.sessions)} tone="blue" icon="CheckCircle2" />
            <StatCard label="Study Time This Week" value={formatHours(progress.weekSeconds)} tone="gold" icon="Clock" />
            <StatCard
              label="Revision Progress"
              value={`${progress.revision}%`}
              tone="pink"
              icon="TrendingUp"
              footer={<Progress value={progress.revision} className="mt-3 h-2" />}
            />
          </>
        )}
      </section>

      <section>
        <h2 className="text-xl font-extrabold">AI Study Tools</h2>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Choose a tool to help you study smarter.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <article
              key={tool.key}
              className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span
                className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${
                  tool.tone === "blue"
                    ? "bg-blue-light text-blue"
                    : tool.tone === "pink"
                      ? "bg-pink-light text-pink"
                      : "bg-gold-light text-navy"
                }`}
              >
                <ToolIcon name={tool.icon} className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold">{tool.title}</h3>
              <p className="mt-1 flex-1 text-sm font-medium text-muted-foreground">{tool.description}</p>
              <Button asChild variant="outline" className="mt-4 font-bold">
                <Link to={tool.to}>Open Tool →</Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Panel title="Continue Studying">
          {continueTopics.length === 0 ? (
            <EmptyState
              icon="BookOpen"
              title="No topics started yet"
              description="Generate a study guide or start a study session to begin tracking topics."
              action={
                <Button asChild size="sm" className="font-bold">
                  <Link to="/study-guide">Open AI Study Guide</Link>
                </Button>
              }
            />
          ) : (
            <ul className="space-y-3">
              {continueTopics.map((c) => (
                <li key={`${c.subject}-${c.topic}`} className="rounded-xl border border-border p-3">
                  <p className="text-sm font-bold">{c.subject}</p>
                  <p className="text-[13px] font-medium text-muted-foreground">{c.topic}</p>
                  <Progress value={c.pct} className="mt-2 h-1.5" />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-blue">{c.pct}% complete</span>
                    <Button size="sm" variant="ghost" className="font-bold text-pink" onClick={() => startStudying(c.subject, c.topic)}>
                      Continue →
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Upcoming Exams">
          {upcoming.length === 0 ? (
            <EmptyState
              icon="CalendarDays"
              title="No exam dates yet"
              description="Add exam dates on your Subjects page for a live countdown."
              action={
                <Button asChild size="sm" variant="outline" className="font-bold">
                  <Link to="/subjects">Add exam dates</Link>
                </Button>
              }
            />
          ) : (
            <ul className="space-y-3">
              {upcoming.map((u) => (
                <li key={u.subject} className="flex items-center justify-between rounded-xl bg-gold-light px-3 py-2.5">
                  <div>
                    <p className="text-sm font-bold text-navy">{u.subject} Exam</p>
                    <p className="text-[12px] font-semibold text-navy/70">
                      {new Date(`${u.examDate}T00:00:00`).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                  <span className="rounded-lg bg-card px-2 py-1 text-xs font-extrabold text-pink">
                    {u.daysLeft === 0 ? "Today" : `${u.daysLeft} days`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent Activity">
          {activity.length === 0 ? (
            <EmptyState icon="Activity" title="Nothing yet" description="Your study sessions and quizzes will appear here." />
          ) : (
            <ul className="space-y-3">
              {activity.map((a, i) => (
                <li key={i} className="border-b border-border pb-2 last:border-0 last:pb-0">
                  <p className="text-[13px] font-semibold">{a.text}</p>
                  <p className="text-[11px] font-semibold text-muted-foreground">
                    {new Date(a.when).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel title="Recommended for you">
          {suggestions.length === 0 ? (
            <p className="text-sm font-medium text-muted-foreground">
              Take a quiz or mark a weak topic and StudyEazy will recommend revision here.
            </p>
          ) : (
            <ul className="space-y-2">
              {suggestions.map((s) => (
                <li key={s} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-pink-light px-3 py-2.5">
                  <span className="text-sm font-bold text-navy">Review {s}</span>
                  <span className="text-[11px] font-semibold text-navy/70">
                    Identified as a weak area from your activity
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Your subjects">
          {subjects.length === 0 ? (
            <EmptyState
              icon="Library"
              title="No subjects yet"
              description="Add your matric subjects to personalise everything."
              action={
                <Button asChild size="sm" className="font-bold">
                  <Link to="/subjects">Add subjects</Link>
                </Button>
              }
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <Link
                  key={s.id}
                  to="/subjects"
                  className="rounded-full bg-blue-light px-3 py-1.5 text-[12.5px] font-bold text-blue hover:bg-blue/15"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          )}
          <p className="mt-4 text-xs font-semibold text-muted-foreground">
            {tasks.length} planned study task{tasks.length === 1 ? "" : "s"} · {progress.taskCompletion}% completed
          </p>
        </Panel>
      </section>

      <AiNotice verify />

      <StudyTimer
        open={timerOpen}
        onOpenChange={setTimerOpen}
        initialSubject={timerSubject}
        initialTopic={timerTopic}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
  icon,
  footer,
}: {
  label: string;
  value: string;
  tone: "blue" | "pink" | "gold";
  icon: string;
  footer?: React.ReactNode;
}) {
  const tones = {
    blue: "bg-blue-light text-blue",
    pink: "bg-pink-light text-pink",
    gold: "bg-gold-light text-navy",
  } as const;
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-3xl font-extrabold tracking-tight">{value}</p>
          <p className="mt-1 text-[13px] font-bold text-muted-foreground">{label}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>
          <ToolIcon name={icon} className="h-5 w-5" />
        </span>
      </div>
      {footer}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <h2 className="mb-4 text-base font-extrabold">{title}</h2>
      {children}
    </section>
  );
}
