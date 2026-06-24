import { A, Container, Kicker, Title, Body, Callout } from "../ui";

type Persona = {
  img: string;
  alt: string;
  label: string;
  body: string;
};

const PERSONAS: Persona[] = [
  {
    img: "image-6.svg",
    alt: "Smiling mascot representing therapy clients",
    label: "Therapy clients",
    body: "Cog Clinic customers who had prior experience with therapy",
  },
  {
    img: "image-7.svg",
    alt: "Squiggly mascot representing therapists",
    label: "Therapists",
    body: "Specialists experienced in providing therapy for individuals with ADHD",
  },
  {
    img: "image-8.svg",
    alt: "Doctor and patient mascots representing clinic staff",
    label: "Clinic staff",
    body: "Professionals at mental health clinics familiar with operational systems",
  },
];

type Bubble = {
  img: string;
  alt: string;
  text: React.ReactNode;
  /** outer wrapper positioning + sizing */
  wrap: string;
  /** padded text area inside the cloud */
  pad: string;
};

const BUBBLES: Bubble[] = [
  {
    img: "stack.png",
    alt: "Purple thought bubble",
    text: (
      <>
        What <b>processes</b> in mental healthcare clinics influence the therapy
        experience?
      </>
    ),
    wrap: "w-[240px] md:translate-x-6",
    pad: "px-9 pt-7 pb-9",
  },
  {
    img: "stack-4.png",
    alt: "Mint thought bubble",
    text: (
      <>
        What factors contribute to a <b>successful therapy</b>?
      </>
    ),
    wrap: "w-[230px] md:mt-10 md:-translate-x-2",
    pad: "px-9 pt-8 pb-10",
  },
  {
    img: "stack-4.png",
    alt: "Mint thought bubble",
    text: (
      <>
        What <b>challenges</b> do therapists face?
      </>
    ),
    wrap: "w-[210px] md:-mt-2",
    pad: "px-9 pt-8 pb-10",
  },
  {
    img: "stack-3.png",
    alt: "Purple thought bubble",
    text: (
      <>
        What are our customers&apos; <b>needs</b> when starting ADHD therapy?
      </>
    ),
    wrap: "w-[230px] md:-translate-y-4",
    pad: "px-9 pt-7 pb-9",
  },
  {
    img: "stack-4.png",
    alt: "Mint thought bubble",
    text: (
      <>
        Which parts of the <b>current process</b> are challenging, and what
        aspects work well?
      </>
    ),
    wrap: "w-[245px] md:mt-2",
    pad: "px-9 pt-7 pb-10",
  },
];

export function Interviews() {
  return (
    <section data-section="Interviews" className="py-16 md:py-24">
      <Container>
        <Kicker>INTERVIEWS</Kicker>
        <Title className="mt-3 max-w-[20ch]">
          HOLISTIC INSIGHTS THROUGH 360&deg; INTERVIEWS WITH&hellip;
        </Title>

        {/* three persona cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PERSONAS.map((p) => (
            <div
              key={p.label}
              className="rounded-xl border border-[var(--cog-line)] bg-[var(--cog-card)] p-6"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={A(p.img)}
                alt={p.alt}
                className="mx-auto -mt-14 mb-4 h-24 w-24 object-contain"
              />
              <p className="cog-label text-[15px]">{p.label}</p>
              <Body className="mt-2 text-[13px]">{p.body}</Body>
            </div>
          ))}
        </div>

        {/* goal */}
        <div className="mt-16 md:mt-20">
          <Callout>
            My goal was to gain a deeper understanding of the ADHD therapy
            landscape so I could address our users&apos; needs better.
          </Callout>
        </div>

        {/* thought-bubble cluster */}
        <div className="mt-12 flex flex-wrap items-start justify-center gap-x-2 gap-y-4 md:mt-16">
          {BUBBLES.map((b, i) => (
            <div key={i} className={`relative shrink-0 ${b.wrap}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={A(b.img)}
                alt={b.alt}
                className="block h-auto w-full select-none"
              />
              <p
                className={`cog-body absolute inset-0 flex items-center justify-center text-center text-[13px] leading-snug text-[var(--cog-ink)] ${b.pad}`}
              >
                <span>{b.text}</span>
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
