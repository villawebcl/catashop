import type { Metadata } from "next";
import { Playfair_Display, Work_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import RouteTransition from "@/components/RouteTransition";
import { getSiteUrl } from "@/lib/siteUrl";

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Catashop - Tienda de Variedad",
    template: "%s | Catashop",
  },
  alternates: {
    canonical: "/",
  },
  description:
    "Catashop: tienda de variedad con estilo minimalista, ofertas cálidas y compra rápida por WhatsApp.",
  openGraph: {
    title: "Catashop - Tienda de Variedad",
    description: "Variedad práctica y bonita en un solo lugar. Coordinamos pago y entrega por WhatsApp en minutos.",
    url: siteUrl,
    siteName: "Catashop",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: `${siteUrl}/icon-512.png`,
        width: 512,
        height: 512,
        alt: "Catashop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Catashop - Tienda de Variedad",
    description: "Variedad práctica y bonita en un solo lugar. Coordinamos pago y entrega por WhatsApp en minutos.",
    images: [`${siteUrl}/icon-512.png`],
  },
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon-32.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Catashop",
    url: siteUrl,
    logo: `${siteUrl}/icon-512.png`,
    sameAs: ["https://wa.me/56973283737"],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Catashop",
    url: siteUrl,
    inLanguage: "es-CL",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/productos?buscar={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="es">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <CartProvider>
          <div className="page-shell">
            <Header />
            <main className="flex-1">
              <RouteTransition>{children}</RouteTransition>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
