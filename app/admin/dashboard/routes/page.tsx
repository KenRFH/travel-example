"use client";

import { useState, useEffect } from "react";
import { getRoutes, createRoute, updateRoute, deleteRoute, getCarTypes } from "@/app/actions/admin";

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
  departureTime?: string;
  carTypeId?: number | null;
  vehicleName?: string;
  scheduleId?: number | null;
}

interface CarType {
  id: number;
  name: string;
  capacity: number;
  facility: string;
}

export default function UnifiedRoutesManager() {
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [vehicles, setVehicles] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RouteType | null>(null);

  // Form Fields
  const [originSelect, setOriginSelect] = useState("Jember");
  const [originCustom, setOriginCustom] = useState("");
  const [destSelect, setDestSelect] = useState("Surabaya");
  const [destCustom, setDestCustom] = useState("");
  const [departureTime, setDepartureTime] = useState("08:00");
  const [duration, setDuration] = useState("4");
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [price, setPrice] = useState("250000");

  // Facilities Checkboxes
  const [facilityAC, setFacilityAC] = useState(true);
  const [facilitySeat, setFacilitySeat] = useState(true);
  const [facilityUSB, setFacilityUSB] = useState(true);
  const [facilitySnack, setFacilitySnack] = useState(true);

  // Photos State (up to 5 images)
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    "/images/toyota-hiace.jpg"
  ]);
  const [photoInput, setPhotoInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const [rData, vData] = await Promise.all([getRoutes(), getCarTypes()]);
      setRoutes(rData);
      setVehicles(vData);
      if (vData.length > 0) {
        setSelectedVehicleId(vData[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setErrorMessage("");

    const files = Array.from(e.target.files);
    
    if (uploadedImages.length + files.length > 5) {
      setErrorMessage("Total gambar tidak boleh lebih dari 5");
      setUploading(false);
      return;
    }

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.success && data.url) {
          setUploadedImages((prev) => [...prev, data.url]);
        } else {
          setErrorMessage(data.error || "Gagal mengunggah file");
          break;
        }
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMessage("Terjadi kesalahan saat mengunggah file");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handleAddPhoto() {
    if (!photoInput.trim()) return;
    if (uploadedImages.length >= 5) {
      setErrorMessage("Maksimal unggah 5 gambar unit");
      return;
    }
    setUploadedImages([...uploadedImages, photoInput.trim()]);
    setPhotoInput("");
  }

  function handleRemovePhoto(index: number) {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  }

  function openCreateModal() {
    setCurrentRoute(null);
    setOriginSelect("Jember");
    setOriginCustom("");
    setDestSelect("Surabaya");
    setDestCustom("");
    setDepartureTime("08:00");
    setDuration("4");
    if (vehicles.length > 0) {
      setSelectedVehicleId(vehicles[0].id);
    } else {
      setSelectedVehicleId(null);
    }
    setPrice("250000");
    setFacilityAC(true);
    setFacilitySeat(true);
    setFacilityUSB(true);
    setFacilitySnack(true);
    setUploadedImages(["/images/toyota-hiace.jpg"]);
    setErrorMessage("");
    setIsFormOpen(true);
  }

  function openEditModal(route: RouteType) {
    setCurrentRoute(route);
    
    const standardCities = ["Jember", "Surabaya", "Malang", "Banyuwangi", "Yogyakarta"];
    if (standardCities.includes(route.origin)) {
      setOriginSelect(route.origin);
      setOriginCustom("");
    } else {
      setOriginSelect("Lainnya");
      setOriginCustom(route.origin);
    }

    if (standardCities.includes(route.destination)) {
      setDestSelect(route.destination);
      setDestCustom("");
    } else {
      setDestSelect("Lainnya");
      setDestCustom(route.destination);
    }

    setDepartureTime(route.departureTime || "08:00");
    setDuration(route.description.replace(/[^0-9]/g, "") || "4");
    setSelectedVehicleId(route.carTypeId || null);
    setPrice(route.price.toString());

    // Parse facilities
    const tags = route.tags.toLowerCase();
    setFacilityAC(tags.includes("ac"));
    setFacilitySeat(tags.includes("seat"));
    setFacilityUSB(tags.includes("usb") || tags.includes("charger"));
    setFacilitySnack(tags.includes("snack") || tags.includes("mineral"));

    // Parse images
    if (route.imageUrl) {
      setUploadedImages(route.imageUrl.split(",").map(url => url.trim()).filter(Boolean));
    } else {
      setUploadedImages(["/images/toyota-hiace.jpg"]);
    }

    setErrorMessage("");
    setIsFormOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    const finalOrigin = originSelect === "Lainnya" ? originCustom.trim() : originSelect;
    const finalDestination = destSelect === "Lainnya" ? destCustom.trim() : destSelect;

    if (!finalOrigin) {
      setErrorMessage("Kota asal wajib diisi");
      setSubmitting(false);
      return;
    }

    if (!finalDestination) {
      setErrorMessage("Kota tujuan wajib diisi");
      setSubmitting(false);
      return;
    }

    const parsedPrice = parseInt(price, 10);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMessage("Harga per kursi harus berupa angka positif");
      setSubmitting(false);
      return;
    }

    if (!selectedVehicleId) {
      setErrorMessage("Silakan pilih armada kendaraan");
      setSubmitting(false);
      return;
    }

    if (uploadedImages.length === 0) {
      setErrorMessage("Silakan masukkan minimal satu foto unit");
      setSubmitting(false);
      return;
    }

    // Assemble tags
    const activeFacilities = [];
    if (facilityAC) activeFacilities.push("Full AC");
    if (facilitySeat) activeFacilities.push("Reclining Seat");
    if (facilityUSB) activeFacilities.push("USB Charger");
    if (facilitySnack) activeFacilities.push("Snack & Mineral Water");
    const tagsString = activeFacilities.join(", ");

    const payload = {
      origin: finalOrigin,
      destination: finalDestination,
      price: parsedPrice,
      description: `Estimasi perjalanan ${duration} Jam`,
      imageUrl: uploadedImages.join(", "), // Comma-separated list for gallery
      tags: tagsString,
      departureTime,
      carTypeId: selectedVehicleId,
    };

    try {
      let res;
      if (currentRoute) {
        res = await updateRoute(currentRoute.id, payload);
      } else {
        res = await createRoute(payload);
      }

      if (res.success) {
        setIsFormOpen(false);
        loadData();
      } else {
        setErrorMessage(res.error || "Gagal menyimpan rute");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan koneksi");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Apakah Anda yakin ingin menghapus rute ini? Semua jadwal yang terikat rute ini juga akan dihapus.")) {
      return;
    }

    try {
      const res = await deleteRoute(id);
      if (res.success) {
        loadData();
      } else {
        alert(res.error || "Gagal menghapus rute");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus rute");
    }
  }

  return (
    <div className="space-y-6">
      {isFormOpen ? (
        <div className="space-y-6 animate-fade-in">
          {/* Form Header */}
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary tracking-tight">
                {currentRoute ? "Sunting Paket Rute" : "Tambah Rute & Jadwal Baru"}
              </h1>
              <p className="text-sm text-on-surface-variant font-medium mt-1">
                Konfigurasi detail rute perjalanan, kendaraan, jadwal keberangkatan, dan unggah foto unit secara lengkap.
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(false)}
              className="border border-outline-variant/60 text-on-surface-variant px-5 py-3 rounded-2xl text-sm font-semibold tracking-wider uppercase flex items-center gap-2 hover:bg-surface hover:scale-[1.01] active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <MIcon name="arrow_back" className="text-base" /> Kembali ke Daftar
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-4 bg-error-container text-on-error-container rounded-2xl text-xs font-semibold flex items-center gap-2 border border-error/10 animate-fade-in">
                <MIcon name="error" className="text-base" /> {errorMessage}
              </div>
            )}

            {/* Grid 1: Route & Media */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* 1. Informasi Rute Card */}
              <div className="lg:col-span-2 bg-white border border-outline-variant/30 rounded-[32px] p-8 shadow-sm space-y-6">
                <h4 className="font-bold text-primary flex items-center gap-2 text-base border-b border-outline-variant/15 pb-3">
                  <MIcon name="alt_route" className="text-lg" /> Informasi Rute
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Kota Asal</label>
                    <select
                      value={originSelect}
                      onChange={(e) => setOriginSelect(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3.5 px-4 text-primary font-semibold outline-none focus:border-primary text-sm cursor-pointer"
                    >
                      <option value="Jember">Jember</option>
                      <option value="Surabaya">Surabaya</option>
                      <option value="Malang">Malang</option>
                      <option value="Banyuwangi">Banyuwangi</option>
                      <option value="Yogyakarta">Yogyakarta</option>
                      <option value="Lainnya">Lainnya (Tulis Manual)</option>
                    </select>
                    {originSelect === "Lainnya" && (
                      <input
                        type="text"
                        required
                        value={originCustom}
                        onChange={(e) => setOriginCustom(e.target.value)}
                        placeholder="Masukkan Kota Asal"
                        className="w-full mt-3 bg-white border border-outline-variant/30 rounded-2xl py-3.5 px-4 text-primary font-semibold outline-none focus:border-primary text-sm animate-fade-in"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Kota Tujuan</label>
                    <select
                      value={destSelect}
                      onChange={(e) => setDestSelect(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3.5 px-4 text-primary font-semibold outline-none focus:border-primary text-sm cursor-pointer"
                    >
                      <option value="Surabaya">Surabaya</option>
                      <option value="Jember">Jember</option>
                      <option value="Malang">Malang</option>
                      <option value="Banyuwangi">Banyuwangi</option>
                      <option value="Yogyakarta">Yogyakarta</option>
                      <option value="Lainnya">Lainnya (Tulis Manual)</option>
                    </select>
                    {destSelect === "Lainnya" && (
                      <input
                        type="text"
                        required
                        value={destCustom}
                        onChange={(e) => setDestCustom(e.target.value)}
                        placeholder="Masukkan Kota Tujuan"
                        className="w-full mt-3 bg-white border border-outline-variant/30 rounded-2xl py-3.5 px-4 text-primary font-semibold outline-none focus:border-primary text-sm animate-fade-in"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Unit Photos Card (on right) */}
              <div className="bg-white border border-outline-variant/30 rounded-[32px] p-8 shadow-sm space-y-6 lg:row-span-2">
                <h4 className="font-bold text-primary flex items-center gap-2 text-base border-b border-outline-variant/15 pb-3">
                  <MIcon name="image" className="text-lg" /> Foto Unit (Maks 5)
                </h4>
                
                {/* File Upload Input */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">Unggah Gambar Armada (PNG/JPG)</label>
                  <div className="relative border-2 border-dashed border-outline-variant/40 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container-lowest transition-colors group">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={uploading}
                    />
                    <MIcon name="cloud_upload" className="text-3xl text-primary group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs font-bold text-primary mt-2">
                      {uploading ? "Mengunggah..." : "Pilih File / Seret Kemari"}
                    </span>
                    <span className="text-2xs text-on-surface-variant mt-1">Format gambar (Maksimal 5)</span>
                  </div>
                </div>

                {/* Photo Path Manual Option */}
                <div className="space-y-2 pt-2 border-t border-outline-variant/10">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">Atau Path Gambar Manual</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={photoInput}
                      onChange={(e) => setPhotoInput(e.target.value)}
                      placeholder="Contoh: /images/toyota-hiace.jpg"
                      className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-xl px-3 py-2 text-xs font-semibold outline-none text-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddPhoto}
                      className="bg-primary text-on-primary px-4 rounded-xl text-xs font-bold hover:opacity-90 transition-all active:scale-95"
                    >
                      Tambah
                    </button>
                  </div>
                </div>

                {/* Thumbnail List */}
                <div className="space-y-2 pt-2 border-t border-outline-variant/10">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">Daftar Foto Unit ({uploadedImages.length})</label>
                  <div className="grid grid-cols-2 gap-3">
                    {uploadedImages.map((url, idx) => (
                      <div key={idx} className="relative h-24 bg-surface rounded-xl overflow-hidden border border-outline-variant/30 group shadow-2xs">
                        <img src={url} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1.5 right-1.5 bg-error text-white h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold hover:scale-110 shadow-md transition-all cursor-pointer"
                          title="Hapus"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {uploadedImages.length === 0 && (
                      <div className="col-span-2 border-2 border-dashed border-outline-variant/20 rounded-2xl h-24 flex flex-col items-center justify-center text-xs text-on-surface-variant font-bold p-3">
                        <span>Belum ada foto unit ditambahkan</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Jadwal & Kendaraan Card */}
              <div className="lg:col-span-2 bg-white border border-outline-variant/30 rounded-[32px] p-8 shadow-sm space-y-6">
                <h4 className="font-bold text-primary flex items-center gap-2 text-base border-b border-outline-variant/15 pb-3">
                  <MIcon name="pending_actions" className="text-lg" /> Jadwal & Kendaraan
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Waktu Keberangkatan</label>
                    <input
                      type="text"
                      required
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3.5 px-4 text-primary font-semibold outline-none focus:border-primary text-sm"
                      placeholder="Contoh: 08:30 atau 19:15"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Estimasi Durasi (Jam)</label>
                    <input
                      type="number"
                      required
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3.5 px-4 text-primary font-semibold outline-none focus:border-primary text-sm"
                      placeholder="Contoh: 4"
                    />
                  </div>
                </div>

                {/* Vehicle selection cards */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">Pilih Armada Mobil</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {vehicles.map((v) => {
                      const isSelected = selectedVehicleId === v.id;
                      return (
                        <div
                          key={v.id}
                          onClick={() => setSelectedVehicleId(v.id)}
                          className={`border rounded-2xl p-5 flex items-center gap-4 cursor-pointer select-none transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                              : "border-outline-variant/30 bg-white hover:bg-surface-container-lowest"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSelected ? "bg-primary/10 text-primary" : "bg-surface text-outline"}`}>
                            <MIcon 
                              name={v.name.toLowerCase().includes("hiace") ? "directions_bus" : "airport_shuttle"} 
                              className="text-2xl" 
                            />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-primary block leading-tight">{v.name}</span>
                            <span className="text-2xs text-on-surface-variant font-medium block mt-1">{v.capacity} Kursi Tersedia</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* Grid 2: Facilities & Price */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* 1. Fasilitas Card */}
              <div className="lg:col-span-2 bg-white border border-outline-variant/30 rounded-[32px] p-8 shadow-sm space-y-6">
                <h4 className="font-bold text-primary flex items-center gap-2 text-base border-b border-outline-variant/15 pb-3">
                  <MIcon name="spa" className="text-lg" /> Fasilitas Unggulan
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-bold text-primary">
                  <label className="flex items-center gap-4 bg-surface-container-low/40 p-4 rounded-2xl border border-outline-variant/10 cursor-pointer select-none hover:bg-surface transition-all">
                    <input
                      type="checkbox"
                      checked={facilityAC}
                      onChange={(e) => setFacilityAC(e.target.checked)}
                      className="h-5 w-5 rounded-md border-outline-variant accent-primary cursor-pointer"
                    />
                    <span>Full AC</span>
                  </label>

                  <label className="flex items-center gap-4 bg-surface-container-low/40 p-4 rounded-2xl border border-outline-variant/10 cursor-pointer select-none hover:bg-surface transition-all">
                    <input
                      type="checkbox"
                      checked={facilitySeat}
                      onChange={(e) => setFacilitySeat(e.target.checked)}
                      className="h-5 w-5 rounded-md border-outline-variant accent-primary cursor-pointer"
                    />
                    <span>Reclining Seat</span>
                  </label>

                  <label className="flex items-center gap-4 bg-surface-container-low/40 p-4 rounded-2xl border border-outline-variant/10 cursor-pointer select-none hover:bg-surface transition-all">
                    <input
                      type="checkbox"
                      checked={facilityUSB}
                      onChange={(e) => setFacilityUSB(e.target.checked)}
                      className="h-5 w-5 rounded-md border-outline-variant accent-primary cursor-pointer"
                    />
                    <span>USB Charger</span>
                  </label>

                  <label className="flex items-center gap-4 bg-surface-container-low/40 p-4 rounded-2xl border border-outline-variant/10 cursor-pointer select-none hover:bg-surface transition-all">
                    <input
                      type="checkbox"
                      checked={facilitySnack}
                      onChange={(e) => setFacilitySnack(e.target.checked)}
                      className="h-5 w-5 rounded-md border-outline-variant accent-primary cursor-pointer"
                    />
                    <span>Snack & Mineral Water</span>
                  </label>
                </div>
              </div>

              {/* 2. Harga Tiket Card */}
              <div className="bg-white border border-outline-variant/30 rounded-[32px] p-8 shadow-sm space-y-6">
                <h4 className="font-bold text-primary flex items-center gap-2 text-base border-b border-outline-variant/15 pb-3">
                  <MIcon name="payments" className="text-lg" /> Harga Tiket
                </h4>
                
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Harga per Kursi (IDR)</label>
                  <div className="flex">
                    <div className="bg-surface-container border border-outline-variant/30 rounded-l-2xl px-5 py-3.5 text-sm font-bold text-primary flex items-center justify-center">
                      IDR
                    </div>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="flex-1 bg-white border-y border-r border-outline-variant/30 rounded-r-2xl py-3.5 px-4 text-primary font-bold outline-none focus:border-primary text-sm"
                      placeholder="250000"
                    />
                  </div>
                  <span className="text-2xs text-on-surface-variant/80 block font-semibold leading-relaxed">
                    Harga sudah termasuk pajak dan biaya operasional.
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Buttons */}
            <div className="flex gap-4 pt-6 border-t border-outline-variant/20 justify-end">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-8 py-4 border border-outline-variant/60 text-on-surface-variant font-bold rounded-2xl hover:bg-surface transition-all cursor-pointer text-xs uppercase tracking-wider"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-4 bg-primary text-on-primary font-bold rounded-2xl hover:bg-primary-container disabled:bg-primary/70 transition-all cursor-pointer text-xs uppercase tracking-wider"
              >
                {submitting ? "Menyimpan..." : "Simpan Rute"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary tracking-tight">Kelola Paket Rute & Jadwal</h1>
              <p className="text-sm text-on-surface-variant font-medium mt-1">
                Tambah rute baru secara terpadu, jadwalkan jam berangkat, serta kaitkan armada mobil & fasilitas.
              </p>
            </div>
            <button
              onClick={openCreateModal}
              disabled={vehicles.length === 0}
              className="bg-primary text-on-primary px-5 py-3 rounded-2xl text-sm font-semibold tracking-wider uppercase flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-md disabled:bg-primary-container/40"
            >
              <MIcon name="add" className="text-base" /> Tambah Rute & Jadwal
            </button>
          </div>

          {/* Constraints Warning */}
          {vehicles.length === 0 && !loading && (
            <div className="p-4 bg-tertiary-fixed/20 text-on-tertiary-container rounded-2xl text-sm font-semibold flex items-center gap-2 border border-tertiary/20">
              <MIcon name="warning" className="text-lg" />
              <span>
                Harap pastikan Anda telah memiliki minimal <strong>satu armada kendaraan</strong> terdaftar di tab sebelah sebelum membuat paket rute.
              </span>
            </div>
          )}

          {/* Routes List */}
          {loading ? (
            <div className="py-20 text-center font-medium text-on-surface-variant">Memuat rute operasional...</div>
          ) : (
            <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-outline-variant/30 text-sm">
                  <thead className="bg-surface-container-low font-bold text-primary">
                    <tr>
                      <th className="py-4 px-6 text-left">Asal → Tujuan</th>
                      <th className="py-4 px-6 text-center">Jadwal Jam</th>
                      <th className="py-4 px-6 text-left">Mobil</th>
                      <th className="py-4 px-6 text-left">Fasilitas</th>
                      <th className="py-4 px-6 text-right">Harga per Kursi</th>
                      <th className="py-4 px-6 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 text-on-surface">
                    {routes.map((r) => (
                      <tr key={r.id} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="py-4 px-6 font-bold text-primary">{r.origin} → {r.destination}</td>
                        <td className="py-4 px-6 text-center font-bold text-primary">
                          {r.departureTime ? (
                            <span className="flex items-center justify-center gap-1"><MIcon name="schedule" className="text-sm" /> {r.departureTime}</span>
                          ) : (
                            <span className="text-on-surface-variant text-xs">Belum dijadwalkan</span>
                          )}
                        </td>
                        <td className="py-4 px-6 font-semibold text-on-surface-variant">{r.vehicleName || "Bebas"}</td>
                        <td className="py-4 px-6 text-2xs font-semibold">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {r.tags.split(",").map((f, idx) => (
                              <span key={idx} className="bg-primary/5 text-primary border border-primary/5 px-2 py-0.5 rounded-md">
                                {f.trim()}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-primary">
                          Rp {r.price.toLocaleString("id-ID")}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => openEditModal(r)}
                              className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-all cursor-pointer"
                              title="Sunting Rute"
                            >
                              <MIcon name="edit" className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleDelete(r.id)}
                              className="p-2 text-error hover:bg-error-container/10 rounded-lg transition-all cursor-pointer"
                              title="Hapus Rute"
                            >
                              <MIcon name="delete" className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {routes.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-on-surface-variant font-medium">
                          Belum ada rute terdaftar. Silakan tambahkan paket perjalanan baru.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
