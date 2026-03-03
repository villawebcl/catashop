import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Revisa tu selección y finaliza la coordinación de compra por WhatsApp.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/carrito",
  },
};

export default function CarritoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
