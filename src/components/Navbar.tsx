'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page transition
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', labelKey: 'navHome' as const },
    { href: '/about', labelKey: 'navAbout' as const },
    { href: '/treatments', labelKey: 'navTreatments' as const },
    { href: '/videos', labelKey: 'navVideos' as const },
    { href: '/location', labelKey: 'navLocation' as const },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-sand-light/95 backdrop-blur-md shadow-sm border-b border-ink/10 py-3' 
        : 'bg-sand-light/90 backdrop-blur-sm border-b border-ink/5 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-teal-deep text-sand-light flex items-center justify-center font-serif text-lg font-bold shadow-md group-hover:scale-105 transition-transform duration-300">
            AG
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-base md:text-lg font-bold text-teal-deep leading-tight">
              Ankita Gastro Care
            </span>
            <span className="text-[9px] md:text-[10px] font-sans font-bold tracking-widest text-copper-deep uppercase leading-none mt-0.5">
              Dr. (Major) Ajay Kandpal
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`relative text-xs font-semibold uppercase tracking-wider transition-colors duration-300 py-1 ${
                  isActive 
                    ? 'text-teal-deep font-bold' 
                    : 'text-ink/80 hover:text-teal-light'
                }`}
              >
                {t(link.labelKey)}
                {isActive && (
                  <motion.div 
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-copper-deep"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA & Language Toggle */}
        <div className="hidden lg:flex items-center gap-5">
          {/* Language Switcher */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-teal-deep/20 rounded-full text-xs font-bold text-teal-deep hover:bg-teal-deep hover:text-sand-light transition-all duration-300"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          <Link 
            href="/book" 
            className="px-5 py-2.5 bg-teal-deep text-sand-light text-xs font-bold uppercase tracking-wider border border-teal-deep hover:bg-copper-deep hover:border-copper-deep transition-all duration-300 shadow-sm"
          >
            {t('navBookNow')}
          </Link>
        </div>

        {/* Mobile Control Buttons */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* Mobile Language Button */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1 border border-teal-deep/20 rounded-full text-[11px] font-bold text-teal-deep"
          >
            <Globe className="w-3 h-3" />
            <span>{language === 'en' ? 'हिं' : 'EN'}</span>
          </button>

          {/* Burger menu */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-teal-deep focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-teal-deep text-sand-light shadow-xl border-t border-sand-light/10 lg:hidden flex flex-col py-6 px-8 gap-5 z-40"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-serif text-xl ${isActive ? 'text-copper-soft font-bold' : 'text-sand-light/80'}`}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-sand-light/10 flex flex-col gap-4">
              <Link 
                href="/book" 
                className="w-full text-center py-3 bg-copper-deep text-sand-light font-sans text-sm font-bold uppercase tracking-wider hover:bg-copper-deep/90 transition-colors duration-300"
              >
                {t('navBookNow')}
              </Link>
              <Link 
                href="/admin" 
                className="text-center text-xs text-sand-light/50 hover:text-copper-soft transition-colors pt-2"
              >
                {t('navAdmin')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default Navbar;
