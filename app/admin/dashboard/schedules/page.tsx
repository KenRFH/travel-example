"use client";

import { useState, useEffect } from "react";
import {
  getSchedules,
  getRoutes,
  getCarTypes,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "@/app/actions/admin";

function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

interface Route {
  id: number;
  origin: string;
  destination: string;
}

interface CarType {
  id: number;
  name: string;
  capacity: number;
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

export default function SchedulesManager() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [vehicles, setVehicles] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null);

  // Form fields
  const [routeId, setRouteId] = useState("");
  const [carTypeId, setCarTypeId] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const [sData, rData, vData] = await Promise.all([
        getSchedules(),
        getRoutes(),
        getCarTypes(),
      ]);
      setSchedules(sData);
      setRoutes(rData);
      setVehicles(vData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // When vehicle selection changes, automatically update availableSeats default
  useEffect(() => {
    if (!currentSchedule && carTypeId) {
      const selected = vehicles.find((v) => v.id === parseInt(carTypeId, 10));
      if (selected) {
        setAvailableSeats(selected.capacity.toString());
      }
    }
  }, [carTypeId, vehicles, currentSchedule]);

  function openCreateModal() {
    setCurrentSchedule(null);
    setRouteId(routes[0]?.id.toString() || "");
    setCarTypeId(vehicles[0]?.id.toString() || "");
    setDepartureTime("08:00");
    setAvailableSeats(vehicles[0]?.capacity.toString() || "10");
    setErrorMessage("");
    setModalOpen(true);
  }

  function openEditModal(sched: Schedule) {
    setCurrentSchedule(sched);
    setRouteId(sched.routeId.toString());
    setCarTypeId(sched.carTypeId.toString());
    setDepartureTime(sched.departureTime);
    setAvailableSeats(sched.availableSeats.toString());
    setErrorMessage("");
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    const parsedRouteId = parseInt(routeId, 10);
    const parsedCarTypeId = parseInt(carTypeId, 10);
    const parsedSeats = parseInt(availableSeats, 10);

    if (isNaN(parsedRouteId) || parsedRouteId <= 0) {
      setErrorMessage("Silakan pilih rute perjalanan");
      setSubmitting(false);
      return;
    }
    if (isNaN(parsedCarTypeId) || parsedCarTypeId <= 0) {
      setErrorMessage("Silakan pilih jenis armada");
      setSubmitting(false);
      return;
    }
    if (isNaN(parsedSeats) || parsedSeats < 0) {
      setErrorMessage("Kursi tersedia harus bernilai positif");
      setSubmitting(false);
      return;
    }
    if (!departureTime) {
      setErrorMessage("Silakan tentukan jam keberangkatan");
      setSubmitting(false);
      return;
    }

    const payload = {
      routeId: parsedRouteId,
      carTypeId: parsedCarTypeId,
      departureTime,
      availableSeats: parsedSeats,
    };

    try {
      let res;
      if (currentSchedule) {
        res = await updateSchedule(currentSchedule.id, payload);
      } else {
        res = await createSchedule(payload);
      }

      if (res.success) {
        setModalOpen(false);
        loadData();
      } else {
        setErrorMessage(res.error || "Gagal menyimpan jadwal");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan koneksi");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Apakah Anda yakin ingin menghapus jadwal keberangkatan ini?")) {
      return;
    }

    try {
      const res = await deleteSchedule(id);
      if (res.success) {
        loadData();
      } else {
        alert(res.error || "Gagal menghapus jadwal");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus jadwal");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Kelola Jadwal Keberangkatan</h1>
          <p className="text-sm text-on-surface-variant font-medium mt-1">
            Jadwalkan armada mobil untuk melayani rute perjalanan tertentu pada jam departur yang ditentukan.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={routes.length === 0 || vehicles.length === 0}
          className="bg-primary text-on-primary px-5 py-3 rounded-2xl text-sm font-semibold tracking-wider uppercase flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-md disabled:bg-primary-container/40 disabled:cursor-not-allowed"
        >
          <MIcon name="add" className="text-base" /> Tambah Jadwal
        </button>
      </div>

      {/* Constraints Warning */}
      {(routes.length === 0 || vehicles.length === 0) && !loading && (
        <div className="p-4 bg-tertiary-fixed/20 text-on-tertiary-container rounded-2xl text-sm font-semibold flex items-center gap-2 border border-tertiary/20">
          <MIcon name="warning" className="text-lg" />
          <span>
            Harap pastikan Anda telah memiliki minimal <strong>satu rute perjalanan</strong> dan <strong>satu armada kendaraan</strong> terdaftar sebelum menambahkan jadwal baru.
          </span>
        </div>
      )}

      {/* Table List */}
      {loading ? (
        <div className="py-20 text-center font-medium text-on-surface-variant">Memuat data jadwal...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-outline-variant/30 text-sm">
              <thead className="bg-surface-container-low font-bold text-primary">
                <tr>
                  <th className="py-4 px-6 text-left">Rute Terkait</th>
                  <th className="py-4 px-6 text-left">Armada Mobil</th>
                  <th className="py-4 px-6 text-center">Jam Keberangkatan</th>
                  <th className="py-4 px-6 text-center">Sisa Kursi</th>
                  <th className="py-4 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-on-surface">
                {schedules.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="py-4 px-6 font-bold text-primary">
                      {s.route ? `${s.route.origin} → ${s.route.destination}` : `Rute ID: ${s.routeId} (Terhapus)`}
                    </td>
                    <td className="py-4 px-6 font-semibold text-on-surface-variant">
                      {s.carType ? s.carType.name : `Armada ID: ${s.carTypeId} (Terhapus)`}
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-primary flex items-center justify-center gap-1.5 h-14">
                      <MIcon name="schedule" className="text-sm" /> {s.departureTime}
                    </td>
                    <td className="py-4 px-6 text-center font-semibold">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        s.availableSeats > 0 ? "bg-primary/5 text-primary" : "bg-error-container text-on-error-container"
                      }`}>
                        {s.availableSeats} Kursi Kosong
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-all cursor-pointer"
                          title="Sunting"
                        >
                          <MIcon name="edit" className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-2 text-error hover:bg-error-container/10 rounded-lg transition-all cursor-pointer"
                          title="Hapus"
                        >
                          <MIcon name="delete" className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {schedules.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-on-surface-variant font-medium">
                      Belum ada jadwal keberangkatan terdaftar. Silakan tambahkan jadwal baru.
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
                {currentSchedule ? "Sunting Jadwal Departur" : "Tambah Jadwal Departur"}
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
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Pilih Rute Perjalanan</label>
                <select
                  required
                  value={routeId}
                  onChange={(e) => setRouteId(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3 px-4 text-primary font-semibold outline-none focus:border-primary cursor-pointer"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.origin} → {r.destination}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Pilih Armada Kendaraan</label>
                <select
                  required
                  value={carTypeId}
                  onChange={(e) => setCarTypeId(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3 px-4 text-primary font-semibold outline-none focus:border-primary cursor-pointer"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.capacity} Kursi)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Jam Departur / Keberangkatan</label>
                  <input
                    type="text"
                    required
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3 px-4 text-primary font-semibold outline-none focus:border-primary"
                    placeholder="Contoh: 08:30 atau 20:00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Sisa Kursi Tersedia</label>
                  <input
                    type="number"
                    required
                    value={availableSeats}
                    onChange={(e) => setAvailableSeats(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3 px-4 text-primary font-semibold outline-none focus:border-primary"
                    placeholder="Contoh: 10"
                  />
                </div>
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
