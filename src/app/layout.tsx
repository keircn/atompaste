import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "~/lib/auth-context";
import { ThemeProvider } from "~/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://atom.keiran.cc"),
  title: "atompaste",
  description: "Free and open-source pastebin for developers",
  openGraph: {
    title: "atompaste",
    description: "Free and open-source pastebin for developers",
    url: "https://atom.keiran.cc",
    siteName: "atompaste",
    /* images: [
      {
        url: "https://atom.keiran.cc/og-image.png",
        width: 1200,
        height: 630,
        alt: "atompaste - Free and open-source pastebin for developers",
      },
    ], */
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "atompaste",
    description: "Free and open-source pastebin for developers",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider defaultTheme="system">
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
