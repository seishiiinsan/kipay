import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = 'https://kipay.app';

export const metadata = {
  title: {
    default: 'Kipay | Les bons comptes font les bons amis',
    template: '%s | Kipay',
  },
  description: "L'application simple et gratuite pour gérer vos dépenses de groupe. Colocations, voyages, couples... Ne vous demandez plus jamais 'Qui paie ?'.",
  keywords: ['gestion de dépenses', 'partage de frais', 'comptes entre amis', 'remboursement', 'dépenses de groupe', 'colocation', 'voyage'],
  openGraph: {
    title: 'Kipay | Les bons comptes font les bons amis',
    description: "L'application simple et gratuite pour gérer vos dépenses de groupe.",
    url: siteUrl,
    siteName: 'Kipay',
    images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630, alt: 'Logo Kipay sur un fond coloré' }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kipay | Les bons comptes font les bons amis',
    description: "L'application simple et gratuite pour gérer vos dépenses de groupe.",
    images: [`${siteUrl}/og-image.jpg`],
    creator: '@votrecompteX',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <AuthProvider>
              {children}
              <Analytics />
              <SpeedInsights />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
