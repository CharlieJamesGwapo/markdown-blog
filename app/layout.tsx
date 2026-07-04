import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import DarkModeToggle from "./components/DarkModeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Markdown Blog CMS",
  description: "A powerful markdown blogging platform with dark mode and client-side storage",
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
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                📝 Blog
              </div>
            </Link>

            <nav className="flex items-center gap-6">
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Home
              </Link>
              <Link href="/write" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Write
              </Link>
              <DarkModeToggle />
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 py-12">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Built with Next.js, MDX, and localStorage. All content stored locally on your device.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
