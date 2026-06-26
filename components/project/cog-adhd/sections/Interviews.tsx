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
  /** absolute-inset utilities framing the cloud's main lobe — the text column is
      centred inside this box, so it's tuned per cloud (each has a different shape
      + trailing-dot corner). */
  box: string;
};

// Five distinct clouds. Laid out as two rows (see render): row 1 = [0,1],
// row 2 = [2,3,4]. All five render at the SAME size.
const BUBBLES: Bubble[] = [
  {
    img: "stack.png", // purple, tail bottom-right — visual-centred by eye
    alt: "Purple thought bubble",
    box: "left-[16%] right-[16%] top-[10%] bottom-[21%]",
    text: (
      <>
        What <b>processes</b> in mental healthcare clinics influence the therapy
        experience?
      </>
    ),
  },
  {
    img: "stack-1.png", // green, tail bottom-left (single dot) — visual-centred by eye
    alt: "Green thought bubble",
    box: "left-[13%] right-[19%] top-[10%] bottom-[23%]",
    text: (
      <>
        What factors contribute to a <b>successful therapy</b>?
      </>
    ),
  },
  {
    img: "stack-2.png", // green, tail bottom-left — visual-centred by eye
    alt: "Green thought bubble",
    box: "left-[28%] right-[17%] top-[16%] bottom-[26%]",
    text: (
      <>
        What <b>challenges</b> do therapists face?
      </>
    ),
  },
  {
    img: "stack-3.png", // purple, tail bottom-right — visual-centred by eye
    alt: "Purple thought bubble",
    box: "left-[23%] right-[18%] top-[23%] bottom-[23%]",
    text: (
      <>
        What are our customers&apos; <b>needs</b> when starting ADHD therapy?
      </>
    ),
  },
  {
    img: "stack-4.png", // green, tail bottom-left — visual-centred by eye
    alt: "Green thought bubble",
    box: "left-[26%] right-[21%] top-[11%] bottom-[25%]",
    text: (
      <>
        Which parts of the <b>current process</b> are challenging, and what
        aspects work well?
      </>
    ),
  },
];

/** one cloud with its question centred over the main lobe (the per-bubble `box`
    frames the lobe, biased away from the trailing dots), text left-aligned. */
function Bubble({ b }: { b: Bubble }) {
  return (
    <div className="relative w-[300px] max-w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={A(b.img)}
        alt={b.alt}
        className="block h-auto w-full select-none"
      />
      <div className={`absolute flex items-center justify-center ${b.box}`}>
        <span className="text-left text-[15px] leading-[1.4] text-[var(--cog-ink)]">
          {b.text}
        </span>
      </div>
    </div>
  );
}

export function Interviews() {
  return (
    <section data-section="Interviews" className="pt-[120px] pb-0">
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
              className="w-full max-w-[260px] rounded-xl border border-[#f1f0ea] bg-[var(--cog-card)] p-6"
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
        <div className="mt-12 flex flex-col items-center gap-y-6 md:mt-16">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {BUBBLES.slice(0, 2).map((b, i) => (
              <Bubble key={i} b={b} />
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {BUBBLES.slice(2).map((b, i) => (
              <Bubble key={i} b={b} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
