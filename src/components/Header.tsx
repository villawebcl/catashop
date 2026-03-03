"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useCart } from "@/components/CartContext";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/ofertas", label: "Ofertas" },
];

export default function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Cata
          </span>
          <span className="font-[var(--font-display)] text-xl text-[var(--ink)]">
            Shop
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-[var(--muted)] md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors duration-300 hover:text-[var(--ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/carrito"
            className="relative hidden md:flex items-center rounded-full border border-[var(--line)] px-4 py-2 text-xs text-[var(--ink)] transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Carrito
            {count > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-medium tracking-normal text-white">
                {count}
              </span>
            )}
          </Link>
          <Link
            href="/carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] text-[11px] text-[var(--ink)] md:hidden"
            aria-label="Abrir carrito"
          >
            🛒
            {count > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[9px] font-medium tracking-normal text-white">
                {count}
              </span>
            )}
          </Link>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] text-sm text-[var(--ink)] md:hidden"
            aria-label="Abrir menú"
          >
            {open ? "×" : "≡"}
          </button>
        </div>
      </div>
      <div
        className={`overflow-hidden border-t border-[var(--line)] bg-[var(--surface)] transition-all duration-300 ease-out md:hidden ${open ? "max-h-[360px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <nav className="px-6 py-6 text-sm text-[var(--muted)]">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={`${item.href}-mobile`}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center justify-between rounded-lg border border-[var(--line)] px-5 py-3 text-[var(--ink)] transition-colors hover:border-[var(--accent)]"
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
      {open && (
        <button
          type="button"
          onClick={closeMenu}
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          aria-label="Cerrar menú"
        />
      )}
    </header>
  );
}
