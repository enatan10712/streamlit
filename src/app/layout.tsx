import type { Metadata, Viewport } from "next";
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
  title: "StreamVault | Unlimited Movies & Shows",
  description: "Experience the next generation of cinematic streaming with StreamVault. Unlimited movies, TV shows, and exclusive originals.",
  keywords: ["streaming", "movies", "tv shows", "netflix clone", "vault", "cinema"],
  authors: [{ name: "StreamVault Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "StreamVault",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "StreamVault",
    title: "StreamVault | Unlimited Movies & Shows",
    description: "Experience the next generation of cinematic streaming with StreamVault.",
  },
  twitter: {
    card: "summary_large_image",
    title: "StreamVault | Unlimited Movies & Shows",
    description: "Experience the next generation of cinematic streaming with StreamVault.",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=JSON.parse(localStorage.getItem('theme-storage')||'{}');var t=(s.state&&s.state.theme)||'dark';var r=t==='system'?(matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'):t;document.documentElement.classList.add(r);document.documentElement.style.colorScheme=r;}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full bg-background text-foreground selection:bg-primary selection:text-white`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
