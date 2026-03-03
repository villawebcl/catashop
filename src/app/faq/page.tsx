"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function FAQPage() {
    const faqs = [
        {
            question: "¿Cómo compro en Catashop?",
            answer:
                "Es muy simple. Agrega los productos que te gusten a tu carrito. Cuando estés lista/o, ve al carrito y presiona 'Finalizar por WhatsApp'. Esto abrirá un chat con nosotros con el detalle de tu pedido para coordinar el pago y el envío.",
        },
        {
            question: "¿Qué métodos de pago aceptan?",
            answer:
                "Aceptamos transferencias bancarias a nuestra cuenta vista/corriente. Los datos te los enviaremos por WhatsApp al confirmar tu pedido.",
        },
        {
            question: "¿Realizan envíos a todo Chile?",
            answer:
                "Sí, realizamos envíos a todo Chile a través de Starken o Chilexpress (por pagar). Si eres de Santo Domingo o San Antonio, podemos coordinar una entrega más directa.",
        },
        {
            question: "¿Cuánto demora el envío?",
            answer:
                "Generalmente despachamos dentro de las 24-48 horas hábiles siguientes a la confirmación del pago. El tiempo de tránsito depende de la empresa de transporte.",
        },
        {
            question: "¿Tienen tienda física?",
            answer:
                "Por el momento operamos 100% online desde Santo Domingo, pero nos aseguramos de que tu experiencia de compra sea cálida y cercana.",
        },
        {
            question: "¿Qué pasa si un producto no me gusta?",
            answer:
                "Por políticas comerciales, no realizamos cambios ni devoluciones por gusto personal o error de compra del cliente (por ejemplo: color, talla, modelo o compatibilidad elegida por el cliente). Si tienes dudas antes de comprar, te asesoramos por WhatsApp para evitar errores.",
        },
        {
            question: "¿Cuál es la política de cambios por falla o producto defectuoso?",
            answer:
                "Si el producto presenta falla de fabricación, puedes solicitar revisión dentro de los primeros 10 días corridos desde la recepción. Evaluaremos el caso y, si corresponde, gestionaremos cambio, reparación o devolución según disponibilidad y la normativa aplicable.",
        },
        {
            question: "¿En qué condiciones se acepta un cambio o revisión?",
            answer:
                "El producto debe venir completo, sin intervención de terceros, sin daños por mal uso, con accesorios y empaque original cuando aplique. No cubre daños por instalación incorrecta, golpes, humedad, uso fuera de especificación o desgaste normal.",
        },
        {
            question: "¿Cómo se gestionan envíos en cambios o garantías?",
            answer:
                "Cuando se confirma falla atribuible al producto, Catashop asume el costo logístico razonable de reposición. Si la revisión descarta falla de fabricación o se detecta mal uso, el costo de envío/reenvío es del cliente.",
        },
        {
            question: "¿Cómo solicitar un cambio o garantía?",
            answer:
                "Escríbenos por WhatsApp con número de pedido, fotos/videos del problema y una breve descripción. Te responderemos con los pasos y plazos de resolución. La atención se realiza por orden de ingreso y en horario hábil.",
        },
    ];

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
                    {faqs.map((faq, index) => (
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
