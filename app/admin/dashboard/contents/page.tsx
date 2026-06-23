"use client";

import { useState, useEffect } from "react";
import { getCompanyContent, updateCompanyContent } from "@/app/actions/admin";

function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

export default function ContentsPage() {
  const [selectedKey, setSelectedKey] = useState<"about" | "packages" | "private">("about");
  
  // JSON states as strings for editing
  const [jsonId, setJsonId] = useState("");
  const [jsonEn, setJsonEn] = useState("");
  
  // Validation errors
  const [errorId, setErrorId] = useState("");
  const [errorEn, setErrorEn] = useState("");
  
  // Saving states
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Load content whenever key changes
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");
      const result = await getCompanyContent(selectedKey);
      if (result) {
        setJsonId(JSON.stringify(result.contentId, null, 2));
        setJsonEn(JSON.stringify(result.contentEn, null, 2));
      } else {
        setJsonId("");
        setJsonEn("");
      }
      setLoading(false);
    }
    loadData();
  }, [selectedKey]);

  // Handle Id JSON input change & validation
  const handleIdChange = (val: string) => {
    setJsonId(val);
    if (!val.trim()) {
      setErrorId("JSON tidak boleh kosong");
      return;
    }
    try {
      JSON.parse(val);
      setErrorId("");
    } catch (err: any) {
      setErrorId(err.message || "Format JSON tidak valid");
    }
  };

  // Handle En JSON input change & validation
  const handleEnChange = (val: string) => {
    setJsonEn(val);
    if (!val.trim()) {
      setErrorEn("JSON cannot be empty");
      return;
    }
    try {
      JSON.parse(val);
      setErrorEn("");
    } catch (err: any) {
      setErrorEn(err.message || "Invalid JSON format");
    }
  };

  // Handle Save
  const handleSave = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    // Final syntax check
    let parsedId, parsedEn;
    try {
      parsedId = JSON.parse(jsonId);
    } catch (err: any) {
      setErrorMsg("JSON Indonesia memiliki error format: " + err.message);
      return;
    }
    try {
      parsedEn = JSON.parse(jsonEn);
    } catch (err: any) {
      setErrorMsg("JSON Inggris memiliki error format: " + err.message);
      return;
    }

    setLoading(true);
    const res = await updateCompanyContent(selectedKey, parsedId, parsedEn);
    setLoading(false);

    if (res.success) {
      setSuccessMsg("Konten halaman berhasil diperbarui secara real-time!");
      // Clear success message after 4s
      setTimeout(() => setSuccessMsg(""), 4000);
    } else {
      setErrorMsg(res.error || "Gagal memperbarui konten halaman.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Pengelola Konten Dinamis</h1>
          <p className="text-sm text-on-surface-variant font-medium mt-1">
            Edit dan perbarui isi teks halaman Tentang Kami, Layanan Private, dan Antar Paket secara langsung tanpa mengubah kode.
          </p>
        </div>
      </div>

      {/* Selector & Actions Row */}
      <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-primary mr-2 uppercase tracking-wider">Halaman:</span>
          {[
            { key: "about", label: "Tentang Kami", icon: "info" },
            { key: "private", label: "Layanan Private", icon: "directions_car" },
            { key: "packages", label: "Antar Paket", icon: "local_shipping" }
          ].map((tab) => {
            const isSelected = selectedKey === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedKey(tab.key as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary text-on-primary shadow-md"
                    : "bg-surface-container-low text-primary border border-outline-variant/10 hover:bg-primary/5"
                }`}
              >
                <MIcon name={tab.icon} className="text-base" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={loading || !!errorId || !!errorEn || !jsonId || !jsonEn}
            className="bg-primary text-on-primary px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <MIcon name="save" className="text-sm" />
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      {/* Toast Alert Status */}
      {successMsg && (
        <div className="p-4 bg-primary/10 border border-primary/20 text-primary rounded-2xl text-sm font-bold flex items-center gap-2.5 shadow-sm animate-fade-in">
          <MIcon name="check_circle" className="text-lg" /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-error-container border border-error/15 text-on-error-container rounded-2xl text-sm font-bold flex items-center gap-2.5 shadow-sm animate-fade-in">
          <MIcon name="error" className="text-lg" /> {errorMsg}
        </div>
      )}

      {/* Editor Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Indonesian Content Editor */}
        <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3">
            <h3 className="text-base font-bold text-primary flex items-center gap-2">
              <MIcon name="language" className="text-base text-primary/70" /> Bahasa Indonesia (ID)
            </h3>
            <span className={`text-2xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
              errorId ? "bg-error-container text-on-error-container" : "bg-primary/5 text-primary"
            }`}>
              {errorId ? "Syntax Error" : "JSON Valid"}
            </span>
          </div>

          <div className="space-y-1">
            <textarea
              value={jsonId}
              onChange={(e) => handleIdChange(e.target.value)}
              className={`w-full font-mono text-xs p-5 bg-surface-container-low rounded-2xl border outline-none min-h-[480px] leading-relaxed transition-all focus:bg-white ${
                errorId ? "border-error focus:ring-2 focus:ring-error/20" : "border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20"
              }`}
              placeholder="Masukkan JSON bahasa Indonesia di sini..."
            />
            {errorId && (
              <p className="text-2xs font-semibold text-error mt-1 flex items-center gap-1">
                <MIcon name="error" className="text-xs" /> {errorId}
              </p>
            )}
          </div>
        </div>

        {/* English Content Editor */}
        <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3">
            <h3 className="text-base font-bold text-primary flex items-center gap-2">
              <MIcon name="language" className="text-base text-primary/70" /> English (EN)
            </h3>
            <span className={`text-2xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
              errorEn ? "bg-error-container text-on-error-container" : "bg-primary/5 text-primary"
            }`}>
              {errorEn ? "Syntax Error" : "JSON Valid"}
            </span>
          </div>

          <div className="space-y-1">
            <textarea
              value={jsonEn}
              onChange={(e) => handleEnChange(e.target.value)}
              className={`w-full font-mono text-xs p-5 bg-surface-container-low rounded-2xl border outline-none min-h-[480px] leading-relaxed transition-all focus:bg-white ${
                errorEn ? "border-error focus:ring-2 focus:ring-error/20" : "border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20"
              }`}
              placeholder="Enter English JSON here..."
            />
            {errorEn && (
              <p className="text-2xs font-semibold text-error mt-1 flex items-center gap-1">
                <MIcon name="error" className="text-xs" /> {errorEn}
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Instructions / Key Guide Alert */}
      <div className="bg-surface-container border border-outline-variant/30 rounded-3xl p-6 flex gap-4 items-start">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <MIcon name="info" className="text-lg" />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-primary">Petunjuk Pengeditan Konten JSON</h4>
          <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
            Struktur JSON di atas mewakili seluruh elemen dinamis halaman. Anda dapat mengubah isi teks, menambahkan/mengurangi statistik di kolom <code>stats</code>, ataupun memperbarui timeline sejarah di kolom <code>history</code>. Pastikan struktur tanda baca JSON tetap valid (seperti tanda petik dua ganda, koma pemisah, dan kurung siku tutup).
          </p>
        </div>
      </div>
    </div>
  );
}
