"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Edit2, Trash2, Image as ImageIcon, Check, X } from "lucide-react";
import type { Product } from "@/lib/types";
import { uploadProductImage } from "@/lib/supabase/storage";
import { supabase } from "@/lib/supabase/client";
import { canUseOptimizedImage } from "@/lib/image";
import { logger } from "@/lib/logger";

type ProductManagerProps = {
    products: Product[];
    onRefresh: () => void;
};

type ProductFormState = {
    id?: string;
    name: string;
    price: string;
    stock: string;
    category: string;
    code: string;
    detail: string;
    image_url: string;
    is_featured: boolean;
    is_offer: boolean;
};

type ProductPayload = {
    name: string;
    price: number;
    stock: number;
    category: string;
    code: string | null;
    detail: string;
    image_url: string | null;
    is_featured: boolean;
    is_offer: boolean;
    readable_id?: string;
};

const emptyForm: ProductFormState = {
    name: "",
    price: "",
    stock: "",
    category: "",
    code: "",
    detail: "",
    image_url: "",
    is_featured: false,
    is_offer: false,
};

const categoryOptions = [
    "Hogar", "Jardín", "Tecnología", "Escolar", "Regalos",
    "Cuidado personal", "Mascotas", "Cocina", "Decoración", "Otro"
] as const;

export default function ProductManager({ products, onRefresh }: ProductManagerProps) {
    const [form, setForm] = useState<ProductFormState>(emptyForm);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const filteredProducts = useMemo(() => {
        return products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const handleEdit = (product: Product) => {
        setForm({
            id: product.id,
            name: product.name,
            price: String(product.price),
            stock: String(product.stock),
            category: product.category,
            code: product.code ?? "",
            detail: product.detail ?? "",
            image_url: product.image_url ?? "",
            is_featured: Boolean(product.is_featured),
            is_offer: Boolean(product.is_offer),
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (productId: string) => {
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;
        if (!supabase) return;

        const { error } = await supabase.from("products").delete().eq("id", productId);
        if (error) {
            setMessage("Error al eliminar.");
        } else {
            onRefresh();
        }
    };

    const handleUpload = async (file?: File | null) => {
        if (!file) return;
        setUploading(true);
        try {
            const result = await uploadProductImage(file);
            setForm((prev) => ({ ...prev, image_url: result.publicUrl }));
            if (result.optimized) {
                const savedKb = Math.max(1, Math.round((result.originalBytes - result.uploadedBytes) / 1024));
                setMessage(`Imagen optimizada y subida correctamente (ahorro aprox. ${savedKb} KB).`);
            } else {
                setMessage("Imagen subida correctamente.");
            }
        } catch {
            setMessage("No se pudo subir la imagen.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        // Basic validation
        if (!form.name || !form.price || !form.category) {
            setMessage("Nombre, precio y categoría son obligatorios.");
            return;
        }

        if (!supabase) return;

        const payload: ProductPayload = {
            name: form.name,
            price: Number(form.price),
            stock: Number(form.stock),
            category: form.category,
            code: form.code || null,
            detail: form.detail,
            image_url: form.image_url || null,
            is_featured: form.is_featured,
            is_offer: form.is_offer,
        };

        let dbError: { message?: string; details?: string | null } | null = null;

        if (form.id) {
            // Update existing
            const { error } = await supabase.from("products").update(payload).eq("id", form.id);
            dbError = error ? { message: error.message, details: error.details } : null;
        } else {
            // Create new
            // Generate readable_id if not present
            const readable_id = Math.random().toString(36).substring(2, 8).toUpperCase();
            payload.readable_id = readable_id;

            const { error } = await supabase.from("products").insert(payload);
            dbError = error ? { message: error.message, details: error.details } : null;
        }

        if (dbError) {
            const errorDetails = dbError.message || dbError.details || JSON.stringify(dbError);
            logger.warn("admin.product.save_failed", {
                details: errorDetails,
            });
            setMessage(`Error: ${errorDetails}`);
        } else {
            setMessage(form.id ? "Producto actualizado." : "Producto creado.");
            setForm(emptyForm);
            setIsEditing(false);
            onRefresh();
        }
    };

    return (
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Form Section */}
            <div className="card p-8 h-fit">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-[var(--font-display)] text-2xl text-[var(--ink)]">
                        {isEditing ? "Editar Producto" : "Nuevo Producto"}
                    </h2>
                    {isEditing && (
                        <button
                            onClick={() => { setIsEditing(false); setForm(emptyForm); }}
                            className="text-xs uppercase tracking-[0.1em] text-red-500 hover:text-red-700"
                        >
                            Cancelar Edición
                        </button>
                    )}
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl text-sm ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid gap-5 md:grid-cols-2">
                        <input
                            type="text"
                            placeholder="Nombre del producto *"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] transition-all"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Código (opcional)"
                            value={form.code}
                            onChange={e => setForm({ ...form, code: e.target.value })}
                            className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] transition-all"
                        />
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        <input
                            type="number"
                            placeholder="Precio *"
                            value={form.price}
                            onChange={e => setForm({ ...form, price: e.target.value })}
                            className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] transition-all"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Stock *"
                            value={form.stock}
                            onChange={e => setForm({ ...form, stock: e.target.value })}
                            className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] transition-all"
                            required
                        />
                        <select
                            value={form.category}
                            onChange={e => setForm({ ...form, category: e.target.value })}
                            className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] transition-all appearance-none"
                            required
                        >
                            <option value="" disabled>Categoría *</option>
                            {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <textarea
                        placeholder="Detalle o descripción del producto"
                        value={form.detail}
                        onChange={e => setForm({ ...form, detail: e.target.value })}
                        className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] transition-all min-h-[100px]"
                    />

                    {/* Image Upload */}
                    <div className="border border-dashed border-[var(--line)] rounded-lg p-6 text-center">
                        {form.image_url ? (
                            <div className="relative w-32 h-32 mx-auto mb-4">
                                {canUseOptimizedImage(form.image_url) ? (
                                    <Image src={form.image_url} alt="Preview" fill className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={form.image_url} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                )}
                                <button type="button" onClick={() => setForm({ ...form, image_url: "" })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12} /></button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-[var(--muted)] mb-4">
                                <ImageIcon size={32} />
                                <span className="text-xs uppercase tracking-[0.1em]">Arrastra o selecciona una imagen</span>
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={e => handleUpload(e.target.files?.[0])} className="hidden" id="file-upload" />
                        <label htmlFor="file-upload" className="cursor-pointer inline-block bg-[var(--surface)] border border-[var(--line)] px-4 py-2 rounded-lg text-xs uppercase tracking-[0.1em] hover:border-[var(--accent)] transition-colors">
                            {uploading ? "Subiendo..." : "Seleccionar Archivo"}
                        </label>
                    </div>

                    {/* Toggles */}
                    <div className="flex gap-8 py-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${form.is_featured ? "bg-[var(--accent)] border-[var(--accent)]" : "border-[var(--line)]"}`}>
                                {form.is_featured && <Check size={14} className="text-white" />}
                            </div>
                            <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="hidden" />
                            <span className="text-sm text-[var(--ink)] group-hover:text-[var(--accent-strong)]">Destacado</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${form.is_offer ? "bg-[var(--accent)] border-[var(--accent)]" : "border-[var(--line)]"}`}>
                                {form.is_offer && <Check size={14} className="text-white" />}
                            </div>
                            <input type="checkbox" checked={form.is_offer} onChange={e => setForm({ ...form, is_offer: e.target.checked })} className="hidden" />
                            <span className="text-sm text-[var(--ink)] group-hover:text-[var(--accent-strong)]">Oferta</span>
                        </label>
                    </div>

                    <button type="submit" disabled={uploading} className="w-full bg-[var(--accent)] text-white py-4 rounded-lg text-sm font-medium uppercase tracking-[0.1em] hover:bg-[var(--accent-strong)] transition-colors disabled:opacity-50">
                        {isEditing ? "Guardar Cambios" : "Crear Producto"}
                    </button>
                </form>
            </div>

            {/* List Section */}
            <div className="card p-6 h-fit">
                <div className="flex flex-col gap-4 mb-6">
                    <h2 className="font-[var(--font-display)] text-xl text-[var(--ink)]">Inventario</h2>
                    <div className="relative">
                        <label htmlFor="product-search" className="sr-only">
                            Buscar producto por nombre o categoría
                        </label>
                        <input
                            id="product-search"
                            type="text"
                            placeholder="Buscar producto..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-full border border-[var(--line)] text-sm focus:border-[var(--accent)] outline-none"
                        />
                        <Search className="absolute left-3.5 top-3.5 text-[var(--muted)]" size={18} />
                    </div>
                </div>

                <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-10 text-[var(--muted)] text-sm">No se encontraron productos.</div>
                    ) : (
                        filteredProducts.map(product => (
                            <div key={product.id} className="group flex items-center justify-between p-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                        {product.image_url ? (
                                            canUseOptimizedImage(product.image_url) ? (
                                                <Image src={product.image_url} alt={product.name} width={48} height={48} className="w-full h-full object-cover" />
                                            ) : (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                            )
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[var(--muted)]"><ImageIcon size={16} /></div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium text-[var(--ink)] text-sm line-clamp-1">{product.name}</h4>
                                            {product.readable_id && (
                                                <span className="font-mono text-[10px] text-[var(--muted)] bg-[var(--line)] px-1.5 py-0.5 rounded">
                                                    #{product.readable_id}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-[var(--muted)] uppercase tracking-wide">
                                            <span>{product.category}</span>
                                            <span>•</span>
                                            <span>Stock: {product.stock}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(product)} className="p-2 text-[var(--muted)] hover:text-[var(--accent-strong)] hover:bg-[var(--sand)] rounded-full transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(product.id)} className="p-2 text-[var(--muted)] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
