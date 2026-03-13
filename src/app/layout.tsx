import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "RealMVP — Find Your Dream Property in India",
  description: "Discover apartments, houses, villas, PGs, and commercial spaces across India. Free property listings, map-based search, and direct owner contact.",
  keywords: "real estate, property, buy, rent, apartment, house, villa, India, Mumbai, Bangalore, Delhi",
  manifest: "/manifest.json",
  themeColor: "#1e3a5f",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
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
      </body>
    </html>
  );
}
