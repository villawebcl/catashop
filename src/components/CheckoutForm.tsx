import { useState } from "react";
import type { CustomerDetails } from "@/lib/types";
import {
    sanitizeCustomerDetails,
    SHIPPING_AGENCIES,
    validateCustomerDetails,
} from "@/lib/checkout";

type CheckoutFormProps = {
    onSubmit: (data: CustomerDetails) => void;
    onCancel: () => void;
    total: string;
};

export default function CheckoutForm({
    onSubmit,
    onCancel,
    total,
}: CheckoutFormProps) {
    const [formData, setFormData] = useState<CustomerDetails>({
        name: "",
        rut: "",
        address: "",
        email: "",
        phone: "",
        agency: SHIPPING_AGENCIES[0],
    });
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const clean = sanitizeCustomerDetails(formData);
        const validationError = validateCustomerDetails(clean);
        if (validationError) {
            setSubmitError(validationError);
            return;
        }
        setSubmitError(null);
        onSubmit(clean);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                        Nombre Completo
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="rounded-[18px] border border-[var(--line)] bg-transparent px-4 py-3 text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
                        placeholder="Juan Pérez"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="rut" className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                        RUT
                    </label>
                    <input
                        type="text"
                        id="rut"
                        name="rut"
                        required
                        value={formData.rut}
                        onChange={handleChange}
                        className="rounded-[18px] border border-[var(--line)] bg-transparent px-4 py-3 text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
                        placeholder="12.345.678-9"
                    />
                </div>

                <div className="col-span-full flex flex-col gap-2">
                    <label htmlFor="address" className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                        Dirección de Envío
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="rounded-[18px] border border-[var(--line)] bg-transparent px-4 py-3 text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
                        placeholder="Calle Principal 123, Comuna, Ciudad"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="rounded-[18px] border border-[var(--line)] bg-transparent px-4 py-3 text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
                        placeholder="juan@ejemplo.com"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                        Teléfono Móvil
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="rounded-[18px] border border-[var(--line)] bg-transparent px-4 py-3 text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
                        placeholder="+56 9 1234 5678"
                    />
                </div>

                <div className="col-span-full flex flex-col gap-2">
                    <label htmlFor="agency" className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                        Agencia de Envío
                    </label>
                    <select
                        id="agency"
                        name="agency"
                        required
                        value={formData.agency}
                        onChange={handleChange}
                        className="rounded-[18px] border border-[var(--line)] bg-transparent px-4 py-3 text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none appearance-none"
                    >
                        {SHIPPING_AGENCIES.map((agency) => (
                            <option key={agency} value={agency} className="text-black">
                                {agency}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-4">
                {submitError && (
                    <p className="text-center text-xs uppercase tracking-[0.1em] text-red-600">
                        {submitError}
                    </p>
                )}
                <p className="text-center text-xs text-[var(--muted)]">
                    Total a confirmar: <span className="text-[var(--ink)] font-bold">{total}</span>
                </p>
                <button
                    type="submit"
                    className="w-full rounded-full bg-[var(--accent)] px-6 py-4 text-xs uppercase tracking-[0.3em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
                >
                    Confirmar y Enviar a WhatsApp
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full text-xs uppercase tracking-[0.3em] text-[var(--muted)] hover:text-[var(--ink)]"
                >
                    Volver al Carrito
                </button>
            </div>
        </form>
    );
}
