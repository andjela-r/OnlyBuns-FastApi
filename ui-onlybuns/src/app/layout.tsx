import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/app/components/navigation";
import Image from 'next/image';
import { roboto } from "@/app/fonts/fonts";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "OnlyBuns",
  description: "Only for Bunnie lovers",
};

export const viewport: Metadata = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fceae9" },
    { media: "(prefers-color-scheme: dark)", color: "#26211f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className} antialiased`}>
        <div className="flex min-h-screen flex-col">
          <header className="bg-primary border-b border-border-color">
            <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/mochi-bunny.png"
                  width={40}
                  height={40}
                  alt="A cute mochi bunny logo"
                  className="drop-shadow-sm"
                />
                <Link href="/" className="group">
                  <h1 className="text-3xl font-bold tracking-tight text-accent transition-opacity group-hover:opacity-80">
                    OnlyBuns
                  </h1>
                </Link>
              </div>
              <div className="header-right">
                <Navigation />
              </div>
            </div>
          </header>

          <main className="flex-grow">
            <div className="mx-auto max-w-5xl p-4 sm:p-6 md:p-8">
              {children}
            </div>
          </main>

          <footer className="bg-primary text-foreground/80 mt-auto border-t border-border-color">
            <div className="mx-auto max-w-5xl p-4 text-center text-sm">
              <p>&copy; {new Date().getFullYear()} OnlyBuns. Bunnie lovers unite!</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}