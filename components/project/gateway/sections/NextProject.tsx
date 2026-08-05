import Link from "next/link";
import { Container, Kicker } from "../ui";
import { Reveal } from "../Reveal";

/* SCAFFOLD — plain next-project link. Restyle after the other studies'
   NextProject treatment once Gateway's own look settles.
   TODO(caro): pick the destination (wiki-whisperer keeps the E.ON pair together). */
export function NextProject() {
  return (
    <section data-section="NextProject" className="py-28">
      <Container>
        <Reveal>
          <Kicker>next project</Kicker>
          <Link
            href="/project/wiki-whisperer"
            className="case-study-section-heading inline-block underline decoration-[var(--green)] decoration-2 underline-offset-8"
          >
            Wiki Whisperer V2 &rarr;
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
