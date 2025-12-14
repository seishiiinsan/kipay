import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// URL de base de votre site (à remplacer par votre domaine de production)
const siteUrl = 'https://kipay.app'; // Exemple

export const metadata = {
  title: {
    default: 'Kipay | Les bons comptes font les bons amis',
    template: '%s | Kipay',
  },
  description: "L'application simple et gratuite pour gérer vos dépenses de groupe. Colocations, voyages, couples... Ne vous demandez plus jamais 'Qui paie ?'.",
  keywords: ['gestion de dépenses', 'partage de frais', 'comptes entre amis', 'remboursement', 'dépenses de groupe', 'colocation', 'voyage'],
  
  // Open Graph (pour Facebook, WhatsApp, etc.)
  openGraph: {
    title: 'Kipay | Les bons comptes font les bons amis',
    description: "L'application simple et gratuite pour gérer vos dépenses de groupe.",
    url: siteUrl,
    siteName: 'Kipay',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`, // IMPORTANT: Remplacez par votre image
        width: 1200,
        height: 630,
        alt: 'Logo Kipay sur un fond coloré',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Kipay | Les bons comptes font les bons amis',
    description: "L'application simple et gratuite pour gérer vos dépenses de groupe.",
    images: [`${siteUrl}/og-image.jpg`], // IMPORTANT: Remplacez par votre image
    creator: '@votrecompteX', // Mettez votre pseudo Twitter si vous en avez un
  },

  // Favicons et icônes
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  
  // Robots (pour le référencement)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
