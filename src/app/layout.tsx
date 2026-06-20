import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
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
  title: "Dev Toolbox - Developer Tools & Utilities",
  description: "Free online developer tools: JSON formatter, regex tester, color converter, Base64 codec, URL encoder, JWT decoder, and more. No sign-up required.",
  openGraph: {
    title: "Dev Toolbox - Developer Tools & Utilities",
    description: "Free online developer tools: JSON formatter, regex tester, color converter, Base64 codec, URL encoder, JWT decoder, and more. No sign-up required.",
    type: "website",
    url: "https://dev-toolbox-zeta-gold.vercel.app",
  },
  verification: {
    google: "IsWE9djwFQ2LdRb5or5sNx70HFwHHBUFgcsc3hMv_CQ",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col noise-overlay">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
