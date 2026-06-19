"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "@/src/lib/i18n";
import { getRoutes } from "@/app/actions/admin";

function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

interface RouteType {
  id: number;
  origin: string;
  destination: string;
  price: number;
  description: string;
  imageUrl: string;
  tags: string;
}

export default function PopularRoutes() {
  const { t, locale } = useTranslation();
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const data = await getRoutes();
        setRoutes(data);
      } catch (err) {
        console.error("Failed to load routes from DB:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRoutes();
  }, []);

  // Standard hardcoded fallback data if DB is empty or fails
  const fallbackRoutes = [
    {
      id: -1,
      origin: "Jember",
      destination: "Surabaya",
      description: t("routes.surabaya.desc"),
      price: 150000,
      imageUrl: "/images/surabaya1.jpg",
      tags: locale === "en" ? "Executive Class, Door-to-Door" : "Kelas Eksekutif, Jemput Antar",
    },
    {
      id: -2,
      origin: "Jember",
      destination: "Malang",
      description: t("routes.malang.desc"),
      price: 120000,
      imageUrl: "/images/malang1.jpg",
      tags: locale === "en" ? "Luxury Coach, Free Snack" : "Bus Mewah, Camilan Gratis",
    },
    {
      id: -3,
      origin: "Jember",
      destination: "Banyuwangi",
      description: t("routes.banyuwangi.desc"),
      price: 100000,
      imageUrl: "/images/banyuwangi1.jpg",
      tags: locale === "en" ? "Scenic Route, Daily Trip" : "Jalur Indah, Perjalanan Harian",
    },
  ];

  const displayedRoutes = routes.length > 0 ? routes : fallbackRoutes;

  return (
    <section className="bg-surface-container-low napas-section">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-2 tracking-tight">
              {t("routes.title")}
            </h2>
            <p className="text-lg text-on-surface-variant">
              {t("routes.subtitle")}
            </p>
          </div>
          <button className="text-sm font-semibold tracking-wider uppercase text-primary flex items-center gap-2 hover:gap-4 transition-all cursor-pointer">
            {t("routes.viewAll")}{" "}
            <MIcon name="arrow_forward" />
          </button>
        </div>

        {loading ? (
          // Skeleton Loader
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl overflow-hidden shadow-sm h-[400px] animate-pulse">
                <div className="h-64 bg-surface-container-high" />
                <div className="p-8 space-y-4">
                  <div className="h-6 bg-surface-container-high rounded w-3/4" />
                  <div className="h-4 bg-surface-container-high rounded w-full" />
                  <div className="h-4 bg-surface-container-high rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedRoutes.map((r) => {
              // Format price (e.g. 150000 -> 150k or 150rb)
              const thousandPrice = Math.round(r.price / 1000);
              const formattedPrice = locale === "en" 
                ? `Rp ${thousandPrice}k` 
                : `Rp ${thousandPrice}rb`;

              // Handle comma-separated tags
              const tagsArray = r.tags.split(",").map((tag) => tag.trim()).filter(Boolean);

              return (
                <div
                  key={r.id}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10 hover:shadow-2xl transition-all zoom-hover"
                >
                  <div className="h-64 relative overflow-hidden">
                    <Image
                      src={r.imageUrl ? r.imageUrl.split(",")[0].trim() : "/images/route-surabaya.jpg"}
                      alt={`${r.origin} to ${r.destination}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-primary shadow-sm border border-outline-variant/10">
                      {t("routes.start")} {formattedPrice}
                    </div>
                  </div>
                  <div className="p-8">
                    <h4 className="text-xl font-bold text-primary mb-2">
                      {r.origin} → {r.destination}
                    </h4>
                    <p className="text-on-surface-variant mb-6 min-h-[48px] leading-relaxed">
                      {r.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tagsArray.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-primary/5 text-primary-container text-xs font-semibold rounded-full uppercase tracking-wider border border-primary/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
