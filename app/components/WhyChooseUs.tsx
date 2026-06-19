"use client";

import { useTranslation } from "@/src/lib/i18n";

function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

export default function WhyChooseUs() {
  const { t } = useTranslation();

  const features = [
    {
      icon: "favorite",
      title: t("why.card1.title"),
      desc: t("why.card1.desc"),
    },
    {
      icon: "airport_shuttle",
      title: t("why.card2.title"),
      desc: t("why.card2.desc"),
    },
    {
      icon: "verified",
      title: t("why.card3.title"),
      desc: t("why.card3.desc"),
    },
  ];

  return (
    <section className="napas-section batik-pattern">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
            {t("why.badge")}
          </h2>
          <p className="text-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            {t("why.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-outline-variant/10 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-8">
                <MIcon name={f.icon} className="text-primary text-3xl" />
              </div>
              <h3 className="text-2xl font-semibold text-primary mb-4">
                {f.title}
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
