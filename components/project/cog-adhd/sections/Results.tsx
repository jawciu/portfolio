import { A, Container, Kicker, Title, Body } from "../ui";

type Bubble = {
  asset: string;
  quote: string;
  who: string;
  className: string;
};

// Four mint speech bubbles, scattered like the PDF.
const BUBBLES: Bubble[] = [
  {
    asset: "stack-5.png",
    quote:
      "In the past, I struggled to see the point of checking in, but using it to look back at my week is great.",
    who: "@Cog clinic customer",
    className: "md:ml-24 md:-mb-2",
  },
  {
    asset: "stack-6.png",
    quote: "It's a great starting point, and I'm excited to use the it with my clients.",
    who: "@Cog clinic therapist",
    className: "md:ml-0 md:mt-6",
  },
  {
    asset: "stack-7.png",
    quote:
      "This motivates me to check in more often, as I can use the entries as a conversation starter in therapy.",
    who: "@Cog clinic customer",
    className: "md:ml-28 md:mt-2",
  },
  {
    asset: "stack-8.png",
    quote:
      "Being able to spot key highs and lows of the week helps focus therapy sessions on the most relevant issues.",
    who: "@Cog clinic therapist",
    className: "md:ml-4 md:mt-4",
  },
];

function SpeechBubble({ bubble }: { bubble: Bubble }) {
  return (
    <figure className={`relative w-full max-w-[16rem] ${bubble.className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={A(bubble.asset)}
        alt=""
        aria-hidden="true"
        className="block w-full h-auto select-none pointer-events-none"
      />
      <figcaption className="absolute inset-0 flex flex-col justify-center px-6 pb-5">
        <p className="cog-body text-[13px] leading-snug italic text-[var(--cog-ink)]">
          &ldquo;{bubble.quote}&rdquo;
        </p>
        <span className="mt-2 cog-label text-[11px] text-[var(--cog-green)]">
          {bubble.who}
        </span>
      </figcaption>
    </figure>
  );
}

export function Results() {
  return (
    <section data-section="Results" className="py-16 md:py-24">
      <Container>
        <Kicker>Results</Kicker>
        <Title className="mt-3">Small changes, measurable results</Title>

        <Body className="mt-6 max-w-[44rem]">
          The history feature helped both users and therapists find value in reviewing past
          check-ins, contributing to a noticeable{" "}
          <strong className="font-semibold text-[var(--cog-ink)]">
            increase in DAU and average time spent
          </strong>
          . Separately, after implementing batch session booking, we saw an{" "}
          <strong className="font-semibold text-[var(--cog-ink)]">
            increase in therapy bookings.
          </strong>
        </Body>

        <div className="mt-12 grid grid-cols-1 items-center gap-10 md:mt-16 lg:grid-cols-[1fr_auto]">
          {/* scattered testimonial bubble cluster */}
          <div className="flex flex-col gap-6 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-2">
            {BUBBLES.map((bubble) => (
              <SpeechBubble key={bubble.asset} bubble={bubble} />
            ))}
          </div>

          {/* solution screen — "Check in history" phone (Daily tab) */}
          <div className="flex justify-center lg:justify-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-large-screens-1.svg")}
              alt="Cog Clinic 'Check in history' screen showing the daily entries view with journal entries, wins and comments"
              className="block h-auto w-[16rem] max-w-full md:w-[18rem]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
