import { A, Container, Kicker, Title, Body, CaseStudyCallout } from "../ui";

type Persona = {
  img: string;
  alt: string;
  label: string;
  body: string;
};

const PERSONAS: Persona[] = [
  {
    img: "image-7.svg",
    alt: "Mascot representing therapy clients",
    label: "Therapy clients",
    body: "Cog Clinic customers who had prior experience with therapy",
  },
  {
    img: "image-8.svg",
    alt: "Mascot representing therapists",
    label: "Therapists",
    body: "Specialists experienced in providing therapy for individuals with ADHD",
  },
  {
    img: "image-9.svg",
    alt: "Mascot representing clinic staff",
    label: "Clinic staff",
    body: "Professionals at mental health clinics familiar with operational systems",
  },
];

type Bubble = {
  img: string;
  alt: string;
  text: React.ReactNode;
  /** which corner the cloud's trailing dots sit in — text is biased away from it */
  tail: "left" | "right";
};

// Laid out as two rows (see render): row 1 = [0,1], row 2 = [2,3,4].
const BUBBLES: Bubble[] = [
  {
    img: "stack.png", // purple, tail bottom-right
    alt: "Purple thought bubble",
    tail: "right",
    text: (
      <>
        What <b>processes</b> in mental healthcare clinics influence the therapy
        experience?
      </>
    ),
  },
  {
    img: "stack-4.png", // green, tail bottom-left
    alt: "Green thought bubble",
    tail: "left",
    text: (
      <>
        What factors contribute to a <b>successful therapy</b>?
      </>
    ),
  },
  {
    img: "stack-4.png", // green, tail bottom-left
    alt: "Green thought bubble",
    tail: "left",
    text: (
      <>
        What <b>challenges</b> do therapists face?
      </>
    ),
  },
  {
    img: "stack-3.png", // purple, tail bottom-right
    alt: "Purple thought bubble",
    tail: "right",
    text: (
      <>
        What are our customers&apos; <b>needs</b> when starting ADHD therapy?
      </>
    ),
  },
  {
    img: "stack-4.png", // green, tail bottom-left
    alt: "Green thought bubble",
    tail: "left",
    text: (
      <>
        Which parts of the <b>current process</b> are challenging, and what
        aspects work well?
      </>
    ),
  },
];

/** one cloud with its question centred over the main lobe (biased away from the
    trailing dots), text left-aligned. */
function Bubble({ b, className = "" }: { b: Bubble; className?: string }) {
  // a NARROW text column centred over the cloud's main lobe, biased away from the
  // trailing dots (purple = tail bottom-right, green = tail bottom-left) so the
  // copy reads as a tidy centred block, not spanning edge-to-edge.
  const box =
    b.tail === "right"
      ? "left-[16%] right-[24%] top-[12%] bottom-[24%]"
      : "left-[24%] right-[16%] top-[12%] bottom-[24%]";
  return (
    <div className={`relative ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={A(b.img)}
        alt={b.alt}
        className="block h-auto w-full select-none"
      />
      <div className={`absolute flex items-center justify-center ${box}`}>
        <span className="text-left text-[15px] leading-[1.4] text-[var(--cog-ink)]">
          {b.text}
        </span>
      </div>
    </div>
  );
}

export function Interviews() {
  return (
    <section data-section="Interviews" className="py-16 md:py-24">
      <Container>
        <Kicker>INTERVIEWS</Kicker>
        <Title>
          HOLISTIC INSIGHTS
          <br />
          THROUGH 360&deg; INTERVIEWS WITH&hellip;
        </Title>

        {/* three persona cards — narrow cards (body wraps to ~3 lines) with a 48px
            gap between them; the mascots overhang the card top by ~32px, so mt-20
            keeps a visible 48px clear gap below the heading (80px − 32px = 48px). */}
        <div className="mt-20 flex flex-col items-center gap-6 sm:flex-row sm:items-stretch sm:justify-center sm:gap-12">
          {PERSONAS.map((p) => (
            <div
              key={p.label}
              className="w-full max-w-[260px] rounded-xl border border-[var(--cog-line)] bg-[var(--cog-card)] p-6"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={A(p.img)}
                alt={p.alt}
                className="mx-auto -mt-14 mb-4 h-24 w-24 object-contain"
              />
              <p className="case-study-label">{p.label}</p>
              <Body className="mt-3">{p.body}</Body>
            </div>
          ))}
        </div>

        {/* goal */}
        <div className="mt-16 md:mt-20">
          <CaseStudyCallout>
            My goal was to gain a deeper understanding of the ADHD therapy
            landscape so I could address our users&apos; needs better.
          </CaseStudyCallout>
        </div>

        {/* thought-bubble cluster — two tidy rows, no overlap:
            row 1 = purple · green, row 2 = green · purple · green. */}
        <div className="mt-12 flex flex-col items-center gap-y-4 md:mt-16">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {BUBBLES.slice(0, 2).map((b, i) => (
              <Bubble key={i} b={b} className="w-[300px] max-w-full md:w-[350px]" />
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {BUBBLES.slice(2).map((b, i) => (
              <Bubble key={i} b={b} className="w-[260px] max-w-full md:w-[290px]" />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
