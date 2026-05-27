import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

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
    default: "Caroline Jaworsky — Product Designer",
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
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="bg-bg text-fg antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
