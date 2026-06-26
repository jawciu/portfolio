"use client";

// Shared sticky glass navbar — rendered once in the root layout so it appears on
// every page. Left: the ~/caro/portfolio/2026 path label → home/hero. Right:
// [ PROJECTS ] → home #work, [ ABOUT ] → home #about. Frosted glass; text colour
// flips dark on light pages (case studies under /project) and light otherwise.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Routes that render on a LIGHT background want dark navbar text/glass.
function isLightRoute(pathname: string) {
  return pathname.startsWith("/project");
}

export function NavBar() {
  const pathname = usePathname();
  const light = isLightRoute(pathname);
  const onHome = pathname === "/";

  // At the very top the bar is invisible (blends into the hero/background); the
  // frosted glass only fades in once you start scrolling.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Same-page anchors smooth-scroll; the path label scrolls to top. Cross-page
  // links fall through to Next's <Link> (loads home, then jumps to the hash).
  const handle = (href: string) => (e: React.MouseEvent) => {
    if (!onHome) return; // let Link navigate to "/" + hash from another page
    if (href === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (href.startsWith("/#")) {
      e.preventDefault();
      document
        .getElementById(href.slice(2))
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // glass surface — only once scrolled; transparent + no blur at the top.
  const shell = scrolled
    ? `${
        light ? "bg-[rgba(245,244,239,0.3)]" : "bg-[rgba(7,7,9,0.28)]"
      } backdrop-blur-md backdrop-saturate-150`
    : "bg-transparent";
  // dark site: dim by default, brighten on hover. light pages: keep the default
  // tone, deepen toward black on hover.
  const pathColor = light ? "text-[#1a1a1a]/65" : "text-fg/70";
  const navColor = light ? "text-[#1a1a1a]/65" : "text-fg/60";
  const hover = light ? "hover:text-black" : "hover:text-fg";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-500 md:px-12 ${shell}`}
    >
      <Link
        href="/"
        onClick={handle("/")}
        className={`font-mono text-xs tracking-[0.2em] transition-colors md:text-sm ${pathColor} ${hover}`}
      >
        ~/caro/portfolio/2026
      </Link>
      <nav
        className={`flex gap-6 font-mono text-xs tracking-[0.25em] md:gap-10 md:text-sm ${navColor}`}
      >
        <Link
          href="/#work"
          onClick={handle("/#work")}
          className={`transition-colors ${hover}`}
        >
          [ PROJECTS ]
        </Link>
        <Link
          href="/#about"
          onClick={handle("/#about")}
          className={`transition-colors ${hover}`}
        >
          [ ABOUT ]
        </Link>
      </nav>
    </header>
  );
}
