"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/app/actions/admin";

function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await loginAdmin(formData);

    if (res.success) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      setError(res.error || "Login failed");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface p-5 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 batik-pattern opacity-30 pointer-events-none" />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-primary font-bold hover:opacity-85 transition-opacity text-sm mb-6">
            <MIcon name="arrow_back" className="text-sm" /> Kembali ke Beranda
          </a>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Portal Admin Jember Travel
          </h1>
          <p className="text-sm text-on-surface-variant mt-2 font-medium">
            Masuk untuk mengelola rute, kendaraan, dan jadwal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-error-container text-on-error-container text-sm font-semibold rounded-2xl flex items-center gap-2 border border-error/10">
            <MIcon name="error" className="text-lg" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
              <MIcon name="person" className="text-sm text-primary" /> Username
            </label>
            <input
              type="text"
              name="username"
              required
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3 px-4 focus:border-primary focus:ring-2 focus:ring-primary/20 text-primary font-medium outline-none transition-all"
              placeholder="Masukkan username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
              <MIcon name="lock" className="text-sm text-primary" /> Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3 px-4 focus:border-primary focus:ring-2 focus:ring-primary/20 text-primary font-medium outline-none transition-all"
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary rounded-2xl py-4 text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-primary-container disabled:bg-primary-container/70 active:scale-95 transition-all shadow-lg cursor-pointer"
            style={{ boxShadow: "0 10px 25px -5px rgba(1,45,29,.2)" }}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </>
            ) : (
              <>
                Masuk Dashboard <MIcon name="login" />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
