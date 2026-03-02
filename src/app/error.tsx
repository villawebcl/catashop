"use client";

import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Unhandled app error:", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <section className="section px-6 sm:px-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="card p-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Error
          </p>
          <h1 className="mt-3 font-[var(--font-display)] text-3xl text-[var(--ink)]">
            Ocurrió un problema inesperado
          </h1>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Intenta nuevamente. Si el problema persiste, contáctanos por WhatsApp.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full bg-[var(--accent)] px-6 py-3 text-xs uppercase tracking-[0.3em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
          >
            Reintentar
          </button>
        </div>
      </div>
    </section>
  );
}
