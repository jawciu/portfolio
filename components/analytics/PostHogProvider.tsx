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

function initPostHog(): boolean {
  if (initialised) return true;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return false;

  // Capture real visitors on the live site only. Skip local dev and any
  // localhost production build so Caroline's own testing never pollutes the
  // analytics or session replays.
  if (process.env.NODE_ENV !== "production") return false;
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return false;

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
  return true;
}

// Init at module load (client only), NOT inside the provider's useEffect:
// React runs child effects before parent effects, so an effect-time init ran
// AFTER PostHogPageView's $pageview capture and the first pageview of every
// visit was silently dropped. During SSR `window` is absent and this no-ops.
if (typeof window !== "undefined") {
  initPostHog();
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!initialised) return;

    // Personal opt-out so Caroline can exclude her own devices from analytics.
    // Visit the live site once per device/browser with ?ph_optout=1 to stop all
    // capture there (events, replays, heatmaps); ?ph_optin=1 re-enables it.
    // PostHog persists the choice in local storage and respects it on every
    // future visit.
    const params = new URLSearchParams(window.location.search);
    if (params.has("ph_optout")) posthog.opt_out_capturing();
    else if (params.has("ph_optin")) posthog.opt_in_capturing();
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
