"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useThemeStore, type Theme } from "@/store/useThemeStore";
import { cn } from "@/lib/utils";

const CYCLE: Theme[] = ["dark", "light", "system"];

const ICONS = {
  dark: Moon,
  light: Sun,
  system: Monitor,
} as const;

const LABELS = {
  dark: "Dark mode",
  light: "Light mode",
  system: "System theme",
} as const;

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useThemeStore();

  const cycle = () => {
    const idx = CYCLE.indexOf(theme);
    setTheme(CYCLE[(idx + 1) % CYCLE.length]);
  };

  const Icon = ICONS[theme];

  return (
    <button
      onClick={cycle}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-white",
        className
      )}
      aria-label={LABELS[theme]}
      title={LABELS[theme]}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
