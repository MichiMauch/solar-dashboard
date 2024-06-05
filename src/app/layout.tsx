import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KOKOMO Solar Dashboard",
  description: "Live-Daten vom Victron-System und KOKOMO Solar Dashboard für Echtzeit-Überwachung und effiziente Solarenergieverwaltung.",
  robots: "noindex",
  openGraph: {
    title: "KOKOMO Solar Dashboard 2"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={`bg-gray-100 ${inter.className}`}>{children}</body>
    </html>
  );
}
