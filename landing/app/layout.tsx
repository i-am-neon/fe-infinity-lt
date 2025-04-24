import type { Metadata } from "next";
import { Metamorphous, Montserrat } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const metamorphous = Metamorphous({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-metamorphous",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FE Infinity",
  description: "Create a Fire Emblem game as you play it",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-black min-h-screen" style={{ backgroundColor: "#000000" }}>
      <body
        className={`${metamorphous.variable} ${montserrat.variable} font-sans dark text-white min-h-screen flex flex-col`}
        style={{
          background: "linear-gradient(135deg, #231558 0%, #15092a 25%, #0d0821 50%, #000000 100%)",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="flex-grow">
          {children}
        </div>
        <footer className="flex justify-center items-center py-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 overflow-hidden rounded-full flex items-center justify-center">
              <Image src="/neon.png" alt="Neon logo" width={24} height={24} />
            </div>
            <span>
              Created by <a href="https://www.neon.engineer/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">neon</a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
