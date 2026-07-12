import { Container, Kicker, Title, Body, CaseStudyCallout } from "../ui";
import { Reveal } from "../Reveal";

const DECISIONS = [
  [
    "the stack",
    "Next.js 16 in plain JavaScript, Tailwind v4 and dnd-kit for the board's drag and drop, deployed on Vercel with a weekly cron driving the stale-task scan.",
  ],
  [
    "the data",
    "Prisma 7 on Supabase Postgres, with a transaction pooler for the app and a session pooler for migrations, because the two jobs need different connection behaviour.",
  ],
  [
    "two kinds of auth",
    "Vendors sign in with Supabase cookie auth. Customers never sign up at all, because the portal runs on custom magic links with expiry, revocation and last-seen tracking.",
  ],
  [
    "one data path",
    "Every read and write goes through a single data layer, so validation and not-found handling stay consistent and the database stays swap-friendly. No component touches the ORM directly.",
  ],
  [
    "a design system that compiles",
    "Vector's design system lives in one documented file that generates the runtime tokens, with a linter that checks contrast and catches broken references. The docs cannot drift from the CSS.",
  ],
  [
    "honest constraints",
    "Streaming runs on Edge Runtime, where Prisma isn't compatible, so those routes talk to Supabase directly. Real projects have these compromises. I learned to make the call and move on.",
  ],
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

        <Reveal className="max-w-[760px] space-y-5">
          <Body>
            I did not want to build just another AI demo. I wanted to learn how a real
            SaaS is put together, and that turned out to be the most fascinating part of
            the project. So Vector is built like one. 16 Prisma models with cascade
            deletes, cookie-based auth for vendors, custom magic links for customers, and
            webhooks with idempotency keys.
          </Body>
          <Body>
            I built most of it by pairing with AI coding tools, and that is a skill in
            itself. I had to know exactly what to ask for, read the output critically, and
            stay on top of the architecture so it never sprawled.
          </Body>
        </Reveal>

        <Reveal
          stagger={0.12}
          className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-3"
        >
          {DECISIONS.map(([label, body]) => (
            <div key={label}>
              <div className="mb-4 h-px w-10 bg-[var(--green)]" />
              <p className="case-study-label mb-3">{label} &gt;</p>
              <Body>{body}</Body>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-16">
          <CaseStudyCallout stream>
            {"I built this to grow my range as a designer who can also ship. Every architectural choice is now something I understand from the inside."}
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
