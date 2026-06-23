"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

export default function PrivateCharterPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("Toyota Innova Zenix");
  const [travelDate, setTravelDate] = useState<string>("");
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [passengerCount, setPassengerCount] = useState<string>("");
  
  // Validation indicator
  const [showValidationMsg, setShowValidationMsg] = useState(false);

  const vehicles = [
    {
      id: "zenix",
      name: "Toyota Innova Zenix",
      badge: "Most Popular",
      image: "/images/toyota_zenix.png",
      seats: "6 Seats",
      bags: "3 Bags",
      features: [
        "Full AC Dual Zone",
        "Reclining Seat Premium",
        "Professional Driver"
      ],
      price: "Rp 950.000",
      rawPrice: 950000
    },
    {
      id: "hiace",
      name: "Toyota HiAce Premio",
      badge: "",
      image: "/images/toyota_hiace_premio.png",
      seats: "11 Seats",
      bags: "6 Bags",
      features: [
        "Cabin Luas & Tinggi",
        "Entertainment System",
        "Driver & Tour Assistant"
      ],
      price: "Rp 1.800.000",
      rawPrice: 1800000
    }
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!travelDate || !pickupLocation || !destination || !passengerCount) {
      setShowValidationMsg(true);
      return;
    }
    setShowValidationMsg(false);

    const basePrice = selectedVehicle === "Toyota Innova Zenix" ? 950000 : 1800000;
    const totalPayment = basePrice + 5000;
    const totalFormatted = "Rp " + totalPayment.toLocaleString("id-ID");

    // Build Whatsapp Booking Message in requested template format
    const message = `Halo Jember Travel, saya ingin memesan tiket perjalanan.

Berikut adalah detail pesanan saya:
• Armada: ${selectedVehicle}
• Tanggal Perjalanan: ${travelDate}
• Jumlah Penumpang: ${passengerCount} Orang
• Rute Penjemputan: ${pickupLocation}
• Rute Tujuan: ${destination}
${notes ? `• Catatan Tambahan: ${notes}\n` : ""}
Total Pembayaran: ${totalFormatted}
(termasuk biaya layanan Rp 5.000)

Mohon konfirmasi pesanan saya. Terima kasih!`;

    const waUrl = `https://wa.me/6281336104254?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#f8f9fa] min-h-screen text-primary font-sans antialiased pt-20">
      
      {/* SECTION 1 - HERO BANNER */}
      <section className="relative h-[700px] flex items-center overflow-hidden">
        {/* Cinematic Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/luxury_charter_hero.png"
            alt="Premium vehicle coastal road Bali"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          {/* Left-to-Right Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-10" />
          {/* Subtle Batik pattern layered on hero */}
          <div className="absolute inset-0 batik-pattern opacity-10 pointer-events-none z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 w-full max-w-[1280px] mx-auto px-5 md:px-16 text-white">
          <div className="max-w-[600px] text-left">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-primary-fixed-dim rounded-full text-xs font-bold tracking-wider uppercase mb-6 backdrop-blur-md border border-white/10">
              PREMIUM CHARTER
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight drop-shadow-sm">
              Layanan Private & Charter
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed mb-8 drop-shadow-sm font-medium">
              Nikmati kebebasan menjelajah Nusantara dengan kenyamanan eksklusif. Armada modern, pengemudi profesional, dan fleksibilitas rute yang sepenuhnya berada di tangan Anda.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER: 12-Column Grid */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: 8 Columns (Fleet selection + details) */}
          <main className="col-span-12 lg:col-span-8 space-y-16">
            
            {/* SECTION 2 - PEMILIHAN ARMADA */}
            <section className="space-y-8">
              <div>
                <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-2">PILIH KENDARAAN</span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">Pilih Armada Anda</h2>
                <p className="text-on-surface-variant font-semibold text-sm mt-1">Armada terawat dengan standar kebersihan tinggi.</p>
              </div>

              {/* Vehicle Cards List */}
              <div className="space-y-6">
                {vehicles.map((veh) => {
                  const isSelected = selectedVehicle === veh.name;
                  return (
                    <div 
                      key={veh.id}
                      onClick={() => {
                        setSelectedVehicle(veh.name);
                        setShowValidationMsg(false);
                      }}
                      className={`flex flex-col md:flex-row rounded-[24px] overflow-hidden border transition-all duration-300 bg-white group cursor-pointer ${
                        isSelected 
                          ? "border-primary ring-2 ring-primary/10 shadow-lg scale-[1.01]" 
                          : "border-outline-variant/10 shadow-sm hover:shadow-md hover:-translate-y-1"
                      }`}
                    >
                      {/* Left: Image Container */}
                      <div className="md:w-2/5 relative min-h-[220px] md:min-h-auto overflow-hidden bg-surface-container-low">
                        <Image
                          src={veh.image}
                          alt={veh.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 40vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Highlight Border Overlay */}
                        {isSelected && (
                          <div className="absolute inset-0 border-r-0 md:border-r border-t-0 border-l-0 border-b-0 md:border-b-0 border-primary" />
                        )}
                        {/* Zenix Badge */}
                        {veh.badge && (
                          <span className="absolute top-4 left-4 z-10 bg-secondary text-white px-3 py-1 rounded-full text-2xs font-extrabold uppercase tracking-wider shadow-sm">
                            {veh.badge}
                          </span>
                        )}
                      </div>

                      {/* Right: Detail Content */}
                      <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between space-y-6">
                        {/* Title and Stats */}
                        <div>
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <h3 className="text-xl font-bold text-primary tracking-tight">{veh.name}</h3>
                            {isSelected && (
                              <span className="flex items-center gap-1 text-primary text-xs font-bold bg-primary/5 px-2.5 py-1 rounded-full">
                                <MIcon name="check_circle" className="text-sm" /> Terpilih
                              </span>
                            )}
                          </div>
                          
                          {/* Seat & Suitcase counts */}
                          <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant mb-4">
                            <span className="flex items-center gap-1">
                              <MIcon name="airline_seat_recline_normal" className="text-base text-primary/70" />
                              {veh.seats}
                            </span>
                            <span className="flex items-center gap-1">
                              <MIcon name="work" className="text-base text-primary/70" />
                              {veh.bags}
                            </span>
                          </div>

                          {/* Features */}
                          <ul className="space-y-2 text-xs font-bold text-on-surface-variant/80">
                            {veh.features.map((feat, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                {feat}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Price and CTA */}
                        <div className="flex items-center justify-between border-t border-outline-variant/10 pt-4">
                          <div>
                            <span className="text-2xs font-bold uppercase tracking-wider text-on-surface-variant block">Tarif Sewa</span>
                            <span className="text-lg font-extrabold text-primary">{veh.price}<span className="text-xs font-bold text-on-surface-variant/70">/hari</span></span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVehicle(veh.name);
                              setShowValidationMsg(false);
                            }}
                            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              isSelected 
                                ? "bg-primary text-white" 
                                : "bg-surface-container-low hover:bg-primary/5 text-primary border border-outline-variant/10"
                            }`}
                          >
                            Pilih
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECTION 3 - DETAIL LAYANAN */}
            <section 
              className="bg-primary-container text-white rounded-[24px] p-8 md:p-12 relative overflow-hidden shadow-lg border border-primary-container"
              style={{
                backgroundImage: "linear-gradient(to bottom, #1b4332, #0f271d)"
              }}
            >
              {/* Translucent white batik pattern overlay */}
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.4) 1px, transparent 0)",
                  backgroundSize: "24px 24px"
                }}
              />
              
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 relative z-10">Detail Layanan</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Sudah Termasuk */}
                <div className="space-y-6">
                  <h4 className="text-sm font-extrabold tracking-wider uppercase text-primary-fixed-dim border-b border-white/10 pb-2">Sudah Termasuk</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-primary-fixed-dim flex-shrink-0 mt-0.5">
                        <MIcon name="check" className="text-sm font-bold" />
                      </span>
                      <div>
                        <strong className="text-sm block">Pengemudi Berpengalaman</strong>
                        <span className="text-xs text-white/70 block mt-0.5">Ramah, profesional, dan paham rute wisata</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-primary-fixed-dim flex-shrink-0 mt-0.5">
                        <MIcon name="check" className="text-sm font-bold" />
                      </span>
                      <div>
                        <strong className="text-sm block">Bahan Bakar (BBM)</strong>
                        <span className="text-xs text-white/70 block mt-0.5">Tanpa biaya tambahan untuk bahan bakar</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-primary-fixed-dim flex-shrink-0 mt-0.5">
                        <MIcon name="check" className="text-sm font-bold" />
                      </span>
                      <div>
                        <strong className="text-sm block">Asuransi Perjalanan</strong>
                        <span className="text-xs text-white/70 block mt-0.5">Perlindungan penuh selama durasi charter</span>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Belum Termasuk */}
                <div className="space-y-6">
                  <h4 className="text-sm font-extrabold tracking-wider uppercase text-error-container border-b border-white/10 pb-2">Belum Termasuk</h4>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-error-container/10 flex items-center justify-center text-error flex-shrink-0">
                        <MIcon name="close" className="text-sm font-bold" />
                      </span>
                      <span className="text-sm font-bold text-white/90">Biaya Parkir & Tol</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-error-container/10 flex items-center justify-center text-error flex-shrink-0">
                        <MIcon name="close" className="text-sm font-bold" />
                      </span>
                      <span className="text-sm font-bold text-white/90">Uang Makan Driver</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-error-container/10 flex items-center justify-center text-error flex-shrink-0">
                        <MIcon name="close" className="text-sm font-bold" />
                      </span>
                      <span className="text-sm font-bold text-white/90">Tiket Masuk Tempat Wisata</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

          </main>

          {/* RIGHT COLUMN: 4 Columns (Sticky Booking Form + Support Card) */}
          <aside className="col-span-12 lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            
            {/* BOOKING FORM CARD */}
            <div className="bg-white rounded-[24px] p-6 shadow-xl border border-outline-variant/10">
              <h3 className="text-lg font-bold text-primary tracking-tight mb-4 flex items-center gap-2">
                <MIcon name="calendar_today" className="text-secondary" /> Formulir Pemesanan
              </h3>
              
              {/* Highlight Selected Vehicle info */}
              <div className="mb-6 p-3 bg-surface-container-low rounded-xl border border-outline-variant/10 flex items-center gap-2.5">
                <MIcon name="directions_car" className="text-primary/70" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">Armada Terpilih:</span>
                  <span className="text-xs font-extrabold text-primary">{selectedVehicle}</span>
                </div>
              </div>

              {/* Form Input fields */}
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {/* Tanggal Perjalanan */}
                <div className="space-y-1.5">
                  <label htmlFor="travel-date" className="text-xs font-bold text-primary block">
                    Tanggal Perjalanan <span className="text-error">*</span>
                  </label>
                  <input
                    type="date"
                    id="travel-date"
                    required
                    value={travelDate}
                    onChange={(e) => {
                      setTravelDate(e.target.value);
                      setShowValidationMsg(false);
                    }}
                    className="w-full text-xs p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30 outline-none transition-all duration-300 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 font-bold"
                  />
                </div>

                {/* Jumlah Penumpang */}
                <div className="space-y-1.5">
                  <label htmlFor="passenger-count" className="text-xs font-bold text-primary block">
                    Jumlah Penumpang <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    id="passenger-count"
                    required
                    min={1}
                    max={selectedVehicle === "Toyota Innova Zenix" ? 6 : 11}
                    value={passengerCount}
                    onChange={(e) => {
                      setPassengerCount(e.target.value);
                      setShowValidationMsg(false);
                    }}
                    placeholder={`Maksimal ${selectedVehicle === "Toyota Innova Zenix" ? 6 : 11} penumpang`}
                    className="w-full text-xs p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30 outline-none transition-all duration-300 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 font-bold"
                  />
                </div>

                {/* Rute Penjemputan */}
                <div className="space-y-1.5">
                  <label htmlFor="pickup-loc" className="text-xs font-bold text-primary block">
                    Rute Penjemputan <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="pickup-loc"
                    required
                    rows={2}
                    value={pickupLocation}
                    onChange={(e) => {
                      setPickupLocation(e.target.value);
                      setShowValidationMsg(false);
                    }}
                    placeholder="Alamat lengkap atau nama hotel..."
                    className="w-full text-xs p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30 outline-none transition-all duration-300 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 font-medium leading-relaxed resize-none"
                  />
                </div>

                {/* Rute Tujuan */}
                <div className="space-y-1.5">
                  <label htmlFor="destination" className="text-xs font-bold text-primary block">
                    Rute Tujuan <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="destination"
                    required
                    rows={2}
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setShowValidationMsg(false);
                    }}
                    placeholder="Destinasi yang ingin dikunjungi..."
                    className="w-full text-xs p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30 outline-none transition-all duration-300 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 font-medium leading-relaxed resize-none"
                  />
                </div>

                {/* Catatan Tambahan */}
                <div className="space-y-1.5">
                  <label htmlFor="notes" className="text-xs font-bold text-primary block">
                    Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Kebutuhan khusus, kursi bayi, dll..."
                    className="w-full text-xs p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30 outline-none transition-all duration-300 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 font-medium leading-relaxed resize-none"
                  />
                </div>

                {/* Validation alert */}
                {showValidationMsg && (
                  <p className="text-xs text-error font-bold flex items-center gap-1">
                    <MIcon name="error" className="text-sm" /> Harap lengkapi semua bidang wajib (*)
                  </p>
                )}

                {/* Action button */}
                <button
                  type="submit"
                  className="w-full bg-[#006399] hover:bg-[#004f7a] text-white py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-md shadow-[#006399]/20 hover:scale-[1.01] active:scale-95 cursor-pointer text-center"
                >
                  Cek Ketersediaan
                </button>
              </form>

              <p className="text-[10px] text-center text-on-surface-variant font-bold mt-4">
                Pemesanan Anda belum bersifat final.
              </p>
            </div>

            {/* CUSTOMER SUPPORT CARD */}
            <a
              href="https://wa.me/6281336104254?text=Halo%20Warna%20Nusantara,%20saya%20membutuhkan%20informasi%20mengenai%20sewa%20mobil%20private."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-[24px] p-5 border border-outline-variant/10 shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex items-center gap-4 group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <MIcon name="support_agent" className="text-xl" />
              </div>
              <div>
                <strong className="text-xs font-bold text-primary block">Butuh bantuan?</strong>
                <span className="text-[11px] font-semibold text-secondary flex items-center gap-1 mt-0.5">
                  Hubungi via WhatsApp <MIcon name="arrow_forward" className="text-xs" />
                </span>
              </div>
            </a>

          </aside>
        </div>
      </div>

      </div>
      <Footer />
    </>
  );
}
