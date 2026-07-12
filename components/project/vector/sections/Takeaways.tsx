import { Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

/* UNMOUNTED (2026-07-09): the previous lessons moved to Collaboration.tsx ("Working
   with AI"). Caroline is writing fresh "Key takeaways" copy; swap LESSONS below for
   her new content and remount this section in page.tsx (after Collaboration). */
const LESSONS = [
  [
    "plan first, prompt second",
    "I sketched a loose plan for the whole product, then wrote a detailed one for every section before building it. I never asked the AI to just build me this. Instead I said what I wanted to achieve, asked for options with pros and cons, and made the call myself. Every plan ended with “ask me follow-up questions” (a habit I later upgraded into a grill-me skill that interrogates a plan until it holds up). I was not always on top of the syntax, but I always knew what was being built, and why.",
  ],
  [
    "tests are the second pair of eyes",
    "On a solo project nobody reviews your work, so the flows I cannot afford to break are covered by Playwright end-to-end tests, from task ids staying intact to editing an AI draft before approving it. Unit tests join them as the AI layer grows.",
  ],
  [
    "when you hit a wall, write a skill",
    "More than once the AI and I went in circles, and pushing harder on the same prompt never fixed it. Instead I had it research the problem properly and write the findings up as a reusable skill, so every session after starts smarter than the last.",
  ],
] as const;

export function Takeaways() {
  return (
    <section data-section="Takeaways" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Key takeaways</Kicker>
          <Title>
            What building it
            <br />
            taught me
          </Title>
        </Reveal>

        <Reveal
          stagger={0.1}
          className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3"
        >
          {LESSONS.map(([label, body]) => (
            <div key={label}>
              <div className="mb-4 h-px w-10 bg-[var(--green)]" />
              <p className="case-study-label mb-3">{label} &gt;</p>
              <Body>{body}</Body>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
