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
  },
  twitter: {
    card: "summary_large_image",
    title: "Catashop - Tienda de Variedad",
    description: "Variedad práctica y bonita en un solo lugar. Coordinamos pago y entrega por WhatsApp en minutos.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
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
