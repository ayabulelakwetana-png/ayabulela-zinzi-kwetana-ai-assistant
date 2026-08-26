import { supabase } from "@/integrations/supabase/client";
import { useCallback, useEffect, useState } from "react";

const KEY = "studyeazy-theme";

function apply(theme: string) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = (localStorage.getItem(KEY) as "light" | "dark" | null) ?? "light";
    setTheme(stored);
    apply(stored);
  }, []);

  const set = useCallback((next: "light" | "dark") => {
    setTheme(next);
    localStorage.setItem(KEY, next);
    apply(next);
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) void supabase.from("profiles").update({ theme: next }).eq("id", data.user.id);
    });
  }, []);

  const toggle = useCallback(() => set(theme === "dark" ? "light" : "dark"), [theme, set]);

  return { theme, setTheme: set, toggle };
}
