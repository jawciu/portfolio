"use client";

import { CaseStudyButton } from "../CaseStudyButton";

/** Scrolls back to the top of the page, where the promo video lives in the hero,
    and restarts it from the beginning. */
export function WatchVideoButton() {
  return (
    <CaseStudyButton
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        const video = document.getElementById("hero-promo");
        if (video instanceof HTMLVideoElement) {
          video.currentTime = 0;
          void video.play();
        }
      }}
    >
      <svg width="13" height="13" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
        <path d="M2 1.5v9l8-4.5z" />
      </svg>
      WATCH VIDEO
    </CaseStudyButton>
  );
}
