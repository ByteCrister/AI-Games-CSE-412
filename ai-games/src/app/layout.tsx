import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'AI Games by Sadiqul Islam Shakib',
    template: '%s | AI Games by Sadiqul Islam Shakib'
  },
  description: 'AI Games website, a Next.js-based web application that implements three classic board games with AI opponents: Chess, Tic-Tac-Toe, and Reversi (Othello). The system demonstrates sophisticated AI algorithms including Minimax and Alpha-Beta Pruning, implemented with varying difficulty levels to provide engaging gameplay experiences.',
  metadataBase: new URL('https://ai-games-cse-412.vercel.app/'),
  openGraph: {
    title: 'AI Games by Sadiqul Islam Shakib',
    description: 'AI Games website, a Next.js-based web application that implements three classic board games with AI opponents: Chess, Tic-Tac-Toe, and Reversi (Othello). The system demonstrates sophisticated AI algorithms including Minimax and Alpha-Beta Pruning, implemented with varying difficulty levels to provide engaging gameplay experiences.',
    url: 'https://ai-games-cse-412.vercel.app/',
    siteName: 'AI Games by Sadiqul Islam Shakib',
    images: [
      {
        url: '/images/shakib.jpg',
        width: 1200,
        height: 630,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Games by Sadiqul Islam Shakib',
    description: 'AI Games website, a Next.js-based web application that implements three classic board games with AI opponents: Chess, Tic-Tac-Toe, and Reversi (Othello). The system demonstrates sophisticated AI algorithms including Minimax and Alpha-Beta Pruning, implemented with varying difficulty levels to provide engaging gameplay experiences.',
    // creator: '@YourTwitterHandle',
    images: ['/images/shakib.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
        {children}
        <Footer />
      </body>
    </html>
  );
}
