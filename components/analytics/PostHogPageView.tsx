"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";

// Manual $pageview capture. PostHog's automatic pageview doesn't fire reliably
// on Next's client-side (soft) navigations, so we watch the pathname + search
// params and capture on change. This covers every route on the site
// (/, /project/wiki-whisperer, /project/vector, /project/cog-adhd).
//
// MUST be rendered inside a <Suspense> boundary because useSearchParams()
// opts the tree into client-side rendering (see app/providers.tsx).

export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (!pathname || !posthog) return;

    let url = window.origin + pathname;
    const search = searchParams.toString();
    if (search) url += `?${search}`;

    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, posthog]);

  return null;
}
