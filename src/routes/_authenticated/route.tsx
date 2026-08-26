import { AppHeader } from "@/components/app/AppHeader";
import { AppSidebar } from "@/components/app/AppSidebar";
import { ErrorState } from "@/components/brand/Bits";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useProfile } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth", search: { mode: "login" as const } });
    return { user: data.user };
  },
  component: Shell,
  errorComponent: ({ error }) => (
    <div className="p-8">
      <ErrorState message={error.message} onRetry={() => window.location.reload()} />
    </div>
  ),
});

function Shell() {
  const profile = useProfile();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [drawer, setDrawer] = useState(false);

  const name = `${profile.data?.first_name ?? ""} ${profile.data?.last_name ?? ""}`.trim();

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { mode: "login" }, replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen shrink-0 lg:block">
        <AppSidebar name={name} onSignOut={signOut} />
      </aside>

      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent side="left" className="w-[270px] border-0 bg-navy p-0">
          <AppSidebar name={name} onNavigate={() => setDrawer(false)} onSignOut={signOut} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader name={name} onMenu={() => setDrawer(true)} onSignOut={signOut} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
