import { getRoutes, getCarTypes, getSchedules } from "@/app/actions/admin";
import Link from "next/link";

function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

export default async function DashboardPage() {
  const [routesList, carTypesList, schedulesList] = await Promise.all([
    getRoutes(),
    getCarTypes(),
    getSchedules(),
  ]);

  const stats = [
    {
      title: "Rute Perjalanan",
      count: routesList.length,
      icon: "route",
      desc: "Rute aktif terdaftar",
      color: "bg-primary/10 text-primary border-primary/20",
      href: "/admin/dashboard/routes",
    },
    {
      title: "Armada Kendaraan",
      count: carTypesList.length,
      icon: "airport_shuttle",
      desc: "Jenis mobil terdaftar",
      color: "bg-secondary-fixed/30 text-on-secondary-container border-secondary/20",
      href: "/admin/dashboard/vehicles",
    },
    {
      title: "Jadwal Harian",
      count: schedulesList.length,
      icon: "calendar_month",
      desc: "Departur terjadwal",
      color: "bg-tertiary-fixed/30 text-on-tertiary-container border-tertiary/20",
      href: "/admin/dashboard/schedules",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-primary tracking-tight">Ringkasan Operasional</h1>
        <p className="text-sm text-on-surface-variant font-medium mt-1">
          Pantau dan kelola seluruh penawaran rute, armada bus/mobil, serta jadwal departur Jember Travel.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, idx) => (
          <Link
            key={idx}
            href={s.href}
            className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="space-y-2">
              <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider block">
                {s.title}
              </span>
              <span className="text-4xl font-bold text-primary block leading-none">
                {s.count}
              </span>
              <span className="text-xs text-on-surface-variant block font-medium">
                {s.desc}
              </span>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${s.color} group-hover:scale-105 transition-transform`}>
              <MIcon name={s.icon} className="text-2xl" />
            </div>
          </Link>
        ))}
      </div>

      {/* Split Tables View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Routes */}
        <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-bold text-primary flex items-center gap-2">
              <MIcon name="route" className="text-lg" /> Rute Perjalanan Terbaru
            </h4>
            <Link
              href="/admin/dashboard/routes"
              className="text-xs font-bold text-primary hover:underline uppercase tracking-wider"
            >
              Kelola
            </Link>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-outline-variant/30">
            <table className="min-w-full divide-y divide-outline-variant/30 text-sm">
              <thead className="bg-surface-container-low font-bold text-primary">
                <tr>
                  <th className="py-3 px-4 text-left">Asal → Tujuan</th>
                  <th className="py-3 px-4 text-right">Harga Tiket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-on-surface">
                {routesList.slice(0, 4).map((r) => (
                  <tr key={r.id} className="hover:bg-surface-container-lowest">
                    <td className="py-3 px-4 font-semibold">{r.origin} → {r.destination}</td>
                    <td className="py-3 px-4 text-right font-bold text-primary">
                      Rp {r.price.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
                {routesList.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-on-surface-variant font-medium">
                      Belum ada rute terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Available Cars */}
        <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-bold text-primary flex items-center gap-2">
              <MIcon name="airport_shuttle" className="text-lg" /> Armada Terdaftar
            </h4>
            <Link
              href="/admin/dashboard/vehicles"
              className="text-xs font-bold text-primary hover:underline uppercase tracking-wider"
            >
              Kelola
            </Link>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-outline-variant/30">
            <table className="min-w-full divide-y divide-outline-variant/30 text-sm">
              <thead className="bg-surface-container-low font-bold text-primary">
                <tr>
                  <th className="py-3 px-4 text-left">Nama Mobil</th>
                  <th className="py-3 px-4 text-center">Kapasitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-on-surface">
                {carTypesList.slice(0, 4).map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container-lowest">
                    <td className="py-3 px-4 font-semibold">{c.name}</td>
                    <td className="py-3 px-4 text-center font-bold text-primary">{c.capacity} Kursi</td>
                  </tr>
                ))}
                {carTypesList.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-on-surface-variant font-medium">
                      Belum ada armada terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
