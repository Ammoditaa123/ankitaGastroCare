import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ankita Gastro Care — Dr. (Major) Ajay Kandpal, Haldwani",
  description: "Complete gastro and liver care in Haldwani by Dr. (Major) Ajay Kandpal, DM Gastroenterology & Hepatology. Over 20+ years of experience and 20,000+ patients treated.",
  keywords: [
    "Ankita Gastro Care",
    "Dr. Ajay Kandpal",
    "Gastroenterologist Haldwani",
    "Endoscopy Haldwani",
    "Colonoscopy Haldwani",
    "Liver Care Haldwani",
    "Gastro doctor Haldwani",
    "Dr Major Ajay Kandpal"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lora.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-sand-light text-ink antialiased">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1 pt-[72px] md:pt-[80px]">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
