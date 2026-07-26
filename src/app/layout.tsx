import type { Metadata } from "next";
import { Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const notoSans = Noto_Sans_Georgian({
  subsets: ["georgian", "latin"],
  variable: "--font-noto-sans-georgian",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const notoSerif = Noto_Serif_Georgian({
  subsets: ["georgian", "latin"],
  variable: "--font-noto-serif-georgian",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "ნოდარ გასიტაშვილი - ბიოგრაფიული ლექსიკონი",
    template: "%s - ნოდარ გასიტაშვილი",
  },
  description:
    "ბიოგრაფიული ლექსიკონი - ნოდარ გასიტაშვილი (1991–2012). იურისტი, ისტორიკოსი, მკვლევარი, პოეტი, კომპოზიტორი, პიანისტი.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
