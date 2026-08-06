"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

// Single client-side init for PostHog. Wraps the whole app (mounted in
// app/providers.tsx). Everything Caroline asked for is enabled here:
// session replays, heatmaps/clickmaps and full product analytics — all on
// the free tier. Traffic goes through the /ingest reverse proxy (see
// next.config.ts) so ad-blockers don't quietly drop sessions.
//
// If NEXT_PUBLIC_POSTHOG_KEY is absent (e.g. a local checkout without a key,
// or CI) init is skipped and every capture call becomes a harmless no-op, so
// dev and build never error.

let initialised = false;

function initPostHog() {
  if (initialised) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    // Reverse proxy: ingest through our own domain, but point the toolbar /
    // "view in PostHog" links at the real EU app host.
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "/ingest",
    ui_host: "https://eu.posthog.com",
    defaults: "2025-05-24",

    // Autocapture powers clickmaps + rageclick/dead-click analytics and is a
    // prerequisite for heatmaps.
    autocapture: true,
    // We capture $pageview manually (PostHogPageView) to handle Next's soft
    // navigation and search-param changes; disable the automatic one to avoid
    // double counting.
    capture_pageview: false,
    // Pageleave gives us scroll depth, time-on-page and bounce.
    capture_pageleave: true,

    // Session replay — a portfolio has no sensitive inputs, so don't mask
    // (we want to see exactly what visitors did).
    disable_session_recording: false,
    session_recording: {
      maskAllInputs: false,
    },

    // Heatmap data capture (also flip "Enable heatmaps" on in project settings).
    enable_heatmaps: true,

    // Cookies allowed, no consent banner (Caroline's call).
    persistence: "localStorage+cookie",
  });

  initialised = true;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
