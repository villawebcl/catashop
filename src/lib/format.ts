import type { CartItem, CustomerDetails } from "@/lib/types";

const cleanForWhatsAppLine = (value: string) =>
  value.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();

export const formatCLP = (value: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);

export const normalizePhoneToWhatsApp = (phone: string) =>
  phone.replace(/[^\d]/g, "");

export const buildWhatsAppMessage = (
  items: CartItem[],
  total: number,
  customer?: CustomerDetails,
  orderId?: string,
) => {
  const lines = items.map(
    (item) =>
      `• ${cleanForWhatsAppLine(item.name)} x${item.quantity} (${formatCLP(item.price * item.quantity)})`,
  );

  let message = [
    orderId ? `*PEDIDO ${orderId}*` : "",
    "Hola! Quiero coordinar la compra de estos productos:",
    ...lines,
    `Total: ${formatCLP(total)}`,
  ];

  if (customer) {
    message = [
      ...message,
      "",
      "------------------",
      "*Datos de Envío*",
      `Nombre: ${cleanForWhatsAppLine(customer.name)}`,
      `RUT: ${cleanForWhatsAppLine(customer.rut)}`,
      `Dirección: ${cleanForWhatsAppLine(customer.address)}`,
      `Email: ${cleanForWhatsAppLine(customer.email)}`,
      `Teléfono: ${cleanForWhatsAppLine(customer.phone)}`,
      `Agencia: ${cleanForWhatsAppLine(customer.agency)}`,
      "------------------",
    ];
  }

  return message.join("\n");
};
