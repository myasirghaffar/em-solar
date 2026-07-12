import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import Providers from "./providers";
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
  title: "EnergyMart",
  description: "EnergyMart storefront — solar products, checkout, and customer accounts.",
  icons: {
    icon: [{ url: "/em-logo-only.png", type: "image/png" }],
    shortcut: "/em-logo-only.png",
    apple: "/em-logo-only.png",
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
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: browser extensions inject body attrs */}
      <body className="min-h-full bg-white text-[#0B2A4A]" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
