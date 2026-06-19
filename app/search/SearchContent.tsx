"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

interface Route {
  id: number;
  origin: string;
  destination: string;
  price: number;
  description: string;
  imageUrl: string;
  tags: string;
}

interface CarType {
  id: number;
  name: string;
  capacity: number;
  facility: string;
}

interface Schedule {
  id: number;
  routeId: number;
  carTypeId: number;
  departureTime: string;
  availableSeats: number;
  route: Route | null;
  carType: CarType | null;
}

interface SearchContentProps {
  initialSchedules: Schedule[];
  fromCity: string;
  toCity: string;
  date: string;
}

export default function SearchContent({
  initialSchedules,
  fromCity,
  toCity,
  date,
}: SearchContentProps) {
  // Filters State
  const [pagi, setPagi] = useState(false);
  const [siang, setSiang] = useState(false);
  const [malam, setMalam] = useState(false);
  const [innova, setInnova] = useState(false);
  const [hiace, setHiace] = useState(false);
  
  // Find min and max prices to set slider defaults
  const prices = initialSchedules.map((s) => s.route?.price || 150000);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 100000;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 300000;
  
  const [maxPriceFilter, setMaxPriceFilter] = useState(maxPrice + 50000); // buffer
  const [sortBy, setSortBy] = useState<"semua" | "termurah" | "terpagi">("semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingSeats, setBookingSeats] = useState<number | null>(null);

  // Reset Filters
  function handleReset() {
    setPagi(false);
    setSiang(false);
    setMalam(false);
    setInnova(false);
    setHiace(false);
    setMaxPriceFilter(maxPrice + 50000);
    setSortBy("semua");
    setCurrentPage(1);
  }

  // Calculate Arrival and Duration dynamically based on destination
  function getTravelDetails(departure: string, destination: string) {
    let durationMinutes = 270; // 4h 30m (Surabaya)
    let durationStr = "4j 30m";

    const dest = destination.toLowerCase();
    if (dest.includes("surabaya")) {
      durationMinutes = 270;
      durationStr = "4j 30m";
    } else if (dest.includes("malang")) {
      durationMinutes = 255;
      durationStr = "4j 15m";
    } else if (dest.includes("banyuwangi")) {
      durationMinutes = 180;
      durationStr = "3j 00m";
    } else {
      durationMinutes = 240;
      durationStr = "4j 00m";
    }

    const [hours, minutes] = departure.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const arrivalHours = Math.floor(totalMinutes / 60) % 24;
    const arrivalMinutes = totalMinutes % 60;

    const formattedHours = arrivalHours.toString().padStart(2, "0");
    const formattedMinutes = arrivalMinutes.toString().padStart(2, "0");

    return {
      arrival: `${formattedHours}:${formattedMinutes}`,
      duration: durationStr,
    };
  }

  // Dynamic image loader based on vehicle name
  function getVehicleImage(name: string) {
    const n = name.toLowerCase();
    if (n.includes("hiace")) {
      return "/images/toyota-hiace.jpg";
    }
    if (n.includes("innova")) {
      return "/images/toyota-innova.jpg";
    }
    return "/images/interior-van.jpg";
  }

  // Filter and Sort Logic
  const filteredSchedules = useMemo(() => {
    let list = [...initialSchedules];

    // Filter by departure time
    if (pagi || siang || malam) {
      list = list.filter((s) => {
        const hour = parseInt(s.departureTime.split(":")[0], 10);
        if (pagi && hour >= 4 && hour < 11) return true;
        if (siang && hour >= 11 && hour < 18) return true;
        if (malam && (hour >= 18 || hour < 4)) return true;
        return false;
      });
    }

    // Filter by vehicle type
    if (innova || hiace) {
      list = list.filter((s) => {
        const name = (s.carType?.name || "").toLowerCase();
        if (innova && name.includes("innova")) return true;
        if (hiace && name.includes("hiace")) return true;
        return false;
      });
    }

    // Filter by price range
    list = list.filter((s) => (s.route?.price || 0) <= maxPriceFilter);

    // Sorting
    if (sortBy === "termurah") {
      list.sort((a, b) => (a.route?.price || 0) - (b.route?.price || 0));
    } else if (sortBy === "terpagi") {
      list.sort((a, b) => {
        const timeA = a.departureTime.replace(":", "");
        const timeB = b.departureTime.replace(":", "");
        return timeA.localeCompare(timeB);
      });
    }

    return list;
  }, [initialSchedules, pagi, siang, malam, innova, hiace, maxPriceFilter, sortBy]);

  // Pagination (3 items per page to match mockup spacing)
  const itemsPerPage = 3;
  const paginatedSchedules = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSchedules.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSchedules, currentPage]);

  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-surface-container-low pt-28 pb-20 px-5 md:px-16">
        <div className="max-w-[1280px] mx-auto space-y-8">
          
          {/* Breadcrumb / Headline */}
          <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-primary tracking-tight">
                {fromCity} → {toCity}
              </h1>
              <p className="text-sm text-on-surface-variant font-semibold mt-1">
                Jadwal Departur untuk {new Date(date).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Link 
              href="/"
              className="text-xs font-bold text-primary border border-primary/20 px-4 py-2 rounded-xl hover:bg-primary/5 transition-all flex items-center gap-1.5"
            >
              <MIcon name="edit" className="text-sm" /> Ganti Pencarian
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* 1. Left Sidebar Filter */}
            <aside className="w-full lg:w-80 bg-white border border-outline-variant/30 rounded-[32px] p-6 shadow-sm space-y-8 flex-shrink-0">
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/10">
                <h3 className="text-lg font-bold text-primary flex items-center gap-1.5">
                  <MIcon name="filter_list" className="text-xl" /> Filter
                </h3>
                <button 
                  onClick={handleReset}
                  className="text-xs font-bold text-error uppercase tracking-wider hover:opacity-80 transition-all cursor-pointer"
                >
                  Reset
                </button>
              </div>

              {/* Time slots */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Waktu Keberangkatan
                </h4>
                <div className="space-y-3 font-semibold text-sm text-primary">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={pagi}
                      onChange={(e) => setPagi(e.target.checked)}
                      className="h-5 w-5 rounded-md border-outline-variant focus:ring-primary accent-primary cursor-pointer" 
                    />
                    <div className="flex items-center gap-2">
                      <MIcon name="wb_sunny" className="text-lg text-primary/60" />
                      <span>Pagi (04:00 - 11:00)</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={siang}
                      onChange={(e) => setSiang(e.target.checked)}
                      className="h-5 w-5 rounded-md border-outline-variant focus:ring-primary accent-primary cursor-pointer" 
                    />
                    <div className="flex items-center gap-2">
                      <MIcon name="light_mode" className="text-lg text-primary/60" />
                      <span>Siang (11:00 - 18:00)</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={malam}
                      onChange={(e) => setMalam(e.target.checked)}
                      className="h-5 w-5 rounded-md border-outline-variant focus:ring-primary accent-primary cursor-pointer" 
                    />
                    <div className="flex items-center gap-2">
                      <MIcon name="dark_mode" className="text-lg text-primary/60" />
                      <span>Malam (18:00 - 04:00)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Vehicle types */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Tipe Kendaraan
                </h4>
                <div className="space-y-3 font-semibold text-sm text-primary">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={innova}
                      onChange={(e) => setInnova(e.target.checked)}
                      className="h-5 w-5 rounded-md border-outline-variant focus:ring-primary accent-primary cursor-pointer" 
                    />
                    <span>Toyota Innova</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={hiace}
                      onChange={(e) => setHiace(e.target.checked)}
                      className="h-5 w-5 rounded-md border-outline-variant focus:ring-primary accent-primary cursor-pointer" 
                    />
                    <span>Toyota Hiace</span>
                  </label>
                </div>
              </div>

              {/* Price range */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Kisaran Harga
                </h4>
                <div className="space-y-3">
                  <input 
                    type="range"
                    min={minPrice}
                    max={maxPrice + 100000}
                    step={10000}
                    value={maxPriceFilter}
                    onChange={(e) => setMaxPriceFilter(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs font-bold text-primary">
                    <span>Rp {(minPrice / 1000).toLocaleString("id-ID")}rb</span>
                    <span>Rp {(maxPriceFilter / 1000).toLocaleString("id-ID")}rb</span>
                  </div>
                </div>
              </div>

            </aside>

            {/* 2. Right Content Column */}
            <div className="flex-1 w-full space-y-6">
              
              {/* Sort Bar */}
              <div className="flex gap-3 bg-surface-container p-2 rounded-2xl border border-outline-variant/10">
                <button
                  onClick={() => setSortBy("semua")}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                    sortBy === "semua"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-white text-primary border border-outline-variant/20 hover:bg-primary/5"
                  }`}
                >
                  Semua Jadwal
                </button>
                <button
                  onClick={() => setSortBy("termurah")}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                    sortBy === "termurah"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-white text-primary border border-outline-variant/20 hover:bg-primary/5"
                  }`}
                >
                  Harga Termurah
                </button>
                <button
                  onClick={() => setSortBy("terpagi")}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                    sortBy === "terpagi"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-white text-primary border border-outline-variant/20 hover:bg-primary/5"
                  }`}
                >
                  Paling Pagi
                </button>
              </div>

              {/* Schedule List */}
              <div className="space-y-6">
                {paginatedSchedules.map((s) => {
                  const defaultVehicleImg = s.carType ? getVehicleImage(s.carType.name) : "/images/interior-van.jpg";
                  const vehicleImg = s.route?.imageUrl
                    ? s.route.imageUrl.split(",")[0].trim()
                    : defaultVehicleImg;
                  const detail = getTravelDetails(s.departureTime, toCity);
                  const priceFormatted = s.route ? `IDR ${s.route.price.toLocaleString("id-ID")}` : "IDR -";

                  const isBooking = bookingSeats === s.id;

                  return (
                    <div 
                      key={s.id}
                      className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6 relative"
                    >
                      {/* Left: Image */}
                      <div className="w-full md:w-60 h-40 relative rounded-2xl overflow-hidden flex-shrink-0 border border-outline-variant/15">
                        <Image
                          src={vehicleImg}
                          alt={s.carType?.name || "Vehicle"}
                          fill
                          sizes="(max-width: 768px) 100vw, 240px"
                          className="object-cover"
                        />
                      </div>

                      {/* Middle: Details */}
                      <div className="flex-1 w-full space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-primary/5 text-primary border border-primary/10 px-3 py-1 rounded text-2xs font-bold uppercase tracking-wider">
                            {s.carType?.name.split(" ")[0]} {s.carType?.name.split(" ")[1] || ""}
                          </span>
                          <span className="bg-secondary/5 text-on-secondary-container border border-secondary/10 px-3 py-1 rounded text-2xs font-bold uppercase tracking-wider">
                            {s.carType?.name.includes("Hiace") ? "EXECUTIVE" : "LUXURY"}
                          </span>
                        </div>

                        {/* Connection Times */}
                        <div className="flex justify-between items-center max-w-md">
                          <div className="space-y-1">
                            <span className="text-2xl font-bold text-primary block leading-none">
                              {s.departureTime}
                            </span>
                            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block">
                              {fromCity}
                            </span>
                          </div>

                          {/* Duration line */}
                          <div className="flex-1 px-4 flex flex-col items-center justify-center">
                            <span className="text-2xs font-bold text-on-surface-variant/80 tracking-wider mb-1 block">
                              {detail.duration}
                            </span>
                            <div className="w-full flex items-center justify-center relative">
                              <span className="absolute left-0 h-1.5 w-1.5 rounded-full bg-outline-variant" />
                              <div className="w-full h-0.5 border-t border-dashed border-outline-variant" />
                              <MIcon name={s.carType?.name.includes("Hiace") ? "directions_bus" : "airport_shuttle"} className="text-primary mx-1 text-sm z-10" />
                              <div className="w-full h-0.5 border-t border-dashed border-outline-variant" />
                              <span className="absolute right-0 h-1.5 w-1.5 rounded-full bg-outline-variant" />
                            </div>
                          </div>

                          <div className="space-y-1 text-right">
                            <span className="text-2xl font-bold text-primary block leading-none">
                              {detail.arrival}
                            </span>
                            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block">
                              {toCity}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & Seats CTA */}
                      <div className="w-full md:w-48 flex md:flex-col justify-between md:justify-center items-center md:items-end border-t md:border-t-0 md:border-l border-outline-variant/20 pt-4 md:pt-0 md:pl-6 gap-3 flex-shrink-0">
                        <div className="space-y-1 text-left md:text-right mb-2">
                          <span className="text-2xl font-bold text-primary block leading-none">
                            {priceFormatted}
                          </span>
                        </div>

                        <Link
                          href={`/vehicles/${s.carTypeId}?scheduleId=${s.id}&date=${encodeURIComponent(date)}`}
                          className="bg-primary text-on-primary px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-primary-container active:scale-95 transition-all cursor-pointer shadow-sm text-center w-full md:w-auto inline-block"
                        >
                          Berangkat
                        </Link>
                      </div>

                    </div>
                  );
                })}

                {filteredSchedules.length === 0 && (
                  <div className="bg-white rounded-3xl border border-outline-variant/30 p-12 text-center shadow-sm space-y-4">
                    <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary">
                      <MIcon name="directions_bus" className="text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-primary">Keberangkatan Tidak Ditemukan</h3>
                    <p className="text-sm text-on-surface-variant max-w-sm mx-auto font-semibold">
                      Belum ada jadwal keberangkatan terdaftar untuk rute ini. Coba ubah pencarian atau hubungi CS WhatsApp kami.
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-6">
                  <button
                    onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-primary bg-white hover:bg-primary/5 disabled:opacity-50 disabled:hover:bg-white cursor-pointer transition-all"
                  >
                    <MIcon name="chevron_left" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? "bg-primary text-on-primary shadow-sm"
                            : "bg-white text-primary border border-outline-variant/30 hover:bg-primary/5"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-primary bg-white hover:bg-primary/5 disabled:opacity-50 disabled:hover:bg-white cursor-pointer transition-all"
                  >
                    <MIcon name="chevron_right" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
