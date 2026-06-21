"use client";

import { useEffect, useState } from "react";

type ThemeToggleProps = {
  compact?: boolean;
};

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const shouldUseDark = document.documentElement.classList.contains("dark");

    applyTheme(shouldUseDark);
  }, []);

  function toggleTheme() {
    const nextTheme = !document.documentElement.classList.contains("dark");

    applyTheme(nextTheme);
  }

  function applyTheme(nextTheme: boolean) {
    setIsDark(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme);
    document.documentElement.style.colorScheme = nextTheme ? "dark" : "light";
    window.localStorage.setItem("dev-pulse-theme", nextTheme ? "dark" : "light");
  }

  return (
    <button
      aria-pressed={isDark}
      className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
      type="button"
      onClick={toggleTheme}
      title={isDark ? "Use light mode" : "Use dark mode"}
    >
      {isDark ? (
        <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5A9 9 0 1 0 20.5 14.5Z" />
        </svg>
      ) : (
        <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      )}
      <span className={`h-4 w-8 rounded-full p-0.5 transition ${isDark ? "bg-mint" : "bg-gray-300"}`}>
        <span className={`block h-3 w-3 rounded-full bg-white transition-transform ${isDark ? "translate-x-4" : "translate-x-0"}`} />
      </span>
      <span className={compact ? "sr-only" : undefined}>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
