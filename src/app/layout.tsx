import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { ToastProvider } from "@/components/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sakshi — Entry & Exit Management",
  description:
    "A modern entry and exit logging system for managing resident, staff, and guest access with real-time tracking.",
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
      <body className="min-h-full">
        <Sidebar />
        <div className="min-h-screen flex flex-col" style={{ paddingLeft: "260px" }}>
          <main className="flex-1" style={{ padding: "48px 64px" }}>
            {children}
          </main>
        </div>
        <ToastProvider />
      </body>
    </html>
  );
}
