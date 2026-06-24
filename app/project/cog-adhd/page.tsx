import type { Metadata } from "next";
import "../../../components/project/cog-adhd/theme.css";
import { Nav } from "../../../components/project/cog-adhd/sections/Nav";
import { Hero } from "../../../components/project/cog-adhd/sections/Hero";
import { MyRole } from "../../../components/project/cog-adhd/sections/MyRole";
import { Interviews } from "../../../components/project/cog-adhd/sections/Interviews";
import { Competitive } from "../../../components/project/cog-adhd/sections/Competitive";
import { Findings } from "../../../components/project/cog-adhd/sections/Findings";
import { BookingDropoff } from "../../../components/project/cog-adhd/sections/BookingDropoff";
import { JourneyMap } from "../../../components/project/cog-adhd/sections/JourneyMap";
import { Strategy } from "../../../components/project/cog-adhd/sections/Strategy";
import { Methodology } from "../../../components/project/cog-adhd/sections/Methodology";
import { Challenges } from "../../../components/project/cog-adhd/sections/Challenges";
import { Solution } from "../../../components/project/cog-adhd/sections/Solution";
import { Results } from "../../../components/project/cog-adhd/sections/Results";
import { Takeaways } from "../../../components/project/cog-adhd/sections/Takeaways";
import { NextProject } from "../../../components/project/cog-adhd/sections/NextProject";

export const metadata: Metadata = {
  title: "Cog ADHD — Gaps & Opportunities in ADHD Therapy | Caroline Jaworsky",
  description:
    "Research & strategy case study: uncovering key user needs in ADHD therapy and turning insights into tested, shipped solutions for Cog Clinic.",
};

export default function CogAdhdCaseStudy() {
  return (
    <main className="cog-root min-h-screen w-full overflow-x-hidden">
      <div data-cog="Nav"><Nav /></div>
      <div data-cog="Hero"><Hero /></div>
      <div data-cog="MyRole"><MyRole /></div>
      <div data-cog="Interviews"><Interviews /></div>
      <div data-cog="Competitive"><Competitive /></div>
      <div data-cog="Findings"><Findings /></div>
      <div data-cog="BookingDropoff"><BookingDropoff /></div>
      <div data-cog="JourneyMap"><JourneyMap /></div>
      <div data-cog="Strategy"><Strategy /></div>
      <div data-cog="Methodology"><Methodology /></div>
      <div data-cog="Challenges"><Challenges /></div>
      <div data-cog="Solution"><Solution /></div>
      <div data-cog="Results"><Results /></div>
      <div data-cog="Takeaways"><Takeaways /></div>
      <div data-cog="NextProject"><NextProject /></div>
    </main>
  );
}
