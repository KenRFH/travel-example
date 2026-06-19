"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAdmin } from "@/app/actions/admin";
import { useState } from "react";

function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const menuItems = [
    {
      label: "Ringkasan",
      icon: "dashboard",
      href: "/admin/dashboard",
    },
    {
      label: "Rute Perjalanan",
      icon: "route",
      href: "/admin/dashboard/routes",
    },
    {
      label: "Armada Mobil",
      icon: "airport_shuttle",
      href: "/admin/dashboard/vehicles",
    },
    {
      label: "Jadwal Keberangkatan",
      icon: "calendar_month",
      href: "/admin/dashboard/schedules",
    },
  ];

  async function handleLogout() {
    setLoggingOut(true);
    await logoutAdmin();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-64 bg-primary text-white flex flex-col justify-between border-r border-primary-container z-20 h-screen fixed top-0 left-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold tracking-tight">Admin Jember</h2>
        <span className="text-xs text-white/50 font-semibold tracking-wider uppercase block mt-1">
          Travel Management
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold tracking-wide transition-all ${
                isActive
                  ? "bg-white text-primary shadow-lg"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <MIcon name={item.icon} className="text-lg" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-white/70 hover:bg-white/5 hover:text-white transition-all"
        >
          <MIcon name="home" className="text-sm" /> Lihat Beranda Utama
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-error-container hover:bg-error-container/10 transition-all cursor-pointer text-left"
        >
          <MIcon name="logout" className="text-lg" />
          {loggingOut ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </aside>
  );
}
