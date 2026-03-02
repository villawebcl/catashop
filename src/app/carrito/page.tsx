"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";
import {
  buildWhatsAppMessage,
  formatCLP,
  normalizePhoneToWhatsApp,
} from "@/lib/format";
import { supabase } from "@/lib/supabase/client";
import CheckoutForm from "@/components/CheckoutForm";
import type { CartItem, CreateOrderSecureResponse, CustomerDetails } from "@/lib/types";
import { sanitizeCustomerDetails, validateCustomerDetails } from "@/lib/checkout";
import { getOrCreateCheckoutClientKey, toCheckoutItemPayload } from "@/lib/order";

const vendorPhone = "+56932422471";

export default function CarritoPage() {
  const { items, total, updateQuantity, removeItem, clear } = useCart();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const generateOrderId = () => {
    // Generate a 6-character random alphanumeric string, uppercase
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleWhatsApp = async (customer: CustomerDetails) => {
    if (items.length === 0) return;
    const cleanCustomer = sanitizeCustomerDetails(customer);
    const validationError = validateCustomerDetails(cleanCustomer);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);

    const orderId = generateOrderId();
    let finalItems: CartItem[] = items;
    let finalTotal = total;

    // Intentamos guardar por RPC segura, pero no bloqueamos venta si falla.
    if (supabase) {
      const { data, error: createOrderError } = await supabase.rpc(
        "create_order_secure",
        {
          p_items: toCheckoutItemPayload(items),
          p_customer_details: cleanCustomer,
          p_readable_id: orderId,
          p_client_key: getOrCreateCheckoutClientKey(),
        },
      );

      if (createOrderError) {
        console.error("Error creando pedido seguro en Supabase:", createOrderError);
      } else if (Array.isArray(data) && data.length > 0) {
        const secureOrder = data[0] as CreateOrderSecureResponse;
        finalItems = secureOrder.order_items ?? items;
        finalTotal = Number(secureOrder.order_total ?? total);
      }
    }

    const message = buildWhatsAppMessage(finalItems, finalTotal, cleanCustomer, orderId);
    const whatsappPhone = normalizePhoneToWhatsApp(vendorPhone);
    const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
      message,
    )}`;

    clear();
    window.open(url, "_blank", "noopener,noreferrer");
    setSaving(false);
  };

  const handleInitialCheckout = () => {
    setShowCheckoutForm(true);
  };

  const handleCancelCheckout = () => {
    setShowCheckoutForm(false);
  };

  return (
    <section className="section px-6 sm:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">
            Carrito
          </p>
          <h1 className="font-[var(--font-display)] text-3xl text-[var(--ink)] md:text-4xl">
            Tu selección
          </h1>
          <p className="max-w-2xl text-sm text-[var(--muted)]">
            Al finalizar, se generará un mensaje automático por WhatsApp para
            coordinar pago y envío.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="card p-6">
            {items.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">
                Aún no agregas productos al carrito.
              </p>
            ) : showCheckoutForm ? (
              <div>
                <h2 className="mb-6 font-[var(--font-display)] text-xl text-[var(--ink)]">
                  Datos de Envío
                </h2>
                <CheckoutForm
                  onSubmit={handleWhatsApp}
                  onCancel={handleCancelCheckout}
                  total={formatCLP(total)}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 border-b border-[var(--line)] pb-6 last:border-b-0 last:pb-0 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-16 w-16 rounded-[18px] object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-[18px] border border-dashed border-[var(--line)] text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                          Sin imagen
                        </div>
                      )}
                      <div>
                        <p className="font-[var(--font-display)] text-lg text-[var(--ink)]">
                          {item.name}
                        </p>
                        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                          {item.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          max={item.stock}
                          value={item.quantity}
                          onChange={(event) =>
                            updateQuantity(item.id, Number(event.target.value))
                          }
                          className="w-20 rounded-full border border-[var(--line)] px-3 py-2 text-base text-center sm:w-24"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                            className="h-10 w-10 rounded-full border border-[var(--line)] text-base text-[var(--ink)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
                            aria-label="Restar cantidad"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                            className="h-10 w-10 rounded-full border border-[var(--line)] text-base text-[var(--ink)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Sumar cantidad"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
                          Stock: {item.stock}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:justify-start">
                        <span className="text-sm text-[var(--accent-strong)]">
                          {formatCLP(item.price * item.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] hover:text-[var(--accent-strong)]"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!showCheckoutForm && (
            <div className="card h-fit p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Resumen
              </p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span>Total</span>
                <span className="text-lg text-[var(--accent-strong)]">
                  {formatCLP(total)}
                </span>
              </div>
              {error && (
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-red-600">
                  {error}
                </p>
              )}
              <button
                type="button"
                disabled={items.length === 0 || saving}
                onClick={handleInitialCheckout}
                className="mt-6 w-full rounded-full bg-[var(--accent)] px-6 py-3 text-xs uppercase tracking-[0.3em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Generando..." : "Continuar Compra"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
