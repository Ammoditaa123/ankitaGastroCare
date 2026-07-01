'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { Check, Heart, ShieldAlert, Award } from 'lucide-react';

export default function About() {
  const { t, language } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="w-full">
      {/* ================= PAGE HERO ================= */}
      <section className="bg-teal-deep text-sand-light py-10 md:py-14 relative overflow-hidden">
        <div className="absolute right-[-100px] top-[-100px] w-[350px] h-[350px] border border-sand-light/10 rounded-full pointer-events-none" />
        <div className="absolute right-[-50px] top-[-50px] w-[250px] h-[250px] border border-sand-light/5 rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-4">
          <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-sand-light/50">
            {t('aboutHeroSub')}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
            {t('aboutHeroTitle')}
          </h1>
          <p className="text-xs md:text-sm font-semibold tracking-wider text-copper-soft uppercase max-w-xl">
            {t('aboutHeroDesc')}
          </p>
        </div>
      </section>

      {/* ================= DOCTOR DETAILED SPLIT ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 aspect-[4/5] max-w-sm mx-auto w-full bg-teal-deep rounded-sm overflow-hidden shadow-xl border-4 border-sand-deep"
          >
            <img
              src="/images/doctor.png"
              alt="Dr. Ajay Kandpal, AFMC Pune MD"
              className="w-full h-full object-cover opacity-95 transition-transform duration-700 hover:scale-103"
            />
          </motion.div>

          {/* Right Column Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="lg:col-span-7 space-y-6"
          >
            <motion.div variants={itemVariants} className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-copper-deep block">
                {t('aboutHeroDesc')}
              </span>
              <h2 className="text-2xl md:text-3xl font-serif text-teal-deep font-bold leading-tight">
                {t('aboutSplitTitle')}
              </h2>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4 text-xs md:text-sm text-ink/75 leading-relaxed font-medium">
              <p>{t('aboutBio1')}</p>
              <p>{t('aboutBio2')}</p>
            </motion.div>

            {/* Checklist */}
            <motion.div variants={itemVariants} className="space-y-3.5 pt-4 border-t border-ink/10">
              <div className="flex items-start gap-3 text-xs md:text-sm font-semibold text-ink/80">
                <div className="w-5 h-5 rounded-full bg-teal-deep text-sand-light flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{t('cred1')}</span>
              </div>
              <div className="flex items-start gap-3 text-xs md:text-sm font-semibold text-ink/80">
                <div className="w-5 h-5 rounded-full bg-teal-deep text-sand-light flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{t('cred2')}</span>
              </div>
              <div className="flex items-start gap-3 text-xs md:text-sm font-semibold text-ink/80">
                <div className="w-5 h-5 rounded-full bg-teal-deep text-sand-light flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{t('cred3')}</span>
              </div>
              <div className="flex items-start gap-3 text-xs md:text-sm font-semibold text-ink/80">
                <div className="w-5 h-5 rounded-full bg-teal-deep text-sand-light flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{t('cred4')}</span>
              </div>
              <div className="flex items-start gap-3 text-xs md:text-sm font-semibold text-ink/80">
                <div className="w-5 h-5 rounded-full bg-teal-deep text-sand-light flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{t('cred5')}</span>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ================= CLINIC VALUES ================= */}
      <section className="py-20 bg-bg-deep/45">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-copper-deep block mb-2">
              {t('philosophyTitle')}
            </span>
            <h2 className="text-3xl font-serif text-teal-deep font-bold mb-3">
              {t('philosophySubtitle')}
            </h2>
            <p className="text-xs md:text-sm text-ink/75 leading-relaxed font-medium">
              {t('philosophyDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-ink/10 border border-ink/10">
            {/* Value 1 */}
            <div className="bg-sand-light p-8 md:p-10 space-y-4">
              <span className="text-[10px] font-bold tracking-wider text-copper-deep uppercase block">
                {language === 'en' ? 'Diagnostics' : 'जांच व मशीनें'}
              </span>
              <h3 className="font-serif text-xl font-bold text-teal-deep">
                {t('valEquipTitle')}
              </h3>
              <p className="text-xs md:text-sm text-ink/70 leading-relaxed">
                {t('valEquipDesc')}
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-sand-light p-8 md:p-10 space-y-4">
              <span className="text-[10px] font-bold tracking-wider text-copper-deep uppercase block">
                {language === 'en' ? 'Clinic Model' : 'क्लीनिक स्वामित्व'}
              </span>
              <h3 className="font-serif text-xl font-bold text-teal-deep">
                {t('valDarkClinic' as any) || t('valOwnerTitle')}
              </h3>
              <p className="text-xs md:text-sm text-ink/70 leading-relaxed">
                {t('valOwnerDesc')}
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-sand-light p-8 md:p-10 space-y-4">
              <span className="text-[10px] font-bold tracking-wider text-copper-deep uppercase block">
                {language === 'en' ? 'Reputation' : 'विश्वसनीयता'}
              </span>
              <h3 className="font-serif text-xl font-bold text-teal-deep">
                {t('valTrustTitle')}
              </h3>
              <p className="text-xs md:text-sm text-ink/70 leading-relaxed">
                {t('valTrustDesc')}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-teal-deep text-sand-light p-10 md:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 rounded-sm">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-serif text-2xl md:text-3xl font-bold max-w-xl leading-tight" style={{ color: '#f7f4ee' }}>
                {t('meetDoctorCta')}
              </h3>
            </div>
            <Link
              href="/book"
              className="px-8 py-3.5 bg-transparent border-2 font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-teal-deep transition-all duration-300 shadow-md select-none shrink-0"
              style={{ color: '#f7f4ee', borderColor: '#f7f4ee' }}
            >
              {t('unsureCta')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
