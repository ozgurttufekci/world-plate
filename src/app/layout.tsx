import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Get a random country and its one signature dish to cook or bake. Filter by baking or cooking, course, difficulty, time and region.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    title: `${SITE_NAME}: ${SITE_TAGLINE}`,
    description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#fbf9f4",
};

const navLink =
  "rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="border-b bg-background/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <span aria-hidden>🍽️</span>
              {SITE_NAME}
            </Link>
            <nav aria-label="Main" className="flex items-center gap-1">
              <Link href="/" className={navLink}>
                Spin
              </Link>
              <Link href="/browse" className={navLink}>
                Browse
              </Link>
              <Link href="/criteria" className={navLink}>
                Criteria
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
          {children}
        </main>

        <footer className="border-t">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-5 text-sm text-muted-foreground sm:px-6">
            <p>One dish per country. The only random part is the country.</p>
            <p className="flex gap-4">
              <Link href="/criteria" className="underline underline-offset-4 hover:text-foreground">
                How countries are chosen
              </Link>
              <Link href="/credits" className="underline underline-offset-4 hover:text-foreground">
                Photo credits
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
