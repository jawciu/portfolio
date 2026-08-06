"use client";

import { Suspense } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { PostHogPageView } from "@/components/analytics/PostHogPageView";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      <SmoothScroll>{children}</SmoothScroll>
    </PostHogProvider>
  );
}
