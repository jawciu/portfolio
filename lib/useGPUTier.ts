"use client";

import { useEffect, useState } from "react";
import { getGPUTier } from "detect-gpu";

export function useGPUTier() {
  // Optimistic default — high tier — so first paint isn't degraded;
  // downgrade if detection reports lower.
  const [tier, setTier] = useState(3);

  useEffect(() => {
    let cancelled = false;
    getGPUTier()
      .then((r) => {
        if (!cancelled) setTier(r.tier);
      })
      .catch(() => {
        // detect-gpu failure → assume mid tier
        if (!cancelled) setTier(2);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return tier;
}
