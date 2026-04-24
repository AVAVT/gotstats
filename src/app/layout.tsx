import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppProvider from "@/redux/provider";

import "./globals.css";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import PageContentLayout from "@/components/page-content-layout/page-content-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Got Stats?",
  description: "Player's statistics app for Online Go Server",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-lvh flex flex-col">
        <AppProvider>
          <main className="App min-h-full flex flex-col justify-stretch">
            <Header />
            <PageContentLayout>{children}</PageContentLayout>
            <Footer />
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
