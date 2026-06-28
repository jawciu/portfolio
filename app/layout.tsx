import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "./providers";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import "./globals.css";

// Iosevka Charon — quasi-proportional, self-hosted. Not in Google's
// next/font catalog, so we load the woff2s locally.
const hero = localFont({
  variable: "--font-hero",
  display: "swap",
  src: [
    {
      path: "./fonts/iosevka-charon-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/iosevka-charon-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Caroline Jaworsky - AI Product Designer",
    template: "%s — Caroline Jaworsky",
  },
  description:
    "Product designer working on consumer apps and B2B SaaS. Selected work, case studies, and writing.",
  openGraph: {
    type: "website",
    siteName: "Caroline Jaworsky",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${hero.variable}`}>
      <body className="bg-bg text-fg antialiased">
        <Providers>
          <NavBar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
