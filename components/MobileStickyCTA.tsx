"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Mobile-only sticky CTA bar. Slides up once the user scrolls past the hero
 * (so it never covers the hero's own buttons), giving an always-reachable
 * "Start your checkup" action on phones. Hidden on sm+ screens.
 */
export function MobileStickyCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`sm:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-6 transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{
        background:
          "linear-gradient(to top, rgba(8,13,30,0.97) 60%, rgba(8,13,30,0))",
      }}
    >
      <Link href="/checkup" className="block">
        <span className="flex items-center justify-center gap-2 w-full rounded-2xl bg-emerald-500 text-white font-semibold py-3.5 shadow-lg shadow-black/40 active:bg-emerald-600">
          Start your checkup
          <ArrowRight size={16} />
        </span>
      </Link>
    </div>
  );
}
