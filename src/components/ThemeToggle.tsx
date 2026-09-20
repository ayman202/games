"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle({ defaultTheme }: { defaultTheme: string }) {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("gh_theme") : null;
    const initial = saved || defaultTheme;
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, [defaultTheme]);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem("gh_theme", next);
  }

  return (
    <button onClick={toggle} className="text-sm hover:text-white" title="Toggle theme">
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
