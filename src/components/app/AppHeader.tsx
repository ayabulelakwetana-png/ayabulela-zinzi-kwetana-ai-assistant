import { GlobalSearch } from "@/components/app/GlobalSearch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotifications } from "@/hooks/useStudyData";
import { useTheme } from "@/hooks/useTheme";
import { AI_NOTICE } from "@/lib/constants";
import { markNotificationsRead } from "@/lib/data";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, LogOut, Menu, Moon, Search, Settings, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";

export function AppHeader({
  name,
  onMenu,
  onSignOut,
}: {
  name: string;
  onMenu: () => void;
  onSignOut: () => void;
}) {
  const { theme, toggle } = useTheme();
  const notifications = useNotifications();
  const qc = useQueryClient();
  const [searchOpen, setSearchOpen] = useState(false);
  const unread = (notifications.data ?? []).filter((n) => !n.read).length;
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0]?.toUpperCase())
      .slice(0, 2)
      .join("") || "SE";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenu}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <p className="hidden flex-1 text-[12.5px] font-semibold text-muted-foreground sm:block">
          {AI_NOTICE}
        </p>
        <div className="flex-1 sm:hidden" />

        <Button
          variant="outline"
          size="sm"
          className="font-semibold"
          onClick={() => setSearchOpen(true)}
          aria-label="Search StudyEazy"
        >
          <Search className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Search</span>
        </Button>

        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle dark mode">
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Popover
          onOpenChange={(open) => {
            if (open && unread) {
              void markNotificationsRead().then(() =>
                qc.invalidateQueries({ queryKey: ["notifications"] }),
              );
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications (${unread} unread)`}>
              <Bell className="h-5 w-5" />
              {unread ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink px-1 text-[10px] font-extrabold text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-extrabold">Notifications</p>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.isLoading ? (
                <p className="px-4 py-6 text-sm font-medium text-muted-foreground">Loading...</p>
              ) : (notifications.data ?? []).length === 0 ? (
                <p className="px-4 py-6 text-sm font-medium text-muted-foreground">
                  No notifications yet. They appear as you study, complete quizzes and set exam dates.
                </p>
              ) : (
                notifications.data!.map((n) => (
                  <div key={n.id} className="border-b border-border px-4 py-3 last:border-0">
                    <p className="text-[13px] font-bold">{n.title}</p>
                    {n.body ? (
                      <p className="mt-0.5 text-[12.5px] font-medium text-muted-foreground">{n.body}</p>
                    ) : null}
                    <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
                      {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-[12px] font-extrabold text-white"
            aria-label="Account menu"
          >
            {initials}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem asChild>
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">
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

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
