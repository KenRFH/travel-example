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

  // States for Private Vehicles CRUD
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [vehId, setVehId] = useState("");
  const [vehName, setVehName] = useState("");
  const [vehBadgeId, setVehBadgeId] = useState("");
  const [vehBadgeEn, setVehBadgeEn] = useState("");
  const [vehImage, setVehImage] = useState("");
  const [vehSeats, setVehSeats] = useState("");
  const [vehBags, setVehBags] = useState("");
  const [vehMaxSeats, setVehMaxSeats] = useState("");
  const [vehFeaturesId, setVehFeaturesId] = useState("");
  const [vehFeaturesEn, setVehFeaturesEn] = useState("");
  const [vehPriceId, setVehPriceId] = useState("");
  const [vehPriceEn, setVehPriceEn] = useState("");
  const [vehRawPrice, setVehRawPrice] = useState("");

  // Parse ID & EN JSON objects
  let idObj: any = null;
  let enObj: any = null;
  try {
    idObj = jsonId ? JSON.parse(jsonId) : null;
  } catch (e) {}
  try {
    enObj = jsonEn ? JSON.parse(jsonEn) : null;
  } catch (e) {}

  const privateVehiclesId = idObj && Array.isArray(idObj.vehicles) ? idObj.vehicles : [];
  const privateVehiclesEn = enObj && Array.isArray(enObj.vehicles) ? enObj.vehicles : [];

  const deletePrivateVehicle = (id: string) => {
    if (!idObj || !enObj) return;
    const newVehiclesId = privateVehiclesId.filter((v: any) => v.id !== id);
    const newVehiclesEn = privateVehiclesEn.filter((v: any) => v.id !== id);
    
    idObj.vehicles = newVehiclesId;
    enObj.vehicles = newVehiclesEn;
    
    setJsonId(JSON.stringify(idObj, null, 2));
    setJsonEn(JSON.stringify(enObj, null, 2));
  };

  const openVehCreateModal = () => {
    setEditingVehicle(null);
    setVehId("zenix-" + Date.now().toString().slice(-4));
    setVehName("");
    setVehBadgeId("");
    setVehBadgeEn("");
    setVehImage("/images/toyota_zenix.png");
    setVehSeats("6 Seats");
    setVehBags("3 Bags");
    setVehMaxSeats("6");
    setVehFeaturesId("Full AC Dual Zone, Reclining Seat Premium, Professional Driver");
    setVehFeaturesEn("Full AC Dual Zone, Premium Reclining Seats, Professional Driver");
    setVehPriceId("Rp 950.000");
    setVehPriceEn("Rp 950,000");
    setVehRawPrice("950000");
    setVehicleModalOpen(true);
  };

  const openVehEditModal = (id: string) => {
    const vId = privateVehiclesId.find((v: any) => v.id === id);
    const vEn = privateVehiclesEn.find((v: any) => v.id === id) || vId;
    if (!vId) return;

    setEditingVehicle(vId);
    setVehId(vId.id);
    setVehName(vId.name || "");
    setVehBadgeId(vId.badge || "");
    setVehBadgeEn(vEn.badge || "");
    setVehImage(vId.image || "");
    setVehSeats(vId.seats || "");
    setVehBags(vId.bags || "");
    setVehMaxSeats(String(vId.maxSeats || ""));
    setVehFeaturesId(Array.isArray(vId.features) ? vId.features.join(", ") : "");
    setVehFeaturesEn(Array.isArray(vEn.features) ? vEn.features.join(", ") : "");
    setVehPriceId(vId.price || "");
    setVehPriceEn(vEn.price || "");
    setVehRawPrice(String(vId.rawPrice || ""));
    setVehicleModalOpen(true);
  };

  const savePrivateVehicle = (vehData: any) => {
    if (!idObj || !enObj) return;
    
    // Prepare ID vehicle object
    const vId = {
      id: vehData.id,
      name: vehData.name,
      badge: vehData.badgeId,
      image: vehData.image,
      seats: vehData.seats,
      bags: vehData.bags,
      features: vehData.featuresId.split(",").map((s: string) => s.trim()).filter(Boolean),
      price: vehData.priceId,
      rawPrice: Number(vehData.rawPrice),
      maxSeats: Number(vehData.maxSeats)
    };

    // Prepare EN vehicle object
    const vEn = {
      id: vehData.id,
      name: vehData.name,
      badge: vehData.badgeEn,
      image: vehData.image,
      seats: vehData.seats,
      bags: vehData.bags,
      features: vehData.featuresEn.split(",").map((s: string) => s.trim()).filter(Boolean),
      price: vehData.priceEn,
      rawPrice: Number(vehData.rawPrice),
      maxSeats: Number(vehData.maxSeats)
    };

    let newVehiclesId = [...privateVehiclesId];
    let newVehiclesEn = [...privateVehiclesEn];

    const idxId = privateVehiclesId.findIndex((v: any) => v.id === vehData.id);
    const idxEn = privateVehiclesEn.findIndex((v: any) => v.id === vehData.id);

    if (editingVehicle) {
      if (idxId !== -1) newVehiclesId[idxId] = vId;
      if (idxEn !== -1) newVehiclesEn[idxEn] = vEn;
    } else {
      if (privateVehiclesId.some((v: any) => v.id === vehData.id)) {
        alert("ID kendaraan sudah digunakan!");
        return;
      }
      newVehiclesId.push(vId);
      newVehiclesEn.push(vEn);
    }

    idObj.vehicles = newVehiclesId;
    enObj.vehicles = newVehiclesEn;

    setJsonId(JSON.stringify(idObj, null, 2));
    setJsonEn(JSON.stringify(enObj, null, 2));
    setVehicleModalOpen(false);
  };

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

      {/* Visual CRUD Panel for Private Vehicles */}
      {selectedKey === "private" && (
        <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <MIcon name="directions_car" className="text-secondary" /> Kelola Daftar Armada Private (Visual CRUD)
              </h3>
              <p className="text-xs font-semibold text-on-surface-variant mt-0.5">
                Tambahkan, edit, atau hapus armada yang ditampilkan pada halaman charter travel secara visual.
              </p>
            </div>
            {idObj && enObj ? (
              <button
                onClick={openVehCreateModal}
                className="bg-primary text-on-primary px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <MIcon name="add" className="text-sm" /> Tambah Armada
              </button>
            ) : null}
          </div>

          {!idObj || !enObj ? (
            <div className="p-4 bg-error-container text-on-error-container rounded-2xl text-xs font-semibold flex items-center gap-2 border border-outline-variant/10">
              <MIcon name="error" className="text-base" />
              Format JSON di atas tidak valid. Harap perbaiki syntax error terlebih dahulu untuk mengaktifkan editor visual armada.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-outline-variant/30 text-xs">
                <thead className="bg-surface-container-low font-bold text-primary">
                  <tr>
                    <th className="py-3 px-4 text-left">Armada</th>
                    <th className="py-3 px-4 text-center">Kapasitas (Kursi/Tas)</th>
                    <th className="py-3 px-4 text-left">Fasilitas & Fitur</th>
                    <th className="py-3 px-4 text-right">Tarif Dasar</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 text-on-surface">
                  {privateVehiclesId.map((v: any) => {
                    return (
                      <tr key={v.id} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-primary">{v.name}</div>
                          {v.badge && (
                            <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded text-[10px] font-bold mt-1 inline-block">
                              {v.badge}
                            </span>
                          )}
                          <div className="text-[10px] text-on-surface-variant font-medium mt-0.5">ID: {v.id}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-semibold">
                          <div>{v.seats}</div>
                          <div className="text-on-surface-variant text-[10px]">{v.bags}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[280px]">
                            {Array.isArray(v.features) ? v.features.map((feat: string, idx: number) => (
                              <span key={idx} className="bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                                {feat}
                              </span>
                            )) : null}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-primary">
                          <div>{v.price}</div>
                          <div className="text-on-surface-variant text-[10px] font-semibold">Raw: {v.rawPrice}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex gap-1">
                            <button
                              onClick={() => openVehEditModal(v.id)}
                              className="p-1.5 text-primary hover:bg-primary/5 rounded-lg transition-all cursor-pointer"
                              title="Edit"
                            >
                              <MIcon name="edit" className="text-base" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus armada "${v.name}"?`)) {
                                  deletePrivateVehicle(v.id);
                                }
                              }}
                              className="p-1.5 text-error hover:bg-error-container/10 rounded-lg transition-all cursor-pointer"
                              title="Hapus"
                            >
                              <MIcon name="delete" className="text-base" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {privateVehiclesId.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-on-surface-variant font-semibold">
                        Belum ada armada private terdaftar. Klik "+ Tambah Armada" untuk menambahkannya.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

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

      {/* Vehicle Modal Dialog */}
      {vehicleModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up border border-outline-variant/30 max-h-[90vh] flex flex-col">
            <div className="bg-primary p-6 text-white flex justify-between items-center flex-shrink-0">
              <h3 className="text-lg font-bold">
                {editingVehicle ? "Sunting Armada Private" : "Tambah Armada Private Baru"}
              </h3>
              <button
                onClick={() => setVehicleModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <MIcon name="close" className="text-xl" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">ID Unik Armada</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingVehicle}
                    value={vehId}
                    onChange={(e) => setVehId(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-xs font-semibold text-primary outline-none focus:border-primary disabled:opacity-60"
                    placeholder="Contoh: zenix"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">Nama Kendaraan</label>
                  <input
                    type="text"
                    required
                    value={vehName}
                    onChange={(e) => setVehName(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-xs font-semibold text-primary outline-none focus:border-primary"
                    placeholder="Contoh: Toyota Innova Zenix"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">Badge (ID)</label>
                  <input
                    type="text"
                    value={vehBadgeId}
                    onChange={(e) => setVehBadgeId(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-xs font-semibold text-primary outline-none focus:border-primary"
                    placeholder="Contoh: Terpopuler"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">Badge (EN)</label>
                  <input
                    type="text"
                    value={vehBadgeEn}
                    onChange={(e) => setVehBadgeEn(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-xs font-semibold text-primary outline-none focus:border-primary"
                    placeholder="Contoh: Most Popular"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">Label Seats</label>
                  <input
                    type="text"
                    required
                    value={vehSeats}
                    onChange={(e) => setVehSeats(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-xs font-semibold text-primary outline-none focus:border-primary"
                    placeholder="Contoh: 6 Seats"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">Label Bags</label>
                  <input
                    type="text"
                    required
                    value={vehBags}
                    onChange={(e) => setVehBags(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-xs font-semibold text-primary outline-none focus:border-primary"
                    placeholder="Contoh: 3 Bags"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">Kapasitas Maksimal (Angka)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={vehMaxSeats}
                    onChange={(e) => setVehMaxSeats(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-xs font-semibold text-primary outline-none focus:border-primary"
                    placeholder="Contoh: 6"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">Path Gambar</label>
                  <input
                    type="text"
                    required
                    value={vehImage}
                    onChange={(e) => setVehImage(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-xs font-semibold text-primary outline-none focus:border-primary"
                    placeholder="/images/toyota_zenix.png"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">Tarif Teks (ID)</label>
                  <input
                    type="text"
                    required
                    value={vehPriceId}
                    onChange={(e) => setVehPriceId(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-xs font-semibold text-primary outline-none focus:border-primary"
                    placeholder="Rp 950.000"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">Tarif Teks (EN)</label>
                  <input
                    type="text"
                    required
                    value={vehPriceEn}
                    onChange={(e) => setVehPriceEn(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-xs font-semibold text-primary outline-none focus:border-primary"
                    placeholder="Rp 950,000"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">Tarif Angka (rawPrice)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={vehRawPrice}
                    onChange={(e) => setVehRawPrice(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-xs font-semibold text-primary outline-none focus:border-primary"
                    placeholder="950000"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">Fitur / Fasilitas (ID) - Pisahkan dengan koma</label>
                  <input
                    type="text"
                    required
                    value={vehFeaturesId}
                    onChange={(e) => setVehFeaturesId(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-xs font-semibold text-primary outline-none focus:border-primary"
                    placeholder="Full AC Dual Zone, Reclining Seat Premium, Professional Driver"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">Fitur / Fasilitas (EN) - Pisahkan dengan koma</label>
                  <input
                    type="text"
                    required
                    value={vehFeaturesEn}
                    onChange={(e) => setVehFeaturesEn(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-xs font-semibold text-primary outline-none focus:border-primary"
                    placeholder="Full AC Dual Zone, Premium Reclining Seats, Professional Driver"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-outline-variant/15 flex gap-4 bg-surface-container-low flex-shrink-0">
              <button
                type="button"
                onClick={() => setVehicleModalOpen(false)}
                className="w-1/2 border border-outline-variant/50 text-on-surface-variant font-bold rounded-xl py-3 hover:bg-white transition-all cursor-pointer text-xs uppercase tracking-wider"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!vehId || !vehName || !vehSeats || !vehBags || !vehMaxSeats || !vehFeaturesId || !vehFeaturesEn || !vehPriceId || !vehPriceEn || !vehRawPrice) {
                    alert("Harap lengkapi semua bidang wajib!");
                    return;
                  }
                  savePrivateVehicle({
                    id: vehId,
                    name: vehName,
                    badgeId: vehBadgeId,
                    badgeEn: vehBadgeEn,
                    image: vehImage,
                    seats: vehSeats,
                    bags: vehBags,
                    maxSeats: vehMaxSeats,
                    featuresId: vehFeaturesId,
                    featuresEn: vehFeaturesEn,
                    priceId: vehPriceId,
                    priceEn: vehPriceEn,
                    rawPrice: vehRawPrice
                  });
                }}
                className="w-1/2 bg-primary text-on-primary font-bold rounded-xl py-3 hover:bg-primary-container transition-all cursor-pointer text-xs uppercase tracking-wider"
              >
                Simpan Kendaraan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
