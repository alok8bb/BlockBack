import type { Metadata } from "next";
import "./globals.css";
import { Hanken_Grotesk, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import WagmiProviderComp from "@/lib/wagmi-provider";
import { config } from "@/lib/config";

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
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${hankenGrotesk.variable} flex h-auto flex-col px-5 md:px-20 font-body pb-5`}
      >
        <Toaster position="bottom-right" reverseOrder={false} />
        <WagmiProviderComp initialState={initialState}>
          {children}
        </WagmiProviderComp>
      </body>
    </html>
  );
}
