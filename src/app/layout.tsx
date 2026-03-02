import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import getSession from "../lib/getSession"
import AppProvider from "./AppProvider";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bryan Ricci",
  description: "Software Engineer, Entrepreneur, and Open Source Enthusiast. Passionate about building innovative solutions and contributing to the tech community.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession()
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <AppProvider session={session}>
            {children}
          </AppProvider>
        </Suspense>
      </body>
    </html>
  );
}
