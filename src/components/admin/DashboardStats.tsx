"use client";

import { useMemo, useState } from "react";
import { Package, ShoppingBag, AlertTriangle, DollarSign, Clock3 } from "lucide-react";
import type { Order, Product } from "@/lib/types";
import { formatCLP } from "@/lib/format";

type DashboardStatsProps = {
    products: Product[];
    orders: Order[];
};

type KpiKey = "sales" | "products" | "stock" | "lowStock" | "pending";

export default function DashboardStats({ products, orders }: DashboardStatsProps) {
    const [activeKpi, setActiveKpi] = useState<KpiKey>("sales");

    const stats = useMemo(() => {
        const soldOrders = orders.filter((order) => order.status === "sold");
        const pendingOrders = orders.filter((order) => order.status !== "sold");
        const totalSales = soldOrders.reduce((acc, order) => acc + order.total, 0);
        const lowStockCount = products.filter((p) => p.stock < 3).length;
        const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

        return {
            sales: totalSales,
            products: products.length,
            stock: totalStock,
            lowStock: lowStockCount,
            pending: pendingOrders.length,
            pendingOrders,
            lowStockProducts: products
                .filter((p) => p.stock < 3)
                .sort((a, b) => a.stock - b.stock),
            soldOrders,
        };
    }, [products, orders]);

    const ordersByDay = useMemo(() => {
        const now = new Date();
        const days: Array<{ label: string; count: number }> = [];

        for (let i = 6; i >= 0; i -= 1) {
            const day = new Date(now);
            day.setDate(now.getDate() - i);
            const key = day.toISOString().slice(0, 10);
            const count = orders.filter((order) => order.created_at.slice(0, 10) === key).length;
            const label = day.toLocaleDateString("es-CL", { weekday: "short" });
            days.push({ label, count });
        }
        return days;
    }, [orders]);

    const productsByCategory = useMemo(() => {
        const map = new Map<string, number>();
        for (const product of products) {
            map.set(product.category, (map.get(product.category) ?? 0) + 1);
        }
        return Array.from(map.entries())
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [products]);

    const maxDay = Math.max(...ordersByDay.map((d) => d.count), 1);
    const maxCategory = Math.max(...productsByCategory.map((d) => d.count), 1);

    const kpiCards = [
        {
            key: "sales" as const,
            title: "Ventas Cerradas",
            value: formatCLP(stats.sales),
            icon: DollarSign,
            tone: "text-[var(--accent-strong)] bg-[var(--sand)]",
            hint: `${stats.soldOrders.length} pedidos vendidos`,
        },
        {
            key: "pending" as const,
            title: "Pedidos Pendientes",
            value: String(stats.pending),
            icon: Clock3,
            tone: "text-amber-600 bg-amber-50",
            hint: "Por confirmar pago/venta",
        },
        {
            key: "products" as const,
            title: "Productos",
            value: String(stats.products),
            icon: Package,
            tone: "text-[var(--accent-strong)] bg-[var(--sand)]",
            hint: `${productsByCategory.length} categorias activas`,
        },
        {
            key: "stock" as const,
            title: "Stock Total",
            value: String(stats.stock),
            icon: ShoppingBag,
            tone: "text-[var(--accent-strong)] bg-[var(--sand)]",
            hint: "Unidades publicadas",
        },
        {
            key: "lowStock" as const,
            title: "Stock Bajo",
            value: String(stats.lowStock),
            icon: AlertTriangle,
            tone: "text-red-600 bg-red-50",
            hint: stats.lowStock > 0 ? "Requiere reposicion" : "Sin alertas",
        },
    ];

    const detailPanel = (() => {
        if (activeKpi === "sales") {
            return (
                <div className="space-y-3">
                    <p className="text-sm text-[var(--muted)]">
                        Total vendido sobre pedidos con estado <strong>sold</strong>.
                    </p>
                    <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
                        {stats.soldOrders.slice(0, 12).map((order) => (
                            <li key={order.id} className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-mono text-xs text-[var(--muted)]">
                                        #{order.readable_id || order.id.slice(0, 8)}
                                    </span>
                                    <span className="text-[var(--ink)]">{formatCLP(order.total)}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }

        if (activeKpi === "pending") {
            return (
                <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
                    {stats.pendingOrders.length === 0 ? (
                        <li className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm text-[var(--muted)]">
                            No hay pedidos pendientes.
                        </li>
                    ) : (
                        stats.pendingOrders.slice(0, 12).map((order) => (
                            <li key={order.id} className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-mono text-xs text-[var(--muted)]">
                                        #{order.readable_id || order.id.slice(0, 8)}
                                    </span>
                                    <span className="text-[var(--ink)]">{formatCLP(order.total)}</span>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            );
        }

        if (activeKpi === "lowStock") {
            return (
                <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
                    {stats.lowStockProducts.length === 0 ? (
                        <li className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm text-[var(--muted)]">
                            No hay productos en stock bajo.
                        </li>
                    ) : (
                        stats.lowStockProducts.map((product) => (
                            <li key={product.id} className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="line-clamp-1">{product.name}</span>
                                    <span className="font-semibold text-red-600">{product.stock}</span>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            );
        }

        if (activeKpi === "products") {
            return (
                <ul className="space-y-2">
                    {productsByCategory.map((row) => (
                        <li key={row.category} className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm">
                            <div className="flex items-center justify-between gap-2">
                                <span>{row.category}</span>
                                <span className="font-semibold text-[var(--ink)]">{row.count}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            );
        }

        return (
            <p className="text-sm text-[var(--muted)]">
                Stock total disponible en catalogo. Usa el KPI de stock bajo para priorizar reposicion.
            </p>
        );
    })();

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {kpiCards.map((kpi) => {
                    const Icon = kpi.icon;
                    const selected = activeKpi === kpi.key;
                    return (
                        <button
                            type="button"
                            key={kpi.key}
                            onClick={() => setActiveKpi(kpi.key)}
                            className={`rounded-2xl border bg-[var(--surface)] p-5 text-left transition-all ${selected
                                ? "border-[var(--accent)] shadow-sm"
                                : "border-[var(--line)] hover:border-[var(--accent)]"
                                }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                                        {kpi.title}
                                    </p>
                                    <h3 className="mt-2 font-[var(--font-display)] text-2xl text-[var(--ink)]">
                                        {kpi.value}
                                    </h3>
                                </div>
                                <div className={`rounded-full p-3 ${kpi.tone}`}>
                                    <Icon size={18} />
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-[var(--muted)]">{kpi.hint}</p>
                        </button>
                    );
                })}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                        Pedidos ultimos 7 dias
                    </p>
                    <div className="mt-4 grid grid-cols-7 items-end gap-3">
                        {ordersByDay.map((row) => (
                            <div key={row.label} className="flex flex-col items-center gap-2">
                                <div className="relative h-28 w-full rounded-md bg-[var(--sand)]/40">
                                    <div
                                        className="absolute bottom-0 w-full rounded-md bg-[var(--accent)]"
                                        style={{
                                            height: `${Math.max((row.count / maxDay) * 100, row.count > 0 ? 8 : 2)}%`,
                                        }}
                                    />
                                </div>
                                <span className="text-[10px] uppercase tracking-[0.1em] text-[var(--muted)]">
                                    {row.label}
                                </span>
                                <span className="text-xs text-[var(--ink)]">{row.count}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                        Productos por categoria
                    </p>
                    <div className="mt-4 space-y-3">
                        {productsByCategory.map((row) => (
                            <div key={row.category}>
                                <div className="mb-1 flex items-center justify-between text-xs">
                                    <span className="line-clamp-1">{row.category}</span>
                                    <span>{row.count}</span>
                                </div>
                                <div className="h-2 rounded-full bg-[var(--sand)]/50">
                                    <div
                                        className="h-2 rounded-full bg-[var(--accent)]"
                                        style={{ width: `${(row.count / maxCategory) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                    Detalle KPI
                </p>
                <h3 className="mt-2 font-[var(--font-display)] text-xl text-[var(--ink)]">
                    {kpiCards.find((kpi) => kpi.key === activeKpi)?.title}
                </h3>
                <div className="mt-4">{detailPanel}</div>
            </section>
        </div>
    );
}
