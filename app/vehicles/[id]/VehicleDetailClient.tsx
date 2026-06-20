"use client";

import { useState } from "react";
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
}

interface VehicleDetailClientProps {
  carType: CarType;
  schedule: Schedule | null;
  route: Route;
  date: string;
}

export default function VehicleDetailClient({
  carType,
  schedule,
  route,
  date,
}: VehicleDetailClientProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [passengers, setPassengers] = useState("1 Orang");
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [validationError, setValidationError] = useState("");

  const ticketPrice = route.price;
  const serviceFee = 5000;
  const passengerCount = parseInt(passengers) || 1;
  const totalPrice = (ticketPrice * passengerCount) + serviceFee;

  // Dynamic image matching car name
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

  const imagesArray = route.imageUrl
    ? route.imageUrl.split(",").map((url) => url.trim()).filter(Boolean)
    : [getVehicleImage(carType.name)];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const activeImage = selectedImage || imagesArray[0];

  function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    setValidationError("");

    if (!name.trim()) {
      setValidationError("Nama lengkap wajib diisi");
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setValidationError("Nomor WhatsApp tidak valid (minimal 8 digit)");
      return;
    }

    // Format Indonesian travel date from props
    let formattedDate = "";
    if (date) {
      try {
        formattedDate = new Date(date).toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch (err) {
        formattedDate = date;
      }
    }

    const departureTime = schedule ? schedule.departureTime : "06.00 WIB — Pagi";

    // Formulate structured WhatsApp text message
    let message = `Halo Jember Travel, saya ingin memesan tiket perjalanan.

Berikut adalah detail pesanan saya:
- Rute: ${route.origin} ke ${route.destination}
- Armada: ${carType.name}`;

    if (formattedDate) {
      message += `\n- Tanggal Berangkat: ${formattedDate}`;
    }
    if (departureTime) {
      message += `\n- Jam Keberangkatan: ${departureTime}`;
    }
    
    message += `\n- Nama Lengkap: ${name}
- No. WhatsApp: +62 ${phone}
- Jumlah Penumpang: ${passengers}`;

    if (pickupAddress.trim()) {
      message += `\n- Alamat Jemput: ${pickupAddress.trim()}`;
    }
    if (destinationAddress.trim()) {
      message += `\n- Alamat Tujuan: ${destinationAddress.trim()}`;
    }
    if (notes.trim()) {
      message += `\n- Catatan / Permintaan: ${notes.trim()}`;
    }

    message += `\n\nTotal Pembayaran: Rp ${totalPrice.toLocaleString("id-ID")} (termasuk biaya layanan Rp ${serviceFee.toLocaleString("id-ID")})`;
    message += `\n\nMohon konfirmasi pesanan saya. Terima kasih!`;

    const waUrl = `https://wa.me/6281336104254?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-surface-container-lowest pt-28 pb-24 px-5 md:px-16">
        <div className="max-w-[1280px] mx-auto space-y-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
            <Link href="/" className="hover:text-primary transition-all">Beranda</Link>
            <MIcon name="chevron_right" className="text-2xs" />
            <Link href={`/search?from=${route.origin}&to=${route.destination}&date=${date}`} className="hover:text-primary transition-all">
              {route.destination}
            </Link>
            <MIcon name="chevron_right" className="text-2xs" />
            <span className="text-primary">{carType.name}</span>
          </nav>

          {/* Headline Title */}
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-primary tracking-tight mb-2">
              {carType.name}
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant font-semibold">
              Premium MPV Experience • {route.origin} – {route.destination}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Columns (Image Gallery & Amenities) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Premium Interactive Image Gallery */}
              <div className="space-y-4">
                
                {/* Main Large Display Image */}
                <div className="w-full aspect-[16/9] md:h-[480px] bg-white rounded-3xl overflow-hidden relative border border-outline-variant/30 shadow-md">
                  <Image
                    src={activeImage}
                    alt={`${carType.name} Main View`}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover transition-all duration-300"
                    priority
                  />
                  
                  {/* Overlay Index */}
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/10 select-none">
                    Foto {imagesArray.indexOf(activeImage) + 1} dari {imagesArray.length}
                  </div>
                </div>

                {/* Clickable Thumbnails Row */}
                {imagesArray.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto py-1.5 scrollbar-none">
                    {imagesArray.map((url, idx) => {
                      const isActive = activeImage === url;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedImage(url)}
                          className={`relative h-20 w-32 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 hover:scale-102 ${
                            isActive 
                              ? "border-primary ring-2 ring-primary/20 shadow-md" 
                              : "border-outline-variant/30 hover:border-primary/50"
                          }`}
                        >
                          <Image
                            src={url}
                            alt={`Armada View ${idx + 1}`}
                            fill
                            sizes="120px"
                            className={`object-cover transition-all ${isActive ? "brightness-100" : "brightness-75 hover:brightness-95"}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>

              {/* Fasilitas Unggulan */}
              <div className="bg-white border border-outline-variant/30 rounded-[32px] p-8 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-primary">Fasilitas Unggulan</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Full AC", icon: "ac_unit", active: route.tags.toLowerCase().includes("ac") },
                    { label: "Reclining Seat", icon: "airline_seat_recline_extra", active: route.tags.toLowerCase().includes("seat") },
                    { label: "USB Charger", icon: "power", active: route.tags.toLowerCase().includes("usb") || route.tags.toLowerCase().includes("charger") },
                    { label: "Mineral Water", icon: "water_drop", active: route.tags.toLowerCase().includes("mineral") || route.tags.toLowerCase().includes("snack") },
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      className={`border rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                        item.active
                          ? "bg-primary/5 border-primary/20 hover:-translate-y-1 opacity-100"
                          : "bg-surface-container/50 border-outline-variant/10 opacity-30 select-none"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.active ? "bg-primary/10 text-primary" : "bg-surface text-outline"}`}>
                        <MIcon name={item.icon} className="text-xl" />
                      </div>
                      <span className={`text-xs font-bold ${item.active ? "text-primary" : "text-outline"}`}>{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Additional facilities text */}
                <div className="pt-4 border-t border-outline-variant/10 text-sm text-on-surface-variant font-medium leading-relaxed">
                  <strong>Catatan Fasilitas:</strong> {carType.facility}
                </div>
              </div>

            </div>

            {/* Right Booking Card Column */}
            <div className="bg-white border border-outline-variant/30 rounded-[32px] p-8 shadow-xl space-y-6 relative">
              <div className="flex justify-between items-center">
                <span className="bg-primary/5 text-primary border border-primary/10 px-3 py-1 rounded-full text-2xs font-bold uppercase tracking-wider">
                  Best Seller
                </span>
                <div className="text-right">
                  <span className="text-xs text-on-surface-variant font-bold block">Harga Tiket</span>
                  <span className="text-xl font-bold text-primary block leading-tight">
                    Rp {ticketPrice.toLocaleString("id-ID")} <span className="text-2xs font-semibold text-on-surface-variant">/ Kursi</span>
                  </span>
                </div>
              </div>

              {/* Validation alert */}
              {validationError && (
                <div className="p-3.5 bg-error-container text-on-error-container rounded-2xl text-xs font-bold flex items-center gap-2 border border-error/10">
                  <MIcon name="error" className="text-base" /> {validationError}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleBooking} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-2xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                    Nama Lengkap <span className="text-error font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3 px-4 text-primary font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    placeholder="Nama lengkap Anda"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-2xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                    No. WhatsApp <span className="text-error font-bold">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="bg-surface-container border border-outline-variant/30 rounded-2xl px-4 py-3 text-sm font-bold text-primary flex items-center justify-center">
                      +62
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                      className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3 px-4 text-primary font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                      placeholder="08xx xxxx xxxx"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-2xs font-bold uppercase tracking-wider text-on-surface-variant">Jumlah Penumpang</label>
                  <div className="relative">
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3 px-4 text-primary font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm appearance-none cursor-pointer pr-10"
                    >
                      <option value="1 Orang">1 Orang</option>
                      <option value="2 Orang">2 Orang</option>
                      <option value="3 Orang">3 Orang</option>
                      <option value="4 Orang">4 Orang</option>
                      <option value="5 Orang">5 Orang</option>
                      <option value="6 Orang">6 Orang</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-primary">
                      <MIcon name="unfold_more" className="text-lg" />
                    </div>
                  </div>
                </div>



                <div className="space-y-1">
                  <label className="text-2xs font-bold uppercase tracking-wider text-on-surface-variant">Alamat Jemput</label>
                  <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3 px-4 text-primary font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    placeholder="Alamat lengkap penjemputan"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-2xs font-bold uppercase tracking-wider text-on-surface-variant">Alamat Tujuan</label>
                  <input
                    type="text"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3 px-4 text-primary font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    placeholder="Alamat lengkap tujuan"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-2xs font-bold uppercase tracking-wider text-on-surface-variant">Catatan / Permintaan</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3.5 px-4 text-primary font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all min-h-[90px] resize-y"
                    placeholder="Catatan atau permintaan khusus"
                  />
                </div>

                {/* Subtotals */}
                <div className="pt-4 border-t border-outline-variant/20 space-y-2 text-xs font-semibold text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Subtotal ({passengerCount} Kursi)</span>
                    <span className="text-primary font-bold">Rp {(ticketPrice * passengerCount).toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Layanan</span>
                    <span className="text-primary font-bold">Rp {serviceFee.toLocaleString("id-ID")}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-outline-variant/10 flex justify-between items-center text-sm">
                    <span className="text-primary font-bold">Total Pembayaran</span>
                    <span className="text-lg font-bold text-primary">Rp {totalPrice.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-primary text-on-primary rounded-2xl py-4 text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-primary-container hover:scale-[1.01] active:scale-95 transition-all shadow-lg cursor-pointer"
                  style={{ boxShadow: "0 10px 25px -5px rgba(1,45,29,.25)" }}
                >
                  <MIcon name="chat" className="text-base" /> Pesan Sekarang
                </button>
              </form>

              <div className="text-center text-2xs text-on-surface-variant/80 font-medium">
                Dengan menekan tombol, Anda menyetujui <br />
                <span className="text-primary font-bold hover:underline cursor-pointer">Syarat & Ketentuan</span> yang berlaku.
              </div>

              {/* Secure Booking Details */}
              <div className="pt-4 border-t border-outline-variant/15 flex justify-around text-2xs text-on-surface-variant/90 font-bold">
                <span className="flex items-center gap-1"><MIcon name="verified_user" className="text-primary text-xs" /> Safe Payment</span>
                <span className="flex items-center gap-1"><MIcon name="support_agent" className="text-primary text-xs" /> 24/7 Support</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
