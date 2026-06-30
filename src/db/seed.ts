import { db } from "./drizzle";
import { admins, companyContents } from "./schema";
import { eq } from "drizzle-orm";

const defaultAboutId = {
  heroBadge: "Kisah & Komitmen Kami",
  heroTitle: "Tentang Indo Travel",
  heroDesc: "Menghubungkan hati dan kota dengan pelayanan tulus dari hati sejak 2018.",
  visionTitle: "Visi Kami",
  visionDesc: "Menjadi pelopor transportasi premium di Jawa Timur yang memadukan kenyamanan modern dengan kehangatan keramahan lokal.",
  missionTitle: "Misi Kami",
  missionDesc: "Memberikan layanan perjalanan yang aman, tepat waktu, transparan, serta mengutamakan nilai-nilai kesopanan dan ketulusan pelayanan khas Nusantara.",
  valuesTitle: "Nilai-Nilai Utama Kami",
  valuesSubtitle: "Nilai yang kami pegang teguh dalam setiap kilometer perjalanan Anda.",
  values: [
    { icon: "volunteer_activism", title: "Pelayanan Tulus", desc: "Senyum dan keramahan kru kami bukan sekadar prosedur, melainkan budaya menghormati tamu khas Nusantara." },
    { icon: "shield", title: "Keselamatan Utama", desc: "Kondisi armada selalu prima dengan perawatan berkala dan kru yang terlatih demi keselamatan Anda." },
    { icon: "monetization_on", title: "Harga Jujur & Transparan", desc: "Transparansi tanpa biaya tersembunyi. Apa yang Anda lihat adalah apa yang Anda bayar, sebanding dengan kualitas." }
  ],
  historyTitle: "Perjalanan Sejarah Kami",
  historySubtitle: "Bagaimana kami tumbuh dan berkembang untuk melayani Anda lebih baik.",
  history: [
    { year: "2018", title: "2018 - Langkah Pertama", desc: "Dimulai dengan 2 armada Avanza melayani rute Jember - Surabaya." },
    { year: "2020", title: "2020 - Ekspansi Armada", desc: "Menambahkan armada Toyota Hiace Commuter untuk kenyamanan ekstra penumpang." },
    { year: "2022", title: "2022 - Layanan Kelas Premium", desc: "Peluncuran Hiace Premio dengan fasilitas kelas eksekutif dan kenyamanan maksimal." },
    { year: "2024", title: "2024 - Transformasi Digital", desc: "Pemesanan tiket online mudah dan sistem pemantauan posisi armada secara real-time." }
  ],
  stats: [
    { icon: "group", count: "1000+", label: "Penumpang Terlayani" },
    { icon: "map", count: "10+", label: "Rute Aktif" },
    { icon: "badge", count: "10+", label: "Kru Profesional" },
    { icon: "sentiment_very_satisfied", count: "93%", label: "Tingkat Kepuasan" }
  ]
};

const defaultAboutEn = {
  heroBadge: "Our Story & Commitment",
  heroTitle: "About Indo Travel",
  heroDesc: "Connecting hearts and cities with genuine service from the heart since 2018.",
  visionTitle: "Our Vision",
  visionDesc: "To be a pioneer of premium transportation in East Java that blends modern comfort with the warmth of local hospitality.",
  missionTitle: "Our Mission",
  missionDesc: "Providing safe, timely, transparent travel services that prioritize the values of politeness and genuine service from the heart.",
  valuesTitle: "Our Core Values",
  valuesSubtitle: "Values we hold dear in every kilometer of your journey.",
  values: [
    { icon: "volunteer_activism", title: "Genuine Service", desc: "Our crew's smile and friendliness are not just procedures, but a culture of honoring guests typical of the archipelago." },
    { icon: "shield", title: "Safety First", desc: "Always prime fleet conditions with regular maintenance and trained crew for your safety." },
    { icon: "monetization_on", title: "Honest & Transparent", desc: "Transparency with no hidden fees. What you see is what you pay, matching the quality." }
  ],
  historyTitle: "Our Historical Journey",
  historySubtitle: "How we grow and evolve to serve you better.",
  history: [
    { year: "2018", title: "2018 - First Steps", desc: "Started with 2 Avanza vehicles serving the Jember - Surabaya route." },
    { year: "2020", title: "2020 - Fleet Expansion", desc: "Added Toyota Hiace Commuter fleet for extra passenger comfort." },
    { year: "2022", title: "2022 - Premium Class Services", desc: "Launch of Hiace Premio with executive class facilities and maximum comfort." },
    { year: "2024", title: "2024 - Digital Transformation", desc: "Easy online ticket booking and real-time fleet position monitoring system." }
  ],
  stats: [
    { icon: "group", count: "1000+", label: "Passengers Served" },
    { icon: "map", count: "10+", label: "Active Routes" },
    { icon: "badge", count: "10+", label: "Professional Crew" },
    { icon: "sentiment_very_satisfied", count: "93%", label: "Satisfaction Rate" }
  ]
};

const defaultPackagesId = {
  heroBadge: "Layanan Logistik & Kargo",
  heroTitle: "Pengiriman Paket Kilat",
  heroDesc: "Kirim barang dan dokumen Anda dengan aman, cepat, dan terpercaya bersama armada Indo Travel.",
  serviceTitle: "Keunggulan Layanan Paket Kami",
  serviceSubtitle: "Mengapa memilih layanan pengiriman paket Indo Travel?",
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

const defaultPackagesEn = {
  heroBadge: "Logistics & Cargo Service",
  heroTitle: "Express Package Delivery",
  heroDesc: "Send your goods and documents safely, quickly, and reliably with the Indo Travel fleet.",
  serviceTitle: "Why Choose Our Package Delivery?",
  serviceSubtitle: "Why choose Indo Travel express cargo services?",
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

const defaultPrivateId = {
  heroBadge: "Sewa & Charter Privat",
  heroTitle: "Layanan Travel Private",
  heroDesc: "Nikmati perjalanan eksklusif dan fleksibel bersama keluarga atau rekan kerja dengan sewa mobil + driver dari Indo Travel.",
  serviceTitle: "Keunggulan Layanan Private",
  serviceSubtitle: "Mengapa memilih layanan charter private Indo Travel?",
  services: [
    { icon: "schedule", title: "Jadwal Fleksibel", desc: "Tentukan sendiri waktu keberangkatan Anda tanpa terikat jadwal perjalanan reguler." },
    { icon: "home", title: "Penjemputan Door-to-Door", desc: "Driver kami menjemput langsung ke alamat Anda dan mengantar hingga ke depan pintu tujuan." },
    { icon: "group", title: "Kapasitas Rombongan", desc: "Tersedia berbagai pilihan armada mulai dari Avanza hingga Toyota Hiace sesuai kebutuhan Anda." },
    { icon: "sentiment_very_satisfied", title: "Perjalanan Nyaman", desc: "Armada bersih, wangi, dan driver profesional yang ramah siap menemani perjalanan Anda." }
  ],
  pricingTitle: "Daftar Tarif Sewa Mobil",
  pricingSubtitle: "Harga sewa all-in (mobil + driver + BBM) untuk rute populer.",
  pricings: [
    { route: "Jember - Surabaya / Malang (Avanza - Max 5 Pax)", price: "Rp 750.000", est: "All-in (Mobil, Driver, BBM)" },
    { route: "Jember - Surabaya / Malang (Hiace Commuter - Max 14 Pax)", price: "Rp 1.200.000", est: "All-in (Mobil, Driver, BBM)" },
    { route: "Jember - Surabaya / Malang (Hiace Premio - Max 11 Pax)", price: "Rp 1.400.000", est: "All-in (Mobil, Driver, BBM)" }
  ],
  ctaTitle: "Butuh Layanan Travel Private?",
  ctaSubtitle: "Konsultasikan kebutuhan rute dan armada Anda dengan admin kami sekarang.",
  ctaButton: "Hubungi Admin Private",
  vehicles: [
    {
      id: "zenix",
      name: "Toyota Innova Zenix",
      badge: "Most Popular",
      image: "/images/toyota_zenix.png",
      seats: "6 Seats",
      bags: "3 Bags",
      features: [
        "Full AC Dual Zone",
        "Reclining Seat Premium",
        "Professional Driver"
      ],
      price: "Rp 950.000",
      rawPrice: 950000,
      maxSeats: 6
    },
    {
      id: "hiace",
      name: "Toyota HiAce Premio",
      badge: "",
      image: "/images/toyota_hiace_premio.png",
      seats: "11 Seats",
      bags: "6 Bags",
      features: [
        "Cabin Luas & Tinggi",
        "Entertainment System",
        "Driver & Tour Assistant"
      ],
      price: "Rp 1.800.000",
      rawPrice: 1800000,
      maxSeats: 11
    }
  ]
};

const defaultPrivateEn = {
  heroBadge: "Private Rent & Charter",
  heroTitle: "Private Travel Service",
  heroDesc: "Enjoy an exclusive and flexible journey with your family or colleagues with car rental + driver from Indo Travel.",
  serviceTitle: "Why Choose Our Private Service?",
  serviceSubtitle: "Why choose Indo Travel private charter services?",
  services: [
    { icon: "schedule", title: "Flexible Schedule", desc: "Decide your own departure time without being bound to regular travel schedules." },
    { icon: "home", title: "Door-to-Door Service", desc: "Our driver will pick you up directly from your address and deliver you to your door." },
    { icon: "group", title: "Group Capacity", desc: "Various fleet options are available from Avanza to Toyota Hiace based on your needs." },
    { icon: "sentiment_very_satisfied", title: "Comfortable Journey", desc: "Clean, fresh vehicle and professional friendly driver ready to accompany your trip." }
  ],
  pricingTitle: "Car Rental Rates List",
  pricingSubtitle: "All-in rental prices (car + driver + fuel) for popular routes.",
  pricings: [
    { route: "Jember - Surabaya / Malang (Avanza - Max 5 Pax)", price: "Rp 750,000", est: "All-in (Car, Driver, Fuel)" },
    { route: "Jember - Surabaya / Malang (Hiace Commuter - Max 14 Pax)", price: "Rp 1,200,000", est: "All-in (Car, Driver, Fuel)" },
    { route: "Jember - Surabaya / Malang (Hiace Premio - Max 11 Pax)", price: "Rp 1,400,000", est: "All-in (Car, Driver, Fuel)" }
  ],
  ctaTitle: "Need a Private Travel Service?",
  ctaSubtitle: "Consult your route and fleet requirements with our admin now.",
  ctaButton: "Contact Private Admin",
  vehicles: [
    {
      id: "zenix",
      name: "Toyota Innova Zenix",
      badge: "Most Popular",
      image: "/images/toyota_zenix.png",
      seats: "6 Seats",
      bags: "3 Bags",
      features: [
        "Full AC Dual Zone",
        "Reclining Seat Premium",
        "Professional Driver"
      ],
      price: "Rp 950,000",
      rawPrice: 950000,
      maxSeats: 6
    },
    {
      id: "hiace",
      name: "Toyota HiAce Premio",
      badge: "",
      image: "/images/toyota_hiace_premio.png",
      seats: "11 Seats",
      bags: "6 Bags",
      features: [
        "Cabin Luas & Tinggi",
        "Entertainment System",
        "Driver & Tour Assistant"
      ],
      price: "Rp 1.800.000",
      rawPrice: 1800000,
      maxSeats: 11
    }
  ]
};

export async function seedDatabase() {
  // 1. Seed Admin
  try {
    const existingAdmins = await db.select().from(admins).limit(1);
    if (existingAdmins.length === 0) {
      console.log("Seeding default admin account...");
      await db.insert(admins).values({
        username: "admin",
        password: "indotravel2026",
      });
    }
  } catch (error) {
    console.log("Admin account seed skipped or already exists.");
  }

  // 2. Seed Company Contents (About Us, Packages, & Private)
  try {
    // Check and seed About Us
    const aboutContent = await db.select().from(companyContents).where(eq(companyContents.key, "about")).limit(1);
    if (aboutContent.length === 0) {
      console.log("Seeding default About Us content...");
      await db.insert(companyContents).values({
        key: "about",
        contentId: JSON.stringify(defaultAboutId),
        contentEn: JSON.stringify(defaultAboutEn)
      });
    }

    // Check and seed Packages
    const packagesContent = await db.select().from(companyContents).where(eq(companyContents.key, "packages")).limit(1);
    if (packagesContent.length === 0) {
      console.log("Seeding default Packages content...");
      await db.insert(companyContents).values({
        key: "packages",
        contentId: JSON.stringify(defaultPackagesId),
        contentEn: JSON.stringify(defaultPackagesEn)
      });
    }

    // Check and seed Private
    const privateContent = await db.select().from(companyContents).where(eq(companyContents.key, "private")).limit(1);
    if (privateContent.length === 0) {
      console.log("Seeding default Private content...");
      await db.insert(companyContents).values({
        key: "private",
        contentId: JSON.stringify(defaultPrivateId),
        contentEn: JSON.stringify(defaultPrivateEn)
      });
    }
  } catch (error) {
    console.error("Error seeding company contents:", error);
  }
}
