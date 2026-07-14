import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Vector Alpha | Algorithmic Portfolio Optimizer",
  description: "Build data-driven portfolios with robust covariance estimation, efficient-frontier analysis, and transparent methodology.",
};
export const viewport: Viewport = { themeColor: "#07110f", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-background"><body className={`${geist.variable} ${mono.variable} font-sans antialiased`}>{children}</body></html>;
}
