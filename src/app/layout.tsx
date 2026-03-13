import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1e3a5f",
};

export const metadata: Metadata = {
  title: "RealMVP — Find Your Dream Property in India",
  description: "Discover apartments, houses, villas, PGs, and commercial spaces across India. Free property listings, map-based search, and direct owner contact.",
  keywords: "real estate, property, buy, rent, apartment, house, villa, India, Mumbai, Bangalore, Delhi",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="font-sans">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              background: '#1e293b',
              color: '#fff',
            },
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
