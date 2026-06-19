"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Locale = "id" | "en";

// Define the shape of our dictionary keys for type-safety or simple lookup.
const dictionary = {
  id: {
    // Navbar
    "nav.findTicket": "Cari Tiket",
    "nav.checkBooking": "Cek Pesanan",
    "nav.promo": "Promo",
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
    "footer.col1.link2": "Karir",
    "footer.col1.link3": "Blog",
    "footer.col2.title": "Bantuan",
    "footer.col2.link1": "Pusat Bantuan",
    "footer.col2.link2": "Syarat & Ketentuan",
    "footer.col2.link3": "Kebijakan Privasi",
    "footer.col3.title": "Kontak",
    "footer.copyright": "© 2024 Jember Travel. Pelayanan Tulus dari Hati.",
  },
  en: {
    // Navbar
    "nav.findTicket": "Find Ticket",
    "nav.checkBooking": "Check Booking",
    "nav.promo": "Promo",
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
    "footer.col1.link2": "Careers",
    "footer.col1.link3": "Blog",
    "footer.col2.title": "Help",
    "footer.col2.link1": "Help Center",
    "footer.col2.link2": "Terms & Conditions",
    "footer.col2.link3": "Privacy Policy",
    "footer.col3.title": "Contact",
    "footer.copyright": "© 2024 Jember Travel. Genuine Service from the Heart.",
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
