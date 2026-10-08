import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "FreeLawGen — Open Source AI Attorney",
  description:
    "Equal access to the legal system for all. FreeLawGen provides AI-powered legal document generation, case management, and legal research.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <a href="/" className="mr-6 flex items-center space-x-2">
                <span className="font-bold text-primary">FreeLawGen</span>
              </a>
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <a href="/" className="transition-colors hover:text-foreground/80 text-foreground">
                  Dashboard
                </a>
                <a href="/cases" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  Cases
                </a>
                <a href="/documents" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  Documents
                </a>
                <a href="/research" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  Research
                </a>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-12 md:flex-row">
              <p className="text-sm leading-loose text-muted-foreground">
                FreeLawGen is open-source software. Not a substitute for retained counsel.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
