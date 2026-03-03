import Link from "next/link";
import SearchableProductGrid from "@/components/SearchableProductGrid";
import { WHATSAPP_URL } from "@/lib/contact";

export default function Home() {
  return (
    <div className="fade-in">
      <section className="section px-6 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-col justify-center gap-6">
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
              Catashop · Santo Domingo · Chile
            </p>
            <h1 className="font-[var(--font-display)] text-4xl leading-tight text-[var(--ink)] md:text-5xl lg:text-6xl">
              Todo lo esencial para tu día a día
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-[var(--muted)]">
              Variedad práctica en un solo lugar. Coordinamos pago y
              entrega por WhatsApp en minutos.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={WHATSAPP_URL}
                className="rounded-lg bg-[var(--accent)] px-8 py-4 text-sm font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-[var(--accent-strong)]"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pedir por WhatsApp
              </a>
              <Link
                href="/productos"
                className="rounded-lg border-2 border-[var(--line)] px-8 py-4 text-sm font-medium text-[var(--ink)] transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Ver Productos
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                Envíos a todo Chile
              </span>
              <span className="hidden h-4 w-px bg-[var(--line)] sm:block" />
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                Respuesta rápida
              </span>
              <span className="hidden h-4 w-px bg-[var(--line)] sm:block" />
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                Stock actualizado
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-[var(--surface)] px-4 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <SearchableProductGrid
            mode="all"
            title="Colección"
            description="Encuentra lo que necesitas y coordina tu compra por WhatsApp."
          />
        </div>
      </section>

      <section className="section bg-[var(--surface)] px-6 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                Cómo comprar
              </p>
              <h2 className="font-[var(--font-display)] text-3xl text-[var(--ink)] md:text-4xl">
                Así de simple
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--muted)]">
                Agrega productos al carrito y finaliza por WhatsApp para
                coordinar pago y envío.
              </p>
            </div>
            <div className="grid w-full gap-3 md:max-w-md">
              {[
                "Explora y agrega al carrito",
                "Revisa tu selección",
                "Finaliza por WhatsApp",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-5 py-4"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-[var(--ink)]">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section px-6">
        <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-3">
          {[
            {
              title: "Stock actualizado",
              text: "Confirmamos disponibilidad antes de coordinar tu envío.",
            },
            {
              title: "Atención local",
              text: "Rapidez en cada coordinación por WhatsApp desde Santo Domingo.",
            },
            {
              title: "Envíos a todo Chile",
              text: "Despachamos a cualquier región con seguimiento.",
            },
          ].map((item) => (
            <div key={item.title} className="card p-6">
              <h3 className="font-[var(--font-display)] text-lg text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
