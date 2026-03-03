import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes",
  description: "Resuelve dudas sobre pagos, envíos y proceso de compra por WhatsApp en Catashop.",
  alternates: {
    canonical: "/faq",
  },
};

export default function FaqLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
