import "~/styles/globals.css";

import { type Metadata } from "next";
import { Caveat, Geist, Inter, Newsreader } from "next/font/google";
import { cn } from "~/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Graph Notebook",
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        geist.variable,
        "font-sans",
        inter.variable,
        caveat.variable,
        newsreader.variable,
      )}
    >
      <body>{children}</body>
    </html>
  );
}
