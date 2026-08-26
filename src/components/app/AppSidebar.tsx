import { ToolIcon } from "@/components/brand/Bits";
import { LogoLockup } from "@/components/brand/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV_MAIN, NAV_OTHER } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";

export function AppSidebar({
  name,
  onNavigate,
  onSignOut,
}: {
  name: string;
  onNavigate?: () => void;
  onSignOut: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0]?.toUpperCase())
      .slice(0, 2)
      .join("") || "SE";

  const item = (nav: { label: string; to: string; icon: string }) => {
    const active = pathname === nav.to;
    return (
      <Link
        key={nav.to}
        to={nav.to}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-bold transition-colors",
          active
            ? "bg-pink text-white shadow-sm"
            : "text-white/80 hover:bg-blue/25 hover:text-white",
        )}
      >
        <ToolIcon name={nav.icon} className="h-4.5 w-4.5 shrink-0" />
        <span className="truncate">{nav.label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-full w-[270px] flex-col bg-navy text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <LogoLockup onDark size={44} />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/45">
          Main
        </p>
        <div className="space-y-1">{NAV_MAIN.map(item)}</div>
        <p className="px-3 pb-2 pt-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/45">
          Other
        </p>
        <div className="space-y-1">{NAV_OTHER.map(item)}</div>
      </nav>

      <div className="border-t border-white/10 p-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-white/10">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-[13px] font-extrabold text-navy">
              {initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-bold text-white">
                {name || "Learner"}
              </span>
              <span className="block text-[11px] font-semibold text-white/60">Matric Learner</span>
            </span>
            <ChevronDown className="h-4 w-4 text-white/60" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link to="/profile" onClick={onNavigate}>
                <User className="mr-2 h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" onClick={onNavigate}>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut}>
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
