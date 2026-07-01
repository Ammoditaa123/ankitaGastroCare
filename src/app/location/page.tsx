'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { PopularTimes } from '@/components/PopularTimes';
import { ContactForm } from '@/components/ContactForm';
import { MapPin, Phone, Clock, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Location() {
  const { t, language } = useLanguage();

  const mapQueryUrl = "https://www.google.com/maps?q=Ankita+Gastro+Care+Talli+Bamori+Lal+Danth+Bypass+Road+Haldwani+Uttarakhand+263139";
  const embedMapUrl = "https://www.google.com/maps?q=Ankita+Gastro+Care+Talli+Bamori+Lal+Danth+Bypass+Road+Haldwani+Uttarakhand+263139&output=embed";

  return (
    <div className="w-full">
      {/* ================= PAGE HERO ================= */}
      <section className="bg-teal-deep text-sand-light py-10 md:py-14 relative overflow-hidden">
        <div className="absolute right-[-100px] top-[-100px] w-[350px] h-[350px] border border-sand-light/10 rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-4">
          <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-sand-light/50">
            Home / {language === 'en' ? 'Location & Timings' : 'स्थान और समय'}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
            {t('locationTitle')}
          </h1>
          <p className="text-xs md:text-sm font-semibold tracking-wider text-copper-soft uppercase max-w-2xl">
            {t('locationSub')}
          </p>
        </div>
      </section>

      {/* ================= LOCATION GRID ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Map & Address */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 w-full"
          >
            {/* Map frame */}
            <div className="w-full aspect-[4/3] border border-ink/10 shadow-sm overflow-hidden bg-sand-deep rounded-sm">
              <iframe
                src={embedMapUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ankita Gastro Care Location Map"
                className="w-full h-full border-none"
              ></iframe>
            </div>

            {/* Address Card */}
            <div className="bg-bg-deep/40 p-6 md:p-8 rounded-sm space-y-4 border border-ink/5">
              <h4 className="font-serif text-lg font-bold text-teal-deep flex items-center gap-2">
                <MapPin className="w-5 h-5 text-copper-deep" />
                <span>{t('addressTitle')}</span>
              </h4>
              <p className="text-xs md:text-sm text-ink/75 leading-relaxed font-semibold">
                {t('addressDetails')}
              </p>
            </div>

            {/* Direction Buttons */}
            <div className="flex flex-wrap gap-4 pt-1">
              <a
                href={mapQueryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-teal-deep text-sand-light text-xs font-bold uppercase tracking-wider hover:bg-copper-deep shadow-md transition-all duration-300 inline-flex items-center gap-2 border border-teal-deep"
              >
                <Compass className="w-4 h-4" />
                <span>{t('getDirections')}</span>
              </a>
              <a
                href="tel:09962076595"
                className="px-6 py-3 border border-teal-deep text-teal-deep text-xs font-bold uppercase tracking-wider hover:bg-teal-deep hover:text-sand-light transition-all duration-300 inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>{t('callClinic')}</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Popular Times, Timings & Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 space-y-6 w-full"
          >
            {/* Popular Times Component */}
            <PopularTimes />

            {/* Hours card */}
            <div className="bg-bg-deep/40 p-6 md:p-8 rounded-sm border border-ink/5 space-y-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-copper-deep flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{t('hoursTitle')}</span>
              </div>
              <h4 className="font-serif text-base font-bold text-teal-deep leading-tight">
                {t('consultationsHours')}
              </h4>
              <p className="text-xs md:text-sm text-ink/70 leading-relaxed font-semibold whitespace-pre-line">
                {language === 'en'
                  ? 'Monday – Saturday: 8:30 AM – 7:30 PM\nSunday: 10:00 AM – 1:00 PM\n\nLunch Hours (No Appointments):\nMonday – Saturday: 1:30 PM – 4:00 PM\nSunday: No Lunch Break'
                  : 'सोमवार - शनिवार: सुबह 8:30 बजे से शाम 7:30 बजे तक\nरविवार: सुबह 10:00 बजे से दोपहर 1:00 बजे तक\n\nभोजन अवकाश (लंच टाइम):\nसोमवार - शनिवार: दोपहर 1:30 बजे से शाम 4:00 बजे तक\nरविवार: कोई लंच ब्रेक नहीं'
                }
              </p>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </motion.div>

        </div>
      </section>

    </div>
  );
}
