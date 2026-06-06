import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import Navigation from "@/components/Navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Support CRM — Customer Support Ticket System",
  description:
    "A production-ready customer support CRM for managing tickets, tracking issues, and delivering exceptional customer service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        {/* Navigation (Sidebar / Mobile Navbar) */}
        <Navigation />

        {/* ─── Main Content ────────────────────────────────────── */}
        <main className="flex-1 md:ml-64 bg-gray-50 min-h-screen pt-16 md:pt-0">
          {children}
        </main>

        {/* Toast notifications */}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
