import { Container, Kicker, Title, Body, CaseStudyCallout } from "../ui";
import { Reveal } from "../Reveal";

/* Under the hood — was six paragraphs of stack prose; now one short intro and
   the stack itself as a wall of tools, each carrying ONE line of the judgement
   that used to live in the text. Icons are mono-ink SVGs (plain paths only,
   per the iOS Safari rule) in /public/projects/vector/stack. */

const STACK = [
  ["nextdotjs.svg", "next.js 16", "app router, plain JavaScript"],
  ["react.svg", "react 19", "server components first"],
  ["tailwindcss.svg", "tailwind v4", "tokens compiled from one documented file"],
  ["prisma.svg", "prisma 7", "16 models, cascade deletes, one data path"],
  ["supabase.svg", "supabase", "postgres + vendor auth (customers get magic links)"],
  ["claude.svg", "claude api", "sonnet 4.6, prompt-cached, schema-pinned, streamed"],
  ["resend.svg", "resend", "customer email, dark-theme templates"],
  ["playwright.svg", "playwright", "e2e on the flows I cannot afford to break"],
  ["vitest.svg", "vitest", "unit tests on the pure logic, green in CI"],
  ["vercel.svg", "vercel", "deploys, plus the weekly cron"],
] as const;

export function Architecture() {
  return (
    <section data-section="Architecture" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Under the hood</Kicker>
          <Title>
            Proper foundations,
            <br />
            fascinating to build
          </Title>
        </Reveal>

        <Reveal className="max-w-[760px]">
          <Body>
            I did not want to build just another AI demo. I wanted to learn how a real
            SaaS is put together, so Vector is built like one.
          </Body>
        </Reveal>

        {/* the stack, as tools rather than paragraphs */}
        <Reveal
          stagger={0.06}
          className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5"
        >
          {STACK.map(([icon, name, note]) => (
            <div key={name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/projects/vector/stack/${icon}`}
                alt=""
                width={26}
                height={26}
                className="h-[26px] w-[26px] opacity-90"
              />
              <p className="case-study-label mt-3">{name}</p>
              <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[12px] leading-snug text-[var(--case-study-muted)]">
                {note}
              </p>
            </div>
          ))}
        </Reveal>

        {/* the honest constraint stays: it is the credible part */}
        <Reveal className="mt-14 max-w-[760px]">
          <Body>
            The compromises are in there too. Streaming runs on Edge Runtime, where Prisma
            is not compatible, so those routes talk to Supabase directly. Real projects
            have these tradeoffs, and I learned to make the call and move on.
          </Body>
        </Reveal>

        <Reveal className="mt-16 max-w-[860px]">
          <CaseStudyCallout stream>
            {"I built this to grow my range as a designer who can also ship. Every architectural choice is now something I understand from the inside."}
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
