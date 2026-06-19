import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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
    <html lang="id" className={`${plusJakartaSans.variable} antialiased`}>
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
