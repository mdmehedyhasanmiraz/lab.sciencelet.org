import type { Metadata } from "next";
import { Geist_Mono, Funnel_Sans } from "next/font/google";
import "./globals.css";
import ogImage from './opengraph-image.png';

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const funnelSans = Funnel_Sans({
  variable: "--font-funnel-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bioinformatics Lab",
    template: "%s | Oimi",
  },
  description: "Oimi Bioinformatics Lab is a research lab that focuses on the application of computational methods to biological data.",
  metadataBase: new URL("https://lab.oimi.io"),
  keywords: [
    "medicinal plants bangladesh",
    "plant directory",
    "medicinal plant directory",
    "medicinal plant directory bangladesh",
    "bangladesh medicinal plants",
    "bangladesh medicinal plant directory",
    "bangladesh medicinal plant directory of bangladesh",
    "bangladesh plant directory",
    "plant directory of bangladesh",
  ],
  openGraph: {
    title: {
      default: "Bioinformatics Lab",
      template: "%s | Oimi",
    },
    description: "Oimi Bioinformatics Lab is a research lab that focuses on the application of computational methods to biological data.",
    url: "https://lab.oimi.io",
      siteName: 'Oimi',
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height
      },
    ],
    type: "website",
  },
  twitter: {
    title: {
      default: "Bioinformatics Lab",
      template: "%s | Oimi",
    },
    description: "Oimi Bioinformatics Lab is a research lab that focuses on the application of computational methods to biological data.",
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} ${funnelSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
