import type { Metadata } from "next";
import { Metamorphous, Montserrat } from "next/font/google";
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
        className={`${metamorphous.variable} ${montserrat.variable} font-sans dark text-white min-h-screen`}
        style={{
          background: "linear-gradient(135deg, #231558 0%, #15092a 25%, #0d0821 50%, #000000 100%)",
          backgroundAttachment: "fixed"
        }}
      >
        {children}
      </body>
    </html>
  );
}
