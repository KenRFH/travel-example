"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation, Locale } from "@/src/lib/i18n";

function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

export default function Navbar() {
  const { t, locale, setLocale } = useTranslation();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLayananOpen, setMobileLayananOpen] = useState(false);

  const isHome = pathname === "/";
  const isAbout = pathname === "/about";
  const isPrivate = pathname === "/layanan/private";
  const isPackages = pathname === "/layanan/antar-paket";
  const isLayanan = pathname.startsWith("/layanan");

  // Keep mobile menu & submenu state in sync on pathname change
  useEffect(() => {
    setMobileLayananOpen(pathname.startsWith("/layanan"));
  }, [pathname]);

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
        <Link href="/" className="text-2xl font-bold text-primary tracking-tight hover:opacity-90 transition-opacity">
          Indo Travel
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-base">
          <Link
            className={isHome ? "text-primary font-bold border-b-2 border-primary pb-1 transition-all" : "text-on-surface-variant hover:text-primary transition-colors font-medium"}
            href="/"
          >
            {t("nav.findTicket")}
          </Link>
          <Link
            className={isAbout ? "text-primary font-bold border-b-2 border-primary pb-1 transition-all" : "text-on-surface-variant hover:text-primary transition-colors font-medium"}
            href="/about"
          >
            {t("nav.aboutUs")}
          </Link>
          
          {/* Dropdown Layanan */}
          <div className="relative group py-2">
            <button
              className={`flex items-center gap-1 cursor-pointer transition-all font-medium ${
                isLayanan 
                  ? "text-primary font-bold border-b-2 border-primary pb-1" 
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {t("nav.services")}
              <MIcon name="expand_more" className="text-xs transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-outline-variant/10 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 origin-top-left z-50">
              <Link
                href="/layanan/private"
                className={`flex items-center gap-2 px-4 py-3 text-sm transition-all hover:bg-primary/5 ${
                  isPrivate ? "text-primary font-bold bg-primary/5" : "text-on-surface-variant font-medium"
                }`}
              >
                <MIcon name="directions_car" className="text-base text-primary/70" />
                {t("nav.services.private")}
              </Link>
              <Link
                href="/layanan/antar-paket"
                className={`flex items-center gap-2 px-4 py-3 text-sm transition-all hover:bg-primary/5 ${
                  isPackages ? "text-primary font-bold bg-primary/5" : "text-on-surface-variant font-medium"
                }`}
              >
                <MIcon name="local_shipping" className="text-base text-primary/70" />
                {t("nav.services.packages")}
              </Link>
            </div>
          </div>
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
            <Link
              className={isHome ? "text-primary font-bold pb-1 border-b border-primary/10" : "text-on-surface-variant hover:text-primary transition-colors py-1"}
              href="/"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.findTicket")}
            </Link>
            <Link
              className={isAbout ? "text-primary font-bold pb-1 border-b border-primary/10" : "text-on-surface-variant hover:text-primary transition-colors py-1"}
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.aboutUs")}
            </Link>
            
            {/* Mobile Dropdown for Layanan */}
            <div className="flex flex-col">
              <button
                onClick={() => setMobileLayananOpen(!mobileLayananOpen)}
                className={`flex items-center justify-between text-left py-1 font-medium transition-colors cursor-pointer ${
                  isLayanan ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"
                }`}
              >
                <span>{t("nav.services")}</span>
                <MIcon name={mobileLayananOpen ? "expand_less" : "expand_more"} className="text-xl text-primary" />
              </button>
              
              {mobileLayananOpen && (
                <div className="flex flex-col pl-4 mt-2 space-y-3 border-l border-primary/10 animate-fade-in">
                  <Link
                    href="/layanan/private"
                    className={`flex items-center gap-2 py-1 text-base transition-colors ${
                      isPrivate ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MIcon name="directions_car" className="text-base text-primary/70" />
                    {t("nav.services.private")}
                  </Link>
                  <Link
                    href="/layanan/antar-paket"
                    className={`flex items-center gap-2 py-1 text-base transition-colors ${
                      isPackages ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MIcon name="local_shipping" className="text-base text-primary/70" />
                    {t("nav.services.packages")}
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
