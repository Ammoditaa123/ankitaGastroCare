'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, User, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ContactForm: React.FC = () => {
  const { language, t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setErrorMsg(data.error || 'Failed to send message.');
      }
    } catch (err) {
      console.error('Error sending contact inquiry:', err);
      setErrorMsg('Network error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-ink/10 p-6 md:p-8 rounded-sm shadow-sm">
      <h3 className="font-serif text-xl md:text-2xl text-teal-deep border-b border-ink/10 pb-3 mb-6">
        {language === 'en' ? 'Send a Message to the Clinic' : 'क्लीनिक को संदेश भेजें'}
      </h3>

      {success ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-teal-deep/5 border border-teal-deep/20 p-6 text-center rounded-sm"
        >
          <CheckCircle className="w-12 h-12 text-ok mx-auto mb-3" />
          <h4 className="font-serif text-lg text-teal-deep mb-2">
            {language === 'en' ? 'Message Sent!' : 'संदेश भेज दिया गया!'}
          </h4>
          <p className="text-xs md:text-sm text-ink/75 leading-relaxed mb-4">
            {language === 'en' 
              ? 'Thank you! The clinic has received your inquiry and our reception team will email or call you shortly.' 
              : 'धन्यवाद! क्लीनिक को आपका संदेश मिल गया है और हमारी टीम जल्द ही आपसे संपर्क करेगी।'}
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="px-5 py-2 bg-teal-deep text-sand-light text-xs font-bold uppercase tracking-wider hover:bg-copper-deep transition-all duration-300"
          >
            {language === 'en' ? 'Send Another Message' : 'दूसरा संदेश भेजें'}
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="bg-full/5 border border-full/20 text-full text-xs font-semibold p-4 flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-ink/60 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {t('formLabelName')}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('formPlaceholderName')}
              className="w-full bg-transparent border-b border-ink/20 focus:border-copper-deep focus:outline-none py-1.5 text-xs md:text-sm text-ink font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-ink/60 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {t('formLabelEmail')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('formPlaceholderEmail')}
                className="w-full bg-transparent border-b border-ink/20 focus:border-copper-deep focus:outline-none py-1.5 text-xs md:text-sm text-ink font-medium"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-ink/60 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {t('formLabelPhone')}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('formPlaceholderPhone')}
                className="w-full bg-transparent border-b border-ink/20 focus:border-copper-deep focus:outline-none py-1.5 text-xs md:text-sm text-ink font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-ink/60 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              {language === 'en' ? 'Your Message' : 'आपका संदेश / पूछताछ'}
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={language === 'en' ? 'Describe your query or symptoms...' : 'अपनी पूछताछ या लक्षणों का विवरण लिखें...'}
              className="w-full bg-transparent border-b border-ink/20 focus:border-copper-deep focus:outline-none py-1.5 text-xs md:text-sm text-ink font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-2.5 bg-teal-deep text-sand-light text-xs font-bold uppercase tracking-wider hover:bg-copper-deep shadow-sm transition-all duration-300 disabled:opacity-50"
          >
            {loading ? '...' : language === 'en' ? 'Send Inquiry' : 'पूछताछ भेजें'}
          </button>
        </form>
      )}
    </div>
  );
};
export default ContactForm;
