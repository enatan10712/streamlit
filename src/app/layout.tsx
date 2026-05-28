import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StreamVault | Your Cinematic Escape",
  description: "Unlimited movies, TV shows, and more. Experience the ultimate cinematic vault with high-quality streaming.",
  keywords: ["streaming", "movies", "TV shows", "StreamVault", "cinema", "entertainment"],
  authors: [{ name: "StreamVault Team" }],
  openGraph: {
    title: "StreamVault | Your Cinematic Escape",
    description: "Unlimited movies, TV shows, and more. Built for the modern web.",
    url: "https://streamvault.vercel.app",
    siteName: "StreamVault",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StreamVault Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StreamVault | Your Cinematic Escape",
    description: "Unlimited movies, TV shows, and more. Built for the modern web.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-[#0d0c1d] text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
