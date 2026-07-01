'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, TranslationKey } from '../translations';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Load language preference from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ankita-gastro-lang') as Language;
    if (stored === 'en' || stored === 'hi') {
      setLanguage(stored);
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
    localStorage.setItem('ankita-gastro-lang', nextLang);
  };

  const t = (key: TranslationKey): string => {
    const translationSet = translations[language] || translations['en'];
    return (translationSet[key] as string) || (translations['en'][key] as string) || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
