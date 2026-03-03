import type { CustomerDetails } from "@/lib/types";
import { SHIPPING_AGENCIES, sanitizeCustomerDetails } from "@/lib/checkout";

const CHECKOUT_DRAFT_KEY = "catashop-checkout-draft-v1";
const CHECKOUT_DRAFT_TTL_MS = 24 * 60 * 60 * 1000;

type CheckoutDraftPayload = {
  data: CustomerDetails;
  savedAt: number;
};

const isValidDraft = (value: unknown): value is CustomerDetails => {
  if (!value || typeof value !== "object") return false;
  const draft = value as Record<string, unknown>;

  if (
    typeof draft.name !== "string" ||
    typeof draft.rut !== "string" ||
    typeof draft.address !== "string" ||
    typeof draft.email !== "string" ||
    typeof draft.phone !== "string" ||
    typeof draft.agency !== "string"
  ) {
    return false;
  }

  return SHIPPING_AGENCIES.includes(
    draft.agency as (typeof SHIPPING_AGENCIES)[number],
  );
};

const isValidPayload = (value: unknown): value is CheckoutDraftPayload => {
  if (!value || typeof value !== "object") return false;
  const payload = value as Record<string, unknown>;

  if (typeof payload.savedAt !== "number") return false;
  return isValidDraft(payload.data);
};

export const loadCheckoutDraft = (): CustomerDetails | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CHECKOUT_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidPayload(parsed)) return null;

    const expired = Date.now() - parsed.savedAt > CHECKOUT_DRAFT_TTL_MS;
    if (expired) {
      clearCheckoutDraft();
      return null;
    }

    return sanitizeCustomerDetails(parsed.data);
  } catch {
    return null;
  }
};

export const saveCheckoutDraft = (value: CustomerDetails) => {
  if (typeof window === "undefined") return;
  const clean = sanitizeCustomerDetails(value);
  const payload: CheckoutDraftPayload = {
    data: clean,
    savedAt: Date.now(),
  };
  window.localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(payload));
};

export const clearCheckoutDraft = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CHECKOUT_DRAFT_KEY);
};
