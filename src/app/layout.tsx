import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond, Cinzel, Inter } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Miss Queen - Timeless Masterpieces",
  description: "Experience the pinnacle of Swiss horology. Our curated collection embodies the fusion of artisanal heritage and avant-garde precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${cormorant.variable} ${cinzel.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white overflow-x-hidden font-sans">
        {children}
      </body>
    </html>
  );
}

