import Link from "next/link";
import { Container, Kicker } from "../ui";
import { Reveal } from "../Reveal";

export function NextProject() {
  return (
    <section data-section="NextProject" className="pt-[120px] pb-[120px]">
      <Container>
        <Reveal>
          <Kicker>View next project</Kicker>
          <div className="flex flex-col items-start gap-6">
            <h3 className="case-study-section-heading mb-0!">
              Gaps and opportunities
              <br />
              in ADHD therapy
            </h3>
            <Link
              href="/project/cog-adhd"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--green)] px-6 py-3 text-[var(--green)] transition-colors hover:bg-[var(--green)] hover:text-white"
            >
              <span className="case-study-label" style={{ color: "inherit" }}>
                check it out
              </span>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
