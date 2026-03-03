"use client";

import { useState } from "react";
import Image from "next/image";
import { formatCLP } from "@/lib/format";
import type { Order } from "@/lib/types";
import { Package, Clock, CheckCircle, Trash2, Check } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { canUseOptimizedImage } from "@/lib/image";
import { logger } from "@/lib/logger";

type OrderManagerProps = {
    orders: Order[];
    onRefresh: () => void;
};

export default function OrderManager({ orders, onRefresh }: OrderManagerProps) {
    const [processing, setProcessing] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleMarkAsSold = async (order: Order) => {
        if (!confirm("¿Marcar como vendido? Esto descontará el stock de los productos.")) return;
        setProcessing(order.id);
        setMessage(null);

        if (!supabase) return;

        try {
            const { error: rpcError } = await supabase.rpc(
                "mark_order_sold_secure",
                { p_order_id: order.id },
            );
            if (rpcError) throw rpcError;

            setMessage("Orden marcada como vendida y stock actualizado.");
            onRefresh();

        } catch (error) {
            logger.error("admin.order.process_failed", error);
            setMessage("Error al procesar la orden.");
        } finally {
            setProcessing(null);
        }
    };

    const handleDelete = async (orderId: string) => {
        if (!confirm("¿Eliminar este pedido permanentemente?")) return;
        if (!supabase) return;

        const { error } = await supabase.from("orders").delete().eq("id", orderId);
        if (error) {
            alert("Error al eliminar pedido.");
        } else {
            onRefresh();
        }
    };

    const handleClearAll = async () => {
        if (!confirm("ADVERTENCIA: ¿Estás seguro de ELIMINAR TODOS los pedidos? Esta acción no se puede deshacer.")) return;
        if (!supabase) return;

        // Supabase delete without where filter is blocked by default usually, but let's try assuming RLS allows or we loop
        // Safer to delete current list IDs to avoid accidental wipe of everything if logic changes
        const ids = orders.map(o => o.id);
        const { error } = await supabase.from("orders").delete().in("id", ids);

        if (error) {
            alert("Error al limpiar pedidos.");
        } else {
            onRefresh();
        }
    };

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-[var(--line)] p-12 text-[var(--muted)]">
                <Package size={32} strokeWidth={1.5} />
                <p className="text-sm">Aún no hay pedidos registrados.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-[0.1em]">{orders.length} Pedidos</h3>
                <button
                    onClick={handleClearAll}
                    className="flex items-center gap-2 text-xs text-red-500 hover:text-red-700 uppercase tracking-[0.1em]"
                >
                    <Trash2 size={14} />
                    Limpiar Todo
                </button>
            </div>

            {message && (
                <div className="p-4 rounded-xl bg-blue-50 text-blue-700 text-sm flex items-center gap-2">
                    <CheckCircle size={16} />
                    {message}
                </div>
            )}

            {orders.map((order) => (
                <div
                    key={order.id}
                    className={`group rounded-lg border bg-[var(--surface)] p-6 transition-all ${order.status === 'sold' ? 'border-green-200 bg-green-50/10' : 'border-[var(--line)] hover:border-[var(--accent)]'}`}
                >
                    <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-4 mb-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>{new Date(order.created_at).toLocaleString("es-CL")}</span>
                                </div>
                                <span className="font-mono text-xs text-[var(--ink)] bg-[var(--line)] px-2 py-0.5 rounded-md">
                                    #{order.readable_id || order.id.slice(0, 8)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="font-[var(--font-display)] text-lg text-[var(--accent-strong)]">
                                    {formatCLP(order.total)}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                {order.status === 'sold' && (
                                    <span className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-lg text-xs uppercase tracking-[0.1em] font-semibold">
                                        <Check size={12} strokeWidth={3} />
                                        Vendido
                                    </span>
                                )}
                                {order.status === 'new' && (
                                    <span className="text-[var(--accent)] bg-[var(--sand)] px-3 py-1 rounded-lg text-xs uppercase tracking-[0.1em] font-semibold">
                                        Nuevo
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {order.status !== 'sold' && (
                                    <button
                                        onClick={() => handleMarkAsSold(order)}
                                        disabled={processing === order.id}
                                        className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                        title="Marcar como vendido y descontar stock"
                                    >
                                        <Check size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(order.id)}
                                    className="text-[var(--muted)] hover:text-red-500 p-2 border border-[var(--line)] rounded-lg hover:bg-red-50 transition-colors"
                                    title="Eliminar pedido"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <ul className="grid gap-3 sm:grid-cols-2">
                        {order.items?.map((item) => (
                            <li
                                key={`${order.id}-${item.id}`}
                                className="flex items-center gap-3 bg-[var(--sand)]/30 p-3 rounded-lg"
                            >
                                {item.image_url ? (
                                    canUseOptimizedImage(item.image_url) ? (
                                        <Image
                                            src={item.image_url}
                                            alt={item.name}
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 shrink-0 rounded-lg object-cover bg-[var(--sand)]"
                                        />
                                    ) : (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="h-10 w-10 shrink-0 rounded-lg object-cover bg-[var(--sand)]"
                                            loading="lazy"
                                            referrerPolicy="no-referrer"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const placeholder = e.currentTarget.nextElementSibling;
                                                if (placeholder) placeholder.classList.remove('hidden');
                                            }}
                                        />
                                    )
                                ) : null}
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-dashed border-[var(--line)] bg-white text-[10px] uppercase tracking-[0.1em] text-[var(--muted)] ${item.image_url ? 'hidden' : ''}`}>
                                    Sin
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-sm font-medium text-[var(--ink)] truncate">{item.name}</span>
                                    <span className="text-xs text-[var(--muted)]">Cant: {item.quantity}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
