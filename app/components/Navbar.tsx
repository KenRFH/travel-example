"use client";

import { useState, useEffect } from "react";
import { useTranslation, Locale } from "@/src/lib/i18n";

function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

export default function Navbar() {
  const { t, locale, setLocale } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleLanguage = () => {
    setLocale(locale === "id" ? "en" : "id");
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 w-full z-50 glass-nav transition-all duration-300 ${
        scrolled 
          ? "h-16 bg-surface/90 shadow-md" 
          : "h-20 bg-surface/75"
      }`}
      style={{ 
        boxShadow: scrolled ? "0 4px 20px -2px rgba(1,45,29,.08)" : "none",
        borderBottom: "1px solid rgba(1,45,29,0.06)"
      }}
    >
      <div className="flex justify-between items-center w-full px-5 md:px-16 h-full max-w-[1280px] mx-auto">
        {/* Logo */}
        <a href="#" className="text-2xl font-bold text-primary tracking-tight hover:opacity-90 transition-opacity">
          Jember Travel
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-base">
          <a
            className="text-primary font-bold border-b-2 border-primary pb-1 transition-all"
            href="#"
          >
            {t("nav.findTicket")}
          </a>
          <a
            className="text-on-surface-variant hover:text-primary transition-colors font-medium"
            href="#"
          >
            {t("nav.checkBooking")}
          </a>
          <a
            className="text-on-surface-variant hover:text-primary transition-colors font-medium"
            href="#"
          >
            {t("nav.promo")}
          </a>
        </nav>

        {/* Desktop Right Controls */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            id="lang-toggle-desktop"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant text-primary font-semibold hover:bg-primary/5 transition-all text-xs cursor-pointer"
          >
            <MIcon name="language" className="text-sm" />
            <span className={locale === "id" ? "text-primary" : "text-outline"}>ID</span>
            <span className="text-outline">/</span>
            <span className={locale === "en" ? "text-primary" : "text-outline"}>EN</span>
          </button>
          <button className="bg-primary text-on-primary px-6 py-2.5 rounded-2xl text-sm font-semibold tracking-wider uppercase hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
            {t("nav.login")}
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleLanguage}
            id="lang-toggle-mobile"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-outline-variant text-primary font-semibold text-xs cursor-pointer mr-1"
          >
            <MIcon name="language" className="text-xs" />
            <span>{locale.toUpperCase()}</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-primary hover:bg-primary/5 rounded-xl transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            <MIcon name={mobileMenuOpen ? "close" : "menu"} className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[64px] z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden fixed top-[64px] right-0 w-3/4 max-w-[300px] h-[calc(100vh-64px)] bg-white z-50 shadow-2xl p-6 transition-transform duration-300 ease-out transform ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ borderLeft: "1px solid rgba(1,45,29,0.08)" }}
      >
        <div className="flex flex-col h-full justify-between">
          <nav className="flex flex-col space-y-6 text-lg font-medium mt-4">
            <a
              className="text-primary font-bold pb-1 border-b border-primary/10"
              href="#"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.findTicket")}
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors py-1"
              href="#"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.checkBooking")}
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors py-1"
              href="#"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.promo")}
            </a>
          </nav>

          <div className="mb-8">
            <button 
              className="w-full bg-primary text-on-primary py-3.5 rounded-2xl text-sm font-semibold tracking-wider uppercase text-center hover:bg-primary-container transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.login")}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
