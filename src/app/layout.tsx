import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif, Syne } from "next/font/google";
import { site } from "@/content/sections";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "800",
});

const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const sans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Matthew Mullin — capsule garden & sketchbook",
    template: "%s — Matthew Mullin",
  },
  description: site.statement,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${serif.variable} ${sans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
