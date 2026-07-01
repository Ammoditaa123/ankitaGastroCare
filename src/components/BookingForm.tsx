'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle, Calendar, Phone, Mail, User, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  reason: string;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'confirmed';
}

const getAvailableSlotsForDate = (dateString: string) => {
  if (!dateString) return [];
  const [year, month, day] = dateString.split('-').map(Number);
  const selectedDateObj = new Date(year, month - 1, day);
  const dayOfWeek = selectedDateObj.getDay();

  if (dayOfWeek === 0) {
    // Sunday: 10:00 AM to 1:00 PM
    return ["10:00 AM", "11:00 AM", "12:00 PM"];
  } else {
    // Monday - Saturday: 8:30 AM to 1:30 PM, then 4:00 PM to 7:30 PM (lunch break 1:30 PM - 4:00 PM is skipped)
    return [
      "8:30 AM", "9:30 AM", "10:30 AM", "11:30 AM", "12:30 PM", 
      "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"
    ];
  }
};

export const BookingForm: React.FC = () => {
  const { language, t } = useLanguage();

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('General Consultation');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  // App and validation states
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSunday, setIsSunday] = useState(false);
  const [minDate, setMinDate] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Lookup dashboard states
  const [showLookup, setShowLookup] = useState(false);
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupResults, setLookupResults] = useState<Booking[]>([]);
  const [searched, setSearched] = useState(false);
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  // Load min date on mount
  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    setMinDate(todayStr);
  }, []);

  // Fetch taken slots when date changes
  useEffect(() => {
    if (!date) {
      setTakenSlots([]);
      setIsSunday(false);
      return;
    }

    const [year, month, day] = date.split('-').map(Number);
    const selectedDateObj = new Date(year, month - 1, day);
    const dayOfWeek = selectedDateObj.getDay();
    
    setIsSunday(dayOfWeek === 0);
    setLoadingSlots(true);
    setErrorMsg('');

    fetch(`/api/bookings?date=${date}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTakenSlots(data.takenSlots || []);
        } else {
          setErrorMsg(data.error || 'Failed to fetch slot availability.');
        }
      })
      .catch(err => {
        console.error('Error fetching slots:', err);
        setErrorMsg('Network error connecting to availability database.');
      })
      .finally(() => {
        setLoadingSlots(false);
      });
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!date) {
      setErrorMsg(language === 'en' ? 'Please select a date.' : 'कृपया तारीख चुनें।');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) {
      setErrorMsg(t('validationErrorPastDate'));
      return;
    }

    if (isSunday) {
      setErrorMsg(t('sundayClosed'));
      return;
    }

    if (!time) {
      setErrorMsg(t('validationErrorSelectSlot'));
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, reason, date, time, notes })
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        // Reset Form
        setName('');
        setPhone('');
        setEmail('');
        setReason('General Consultation');
        setDate('');
        setTime('');
        setNotes('');
        setSuccess(true);
        window.scrollTo({ top: 120, behavior: 'smooth' });
      } else {
        setErrorMsg(resData.error || 'Failed to submit appointment request.');
      }
    } catch (err) {
      console.error('Error submitting booking:', err);
      setErrorMsg('Network error submitting appointment request. Please try again.');
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setCancelMessage('');
    setErrorMsg('');
    if (!lookupPhone) return;

    setLoadingLookup(true);
    setSearched(false);

    try {
      const res = await fetch(`/api/bookings?phone=${encodeURIComponent(lookupPhone)}`);
      const data = await res.json();
      
      if (res.ok && data.success) {
        setLookupResults(data.bookings || []);
      } else {
        setLookupResults([]);
        setErrorMsg(data.error || 'Failed to search bookings.');
      }
    } catch (err) {
      console.error('Error searching bookings:', err);
      setErrorMsg('Network error searching bookings. Please check connection.');
      setLookupResults([]);
    } finally {
      setSearched(true);
      setLoadingLookup(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    setErrorMsg('');
    setCancelMessage('');

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // Filter out cancelled booking
        setLookupResults(prev => prev.filter(b => b.id !== id));
        setCancelMessage(t('cancelSuccessMsg'));
        
        // Auto clear message after 4s
        setTimeout(() => {
          setCancelMessage('');
        }, 4000);
      } else {
        setErrorMsg(data.error || 'Failed to cancel appointment.');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setErrorMsg('Network error cancelling appointment. Please try again.');
    }
  };

  return (
    <div className="w-full">
      {/* Tab Selectors */}
      <div className="flex border-b border-ink/10 mb-8">
        <button
          onClick={() => { setShowLookup(false); setSuccess(false); setErrorMsg(''); }}
          className={`flex-1 text-center py-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 border-b-2 cursor-pointer ${
            !showLookup
              ? 'border-teal-deep text-teal-deep'
              : 'border-transparent text-ink/50 hover:text-teal-light'
          }`}
        >
          {t('heroCtaBook')}
        </button>
        <button
          onClick={() => { setShowLookup(true); setSearched(false); setLookupPhone(''); setErrorMsg(''); }}
          className={`flex-1 text-center py-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 border-b-2 cursor-pointer ${
            showLookup
              ? 'border-teal-deep text-teal-deep'
              : 'border-transparent text-ink/50 hover:text-teal-light'
          }`}
        >
          {t('myBookingsTitle')}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!showLookup ? (
          // ================= BOOKING REQUEST FORM =================
          <motion.div
            key="booking-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {success ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-teal-deep/5 border border-teal-deep/20 p-8 text-center rounded-sm max-w-xl mx-auto shadow-sm"
              >
                <CheckCircle className="w-16 h-16 text-ok mx-auto mb-4" />
                <h3 className="font-serif text-2xl text-teal-deep mb-3">
                  {language === 'en' ? 'Appointment Requested!' : 'अनुरोध भेज दिया गया है!'}
                </h3>
                <p className="text-sm text-ink/80 leading-relaxed mb-6">
                  {t('bookingSuccessMsg')}
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 bg-teal-deep text-sand-light text-xs font-bold uppercase tracking-wider hover:bg-copper-deep transition-all duration-300"
                >
                  {language === 'en' ? 'Book Another Slot' : 'दूसरा स्लॉट बुक करें'}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="font-serif text-xl md:text-2xl text-teal-deep border-b border-ink/10 pb-3">
                  {t('bookRequestTitle')}
                </h2>

                {errorMsg && (
                  <div className="bg-full/5 border border-full/20 text-full text-xs font-semibold p-4 flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-ink/60 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {t('formLabelName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('formPlaceholderName')}
                      className="w-full bg-transparent border-b border-ink/20 focus:border-copper-deep focus:outline-none py-2 text-sm text-ink font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-ink/60 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      {t('formLabelPhone')}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('formPlaceholderPhone')}
                      className="w-full bg-transparent border-b border-ink/20 focus:border-copper-deep focus:outline-none py-2 text-sm text-ink font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink/60 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    {t('formLabelEmail')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('formPlaceholderEmail')}
                    className="w-full bg-transparent border-b border-ink/20 focus:border-copper-deep focus:outline-none py-2 text-sm text-ink font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-ink/60">
                      {t('formLabelReason')}
                    </label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full bg-transparent border-b border-ink/20 focus:border-copper-deep focus:outline-none py-2 text-sm text-ink font-medium"
                    >
                      <option value="General Consultation">General Consultation / सामान्य परामर्श</option>
                      <option value="Gastro-Oesophageal Reflux">Gastro-Oesophageal Reflux / रिफ्लक्स रोग</option>
                      <option value="Gastroenteritis">Gastroenteritis / गैस्ट्रोएंटेराइटिस</option>
                      <option value="Acute Pancreatitis">Acute Pancreatitis / अग्नाशयशोथ</option>
                      <option value="Pancreas Stone">Pancreas Stone / अग्नाशय पथरी</option>
                      <option value="Endoscopic Variceal Banding">Endoscopic Variceal Banding / एंडोस्कोपिक बैंडिंग</option>
                      <option value="Peg Tube Placement">PEG Tube Placement / पेग ट्यूब डालना</option>
                      <option value="Esophageal Dilatation">Esophageal Dilatation / एसोफैगल फैलाव</option>
                      <option value="Colonoscopy">Colonoscopy / कोलोनोस्कोपी</option>
                      <option value="OGD Scopy">OGD Scopy / ओजीडी स्कोपी (एंडोस्कोपी)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-ink/60 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {t('formLabelDate')}
                    </label>
                    <input
                      type="date"
                      required
                      min={minDate}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-transparent border-b border-ink/20 focus:border-copper-deep focus:outline-none py-2 text-sm text-ink font-medium"
                    />
                  </div>
                </div>

                {/* Time slots grid */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink/60 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {t('formLabelTime')}
                  </label>

                  {date ? (
                    loadingSlots ? (
                      <p className="text-xs text-ink/50 italic animate-pulse">
                        {language === 'en' ? 'Checking slot availability...' : 'उपलब्धता की जांच की जा रही है...'}
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {isSunday && (
                          <div className="bg-teal-deep/5 border border-teal-deep/10 text-teal-deep text-[11px] font-bold py-2 px-3 rounded-xs">
                            {language === 'en' 
                              ? 'Sunday Hours: 10:00 AM – 1:00 PM (No Lunch Break)' 
                              : 'रविवार का समय: सुबह 10:00 बजे से दोपहर 1:00 बजे तक (भोजन अवकाश नहीं)'}
                          </div>
                        )}
                        {!isSunday && (
                          <div className="bg-copper-deep/5 border border-copper-deep/10 text-copper-deep text-[11px] font-semibold py-2 px-3 rounded-xs">
                            {language === 'en' 
                              ? 'Lunch break is from 1:30 PM to 4:00 PM (No appointments available)' 
                              : 'भोजन अवकाश (लंच टाइम) दोपहर 1:30 से शाम 4:00 बजे तक है (स्लॉट बंद)'}
                          </div>
                        )}
                        <div className="grid grid-cols-3 gap-2.5">
                          {getAvailableSlotsForDate(date).map((slot) => {
                            const isTaken = takenSlots.includes(slot);
                            const isSelected = time === slot;

                            return (
                              <button
                                key={slot}
                                type="button"
                                disabled={isTaken}
                                onClick={() => setTime(slot)}
                                className={`py-2 px-1 text-center text-xs border transition-all duration-200 cursor-pointer ${
                                  isTaken
                                    ? 'opacity-35 line-through bg-ink/5 border-ink/10 text-ink/40 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-teal-deep text-sand-light border-teal-deep font-bold shadow-sm'
                                    : 'bg-white text-ink/80 border-ink/15 hover:border-copper-deep'
                                }`}
                              >
                                {slot} {isTaken && `(${t('slotTaken')})`}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )
                  ) : (
                    <p className="text-xs text-ink/50 italic">
                      {language === 'en' ? 'Select a date first to view available time slots.' : 'उपलब्ध समय स्लॉट देखने के लिए पहले तारीख चुनें।'}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink/60">
                    {t('formLabelNotes')}
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('formPlaceholderNotes')}
                    className="w-full bg-transparent border-b border-ink/20 focus:border-copper-deep focus:outline-none py-2 text-sm text-ink font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-teal-deep text-sand-light text-xs font-bold uppercase tracking-widest hover:bg-copper-deep shadow-sm transition-all duration-300"
                >
                  {t('formSubmit')}
                </button>
              </form>
            )}
          </motion.div>
        ) : (
          // ================= MY BOOKINGS LOOKUP =================
          <motion.div
            key="booking-lookup"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <h2 className="font-serif text-xl md:text-2xl text-teal-deep border-b border-ink/10 pb-3">
              {t('myBookingsCta')}
            </h2>

            {cancelMessage && (
              <div className="bg-ok/5 border border-ok/20 text-ok text-xs font-semibold p-4 rounded-sm">
                {cancelMessage}
              </div>
            )}

            {errorMsg && (
              <div className="bg-full/5 border border-full/20 text-full text-xs font-semibold p-4 rounded-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 flex flex-col gap-1.5 w-full">
                <label className="text-[10px] font-bold uppercase tracking-wider text-ink/60">
                  {t('enterPhoneLookup')}
                </label>
                <input
                  type="tel"
                  required
                  value={lookupPhone}
                  onChange={(e) => setLookupPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-transparent border-b border-ink/20 focus:border-copper-deep focus:outline-none py-2 text-sm text-ink font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={loadingLookup}
                className="w-full sm:w-auto px-6 py-2.5 bg-teal-deep text-sand-light text-xs font-bold uppercase tracking-wider hover:bg-copper-deep transition-all duration-300 disabled:opacity-50"
              >
                {loadingLookup ? '...' : t('lookupBtn')}
              </button>
            </form>

            {/* Results */}
            <div className="space-y-4 pt-4">
              {searched && lookupResults.length === 0 && (
                <p className="text-sm text-ink/60 italic text-center py-6">
                  {t('noBookingsFound')}
                </p>
              )}

              {lookupResults.map((booking) => (
                <div 
                  key={booking.id} 
                  className="bg-white border border-ink/10 p-5 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-teal-deep/30 transition-all duration-300"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-serif text-base font-bold text-teal-deep">
                        {booking.name}
                      </h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        booking.status === 'confirmed'
                          ? 'bg-ok/10 text-ok'
                          : 'bg-busy/10 text-busy'
                      }`}>
                        {booking.status === 'confirmed' ? t('bookingStatusConfirmed') : t('bookingStatusPending')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-ink/70 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-copper-deep" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-copper-deep" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="sm:col-span-2 text-[11px] text-ink/50 mt-1 border-t border-ink/5 pt-1">
                        <b>{t('formLabelReason')}:</b> {booking.reason}
                        {booking.notes && (
                          <div className="italic text-ink/40 mt-0.5">
                            "{booking.notes}"
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 border border-full/20 hover:border-full bg-transparent hover:bg-full/5 text-xs font-bold text-full transition-all duration-300 rounded-sm w-full sm:w-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t('cancelBookingBtn')}</span>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default BookingForm;
