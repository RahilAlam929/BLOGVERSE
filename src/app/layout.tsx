import "./globals.css";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";

export const metadata = {
  title: "BuildVerse",
  description: "Modern tech blog platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}