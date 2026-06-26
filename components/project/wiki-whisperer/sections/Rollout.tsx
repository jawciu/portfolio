import { Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

export function Rollout() {
  return (
    <section data-section="Rollout" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>The rollout</Kicker>
          <Title>Hyping a launch agents would believe in</Title>
        </Reveal>

        <Reveal stagger={0.1} className="flex max-w-[760px] flex-col gap-5">
          <Body>
            The pilots surfaced one more thing: specialists burned by V1 did not even try
            V2&apos;s best features. Many did not realise it was conversational until we
            showed them.
          </Body>
          <Body>
            So adoption was a perception problem too. For the company-wide rollout I
            scripted a one-minute feature-hype video, in the spirit of a Google or
            ElevenLabs launch, and directed a motion designer to bring it to life.
          </Body>
          <Body>
            It shows specialists they can ask complex questions, be creative, and give
            feedback, so they arrive ready to use V2 well. The rollout itself is a low-risk,
            site-by-site phased launch, with monitoring at each gate before the next.
          </Body>
        </Reveal>

        {/* the promo video lives here — placeholder until the mp4 is added */}
        <Reveal className="mt-14 flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-[var(--cog-line)] bg-[var(--cog-bg-alt)]">
          <span className="case-study-label text-[var(--cog-muted)]">
            one-minute feature-hype video
          </span>
        </Reveal>
      </Container>
    </section>
  );
}
