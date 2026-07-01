'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-teal-deep text-sand-light/75 py-12 md:py-16 border-t border-sand-light/10 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Info */}
        <div className="space-y-4">
          <div className="font-serif text-xl md:text-2xl font-bold text-sand-light">
            Ankita Gastro Care
          </div>
          <p className="text-xs md:text-sm leading-relaxed text-sand-light/60 max-w-sm">
            {t('footerAbout')}
          </p>
        </div>

        {/* Explore Links */}
        <div className="space-y-4">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-sand-light">
            {t('footerExplore')}
          </h5>
          <div className="flex flex-col gap-2.5 text-xs md:text-sm">
            <Link href="/" className="hover:text-copper-soft transition-colors duration-200">{t('navHome')}</Link>
            <Link href="/about" className="hover:text-copper-soft transition-colors duration-200">{t('navAbout')}</Link>
            <Link href="/treatments" className="hover:text-copper-soft transition-colors duration-200">{t('navTreatments')}</Link>
            <Link href="/videos" className="hover:text-copper-soft transition-colors duration-200">{t('navVideos')}</Link>
            <Link href="/admin" className="hover:text-copper-soft transition-colors duration-200">{t('navAdmin')}</Link>
          </div>
        </div>

        {/* Patients Links */}
        <div className="space-y-4">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-sand-light">
            {t('footerPatients')}
          </h5>
          <div className="flex flex-col gap-2.5 text-xs md:text-sm">
            <Link href="/book" className="hover:text-copper-soft transition-colors duration-200">{t('navBook')}</Link>
            <Link href="/location" className="hover:text-copper-soft transition-colors duration-200">{t('navLocation')}</Link>
            <a 
              href="https://www.youtube.com/@AnkitaGastroCare-haldwani" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-copper-soft transition-colors duration-200"
            >
              YouTube Channel
            </a>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-4">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-sand-light">
            {t('footerContact')}
          </h5>
          <div className="text-xs md:text-sm space-y-2.5 text-sand-light/60">
            <p>
              Talli Bamori, Lal Danth Bypass Rd,<br />
              near Nainital Bank, Amrawati Colony,<br />
              Haldwani, Uttarakhand 263139
            </p>
            <p className="font-bold text-sand-light mt-1">
              09962076595
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 md:mt-16 pt-6 border-t border-sand-light/15 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] md:text-xs text-sand-light/45 font-bold uppercase tracking-wider">
        <span>{t('footerRights')}</span>
        <span>{t('badgeWomenOwned')} · {t('badgeVeteranDiscount')}</span>
      </div>
    </footer>
  );
};
export default Footer;
