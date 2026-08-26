import { Button } from "@/components/ui/button";
import { AI_NOTICE, VERIFY_NOTICE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import { AlertTriangle, Info, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Sparkles;
  return <Cmp className={className} aria-hidden="true" />;
}

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle ? (
          <p className="mt-1 max-w-2xl text-sm font-medium text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </header>
  );
}

export function AiNotice({ className, verify = false }: { className?: string; verify?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-xl border border-border bg-gold-light px-3 py-2 text-[12.5px] font-semibold text-navy",
        className,
      )}
      role="note"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
      <span>
        {AI_NOTICE}
        {verify ? ` ${VERIFY_NOTICE}` : ""}
      </span>
    </div>
  );
}

export function LoadingState({ label = "StudyEazy is preparing your study material..." }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-14 text-center"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-7 w-7 animate-spin text-blue" aria-hidden="true" />
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="text-xs font-medium text-muted-foreground">This usually takes a few seconds.</p>
    </div>
  );
}

export function EmptyState({
  icon = "Sparkles",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-light">
        <ToolIcon name={icon} className="h-6 w-6 text-blue" />
      </span>
      <h3 className="text-base font-bold">{title}</h3>
      {description ? (
        <p className="max-w-md text-sm font-medium text-muted-foreground">{description}</p>
      ) : null}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      className="flex flex-col items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-4"
      role="alert"
    >
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
        <div>
          <p className="text-sm font-bold text-foreground">Something went wrong</p>
          <p className="text-sm font-medium text-muted-foreground">{message}</p>
        </div>
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function StatPill({ tone = "blue", children }: { tone?: "blue" | "pink" | "gold"; children: ReactNode }) {
  const tones = {
    blue: "bg-blue-light text-blue",
    pink: "bg-pink-light text-pink",
    gold: "bg-gold-light text-navy",
  } as const;
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide", tones[tone])}>
      {children}
    </span>
  );
}
