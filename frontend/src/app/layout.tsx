import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans'
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Primary Health",
  description: "Find social programs near you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${GeistSans.className} antialiased bg-gray-100`}>
        {children}
      </body>
    </html>
  );
}