import { LogoLockup, LogoMark } from "@/components/brand/Logo";
import { ToolIcon } from "@/components/brand/Bits";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/useSession";
import { AI_NOTICE, APP_TAGLINE, TOOLS } from "@/lib/constants";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StudyEazy AI — AI Matric Study Assistant | Study Smart. Pass Eazy." },
      {
        name: "description",
        content:
          "StudyEazy AI helps South African Grade 12 learners revise faster with AI study guides, quizzes, planners and a subject tutor.",
      },
      { property: "og:title", content: "StudyEazy AI — Study Smart. Pass Eazy." },
      {
        property: "og:description",
        content:
          "AI study guides, note summaries, quizzes, a study planner and a matric subject tutor in one workspace.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user, loading } = useSession();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <LogoLockup />
          <nav className="flex items-center gap-2">
            {loading ? null : user ? (
              <Button asChild>
                <Link to="/dashboard">Go to dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="font-bold">
                  <Link to="/auth" search={{ mode: "login", redirect: undefined }}>
                    Log in
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/auth" search={{ mode: "signup", redirect: undefined }}>
                    Create free account
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="hero-gradient grid items-center gap-10 rounded-3xl border border-border p-6 shadow-card sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-blue shadow-sm">
                ✦ Powered by AI
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
                Your <span className="text-blue">AI</span> Matric Study{" "}
                <span className="text-pink">Assistant</span>
              </h1>
              <p className="mt-4 max-w-xl text-base font-medium text-navy-2 sm:text-lg">
                Learn smarter, revise faster, and prepare with confidence — all from one simple study
                workspace built for South African Grade 12 learners.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" className="font-bold">
                  <Link to="/auth" search={{ mode: "signup", redirect: undefined }}>
                    START STUDYING →
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-navy bg-card font-bold text-navy hover:bg-blue-light"
                >
                  <Link to="/auth" search={{ mode: "login", redirect: undefined }}>
                    ASK AI TUTOR
                  </Link>
                </Button>
              </div>
              <p className="mt-5 text-xs font-semibold text-muted-foreground">{AI_NOTICE}</p>
            </div>
            <div className="flex justify-center">
              <div className="relative rounded-3xl bg-card p-8 shadow-lift">
                <LogoMark size={190} />
                <span className="absolute -right-3 -top-3 rounded-xl bg-gold px-2.5 py-1 text-[11px] font-extrabold text-navy">
                  Matric ready
                </span>
                <p className="mt-4 text-center text-[11px] font-extrabold uppercase tracking-[0.18em] text-blue">
                  {APP_TAGLINE}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Everything you need to pass eazy</h2>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            Seven AI study tools, real progress tracking and your own saved revision library.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <article
                key={tool.key}
                className="rounded-2xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-lift"
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
                <p className="mt-1 text-sm font-medium text-muted-foreground">{tool.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-navy py-8 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
          <LogoLockup onDark />
          <p className="text-xs font-semibold text-white/70">
            {AI_NOTICE} StudyEazy AI is a study aid, not an official examiner.
          </p>
        </div>
      </footer>
    </div>
  );
}
