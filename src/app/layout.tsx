import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false, // Only preload the primary font
});

export const metadata: Metadata = {
  metadataBase: new URL('https://marche-noel-mpr.vercel.app'),
  title: "Sora Vidéo Generator",
  description: "Application web pour générer des vidéos avec l'API Sora 2 de OpenAI",
  manifest: "/manifest.json",
  keywords: [],
  authors: [{ name: "Romain Ecarnot" }],
  openGraph: {
    title: "Sora Vidéo Generator",
    description: "Application web pour générer des vidéos avec l'API Sora 2 de OpenAI",
    type: "website",
    locale: "fr_FR",
    siteName: "Sora Vidéo Generator",
    images: [
      {
        url: "/og.webp",
        width: 1280,
        height: 800,
        alt: "Application web pour générer des vidéos avec l'API Sora 2 de OpenAI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sora Vidéo Generator",
    description: "Application web pour générer des vidéos avec l'API Sora 2 de OpenAI",
    images: ["/og.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sora Vidéo Generator",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
