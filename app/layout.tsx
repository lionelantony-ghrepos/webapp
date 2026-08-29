import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { ConciergeDock } from "@/components/concierge-dock";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Havn — Quiet rooms at the edge of the north",
    template: "%s · Havn",
  },
  description:
    "A quiet, expensive-feeling travel house for the Scandinavian north. Four private stays. Winter light. Nowhere hurried.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ink font-sans text-ivory">
        <div className="grain" aria-hidden="true" />
        <SiteHeader />
        <main className="flex flex-1 flex-col pb-56">{children}</main>
        <SiteFooter />
        <ConciergeDock />
      </body>
    </html>
  );
}
