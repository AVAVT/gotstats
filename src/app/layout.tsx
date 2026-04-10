import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import SideBar from "@/components/sidebar/side-bar";

import "./globals.css";
import AppProvider from "@/redux/provider";

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
      <body className="min-h-full flex flex-col">
        <AppProvider>
          <main className="App">
            <Header />
            <div className="container flex flex-col md:flex-row">
              <SideBar />
              {children}
            </div>
            <Footer />
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
