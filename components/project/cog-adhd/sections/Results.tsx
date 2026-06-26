import { A, Container, Kicker, Title, Body, TestimonialBubble } from "../ui";

type Bubble = {
  asset: string;
  quote: string;
  who: string;
  /** explicit bubble width in px (aspect ratio is preserved) */
  width: number;
  /** mirror the art horizontally so the tail sits on the LEFT */
  flip?: boolean;
};

// Therapist quotes (left column) and customer quotes (right column) — staggered
// into a loose zigzag scatter, matching the PDF.
const THERAPIST: Bubble[] = [
  {
    asset: "stack-6.png",
    quote: "It's a great starting point, and I'm excited to use the it with my clients.",
    who: "@Cog clinic therapist",
    width: 280, // top-left
  },
  {
    asset: "stack-8.png",
    quote:
      "Being able to spot key highs and lows of the week helps focus therapy sessions on the most relevant issues.",
    who: "@Cog clinic therapist",
    width: 340, // bottom-left
  },
];

const CUSTOMER: Bubble[] = [
  {
    asset: "stack-5.png",
    quote:
      "In the past, I struggled to see the point of checking in, but using it to look back at my week is great.",
    who: "@Cog clinic customer",
    width: 300, // top-right — tail on the left
    flip: true,
  },
  {
    asset: "stack-7.png",
    quote:
      "This motivates me to check in more often, as I can use the entries as a conversation starter in therapy.",
    who: "@Cog clinic customer",
    width: 320, // bottom-right — tail on the right
    flip: true,
  },
];

export function Results() {
  return (
    <section data-section="Results" className="pt-[120px] pb-0 bg-[var(--cog-bg-section)]">
      <Container>
        <Kicker>Results</Kicker>
        <Title>Small changes, measurable results</Title>

        <div className="mt-6 max-w-[600px] space-y-6">
          <Body>
            The history feature helped both users and therapists find value in
            reviewing past check-ins, contributing to a noticeable{" "}
            <strong className="font-semibold text-[var(--cog-ink)]">
              increase in DAU and average time spent
            </strong>
            .
          </Body>
          <Body>
            Separately, after implementing batch session booking, we saw an{" "}
            <strong className="font-semibold text-[var(--cog-ink)]">
              increase in therapy bookings.
            </strong>
          </Body>
        </div>

        <div className="mt-12 grid grid-cols-1 items-center gap-10 md:mt-16 lg:grid-cols-[1fr_auto]">
          {/* scattered testimonial bubble cluster — therapists (left) and
              customers (right) staggered into a zigzag.
              DIALS: `gap-3` = horizontal closeness of the two columns;
              `pt-32` on the left column = how far it drops to alternate with the
              right column; `gap-8` = vertical space between the two stacked
              bubbles in each column. */}
          <div className="flex justify-center gap-2 sm:gap-0">
            <div className="flex flex-col items-center gap-8 pt-50">
              {THERAPIST.map((bubble) => (
                <TestimonialBubble key={bubble.asset} {...bubble} />
              ))}
            </div>
            <div className="flex flex-col items-center gap-8">
              {CUSTOMER.map((bubble) => (
                <TestimonialBubble key={bubble.asset} {...bubble} />
              ))}
            </div>
          </div>

          {/* result clip — phone screen recording */}
          <div className="flex justify-center lg:justify-end">
            <video
              src={A("results-phone.mp4")}
              autoPlay
              loop
              muted
              playsInline
              className="block h-auto w-[16rem] max-w-full md:w-[18rem]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
