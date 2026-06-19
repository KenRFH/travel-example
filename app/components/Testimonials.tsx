"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/src/lib/i18n";

function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

export default function Testimonials() {
  const { t, locale } = useTranslation();
  const [tIdx, setTIdx] = useState(0);
  const [tFade, setTFade] = useState(false);

  const testimonials = [
    {
      text: locale === "en"
        ? '"The trip from Jember to Malang felt very short because of the extremely comfortable and clean vehicle. The driver was very polite, truly a genuine service from the heart."'
        : '"Perjalanan dari Jember ke Malang terasa sangat singkat karena armada yang sangat nyaman dan wangi. Sopirnya sangat sopan, benar-benar layanan tulus dari hati."',
      name: "Anisa Rahmawati",
      role: locale === "en" ? "Entrepreneur, Jember" : "Pengusaha, Jember",
    },
    {
      text: locale === "en"
        ? '"Honest pricing matching the website. No illegal fees, and the fleet is on time. Highly recommended for business trips."'
        : '"Harga jujur sesuai dengan website. Tidak ada pungutan liar, dan armada tepat waktu. Sangat direkomendasikan untuk perjalanan bisnis."',
      name: "Budi Santoso",
      role: locale === "en" ? "Lecturer, Surabaya" : "Dosen, Surabaya",
    },
  ];

  function cycleTestimonial() {
    setTFade(true);
    setTimeout(() => {
      setTIdx((i) => (i + 1) % testimonials.length);
      setTFade(false);
    }, 250);
  }

  return (
    <section className="napas-section overflow-hidden bg-surface-container-lowest">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Text Side */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] mb-4 block text-primary-container">
                {t("testi.badge")}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-8 tracking-tight">
                {t("testi.title").split("?")[0]} <br />
                {t("testi.title").includes("?") ? t("testi.title").substring(t("testi.title").indexOf("Pelanggan Kami?")) : ""}
                {locale === "en" ? "Customers Say?" : ""}
              </h2>

              {/* Responsive Container without huge empty gap */}
              <div className="relative min-h-[160px] md:min-h-[180px] flex items-center">
                <div
                  className={`testimonial-slide transition-all duration-300 ${
                    tFade
                      ? "opacity-0 -translate-x-4 scale-95"
                      : "opacity-100 translate-x-0 scale-100"
                  }`}
                >
                  <p className="text-lg md:text-xl text-on-surface italic mb-8 leading-relaxed font-medium">
                    {testimonials[tIdx].text}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden relative border border-outline-variant/30">
                      <Image
                        src="/images/testimonial-avatar.jpg"
                        alt={testimonials[tIdx].name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-primary">
                        {testimonials[tIdx].name}
                      </h5>
                      <p className="text-xs text-on-surface-variant font-medium">
                        {testimonials[tIdx].role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8 md:mt-12">
              <button
                onClick={cycleTestimonial}
                className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
                aria-label="Previous testimonial"
              >
                <MIcon name="west" />
              </button>
              <button
                onClick={cycleTestimonial}
                className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
                aria-label="Next testimonial"
              >
                <MIcon name="east" />
              </button>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative hidden md:block">
            <div className="aspect-square bg-primary-fixed/20 rounded-[40px] rotate-3 absolute inset-0 -z-10" />
            <div className="aspect-square bg-white rounded-[40px] shadow-2xl overflow-hidden relative border border-outline-variant/10">
              <Image
                src="/images/interior-van.jpg"
                alt={t("testi.vanAlt")}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
