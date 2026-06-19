"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/src/lib/i18n";
import { getDistinctCities } from "@/app/actions/admin";

function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

export default function HeroSection() {
  const { t } = useTranslation();
  const router = useRouter();

  const [origins, setOrigins] = useState<string[]>(["Jember"]);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [fromCity, setFromCity] = useState("Jember");
  const [toCity, setToCity] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    async function loadCities() {
      try {
        const { origins: orgs, destinations: dests } = await getDistinctCities();
        if (orgs.length > 0) {
          setOrigins(orgs);
          setFromCity(orgs[0]);
        }
        if (dests.length > 0) {
          setDestinations(dests);
          setToCity(dests[0]);
        }
      } catch (err) {
        console.error("Failed to load distinct cities:", err);
      }
    }
    loadCities();
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setValidationError("");

    if (!fromCity) {
      setValidationError("Silakan pilih kota asal");
      return;
    }
    if (!toCity) {
      setValidationError("Silakan pilih kota tujuan");
      return;
    }
    if (!travelDate) {
      setValidationError("Silakan pilih tanggal keberangkatan");
      return;
    }

    // Redirect to search results page
    const query = new URLSearchParams({
      from: fromCity,
      to: toCity,
      date: travelDate,
    });
    router.push(`/search?${query.toString()}`);
  }

  return (
    <section className="relative min-h-[921px] flex items-center pt-20 overflow-hidden rounded-b-[3rem]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent z-10" />
        <Image
          src="/images/hero-bg1.jpg"
          alt={t("hero.subtitle")}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-[1280px] mx-auto px-5 md:px-16 py-12 md:py-24">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary-fixed-dim rounded-full text-sm font-semibold tracking-wider uppercase mb-6 backdrop-blur-md border border-primary/20">
            {t("hero.badge")}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            {t("hero.title1")} <br />
            {t("hero.title2")}
          </h1>
          <p className="text-lg text-white/95 mb-12 max-w-lg leading-relaxed">
            {t("hero.subtitle")}
          </p>
        </div>

        {/* Search Widget */}
        <form 
          onSubmit={handleSearch}
          className="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl max-w-5xl mt-8 space-y-4"
          style={{ boxShadow: "0 25px 50px -12px rgba(1,45,29,.15)" }}
        >
          {validationError && (
            <div className="p-3.5 bg-error-container text-on-error-container rounded-xl text-xs font-bold flex items-center gap-2 border border-error/10">
              <MIcon name="error" className="text-base" /> {validationError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wider uppercase text-on-surface-variant flex items-center gap-2">
                <MIcon name="location_on" className="text-lg text-primary" /> {t("hero.from")}
              </label>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/20 text-primary font-bold outline-none transition-all cursor-pointer"
              >
                {origins.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wider uppercase text-on-surface-variant flex items-center gap-2">
                <MIcon name="near_me" className="text-lg text-primary" /> {t("hero.to")}
              </label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/20 text-primary font-bold outline-none transition-all cursor-pointer"
              >
                <option value="">{t("hero.toPlaceholder")}</option>
                {destinations
                  .filter((city) => city !== fromCity)
                  .map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wider uppercase text-on-surface-variant flex items-center gap-2">
                <MIcon name="calendar_today" className="text-lg text-primary" /> {t("hero.date")}
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-primary/20 outline-none text-primary font-bold transition-all cursor-pointer"
                type="date"
                required
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-primary text-on-primary rounded-2xl py-4.5 text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-primary-container hover:scale-[1.01] active:scale-95 transition-all shadow-lg cursor-pointer"
              style={{ boxShadow: "0 10px 25px -5px rgba(1,45,29,.2)" }}
            >
              {t("hero.searchBtn")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
