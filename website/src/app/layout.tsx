import type { Metadata } from "next";
import "./globals.css";
import { Hanken_Grotesk, Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hanken-grotesk",
});

export const metadata: Metadata = {
  title: "BlockBack",
  description: "BlockBack Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${hankenGrotesk.variable} flex h-auto flex-col px-20 font-body pb-5`}
      >
        {children}
      </body>
    </html>
  );
}
