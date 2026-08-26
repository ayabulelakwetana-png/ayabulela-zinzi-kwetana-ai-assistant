import { LogoLockup } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { APP_TAGLINE, GRADES, SA_SUBJECTS } from "@/lib/constants";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const searchSchema = z.object({
  mode: z.enum(["login", "signup", "forgot"]).catch("login"),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in or create your StudyEazy AI account" },
      {
        name: "description",
        content:
          "Log in or create a free StudyEazy AI account to access your AI matric study workspace.",
      },
      { property: "og:title", content: "Sign in to StudyEazy AI" },
      { property: "og:description", content: "Your AI matric study workspace — study smart, pass eazy." },
    ],
  }),
  component: AuthPage,
});

function safePath(value?: string) {
  if (!value) return "/dashboard";
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

function AuthPage() {
  const { mode, redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [grade, setGrade] = useState<string>("Grade 12 / Matric");
  const [school, setSchool] = useState("");
  const [subjects, setSubjects] = useState<string[]>([
    "Mathematics",
    "Physical Sciences",
    "English",
  ]);

  const target = safePath(redirect);

  const setMode = (m: "login" | "signup" | "forgot") => {
    setError("");
    navigate({ to: "/auth", search: { mode: m, redirect } });
  };

  const seedSubjects = async (userId: string, names: string[]) => {
    if (!names.length) return;
    await supabase
      .from("subjects")
      .upsert(
        names.map((name) => ({ user_id: userId, name })),
        { onConflict: "user_id,name", ignoreDuplicates: true },
      );
  };

  const handleSignup = async () => {
    if (!firstName.trim() || !lastName.trim()) return setError("Enter your first and last name.");
    if (password.length < 6) return setError("Your password must be at least 6 characters.");
    setBusy(true);
    setError("");
    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${target}`,
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          grade,
          school: school.trim() || null,
        },
      },
    });
    if (err) {
      setBusy(false);
      setError(
        err.message.toLowerCase().includes("already")
          ? "That email is already registered. Try logging in instead."
          : err.message,
      );
      return;
    }
    if (data.session && data.user) {
      await seedSubjects(data.user.id, subjects);
      await supabase.from("notifications").insert({
        user_id: data.user.id,
        title: "Welcome to StudyEazy AI",
        body: "Pick a tool on your dashboard and start your first study session.",
        kind: "welcome",
      });
      toast.success(`Welcome, ${firstName.trim()}!`);
      navigate({ to: target });
    } else {
      toast.success("Account created. Check your email to confirm your address, then log in.");
      setMode("login");
    }
    setBusy(false);
  };

  const handleLogin = async () => {
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (err) {
      setError(
        err.message.toLowerCase().includes("invalid")
          ? "Incorrect email or password. Please try again."
          : err.message,
      );
      return;
    }
    toast.success("Welcome back!");
    navigate({ to: target });
  };

  const handleForgot = async () => {
    if (!email.trim()) return setError("Enter the email address on your account.");
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (err) return setError(err.message);
    toast.success("Password reset link sent. Check your inbox.");
    setMode("login");
  };

  const handleGoogle = async () => {
    setBusy(true);
    setError("");
    try {
      sessionStorage.setItem("studyeazy_redirect", target);
    } catch {
      /* ignore */
    }
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      setError("Google sign-in failed. Please try again or use your email and password.");
      return;
    }
    if (result.redirected) return;
    setBusy(false);
    navigate({ to: target });
  };

  const toggleSubject = (name: string) =>
    setSubjects((prev) => (prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]));

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-navy p-10 text-white lg:flex">
        <LogoLockup onDark size={48} />
        <div>
          <h2 className="text-3xl font-extrabold leading-tight">
            <span className="text-blue-bright">AI</span> study help built for{" "}
            <span className="text-gold">matric</span>.
          </h2>
          <p className="mt-4 max-w-md text-sm font-medium text-white/80">
            Study guides, note summaries, quizzes, a realistic study planner and a patient subject
            tutor — all tracking your real progress.
          </p>
        </div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold">
          {APP_TAGLINE}
        </p>
      </aside>

      <main className="flex items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden">
            <LogoLockup />
          </div>

          <h1 className="text-2xl font-extrabold">
            {mode === "signup"
              ? "Create your account"
              : mode === "forgot"
                ? "Reset your password"
                : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {mode === "signup"
              ? "Set up your matric study workspace in under a minute."
              : mode === "forgot"
                ? "We'll email you a secure link to choose a new password."
                : "Log in to continue studying."}
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (busy) return;
              if (mode === "signup") void handleSignup();
              else if (mode === "forgot") void handleForgot();
              else void handleLogin();
            }}
          >
            {mode === "signup" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                  />
                </div>
              </div>
            ) : null}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {mode !== "forgot" ? (
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
              </div>
            ) : null}

            {mode === "signup" ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="grade">Grade</Label>
                    <Select value={grade} onValueChange={setGrade}>
                      <SelectTrigger id="grade">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADES.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="school">School (optional)</Label>
                    <Input id="school" value={school} onChange={(e) => setSchool(e.target.value)} />
                  </div>
                </div>

                <fieldset>
                  <legend className="mb-2 text-sm font-bold">Your subjects</legend>
                  <div className="grid max-h-44 gap-2 overflow-y-auto rounded-xl border border-border p-3 sm:grid-cols-2">
                    {SA_SUBJECTS.filter((s) => s !== "Other").map((s) => (
                      <label key={s} className="flex items-center gap-2 text-sm font-medium">
                        <Checkbox
                          checked={subjects.includes(s)}
                          onCheckedChange={() => toggleSubject(s)}
                          aria-label={s}
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    You can add or change subjects later in Settings.
                  </p>
                </fieldset>
              </>
            ) : null}

            {error ? (
              <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full font-bold" disabled={busy}>
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {mode === "signup" ? "CREATE ACCOUNT" : mode === "forgot" ? "SEND RESET LINK" : "LOG IN"}
            </Button>
          </form>

          {mode !== "forgot" ? (
            <>
              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">or</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full border-2 font-bold"
                onClick={handleGoogle}
                disabled={busy}
              >
                Continue with Google
              </Button>
            </>
          ) : null}

          <div className="mt-6 space-y-2 text-sm font-semibold">
            {mode === "login" ? (
              <>
                <p>
                  <button type="button" className="text-blue hover:underline" onClick={() => setMode("forgot")}>
                    Forgot your password?
                  </button>
                </p>
                <p className="text-muted-foreground">
                  New to StudyEazy AI?{" "}
                  <button type="button" className="text-pink hover:underline" onClick={() => setMode("signup")}>
                    Create an account
                  </button>
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <button type="button" className="text-blue hover:underline" onClick={() => setMode("login")}>
                  Log in
                </button>
              </p>
            )}
            <p>
              <Link to="/" className="text-muted-foreground hover:underline">
                ← Back to home
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
