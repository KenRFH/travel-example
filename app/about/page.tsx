"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useTranslation } from "@/src/lib/i18n";
import { getCompanyContent } from "@/app/actions/admin";
import Image from "next/image";

function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

export default function AboutPage() {
  const { t, locale } = useTranslation();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    async function loadContent() {
      const data = await getCompanyContent("about");
      if (data) {
        setContent(locale === "id" ? data.contentId : data.contentEn);
      }
    }
    loadContent();
  }, [locale]);

  // Redundant fallback to translation files if database content is not yet seeded/loaded
  const data = content || {
    heroBadge: t("about.hero.badge"),
    heroTitle: t("about.hero.title"),
    heroDesc: t("about.hero.desc"),
    visionTitle: t("about.vision.title"),
    visionDesc: t("about.vision.desc"),
    missionTitle: t("about.mission.title"),
    missionDesc: t("about.mission.desc"),
    valuesTitle: t("about.values.title"),
    valuesSubtitle: t("about.values.subtitle"),
    values: [
      { icon: "volunteer_activism", title: t("about.value1.title"), desc: t("about.value1.desc") },
      { icon: "shield", title: t("about.value2.title"), desc: t("about.value2.desc") },
      { icon: "monetization_on", title: t("about.value3.title"), desc: t("about.value3.desc") }
    ],
    historyTitle: t("about.history.title"),
    historySubtitle: t("about.history.subtitle"),
    history: [
      { year: "2018", title: t("about.history.y2018.title"), desc: t("about.history.y2018.desc") },
      { year: "2020", title: t("about.history.y2020.title"), desc: t("about.history.y2020.desc") },
      { year: "2022", title: t("about.history.y2022.title"), desc: t("about.history.y2022.desc") },
      { year: "2024", title: t("about.history.y2024.title"), desc: t("about.history.y2024.desc") }
    ],
    stats: [
      { icon: "group", count: "1000+", label: t("about.stats.pax.title") },
      { icon: "map", count: "10+", label: t("about.stats.routes.title") },
      { icon: "badge", count: "10+", label: t("about.stats.crew.title") },
      { icon: "sentiment_very_satisfied", count: "93%", label: t("about.stats.satisfaction.title") }
    ]
  };

  return (
    <>
      <Navbar />
      <main className="relative pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[420px] flex items-center justify-center text-white py-20 md:py-32 overflow-hidden rounded-b-[3rem]">
          {/* Background Image & Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            {/* Gradient overlay: Dark green at top, fading to solid white at the bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/40 to-white z-10" />
            <Image
              src="/images/screen.png"
              alt={data.heroTitle}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Batik Pattern Overlay */}
          <div className="absolute inset-0 batik-pattern opacity-10 pointer-events-none z-10" />
          
          <div className="relative z-20 max-w-[1280px] mx-auto px-5 md:px-16 text-center">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-primary-fixed-dim rounded-full text-sm font-semibold tracking-wider uppercase mb-6 backdrop-blur-md border border-white/10">
              {data.heroBadge}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-sm">
              {data.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              {data.heroDesc}
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative z-20 -mt-10 max-w-[1280px] mx-auto px-5 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {data.stats.map((stat: any, index: number) => (
              <div 
                key={index} 
                className="bg-white rounded-3xl p-6 shadow-xl border border-outline-variant/10 flex flex-col items-center text-center hover:scale-[1.03] transition-all duration-300"
                style={{ boxShadow: "0 10px 30px -10px rgba(1,45,29,0.08)" }}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-4">
                  <MIcon name={stat.icon} className="text-2xl" />
                </div>
                <span className="text-3xl font-extrabold text-primary tracking-tight mb-1">{stat.count}</span>
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="napas-section max-w-[1280px] mx-auto px-5 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Vision Card */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-outline-variant/20 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[8rem] z-0 group-hover:scale-110 transition-transform duration-300" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center mb-6 shadow-md shadow-primary/20">
                  <MIcon name="visibility" className="text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">{data.visionTitle}</h3>
                <p className="text-on-surface-variant leading-relaxed font-medium">
                  {data.visionDesc}
                </p>
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-outline-variant/20 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[8rem] z-0 group-hover:scale-110 transition-transform duration-300" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center mb-6 shadow-md shadow-primary/20">
                  <MIcon name="flag" className="text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">{data.missionTitle}</h3>
                <p className="text-on-surface-variant leading-relaxed font-medium">
                  {data.missionDesc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="bg-surface-container-low border-y border-outline-variant/20 py-20">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight">
                {data.valuesTitle}
              </h2>
              <p className="text-on-surface-variant font-medium">
                {data.valuesSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.values.map((value: any, index: number) => (
                <div 
                  key={index} 
                  className="bg-white rounded-3xl p-8 border border-outline-variant/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6">
                    <MIcon name={value.icon} className="text-2xl" />
                  </div>
                  <h4 className="text-xl font-bold text-primary mb-3">{value.title}</h4>
                  <p className="text-on-surface-variant font-medium text-sm leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* History Timeline Section */}
        <section className="napas-section max-w-[1280px] mx-auto px-5 md:px-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight">
              {data.historyTitle}
            </h2>
            <p className="text-on-surface-variant font-medium">
              {data.historySubtitle}
            </p>
          </div>

          <div className="relative border-l border-primary/20 max-w-3xl mx-auto pl-6 md:pl-10 space-y-12">
            {data.history.map((milestone: any, index: number) => (
              <div key={index} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-md group-hover:scale-125 transition-transform duration-300" />
                
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-outline-variant/10 shadow-sm hover:shadow-md transition-all duration-300">
                  <h4 className="text-lg font-bold text-primary mb-2">{milestone.title}</h4>
                  <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                    {milestone.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
