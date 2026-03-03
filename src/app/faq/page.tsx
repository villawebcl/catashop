"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/faq";

export default function FAQPage() {
    return (
        <section className="section px-6 sm:px-10 py-20 min-h-[70vh]">
            <div className="mx-auto w-full max-w-3xl">
                <div className="mb-12 text-center">
                    <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)] mb-3">
                        Resolver dudas
                    </p>
                    <h1 className="font-[var(--font-display)] text-4xl text-[var(--ink)] md:text-5xl">
                        Preguntas Frecuentes
                    </h1>
                </div>

                <div className="flex flex-col gap-4">
                    {FAQ_ITEMS.map((faq, index) => (
                        <FAQItem key={index} faq={faq} />
                    ))}
                </div>
                <p className="mt-8 text-center text-xs text-[var(--muted)]">
                    Política resumida. Ante cualquier caso, aplica además la normativa vigente y las condiciones informadas al confirmar el pedido por WhatsApp.
                </p>
            </div>
        </section>
    );
}

function FAQItem({ faq }: { faq: { question: string; answer: string } }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-[var(--line)] rounded-2xl bg-[var(--surface)] overflow-hidden transition-all duration-300 hover:border-[var(--accent)]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between p-6 text-left"
            >
                <span className="font-[var(--font-display)] text-lg text-[var(--ink)]">
                    {faq.question}
                </span>
                <span className="ml-4 text-[var(--accent)]">
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 pb-6 text-sm leading-relaxed text-[var(--muted)]">
                            {faq.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
