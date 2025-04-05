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
    <html lang="en" className="dark">
      <body className={`${metamorphous.variable} ${montserrat.variable} font-sans dark bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
