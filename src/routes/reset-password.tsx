import { LogoLockup } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Choose a new StudyEazy AI password" },
      { name: "description", content: "Set a new password for your StudyEazy AI learner account." },
      { property: "og:title", content: "Reset your StudyEazy AI password" },
      { property: "og:description", content: "Choose a new password and get back to studying." },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (password.length < 6) return setError("Your password must be at least 6 characters.");
    if (password !== confirm) return setError("The two passwords do not match.");
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) {
      setError(
        err.message.toLowerCase().includes("session")
          ? "This reset link has expired. Request a new one from the login page."
          : err.message,
      );
      return;
    }
    toast.success("Password updated. You're signed in.");
    navigate({ to: "/dashboard" });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <LogoLockup className="mb-6" />
        <h1 className="text-2xl font-extrabold">Choose a new password</h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Enter a new password for your StudyEazy AI account.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!busy) void submit();
          }}
        >
          <div>
            <Label htmlFor="pw">New password</Label>
            <Input
              id="pw"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div>
            <Label htmlFor="pw2">Confirm new password</Label>
            <Input
              id="pw2"
              type="password"
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          {error ? (
            <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full font-bold" disabled={busy}>
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            UPDATE PASSWORD
          </Button>
        </form>
        <p className="mt-6 text-sm font-semibold">
          <Link to="/auth" search={{ mode: "login", redirect: undefined }} className="text-blue hover:underline">
            ← Back to login
          </Link>
        </p>
      </div>
    </main>
  );
}
