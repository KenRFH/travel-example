"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Locale = "id" | "en";

// Define the shape of our dictionary keys for type-safety or simple lookup.
const dictionary = {
  id: {
    // Navbar
    "nav.findTicket": "Cari Tiket",
    "nav.aboutUs": "Tentang Kami",
    "nav.packages": "Paket",
    "nav.login": "Masuk",
    "nav.lang": "ID/EN",

    // Hero
    "hero.badge": "Premium Travel Experience",
    "hero.title1": "Jelajahi Indahnya",
    "hero.title2": "Sudut Nusantara.",
    "hero.subtitle": "Kami menghadirkan kenyamanan perjalanan antar kota dengan sentuhan kehangatan layanan lokal yang tulus.",
    "hero.from": "Dari",
    "hero.to": "Ke",
    "hero.toPlaceholder": "Tujuan (Surabaya/Malang)",
    "hero.date": "Tanggal",
    "hero.searchBtn": "Cari Perjalanan",

    // Why Choose Us
    "why.badge": "Mengapa Memilih Kami",
    "why.subtitle": "Filosofi perjalanan kami berakar pada tiga pilar kenyamanan yang tak tergoyahkan.",
    "why.card1.title": "Layanan Tulus",
    "why.card1.desc": "Senyum dan keramahan kru kami bukan sekadar prosedur, melainkan budaya menghormati tamu khas Nusantara.",
    "why.card2.title": "Armada Nyaman",
    "why.card2.desc": "Kendaraan terbaru dengan perawatan berkala untuk memastikan setiap kilometer perjalanan terasa tenang dan aman.",
    "why.card3.title": "Harga Jujur",
    "why.card3.desc": "Transparansi tanpa biaya tersembunyi. Apa yang Anda lihat adalah apa yang Anda bayar, sebanding dengan kualitas.",

    // Popular Routes
    "routes.title": "Rute Terpopuler",
    "routes.subtitle": "Destinasi yang paling sering dirindukan oleh pelanggan kami.",
    "routes.viewAll": "Lihat Semua Rute",
    "routes.start": "Mulai",
    "routes.surabaya.desc": "Nikmati perjalanan melintasi jalur pantura yang efisien dan nyaman.",
    "routes.malang.desc": "Udara sejuk pegunungan menanti Anda di perjalanan yang menenangkan.",
    "routes.banyuwangi.desc": "Gerbang timur Jawa yang penuh dengan keajaiban alam dan tradisi.",

    // Testimonials
    "testi.badge": "Testimoni",
    "testi.title": "Apa Kata Pelanggan Kami?",
    "testi.avatarAlt": "Foto pelanggan",
    "testi.vanAlt": "Interior armada premium Jember Travel",

    // CTA
    "cta.title": "Siap Memulai Perjalanan Anda?",
    "cta.subtitle": "Pesan tiket Anda sekarang dan nikmati pengalaman perjalanan terbaik di Jawa Timur.",
    "cta.bookNow": "Pesan Sekarang",
    "cta.whatsapp": "Hubungi WhatsApp",

    // Footer
    "footer.desc": "Pusat layanan perjalanan premium yang menghubungkan hati dan kota di seluruh Indonesia.",
    "footer.col1.title": "Perusahaan",
    "footer.col1.link1": "Tentang Kami",
    "footer.col1.link2": "Layanan Paket",
    "footer.col1.link3": "Blog",
    "footer.col2.title": "Bantuan",
    "footer.col2.link1": "Pusat Bantuan",
    "footer.col2.link2": "Syarat & Ketentuan",
    "footer.col2.link3": "Kebijakan Privasi",
    "footer.col3.title": "Kontak",
    "footer.copyright": "© 2026 Jember Travel. Pelayanan Travel Terpercaya.",

    // About Us Page
    "about.hero.badge": "Kisah & Komitmen Kami",
    "about.hero.title": "Tentang Jember Travel",
    "about.hero.desc": "Menghubungkan hati dan kota dengan pelayanan tulus dari hati sejak 2018.",
    "about.vision.title": "Visi & Misi Kami",
    "about.vision.desc": "Menjadi pelopor transportasi premium di Jawa Timur yang memadukan kenyamanan modern dengan kehangatan keramahan lokal.",
    "about.mission.title": "Misi Kami",
    "about.mission.desc": "Memberikan layanan perjalanan yang aman, tepat waktu, transparan, serta mengutamakan nilai-nilai kesopanan dan ketulusan pelayanan khas Nusantara.",
    "about.values.title": "Nilai-Nilai Utama Kami",
    "about.values.subtitle": "Nilai yang kami pegang teguh dalam setiap kilometer perjalanan Anda.",
    "about.value1.title": "Pelayanan Tulus",
    "about.value1.desc": "Senyum dan keramahan kru kami bukan sekadar prosedur, melainkan budaya menghormati tamu khas Nusantara.",
    "about.value2.title": "Keselamatan Utama",
    "about.value2.desc": "Kondisi armada selalu prima dengan perawatan berkala dan kru yang terlatih demi keselamatan Anda.",
    "about.value3.title": "Harga Jujur & Transparan",
    "about.value3.desc": "Transparansi tanpa biaya tersembunyi. Apa yang Anda lihat adalah apa yang Anda bayar, sebanding dengan kualitas.",
    "about.history.title": "Perjalanan Sejarah Kami",
    "about.history.subtitle": "Bagaimana kami tumbuh dan berkembang untuk melayani Anda lebih baik.",
    "about.history.y2018.title": "2018 - Langkah Pertama",
    "about.history.y2018.desc": "Dimulai dengan 2 armada Avanza melayani rute Jember - Surabaya.",
    "about.history.y2020.title": "2020 - Ekspansi Armada",
    "about.history.y2020.desc": "Menambahkan armada Toyota Hiace Commuter untuk kenyamanan ekstra penumpang.",
    "about.history.y2022.title": "2022 - Layanan Kelas Premium",
    "about.history.y2022.desc": "Peluncuran Hiace Premio dengan fasilitas kelas eksekutif dan kenyamanan maksimal.",
    "about.history.y2024.title": "2024 - Transformasi Digital",
    "about.history.y2024.desc": "Pemesanan tiket online mudah dan sistem pemantauan posisi armada secara real-time.",
    "about.stats.pax.title": "Penumpang Terlayani",
    "about.stats.routes.title": "Rute Aktif",
    "about.stats.crew.title": "Kru Profesional",
    "about.stats.satisfaction.title": "Tingkat Kepuasan",
  },
  en: {
    // Navbar
    "nav.findTicket": "Find Ticket",
    "nav.aboutUs": "About Us",
    "nav.packages": "Packages",
    "nav.login": "Login",
    "nav.lang": "EN/ID",

    // Hero
    "hero.badge": "Premium Travel Experience",
    "hero.title1": "Explore the Beauty of",
    "hero.title2": "the Archipelago.",
    "hero.subtitle": "We bring comfortable intercity travel with a touch of genuine local hospitality.",
    "hero.from": "From",
    "hero.to": "To",
    "hero.toPlaceholder": "Destination (Surabaya/Malang)",
    "hero.date": "Date",
    "hero.searchBtn": "Search Trips",

    // Why Choose Us
    "why.badge": "Why Choose Us",
    "why.subtitle": "Our travel philosophy is rooted in three unwavering pillars of comfort.",
    "why.card1.title": "Genuine Service",
    "why.card1.desc": "Our crew's smile and friendliness are not just procedures, but a culture of honoring guests typical of the archipelago.",
    "why.card2.title": "Comfortable Fleet",
    "why.card2.desc": "Latest vehicles with regular maintenance to ensure every kilometer of the journey feels peaceful and safe.",
    "why.card3.title": "Honest Pricing",
    "why.card3.desc": "Transparency with no hidden fees. What you see is what you pay, matching the quality.",

    // Popular Routes
    "routes.title": "Popular Routes",
    "routes.subtitle": "Destinations most often missed by our customers.",
    "routes.viewAll": "View All Routes",
    "routes.start": "From",
    "routes.surabaya.desc": "Enjoy an efficient and comfortable journey across the northern coastal route.",
    "routes.malang.desc": "Cool mountain air awaits you in a relaxing journey.",
    "routes.banyuwangi.desc": "The eastern gateway of Java, full of natural wonders and traditions.",

    // Testimonials
    "testi.badge": "Testimonials",
    "testi.title": "What Our Customers Say",
    "testi.avatarAlt": "Customer photo",
    "testi.vanAlt": "Interior of Jember Travel premium fleet",

    // CTA
    "cta.title": "Ready to Start Your Journey?",
    "cta.subtitle": "Book your ticket now and enjoy the best travel experience in East Java.",
    "cta.bookNow": "Book Now",
    "cta.whatsapp": "Contact WhatsApp",

    // Footer
    "footer.desc": "Premium travel service hub connecting hearts and cities across Indonesia.",
    "footer.col1.title": "Company",
    "footer.col1.link1": "About Us",
    "footer.col1.link2": "Package Services",
    "footer.col1.link3": "Blog",
    "footer.col2.title": "Help",
    "footer.col2.link1": "Help Center",
    "footer.col2.link2": "Terms & Conditions",
    "footer.col2.link3": "Privacy Policy",
    "footer.col3.title": "Contact",
    "footer.copyright": "© 2026 Jember Travel. Trusted Travel Service.",

    // About Us Page
    "about.hero.badge": "Our Story & Commitment",
    "about.hero.title": "About Jember Travel",
    "about.hero.desc": "Connecting hearts and cities with genuine service from the heart since 2018.",
    "about.vision.title": "Our Vision & Mission",
    "about.vision.desc": "To be a pioneer of premium transportation in East Java that blends modern comfort with the warmth of local hospitality.",
    "about.mission.title": "Our Mission",
    "about.mission.desc": "Providing safe, timely, transparent travel services that prioritize the values of politeness and genuine service from the heart.",
    "about.values.title": "Our Core Values",
    "about.values.subtitle": "Values we hold dear in every kilometer of your journey.",
    "about.value1.title": "Genuine Service",
    "about.value1.desc": "Our crew's smile and friendliness are not just procedures, but a culture of honoring guests typical of the archipelago.",
    "about.value2.title": "Safety First",
    "about.value2.desc": "Always prime fleet conditions with regular maintenance and trained crew for your safety.",
    "about.value3.title": "Honest & Transparent",
    "about.value3.desc": "Transparency with no hidden fees. What you see is what you pay, matching the quality.",
    "about.history.title": "Our Historical Journey",
    "about.history.subtitle": "How we grow and evolve to serve you better.",
    "about.history.y2018.title": "2018 - First Steps",
    "about.history.y2018.desc": "Started with 2 Avanza vehicles serving the Jember - Surabaya route.",
    "about.history.y2020.title": "2020 - Fleet Expansion",
    "about.history.y2020.desc": "Added Toyota Hiace Commuter fleet for extra passenger comfort.",
    "about.history.y2022.title": "2022 - Premium Class Services",
    "about.history.y2022.desc": "Launch of Hiace Premio with executive class facilities and maximum comfort.",
    "about.history.y2024.title": "2024 - Digital Transformation",
    "about.history.y2024.desc": "Easy online ticket booking and real-time fleet position monitoring system.",
    "about.stats.pax.title": "Passengers Served",
    "about.stats.routes.title": "Active Routes",
    "about.stats.crew.title": "Professional Crew",
    "about.stats.satisfaction.title": "Satisfaction Rate",
  },
};

interface TranslationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof typeof dictionary.id) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("id");
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage only after mounting to avoid hydration mismatch
  useEffect(() => {
    const savedLocale = localStorage.getItem("jember-travel-locale") as Locale;
    if (savedLocale === "id" || savedLocale === "en") {
      setLocaleState(savedLocale);
      document.documentElement.lang = savedLocale;
    } else {
      document.documentElement.lang = "id";
    }
    setIsMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("jember-travel-locale", newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = (key: keyof typeof dictionary.id): string => {
    const dict = dictionary[locale] || dictionary.id;
    return dict[key] || dictionary.id[key] || String(key);
  };

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
