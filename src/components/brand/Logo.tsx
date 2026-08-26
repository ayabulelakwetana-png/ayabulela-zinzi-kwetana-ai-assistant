import logo from "@/assets/studyeazy-logo.png";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function LogoMark({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <img
      src={logo}
      alt="StudyEazy AI logo: the letters S and E"
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
    />
  );
}

export function LogoLockup({
  className,
  onDark = false,
  size = 44,
}: {
  className?: string;
  onDark?: boolean;
  size?: number;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "flex items-center justify-center rounded-xl",
          onDark ? "bg-white/95" : "bg-blue-light",
        )}
        style={{ width: size, height: size }}
      >
        <LogoMark size={size - 10} />
      </span>
      <span className="min-w-0">
        <span
          className={cn(
            "block truncate text-[15px] font-extrabold leading-tight",
            onDark ? "text-white" : "text-foreground",
          )}
        >
          {APP_NAME}
        </span>
        <span
          className={cn(
            "block truncate text-[9.5px] font-bold uppercase leading-tight tracking-[0.14em]",
            onDark ? "text-gold" : "text-blue",
          )}
        >
          {APP_TAGLINE}
        </span>
      </span>
    </div>
  );
}
