import { normalizePhoneToWhatsApp } from "@/lib/format";

export const WHATSAPP_PHONE = "+56973283737";
export const WHATSAPP_URL = `https://wa.me/${normalizePhoneToWhatsApp(WHATSAPP_PHONE)}`;
