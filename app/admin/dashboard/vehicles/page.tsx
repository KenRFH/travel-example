"use client";

import { useState, useEffect } from "react";
import { getCarTypes, createCarType, updateCarType, deleteCarType } from "@/app/actions/admin";

function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

interface CarType {
  id: number;
  name: string;
  capacity: number;
  facility: string;
}

export default function VehiclesManager() {
  const [vehicles, setVehicles] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<CarType | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [facility, setFacility] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const data = await getCarTypes();
      setVehicles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreateModal() {
    setCurrentVehicle(null);
    setName("");
    setCapacity("10");
    setFacility("AC, USB Charger, Air Mineral");
    setErrorMessage("");
    setModalOpen(true);
  }

  function openEditModal(vehicle: CarType) {
    setCurrentVehicle(vehicle);
    setName(vehicle.name);
    setCapacity(vehicle.capacity.toString());
    setFacility(vehicle.facility);
    setErrorMessage("");
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    const parsedCapacity = parseInt(capacity, 10);
    if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
      setErrorMessage("Kapasitas kursi harus berupa angka positif");
      setSubmitting(false);
      return;
    }

    const payload = {
      name,
      capacity: parsedCapacity,
      facility,
    };

    try {
      let res;
      if (currentVehicle) {
        res = await updateCarType(currentVehicle.id, payload);
      } else {
        res = await createCarType(payload);
      }

      if (res.success) {
        setModalOpen(false);
        loadData();
      } else {
        setErrorMessage(res.error || "Gagal menyimpan kendaraan");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan koneksi");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Apakah Anda yakin ingin menghapus armada ini? Semua jadwal keberangkatan yang menggunakan armada ini juga akan dihapus.")) {
      return;
    }

    try {
      const res = await deleteCarType(id);
      if (res.success) {
        loadData();
      } else {
        alert(res.error || "Gagal menghapus armada");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus armada");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Kelola Armada Mobil</h1>
          <p className="text-sm text-on-surface-variant font-medium mt-1">
            Daftarkan tipe mobil, kapasitas tempat duduk, beserta fasilitas di dalam kendaraan.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-primary text-on-primary px-5 py-3 rounded-2xl text-sm font-semibold tracking-wider uppercase flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-md"
        >
          <MIcon name="add" className="text-base" /> Tambah Armada
        </button>
      </div>

      {/* Table List */}
      {loading ? (
        <div className="py-20 text-center font-medium text-on-surface-variant">Memuat data armada...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-outline-variant/30 text-sm">
              <thead className="bg-surface-container-low font-bold text-primary">
                <tr>
                  <th className="py-4 px-6 text-left">Tipe Mobil / Nama Kendaraan</th>
                  <th className="py-4 px-6 text-center">Kapasitas Kursi</th>
                  <th className="py-4 px-6 text-left">Fasilitas On-Board</th>
                  <th className="py-4 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-on-surface">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="py-4 px-6 font-bold text-primary">{v.name}</td>
                    <td className="py-4 px-6 text-center font-semibold text-primary">{v.capacity} Kursi</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {v.facility.split(",").map((f, idx) => (
                          <span key={idx} className="bg-secondary/5 text-on-secondary-container border border-secondary/15 px-2.5 py-0.5 rounded-full text-2xs font-semibold">
                            {f.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => openEditModal(v)}
                          className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-all cursor-pointer"
                          title="Sunting"
                        >
                          <MIcon name="edit" className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="p-2 text-error hover:bg-error-container/10 rounded-lg transition-all cursor-pointer"
                          title="Hapus"
                        >
                          <MIcon name="delete" className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {vehicles.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-on-surface-variant font-medium">
                      Belum ada tipe mobil terdaftar. Silakan tambahkan armada baru.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-[32px] w-full max-w-xl overflow-hidden shadow-2xl animate-scale-up border border-outline-variant/30">
            <div className="bg-primary p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {currentVehicle ? "Sunting Detail Armada" : "Tambah Armada Baru"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <MIcon name="close" className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {errorMessage && (
                <div className="p-4 bg-error-container text-on-error-container rounded-2xl text-xs font-semibold flex items-center gap-2 border border-error/10">
                  <MIcon name="error" className="text-base" /> {errorMessage}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Tipe / Nama Mobil</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3 px-4 text-primary font-semibold outline-none focus:border-primary"
                  placeholder="Contoh: Toyota Hiace Premio"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Kapasitas Tempat Duduk (Kursi)</label>
                <input
                  type="number"
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3 px-4 text-primary font-semibold outline-none focus:border-primary"
                  placeholder="Contoh: 10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Fasilitas On-Board (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  required
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3 px-4 text-primary font-semibold outline-none focus:border-primary"
                  placeholder="Contoh: AC, USB Charger, Snack, Air Mineral"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/2 border border-outline-variant/50 text-on-surface-variant font-bold rounded-2xl py-3.5 hover:bg-surface transition-all cursor-pointer text-sm uppercase tracking-wider"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 bg-primary text-on-primary font-bold rounded-2xl py-3.5 hover:bg-primary-container disabled:bg-primary/70 transition-all cursor-pointer text-sm uppercase tracking-wider"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
