import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BYgame - Top Up Game Termurah & Terpercaya",
  description:
    "Top up game favorit kamu dengan harga termurah, proses instan, dan aman 100%. Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, dan 500+ game lainnya!",
  keywords: [
    "top up game",
    "top up murah",
    "top up Mobile Legends",
    "top up Free Fire",
    "top up PUBG Mobile",
    "top up Genshin Impact",
    "BYgame",
    "game top up",
    "beli diamond",
    "beli UC",
  ],
  authors: [{ name: "BYgame Team" }],
  openGraph: {
    title: "BYgame - Top Up Game Termurah & Terpercaya",
    description: "Harga termurah, proses instan, dan aman 100%",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${nunito.className} ${nunito.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
