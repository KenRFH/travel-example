"use client";

import { useTranslation } from "@/src/lib/i18n";

function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

export default function CtaSection() {
  const { t } = useTranslation();

  return (
    <section className="max-w-[1280px] mx-auto px-5 md:px-16 mb-24">
      <div 
        className="bg-primary rounded-[32px] p-12 md:p-20 text-center relative overflow-hidden shadow-xl"
        style={{ 
          backgroundColor: "#012d1d", 
          boxShadow: "0 20px 40px -15px rgba(1,45,29,.3)" 
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10 tracking-tight">
          {t("cta.title")}
        </h2>
        <p className="text-white/85 text-lg mb-10 max-w-lg mx-auto relative z-10 leading-relaxed">
          {t("cta.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <a
            href="https://wa.me/6281336104254?text=Halo%20Jember%20Travel,%20saya%20ingin%20tanya-tanya%20mengenai%20rute%20dan%20jadwal."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-transparent text-white border border-white/30 px-8 py-4 rounded-2xl text-sm font-semibold tracking-wider uppercase hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer inline-flex"
          >
            <MIcon name="chat" className="text-lg" /> {t("cta.whatsapp")}
          </a>
        </div>
      </div>
    </section>
  );
}
