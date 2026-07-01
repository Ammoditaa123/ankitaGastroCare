'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { BookingForm } from '@/components/BookingForm';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Award } from 'lucide-react';

export default function BookAppointment() {
  const { t, language } = useLanguage();
  
  // Callback states
  const [callbackName, setCallbackName] = useState('');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackSuccess, setCallbackSuccess] = useState(false);
  const [submittingCallback, setSubmittingCallback] = useState(false);

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackName || !callbackPhone) return;
    
    setSubmittingCallback(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: callbackName,
          phone: callbackPhone,
          email: 'callback@ankitagastrocare.example',
          message: `CALLBACK REQUEST: Patient requested a call back to assist with booking their appointment. Phone number: ${callbackPhone}`
        })
      });
      if (res.ok) {
        setCallbackSuccess(true);
        setCallbackName('');
        setCallbackPhone('');
      }
    } catch (err) {
      console.error('Callback request error:', err);
    } finally {
      setSubmittingCallback(false);
    }
  };

  return (
    <div className="w-full">
      {/* ================= PAGE HERO ================= */}
      <section className="bg-teal-deep text-sand-light py-10 md:py-14 relative overflow-hidden">
        <div className="absolute right-[-100px] top-[-100px] w-[350px] h-[350px] border border-sand-light/10 rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-4">
          <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-sand-light/50">
            {t('bookHeroSub')}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
            {t('bookHeroTitle')}
          </h1>
          <p className="text-xs md:text-sm font-semibold tracking-wider text-copper-soft uppercase max-w-xl">
            {t('bookHeroDesc')}
          </p>
        </div>
      </section>

      {/* ================= BOOKING CONTAINER ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Form component */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 w-full"
          >
            <BookingForm />
          </motion.div>

          {/* Right Column: Info Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 space-y-6 w-full"
          >
            {/* Request a Call Back Card */}
            <div className="bg-teal-deep/5 p-6 md:p-8 rounded-sm border-2 border-teal-deep/20 space-y-4">
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold text-teal-deep">
                  {language === 'en' ? 'Or Request a Call Back' : 'या कॉल बैक का अनुरोध करें'}
                </h4>
                <p className="text-xs md:text-sm text-ink/75 leading-relaxed font-semibold">
                  {language === 'en' 
                    ? 'Our executive will call you to help with your bookings' 
                    : 'हमारे प्रतिनिधि आपकी बुकिंग में सहायता के लिए आपको कॉल करेंगे'}
                </p>
              </div>

              {callbackSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs py-3 px-4 rounded-sm font-semibold">
                  {language === 'en' 
                    ? 'Thank you! We will call you shortly.' 
                    : 'धन्यवाद! हम आपको जल्द ही कॉल करेंगे।'}
                </div>
              ) : (
                <form onSubmit={handleCallbackSubmit} className="space-y-3">
                  <div>
                    <input 
                      type="text" 
                      placeholder={language === 'en' ? 'Your Name' : 'आपका नाम'} 
                      value={callbackName}
                      onChange={(e) => setCallbackName(e.target.value)}
                      required
                      className="w-full bg-white border border-ink/10 py-2 px-3 text-xs md:text-sm font-medium focus:outline-teal-deep focus:border-teal-deep rounded-xs"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="tel" 
                      placeholder={language === 'en' ? 'Phone Number' : 'फ़ोन नंबर'} 
                      value={callbackPhone}
                      onChange={(e) => setCallbackPhone(e.target.value)}
                      required
                      className="w-full bg-white border border-ink/10 py-2 px-3 text-xs md:text-sm font-medium focus:outline-teal-deep focus:border-teal-deep rounded-xs"
                    />
                    <button
                      type="submit"
                      disabled={submittingCallback}
                      className="bg-teal-deep hover:bg-copper-deep text-sand-light font-bold text-xs uppercase tracking-wider px-4 py-2 transition-all duration-300 disabled:opacity-50 select-none shrink-0"
                    >
                      {submittingCallback 
                        ? (language === 'en' ? 'Sending...' : 'भेज रहे...') 
                        : (language === 'en' ? 'Call Me' : 'कॉल करें')}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Visit Card */}
            <div className="bg-bg-deep/40 p-6 md:p-8 rounded-sm border border-ink/5 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-copper-deep flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{t('visitUsTitle')}</span>
              </span>
              <h4 className="font-serif text-base font-bold text-teal-deep">
                Ankita Gastro Care
              </h4>
              <p className="text-xs md:text-sm text-ink/70 leading-relaxed font-semibold">
                Talli Bamori, Lal Danth Bypass Road,<br />
                near Nainital Bank, Amrawati Colony,<br />
                Haldwani, Haripur Nayak, Uttarakhand 263139
              </p>
            </div>

            {/* Reach Us Card */}
            <div className="bg-bg-deep/40 p-6 md:p-8 rounded-sm border border-ink/5 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-copper-deep flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>{t('reachUsTitle')}</span>
              </span>
              <h4 className="font-serif text-base font-bold text-teal-deep">
                {t('clinicReception')}
              </h4>
              <p className="text-xs md:text-sm text-ink/70 leading-relaxed font-semibold">
                09962076595<br />
                care@ankitagastrocare.example
              </p>
            </div>

            {/* Timings Card */}
            <div className="bg-bg-deep/40 p-6 md:p-8 rounded-sm border border-ink/5 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-copper-deep flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Clinic Hours' : 'क्लीनिक खुलने का समय'}</span>
              </span>
              <h4 className="font-serif text-base font-bold text-teal-deep">
                {t('consultationsHours')}
              </h4>
              <p className="text-xs md:text-sm text-ink/70 leading-relaxed font-semibold">
                {language === 'en' ? (
                  <>
                    Monday – Saturday: 8:30 AM – 7:30 PM<br />
                    Sunday: 10:00 AM – 1:00 PM
                  </>
                ) : (
                  <>
                    सोमवार - शनिवार: सुबह 8:30 बजे से शाम 7:30 बजे तक<br />
                    रविवार: सुबह 10:00 बजे से दोपहर 1:00 बजे तक
                  </>
                )}
              </p>
            </div>

            {/* Lunch Hours Card */}
            <div className="bg-bg-deep/40 p-6 md:p-8 rounded-sm border border-ink/5 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-copper-deep flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{t('lunchTitle')}</span>
              </span>
              <h4 className="font-serif text-base font-bold text-teal-deep">
                {language === 'en' ? 'Lunch Break (No Appointments)' : 'भोजन अवकाश (लंच टाइम)'}
              </h4>
              <p className="text-xs md:text-sm text-ink/70 leading-relaxed font-semibold">
                {language === 'en' ? (
                  <>
                    Monday – Saturday: 1:30 PM – 4:00 PM<br />
                    Sunday: No Lunch Break (Clinic closes at 1:00 PM)
                  </>
                ) : (
                  <>
                    सोमवार - शनिवार: दोपहर 1:30 बजे से शाम 4:00 बजे तक<br />
                    रविवार: कोई लंच ब्रेक नहीं (क्लीनिक दोपहर 1:00 बजे बंद हो जाता है)
                  </>
                )}
              </p>
            </div>

            {/* Good to Know */}
            <div className="bg-bg-deep/40 p-6 md:p-8 rounded-sm border border-ink/5 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-copper-deep flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>{t('goodToKnowTitle')}</span>
              </span>
              <h4 className="font-serif text-base font-bold text-teal-deep">
                {language === 'en' ? 'Woman-Owned & Veteran Welcome' : 'महिला-स्वामित्व व सैनिकों का स्वागत'}
              </h4>
              <p className="text-xs md:text-sm text-ink/70 leading-relaxed font-semibold">
                {t('goodToKnowDesc')}
              </p>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
