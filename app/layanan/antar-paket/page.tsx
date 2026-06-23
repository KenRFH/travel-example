"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useTranslation } from "@/src/lib/i18n";
import { getCompanyContent } from "@/app/actions/admin";
import Image from "next/image";

function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

export default function AntarPaketPage() {
  const { t, locale } = useTranslation();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    async function loadContent() {
      const data = await getCompanyContent("packages");
      if (data) {
        setContent(locale === "id" ? data.contentId : data.contentEn);
      }
    }
    loadContent();
  }, [locale]);

  // Fallback defaults if DB is loading or empty
  const defaultId = {
    heroBadge: "Layanan Logistik & Kargo",
    heroTitle: "Pengiriman Paket Kilat",
    heroDesc: "Kirim barang dan dokumen Anda dengan aman, cepat, dan terpercaya bersama armada Jember Travel.",
    serviceTitle: "Keunggulan Layanan Paket Kami",
    serviceSubtitle: "Mengapa memilih layanan pengiriman paket Jember Travel?",
    services: [
      { icon: "speed", title: "Sama Hari Sampai (Same Day)", desc: "Paket Anda dikirim hari ini dan tiba hari ini juga, mengikuti jadwal keberangkatan armada kami." },
      { icon: "local_shipping", title: "Pengantaran Door-to-Door", desc: "Kami menjemput paket ke rumah Anda dan mengantarkannya langsung ke alamat tujuan secara presisi." },
      { icon: "security", title: "Keamanan Terjamin", desc: "Barang dikemas dan disimpan dengan aman di bagasi armada khusus untuk menghindari kerusakan." },
      { icon: "tracking", title: "Pelacakan Mudah", desc: "Dapatkan status pengiriman secara real-time dengan menghubungi admin kami." }
    ],
    pricingTitle: "Daftar Harga & Rute Pengiriman",
    pricingSubtitle: "Tarif hemat untuk berbagai kota tujuan di Jawa Timur.",
    pricings: [
      { route: "Jember - Surabaya", price: "Rp 50.000", est: "Same Day / 1 Hari" },
      { route: "Jember - Malang", price: "Rp 50.000", est: "Same Day / 1 Hari" },
      { route: "Jember - Banyuwangi", price: "Rp 40.000", est: "Same Day / 1 Hari" },
      { route: "Surabaya - Jember", price: "Rp 50.000", est: "Same Day / 1 Hari" }
    ],
    ctaTitle: "Ingin Mengirim Paket?",
    ctaSubtitle: "Hubungi admin kami sekarang untuk pemesanan slot pengiriman barang.",
    ctaButton: "Hubungi Admin Paket"
  };

  const defaultEn = {
    heroBadge: "Logistics & Cargo Service",
    heroTitle: "Express Package Delivery",
    heroDesc: "Send your goods and documents safely, quickly, and reliably with the Jember Travel fleet.",
    serviceTitle: "Why Choose Our Package Delivery?",
    serviceSubtitle: "Why choose Jember Travel express cargo services?",
    services: [
      { icon: "speed", title: "Same Day Delivery", desc: "Your package is sent today and arrives today, following our fleet's departure schedules." },
      { icon: "local_shipping", title: "Door-to-Door Service", desc: "We pick up the package from your doorstep and deliver it directly to the recipient's address." },
      { icon: "security", title: "Guaranteed Security", desc: "Goods are packed and stored securely in dedicated fleet cargo compartments to prevent damage." },
      { icon: "tracking", title: "Easy Tracking", desc: "Get real-time delivery status by contacting our support admin." }
    ],
    pricingTitle: "Pricing & Delivery Routes",
    pricingSubtitle: "Affordable rates for various destination cities in East Java.",
    pricings: [
      { route: "Jember - Surabaya", price: "Rp 50,000", est: "Same Day / 1 Day" },
      { route: "Jember - Malang", price: "Rp 50,000", est: "Same Day / 1 Day" },
      { route: "Jember - Banyuwangi", price: "Rp 40,000", est: "Same Day / 1 Day" },
      { route: "Surabaya - Jember", price: "Rp 50,000", est: "Same Day / 1 Day" }
    ],
    ctaTitle: "Ready to Send a Package?",
    ctaSubtitle: "Contact our admin now to book a cargo slot.",
    ctaButton: "Contact Package Admin"
  };

  const data = content || (locale === "id" ? defaultId : defaultEn);

  return (
    <>
      <Navbar />
      <main className="relative pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[420px] flex items-center justify-center text-white py-20 md:py-32 overflow-hidden rounded-b-[3rem]">
          {/* Background Image & Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            {/* Gradient overlay: Dark green at top, fading to solid white at the bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/40 to-white z-10" />
            <Image
              src="/images/screen.png"
              alt={data.heroTitle}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Batik Pattern Overlay */}
          <div className="absolute inset-0 batik-pattern opacity-10 pointer-events-none z-10" />
          
          <div className="relative z-20 max-w-[1280px] mx-auto px-5 md:px-16 text-center">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-primary-fixed-dim rounded-full text-sm font-semibold tracking-wider uppercase mb-6 backdrop-blur-md border border-white/10">
              {data.heroBadge}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-sm">
              {data.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              {data.heroDesc}
            </p>
          </div>
        </section>

        {/* Benefits Grid Section */}
        <section className="napas-section max-w-[1280px] mx-auto px-5 md:px-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight">
              {data.serviceTitle}
            </h2>
            <p className="text-on-surface-variant font-medium">
              {data.serviceSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.services.map((service: any, index: number) => (
              <div 
                key={index} 
                className="bg-white rounded-3xl p-8 border border-outline-variant/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center mb-6 shadow-md shadow-primary/20">
                  <MIcon name={service.icon} className="text-2xl" />
                </div>
                <h4 className="text-lg font-bold text-primary mb-3">{service.title}</h4>
                <p className="text-on-surface-variant font-medium text-xs leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing / Routes Table Section */}
        <section className="bg-surface-container-low border-y border-outline-variant/20 py-20">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight">
                {data.pricingTitle}
              </h2>
              <p className="text-on-surface-variant font-medium">
                {data.pricingSubtitle}
              </p>
            </div>

            <div className="bg-white rounded-[32px] overflow-hidden border border-outline-variant/30 shadow-md max-w-4xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-primary text-white text-xs font-bold uppercase tracking-wider">
                      <th className="py-4 px-6 md:px-8">Rute Pengiriman</th>
                      <th className="py-4 px-6 md:px-8">Tarif Dasar</th>
                      <th className="py-4 px-6 md:px-8">Estimasi Waktu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-sm font-semibold text-primary">
                    {data.pricings.map((priceItem: any, index: number) => (
                      <tr key={index} className="hover:bg-primary/5 transition-colors">
                        <td className="py-4.5 px-6 md:px-8 flex items-center gap-2">
                          <MIcon name="local_post_office" className="text-primary/70 text-lg" />
                          {priceItem.route}
                        </td>
                        <td className="py-4.5 px-6 md:px-8 text-primary font-bold">{priceItem.price}</td>
                        <td className="py-4.5 px-6 md:px-8 text-on-surface-variant">{priceItem.est}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="max-w-[1280px] mx-auto px-5 md:px-16 my-24">
          <div 
            className="bg-primary rounded-[32px] p-12 md:p-20 text-center relative overflow-hidden shadow-xl"
            style={{ 
              backgroundColor: "#012d1d", 
              boxShadow: "0 20px 40px -15px rgba(1,45,29,.3)" 
            }}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10 tracking-tight">
              {data.ctaTitle}
            </h2>
            <p className="text-white/85 text-lg mb-10 max-w-lg mx-auto relative z-10 leading-relaxed">
              {data.ctaSubtitle}
            </p>
            <div className="flex justify-center relative z-10">
              <a
                href={`https://wa.me/6281336104254?text=${encodeURIComponent(
                  locale === "id"
                    ? "Halo Jember Travel, saya tertarik untuk mengirim paket barang."
                    : "Hello Jember Travel, I am interested in sending a package delivery."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary px-8 py-4 rounded-2xl text-sm font-bold tracking-wider uppercase hover:bg-surface-container hover:scale-[1.02] active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <MIcon name="chat" className="text-lg" />
                {data.ctaButton}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
