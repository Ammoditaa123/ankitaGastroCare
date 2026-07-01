'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Heart, ChevronRight, Activity, Stethoscope, Scissors, FileText } from 'lucide-react';

export default function Home() {
  const { t, language } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="w-full">
      {/* ================= HERO SECTION ================= */}
      <section className="min-h-[90vh] flex items-center justify-center py-12 md:py-20 bg-radial-[ellipse_at_85%_10%] from-copper-deep/5 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="lg:col-span-7 space-y-6 md:space-y-8"
          >
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-2.5">
              <span className="badge-pill inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-copper-deep animate-pulse" />
                {t('badgeWomenOwned')}
              </span>
              <span className="badge-pill inline-flex bg-teal-light/5 border-teal-light/20">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-light" />
                {t('badgeVeteranDiscount')}
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-copper-deep block">
                {t('heroSub')}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-teal-deep font-bold leading-[1.1] tracking-tight">
                {t('heroTitleStart')}
                <em className="text-copper-deep font-medium italic block sm:inline">
                  {t('heroTitleEm')}
                </em>
              </h1>
              <p className="text-sm md:text-base text-ink/75 max-w-xl leading-relaxed font-medium">
                {t('heroDesc')}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-1">
              <Link
                href="/book"
                className="px-6 py-3 bg-teal-deep text-sand-light text-xs font-bold uppercase tracking-wider hover:bg-copper-deep shadow-md transition-all duration-300 border border-teal-deep"
              >
                {t('heroCtaBook')}
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 border border-teal-deep text-teal-deep text-xs font-bold uppercase tracking-wider hover:bg-teal-deep hover:text-sand-light transition-all duration-300"
              >
                {t('heroCtaAbout')}
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 pt-8 border-t border-ink/10 max-w-lg"
            >
              <div>
                <b className="font-serif text-2xl md:text-3xl text-teal-deep font-bold block">20+</b>
                <span className="text-[10px] uppercase font-bold tracking-wider text-ink/50 leading-tight block mt-1">
                  {t('statYears')}
                </span>
              </div>
              <div>
                <b className="font-serif text-2xl md:text-3xl text-teal-deep font-bold block">20k+</b>
                <span className="text-[10px] uppercase font-bold tracking-wider text-ink/50 leading-tight block mt-1">
                  {t('statPatients')}
                </span>
              </div>
              <div>
                <b className="font-serif text-2xl md:text-3xl text-teal-deep font-bold block">DM</b>
                <span className="text-[10px] uppercase font-bold tracking-wider text-ink/50 leading-tight block mt-1">
                  {t('statDegree')}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-5 relative aspect-square md:aspect-[4/4.5] max-w-md mx-auto w-full border-8 border-white shadow-xl bg-teal-deep rounded-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-teal-deep/50 to-transparent z-10 pointer-events-none" />
            <img
              src="/images/home.png"
              alt="Ankita Gastro Care Suite"
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
            />
            {/* Visual Quote Overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-teal-deep/90 backdrop-blur-md text-sand-light p-5 rounded-sm border border-sand-light/10 shadow-lg z-20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border border-copper-soft flex items-center justify-center font-serif text-copper-soft font-bold text-xs flex-shrink-0 mt-0.5">
                  M
                </div>
                <p className="text-xs text-sand-light/95 leading-relaxed font-medium">
                  {t('mottoText')}
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ================= PILLARS SECTION ================= */}
      <section className="py-20 bg-white border-y border-ink/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="max-w-xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-copper-deep block mb-2">
              {t('whyTitle')}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-teal-deep font-bold">
              {t('whySubtitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-sand-light/30 border border-ink/10 hover:border-teal-deep/30 p-8 rounded-sm shadow-xs transition-all duration-300 hover:shadow-md flex flex-col justify-between">
              <div className="space-y-4">
                <Activity className="w-8 h-8 text-teal-deep" />
                <h3 className="font-serif text-xl font-bold text-teal-deep">{t('pillar1Title')}</h3>
                <p className="text-xs md:text-sm text-ink/75 leading-relaxed">{t('pillar1Desc')}</p>
              </div>
              <span className="text-[10px] font-bold text-copper-deep tracking-wider uppercase mt-6 block">01 · Advanced Tech</span>
            </div>

            {/* Pillar 2 */}
            <div className="bg-sand-light/30 border border-ink/10 hover:border-teal-deep/30 p-8 rounded-sm shadow-xs transition-all duration-300 hover:shadow-md flex flex-col justify-between">
              <div className="space-y-4">
                <Heart className="w-8 h-8 text-teal-deep" />
                <h3 className="font-serif text-xl font-bold text-teal-deep">{t('pillar2Title')}</h3>
                <p className="text-xs md:text-sm text-ink/75 leading-relaxed">{t('pillar2Desc')}</p>
              </div>
              <span className="text-[10px] font-bold text-copper-deep tracking-wider uppercase mt-6 block">02 · Holistic Integrity</span>
            </div>

            {/* Pillar 3 */}
            <div className="bg-sand-light/30 border border-ink/10 hover:border-teal-deep/30 p-8 rounded-sm shadow-xs transition-all duration-300 hover:shadow-md flex flex-col justify-between">
              <div className="space-y-4">
                <Award className="w-8 h-8 text-teal-deep" />
                <h3 className="font-serif text-xl font-bold text-teal-deep">{t('pillar3Title')}</h3>
                <p className="text-xs md:text-sm text-ink/75 leading-relaxed">{t('pillar3Desc')}</p>
              </div>
              <span className="text-[10px] font-bold text-copper-deep tracking-wider uppercase mt-6 block">03 · Experienced Hand</span>
            </div>
          </div>

        </div>
      </section>

      {/* ================= CARE SERVICES SUMMARY SECTION ================= */}
      <section className="py-20 bg-bg-deep/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="max-w-xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-copper-deep block mb-2">
              {t('servicesTitle')}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-teal-deep font-bold mb-3">
              {t('servicesSubtitle')}
            </h2>
            <p className="text-xs md:text-sm text-ink/70 leading-relaxed">
              {t('servicesDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Treatments */}
            <div className="bg-white border border-ink/10 p-6 rounded-sm space-y-4 shadow-sm hover:border-teal-deep/30 transition-all">
              <div className="flex items-center gap-3">
                <Stethoscope className="w-6 h-6 text-teal-deep" />
                <h4 className="font-serif text-base font-bold text-teal-deep">{t('catTreatments')}</h4>
              </div>
              <ul className="text-xs md:text-sm text-ink/80 space-y-2 border-t border-ink/10 pt-3 font-medium">
                <li>• Gastro-Oesophageal Reflux</li>
                <li>• Gastroenteritis</li>
                <li>• Acute Pancreatitis</li>
                <li>• Pancreas Stone</li>
              </ul>
            </div>

            {/* Surgeries */}
            <div className="bg-white border border-ink/10 p-6 rounded-sm space-y-4 shadow-sm hover:border-teal-deep/30 transition-all">
              <div className="flex items-center gap-3">
                <Scissors className="w-6 h-6 text-teal-deep" />
                <h4 className="font-serif text-base font-bold text-teal-deep">{t('catSurgery')}</h4>
              </div>
              <ul className="text-xs md:text-sm text-ink/80 space-y-2 border-t border-ink/10 pt-3 font-medium">
                <li>• Endoscopic Variceal Banding</li>
                <li>• PEG Tube Placement</li>
              </ul>
            </div>

            {/* Procedures */}
            <div className="bg-white border border-ink/10 p-6 rounded-sm space-y-4 shadow-sm hover:border-teal-deep/30 transition-all">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-teal-deep" />
                <h4 className="font-serif text-base font-bold text-teal-deep">{t('catProcedures')}</h4>
              </div>
              <ul className="text-xs md:text-sm text-ink/80 space-y-2 border-t border-ink/10 pt-3 font-medium">
                <li>• Esophageal Dilatation</li>
                <li>• Colonoscopy</li>
              </ul>
            </div>

            {/* Tests */}
            <div className="bg-white border border-ink/10 p-6 rounded-sm space-y-4 shadow-sm hover:border-teal-deep/30 transition-all">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-teal-deep" />
                <h4 className="font-serif text-base font-bold text-teal-deep">{t('catTests')}</h4>
              </div>
              <ul className="text-xs md:text-sm text-ink/80 space-y-2 border-t border-ink/10 pt-3 font-medium">
                <li>• OGD Scopy</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/treatments"
              className="px-6 py-3 bg-teal-deep text-sand-light text-xs font-bold uppercase tracking-wider hover:bg-copper-deep shadow-md transition-all duration-300 inline-flex items-center gap-2 border border-teal-deep"
            >
              <span>{t('viewFullDetails')}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= GOOGLE REVIEWS SECTION ================= */}
      <section className="py-20 bg-bg-deep/45">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-copper-deep block">
                Google Reviews
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-teal-deep font-bold leading-tight">
                {t('reviewsTitle')}
              </h2>
              <p className="text-xs md:text-sm text-ink/75 leading-relaxed max-w-xl">
                {t('reviewsSubtitle')}
              </p>
            </div>

            {/* Google Rating Summary */}
            <div className="bg-white border border-ink/10 p-5 rounded-sm shadow-sm flex items-center gap-4 shrink-0 hover:border-teal-deep/30 transition-all duration-300">
              <div className="w-12 h-12 bg-[#fbbc05]/10 rounded-full flex items-center justify-center text-[#fbbc05]">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.694 0-8.503-3.809-8.503-8.503s3.809-8.503 8.503-8.503c2.25 0 4.3 1.05 5.604 2.766l3.207-3.207C18.955 1.09 15.772 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.82 0 12.24-5.42 12.24-12.24 0-.763-.075-1.503-.223-2.215H12.24z"/>
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-teal-deep text-lg leading-none">4.9</span>
                  <div className="flex text-[#fbbc05]">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-ink/50 uppercase tracking-wider font-bold mt-1">
                  {t('reviewsRatingText')}
                </p>
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="bg-white border border-ink/10 p-6 rounded-sm space-y-4 shadow-sm hover:border-teal-deep/30 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-deep/5 text-teal-deep flex items-center justify-center font-bold text-sm">
                  RK
                </div>
                <div>
                  <h4 className="font-bold text-teal-deep text-sm leading-tight">Rajesh Kumar</h4>
                  <div className="flex text-[#fbbc05] mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs md:text-sm text-ink/75 leading-relaxed italic">
                {language === 'en'
                  ? "Dr. Kandpal is an excellent clinician. He explained my GERD condition very clearly and didn't prescribe unnecessary medicines. The clinic is very clean and staff is polite."
                  : "डॉ. कांडपाल बहुत ही बेहतरीन डॉक्टर हैं। उन्होंने मेरे एसिड रिफ्लक्स (GERD) की स्थिति को बहुत स्पष्ट रूप से समझाया और फालतू दवाएं नहीं दीं। क्लीनिक बहुत साफ है और स्टाफ भी विनम्र है।"
                }
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-white border border-ink/10 p-6 rounded-sm space-y-4 shadow-sm hover:border-teal-deep/30 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-deep/5 text-teal-deep flex items-center justify-center font-bold text-sm">
                  NB
                </div>
                <div>
                  <h4 className="font-bold text-teal-deep text-sm leading-tight">Neelam Bisht</h4>
                  <div className="flex text-[#fbbc05] mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs md:text-sm text-ink/75 leading-relaxed italic">
                {language === 'en'
                  ? "The best gastroenterologist in Haldwani. My father was treated for acute pancreatitis here and recovered very quickly. Highly recommend him."
                  : "हल्द्वानी के सर्वश्रेष्ठ गैस्ट्रोएंट्रोलॉजिस्ट। मेरे पिताजी का यहाँ एक्यूट पैंक्रियाटाइटिस का इलाज हुआ और वे बहुत जल्दी ठीक हो गए। उनकी अत्यधिक अनुशंसा करते हैं।"
                }
              </p>
            </div>

            {/* Review 3 */}
            <div className="bg-white border border-ink/10 p-6 rounded-sm space-y-4 shadow-sm hover:border-teal-deep/30 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-deep/5 text-teal-deep flex items-center justify-center font-bold text-sm">
                  MM
                </div>
                <div>
                  <h4 className="font-bold text-teal-deep text-sm leading-tight">Major R. S. Mehta</h4>
                  <div className="flex text-[#fbbc05] mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs md:text-sm text-ink/75 leading-relaxed italic">
                {language === 'en'
                  ? "As a veteran, I received a discount on consultation. Dr. Kandpal's AFMC credentials and experience reflect in his precise diagnosis. Excellent care."
                  : "एक पूर्व सैनिक के रूप में, मुझे परामर्श पर छूट मिली। डॉ. कांडपाल के एएफएमसी क्रेडेंशियल्स और अनुभव उनके सटीक निदान में दिखाई देते हैं। उत्कृष्ट देखभाल।"
                }
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <a
              href="https://www.google.com/search?q=Ankita+Gastro+Care+Haldwani&sca_esv=a6fae943e924d981&sxsrf=APpeQnt11NfFVhSl99_ZT2u-3G14pJi4oA%3A1782918197880&ei=NSxFaviGNfX30PEPzODJ4QQ&biw=1649&bih=938&ved=0ahUKEwi49ePu37GVAxX1OzQIHUxwMkwQ4dUDCBA&uact=5&oq=Ankita+Gastro+Care+Haldwani&gs_lp=Egxnd3Mtd2l6LXNlcnAiG0Fua2l0YSBHYXN0cm8gQ2FyZSBIYWxkd2FuaTILEC4YgAQYxwEYrwEyBRAAGO8FMgUQABjvBTIFEAAY7wUyBRAAGO8FSI0PUJgEWJgEcAF4AZABAJgBrAGgAawBqgEDMC4xuAEDyAEA-AEBmAICoAK7AcICChAAGEcY1gQYsAOYAwCIBgGQBgSSBwMxLjGgB9kIsgcDMC4xuAe1AcIHAzItMsgHCYAIAQ&sclient=gws-wiz-serp#lrd=0x39a09b0008f0431d:0x7afba0c00ec17e05,3,,,,"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-teal-deep text-sand-light text-xs font-bold uppercase tracking-wider hover:bg-copper-deep shadow-md transition-all duration-300 inline-flex items-center gap-2 border border-teal-deep"
            >
              <span>{t('writeReviewBtn')}</span>
            </a>
          </div>

        </div>
      </section>

      {/* ================= CALL TO ACTION STRIP ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-copper-deep text-sand-light p-10 md:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 rounded-sm">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white max-w-xl leading-tight">
                {language === 'en' 
                  ? 'Talli Bamori, Lal Danth Bypass Road, Haldwani — open six days a week.' 
                  : 'तल्ली बामोरी, लाल डांठ बाईपास रोड, हल्द्वानी — सप्ताह में छह दिन खुला है।'}
              </h3>
            </div>
            <Link
              href="/book"
              className="px-8 py-3.5 bg-transparent border-2 border-white text-white font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-copper-deep transition-all duration-300 shadow-md select-none shrink-0"
            >
              {language === 'en' ? 'Book Your Visit' : 'विजिट बुक करें'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
