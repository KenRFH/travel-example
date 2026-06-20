import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const plusJakartaSans = localFont({
  src: [
    {
      path: "../src/Inter,Outfit,Plus_Jakarta_Sans,Poppins/Plus_Jakarta_Sans/PlusJakartaSans-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../src/Inter,Outfit,Plus_Jakarta_Sans,Poppins/Plus_Jakarta_Sans/PlusJakartaSans-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-plus-jakarta",
});

const inter = localFont({
  src: [
    {
      path: "../src/Inter,Outfit,Plus_Jakarta_Sans,Poppins/Inter/Inter-VariableFont_opsz,wght.ttf",
      style: "normal",
    },
    {
      path: "../src/Inter,Outfit,Plus_Jakarta_Sans,Poppins/Inter/Inter-Italic-VariableFont_opsz,wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Jember Travel - Perjalanan Modern Berjiwa Tradisi",
  description:
    "Layanan travel premium antar kota dari Jember. Nikmati perjalanan nyaman dengan armada modern dan layanan tulus dari hati.",
};

import { LanguageProvider } from "@/src/lib/i18n";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${inter.variable} antialiased`} data-scroll-behavior="smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
