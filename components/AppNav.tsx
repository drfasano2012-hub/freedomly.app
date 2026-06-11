"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { useFinancialData } from "@/hooks/useFinancialData";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/learn", label: "Learn" },
  { href: "/tools", label: "Tools" },
  { href: "/coaching", label: "Coaching" },
];

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { hasCompletedCheckup, clearInputs } = useFinancialData();
  const [confirmReset, setConfirmReset] = useState(false);

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      // Auto-cancel after 4 seconds if not confirmed
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    clearInputs();
    setConfirmReset(false);
    router.push("/");
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-white/10 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href={hasCompletedCheckup ? "/dashboard" : "/"}
          className="flex items-center gap-2 shrink-0"
          onClick={() => setConfirmReset(false)}
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
            <TrendingUp size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            Freedomly
          </span>
          <span className="hidden sm:inline text-xs text-emerald-400 font-medium border border-emerald-400/30 rounded px-1.5 py-0.5 bg-emerald-400/10">
            beta
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            if (href === "/dashboard" && !hasCompletedCheckup) return null;
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setConfirmReset(false)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "text-white bg-white/20"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right CTAs */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Reset — only when checkup is complete */}
          {hasCompletedCheckup && (
            <button
              onClick={handleReset}
              className={cn(
                "text-xs font-medium transition-colors px-2 py-1 rounded-lg",
                confirmReset
                  ? "text-red-400 bg-red-900/30 border border-red-700/40 animate-pulse"
                  : "text-white/40 hover:text-white/70"
              )}
            >
              {confirmReset ? "Confirm reset?" : "Reset"}
            </button>
          )}

          {hasCompletedCheckup ? (
            <Link href="/checkup">
              <Button variant="secondary" size="sm">
                Edit checkup
              </Button>
            </Link>
          ) : (
            <Link href="/checkup">
              <Button size="sm">
                Start checkup
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-white/10 px-4 pb-2 pt-1 flex gap-1 overflow-x-auto scrollbar-none">
        {NAV_LINKS.map(({ href, label }) => {
          if (href === "/dashboard" && !hasCompletedCheckup) return null;
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setConfirmReset(false)}
              className={cn(
                "shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-colors",
                active
                  ? "text-white bg-white/20"
                  : "text-white/60 hover:text-white"
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
