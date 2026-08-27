import type { Metadata } from "next";
import "./globals.css";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";

export const metadata: Metadata = {
  title: {
    default: "BlogVerse — Write. Publish. Get discovered.",
    template: "%s | BlogVerse",
  },
  description:
    "BlogVerse is a modern blogging platform for writers, developers, creators and builders to publish ideas and discover useful content.",
  applicationName: "BlogVerse",
  keywords: [
    "BlogVerse",
    "blog platform",
    "technology blogs",
    "programming blogs",
    "AI blogs",
    "developer blogs",
    "startup blogs",
    "web development",
  ],
  authors: [{ name: "BlogVerse" }],
  creator: "BlogVerse",
  openGraph: {
    title: "BlogVerse — Write. Publish. Get discovered.",
    description:
      "Write, publish and discover useful ideas from the BlogVerse community.",
    type: "website",
    siteName: "BlogVerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlogVerse — Write. Publish. Get discovered.",
    description:
      "A modern blogging platform for writers, developers and creators.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#050505] text-white antialiased">
        <Header />

        <div className="min-h-screen pt-[64px]">
          {children}
        </div>

        <Footer />

        <CookieConsent />
      </body>
    </html>
  );
}
