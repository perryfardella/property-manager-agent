import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
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
  title: "Host Agent - AI WhatsApp Automation for STR Property Managers",
  description:
    "Save 10-15 hours per property monthly with AI-powered WhatsApp automation. Replace expensive property managers and automate guest messaging for short-term rentals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {/* Facebook SDK */}
        <Script
          id="facebook-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.fbAsyncInit = function() {
                FB.init({
                  appId            : '${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}',
                  autoLogAppEvents : true,
                  xfbml            : true,
                  version          : 'v23.0'
                });
              };
            `,
          }}
        />
        <Script
          src="https://connect.facebook.net/en_US/sdk.js"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
