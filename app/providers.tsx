"use client";

/**
 * Freedomly — PostHog provider
 *
 * Initializes PostHog on the client and tracks pageviews on App Router
 * navigations (Next.js client-side route changes don't fire a normal
 * pageview, so we capture $pageview manually on path/params change).
 *
 * Safe by design:
 *   - No key set → PostHog never initializes, app runs normally.
 *   - Session-replay input masking stays ON (finance app — never record
 *     what users type into financial fields).
 *   - manual_pageview so we control capture (avoids double counts).
 */

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

if (typeof window !== "undefined" && KEY && !posthog.__loaded) {
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: false, // we capture manually below (App Router)
    capture_pageleave: true,
    persistence: "localStorage+cookie",
    autocapture: false, // explicit events only — cleaner taxonomy for a finance app
    mask_all_text: false,
    session_recording: {
      maskAllInputs: true, // NEVER record what users type into financial fields
    },
  });
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || posthog.__loaded !== true) return;
    let url = window.origin + pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  // If no key, render children without the provider (clean no-op).
  if (!KEY) return <>{children}</>;

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}
