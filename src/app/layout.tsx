import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "[Nombre del estudio] · Diseño de interiores",
  description:
    "Estudio de diseño de interiores: una sola persona te acompaña desde la primera idea hasta la entrega de llaves.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${dmSans.variable} ${instrument.variable}`}>
      <body>{children}</body>
    </html>
  );
}
