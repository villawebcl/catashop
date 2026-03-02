import type { CustomerDetails } from "@/lib/types";

export const SHIPPING_AGENCIES = [
  "BlueExpress",
  "Chilexpress",
  "Starken",
  "Varmontt",
  "Correos de Chile",
  "Pullman Cargo",
] as const;

const sanitizeText = (value: string, maxLen: number) =>
  value.replace(/\s+/g, " ").trim().slice(0, maxLen);

const normalizePhone = (value: string) => value.replace(/[^\d+]/g, "").slice(0, 16);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rutRegex = /^[0-9.\-kK]{7,16}$/;

export const sanitizeCustomerDetails = (customer: CustomerDetails): CustomerDetails => ({
  name: sanitizeText(customer.name, 80),
  rut: sanitizeText(customer.rut, 16),
  address: sanitizeText(customer.address, 180),
  email: sanitizeText(customer.email, 120).toLowerCase(),
  phone: normalizePhone(customer.phone),
  agency: sanitizeText(customer.agency, 50),
});

export const validateCustomerDetails = (customer: CustomerDetails): string | null => {
  const clean = sanitizeCustomerDetails(customer);

  if (clean.name.length < 2) return "Ingresa un nombre válido.";
  if (!rutRegex.test(clean.rut)) return "Ingresa un RUT válido.";
  if (clean.address.length < 8) return "Ingresa una dirección válida.";
  if (!emailRegex.test(clean.email)) return "Ingresa un correo válido.";
  if (clean.phone.replace(/[^\d]/g, "").length < 8) return "Ingresa un teléfono válido.";
  if (!SHIPPING_AGENCIES.includes(clean.agency as (typeof SHIPPING_AGENCIES)[number])) {
    return "Selecciona una agencia de envío válida.";
  }

  return null;
};
