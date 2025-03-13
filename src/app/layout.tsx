import { TempoInit } from "@/components/tempo-init";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kashew - Modern Invoicing Platform",
  description:
    "A comprehensive invoicing web application with AI-powered features",
  icons: {
    icon: [
      { url: '/images/Kashew.png' }
    ],
    apple: [
      { url: '/images/Kashew.png' }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/Kashew.png" />
        <link rel="apple-touch-icon" href="/images/Kashew.png" />
      </head>
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <TempoInit />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
