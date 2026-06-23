"use client";

import Link from "next/link";
import { useTranslation } from "@/src/lib/i18n";

function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/30 w-full py-16 md:py-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 px-5 md:px-16 max-w-[1280px] mx-auto">
        {/* Brand */}
        <div className="col-span-1">
          <div className="text-xl font-bold text-primary mb-4">
            Jember Travel
          </div>
          <p className="text-on-surface-variant mb-6 leading-relaxed">
            {t("footer.desc")}
          </p>
        </div>

        {/* Company */}
        <div>
          <h6 className="text-sm font-bold text-primary mb-6 uppercase tracking-wider">
            {t("footer.col1.title")}
          </h6>
          <ul className="space-y-4">
            {[
              { label: t("footer.col1.link1"), href: "/about" },
              { label: t("footer.col1.link2_private"), href: "/layanan/private" },
              { label: t("footer.col1.link2_packages"), href: "/layanan/antar-paket" },
              { label: t("footer.col1.link3"), href: "#" },
            ].map((item, i) => (
              <li key={i}>
                <Link
                  className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all inline-block font-medium"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h6 className="text-sm font-bold text-primary mb-6 uppercase tracking-wider">
            {t("footer.col2.title")}
          </h6>
          <ul className="space-y-4">
            {[
              { label: t("footer.col2.link1"), href: "#" },
              { label: t("footer.col2.link2"), href: "#" },
              { label: t("footer.col2.link3"), href: "#" },
            ].map((item, i) => (
              <li key={i}>
                <a
                  className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all inline-block font-medium"
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h6 className="text-sm font-bold text-primary mb-6 uppercase tracking-wider">
            {t("footer.col3.title")}
          </h6>
          <ul className="space-y-4">
            <li className="flex items-center gap-2 text-on-surface-variant font-medium">
              <MIcon name="call" className="text-lg text-primary" /> +62 813 3610 4254
            </li>
            <li className="flex items-center gap-2 text-on-surface-variant font-medium">
              <MIcon name="mail" className="text-lg text-primary" /> support@jembertravel.com
            </li>
            <li className="pt-2">
              <a
                className="text-primary font-bold flex items-center gap-2 hover:translate-x-1 transition-all"
                href="https://wa.me/6281336104254?text=Halo%20Jember%20Travel,%20saya%20membutuhkan%20bantuan%20support."
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Support
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-16 mt-16 md:mt-20 pt-8 border-t border-outline-variant/10 text-center text-on-surface-variant font-medium text-sm">
        {t("footer.copyright")}
      </div>
    </footer>
  );
}
