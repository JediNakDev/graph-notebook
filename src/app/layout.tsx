import "~/styles/globals.css";

import { type Metadata } from "next";
import { Caveat, Geist, Inter } from "next/font/google";
import { cn } from "~/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Illinois ARCS Interview Assessment",
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(geist.variable, "font-sans", inter.variable, caveat.variable)}
    >
      <body>{children}</body>
    </html>
  );
}
