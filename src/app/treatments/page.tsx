'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Scissors, Activity, FileText, ChevronDown, CheckCircle2 } from 'lucide-react';

interface AccordionItem {
  titleEn: string;
  titleHi: string;
  contentEn: string;
  contentHi: string;
}

const accordionData: AccordionItem[] = [
  {
    titleEn: "What is GERD & Acid Reflux?",
    titleHi: "जीईआरडी (GERD) और एसिड रिफ्लक्स क्या है?",
    contentEn: "Gastro-Oesophageal Reflux Disease (GERD) occurs when stomach acid frequently flows back into the tube connecting your mouth and stomach (esophagus). This backwash (acid reflux) can irritate the lining of your esophagus, causing heartburn, regurgitation of food or sour liquid, chest pain, and difficulty swallowing.",
    contentHi: "गैस्ट्रो-एसोफेगल रिफ्लक्स डिजीज (GERD) तब होता है जब पेट का एसिड बार-बार वापस उस नली (ग्रासनली/एसोफैगस) में बहता है जो आपके मुंह और पेट को जोड़ती है। यह एसिड रिफ्लक्स ग्रासनली के अस्तर को उत्तेजित कर सकता है, जिससे सीने में जलन, भोजन या खट्टे तरल का गले में आना, छाती में दर्द और निगलने में कठिनाई होती है।"
  },
  {
    titleEn: "What happens during an OGD Scopy?",
    titleHi: "ओजीडी स्कोपी (OGD Scopy / एंडोस्कोपी) में क्या होता है?",
    contentEn: "An OesophagoGastroDuodenoscopy (OGD Scopy or Upper GI Endoscopy) is a procedure where a thin, flexible tube with a camera (endoscope) is passed through your mouth down into your esophagus, stomach, and the first part of your small intestine (duodenum). It allows Dr. Kandpal to visually inspect these areas for ulcers, inflammation, tumors, or bleeding and perform minor treatments like biopsy or stone removal.",
    contentHi: "ओजीडी स्कोपी (या अपर जीआई एंडोस्कोपी) एक ऐसी प्रक्रिया है जिसमें एक पतली, लचीली नली जिसके सिरे पर कैमरा लगा होता है (एंडोस्कोप), आपके मुंह से होते हुए आपकी ग्रासनली, पेट और छोटी आंत के पहले हिस्से (डुओडेनम) में डाली जाती है। यह डॉ. कांडपाल को अल्सर, सूजन, ट्यूमर या रक्तस्राव के लिए इन क्षेत्रों का दृश्य निरीक्षण करने और बायोप्सी या स्टोन निकालने जैसे छोटे उपचार करने की अनुमति देता है।"
  },
  {
    titleEn: "What is a Colonoscopy and why is it performed?",
    titleHi: "कोलोनोस्कोपी (Colonoscopy) क्या है और यह क्यों की जाती है?",
    contentEn: "A colonoscopy is an endoscopic examination of the large bowel (colon) and the distal part of the small bowel. It is performed using a flexible camera (colonoscope) passed through the rectum. It is used to evaluate symptoms like blood in stool, abdominal pain, chronic diarrhea, and to screen for colorectal cancer or remove polyps.",
    contentHi: "कोलोनोस्कोपी बड़ी आंत (कोलन) और छोटी आंत के अंतिम हिस्से की एक एंडोस्कोपिक जांच है। इसे मलाशय के माध्यम से डाले गए एक लचीले कैमरे (कोलोनोस्कोप) का उपयोग करके किया जाता है। इसका उपयोग मल में रक्त, पेट दर्द, पुरानी दस्त जैसे लक्षणों का मूल्यांकन करने और कोलोरेक्टल कैंसर की जांच करने या पॉलिप्स को हटाने के लिए किया जाता है।"
  },
  {
    titleEn: "Understanding Pancreas Stones & Acute Pancreatitis",
    titleHi: "अग्न्याशय की पथरी (Pancreas Stones) और अग्नाशयशोथ को समझें",
    contentEn: "Acute pancreatitis is a sudden inflammation of the pancreas, often caused by gallstones blocking the pancreatic duct or heavy alcohol consumption. Pancreas stones are calcified deposits that form in the pancreatic duct, blocking pancreatic juice flow. Symptoms include severe upper abdominal pain radiating to the back, nausea, and vomiting. Treatment involves pain management, biliary drainage (ERCP), or endoscopic stone removal.",
    contentHi: "एक्यूट पैंक्रियाटाइटिस अग्न्याशय (पैंक्रियाज) में अचानक होने वाली सूजन है, जो अक्सर पित्त की पथरी द्वारा अग्नाशयी वाहिनी को अवरुद्ध करने या भारी शराब के सेवन से होती है। अग्न्याशय की पथरी कैल्शियम के जमाव होते हैं जो अग्नाशयी वाहिनी में बनते हैं, जिससे अग्नाशयी रस का प्रवाह रुक जाता है। लक्षणों में पेट के ऊपरी हिस्से में तेज दर्द (जो पीठ तक जाता है), जी मिचलाना और उल्टी शामिल हैं। उपचार में दर्द प्रबंधन, पित्त जल निकासी (ERCP) या एंडोस्कोपिक पथरी निकालना शामिल है।"
  }
];

export default function Treatments() {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full">
      {/* ================= PAGE HERO ================= */}
      <section className="bg-teal-deep text-sand-light py-10 md:py-14 relative overflow-hidden">
        <div className="absolute right-[-100px] top-[-100px] w-[350px] h-[350px] border border-sand-light/10 rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-4">
          <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-sand-light/50">
            {t('treatmentHeroSub')}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
            {t('treatmentHeroTitle')}
          </h1>
          <p className="text-xs md:text-sm font-semibold tracking-wider text-copper-soft uppercase max-w-xl">
            {t('treatmentHeroDesc')}
          </p>
        </div>
      </section>

      {/* ================= CORE SERVICES DETAIL LISTS ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Category 1: Treatments */}
            <div className="border border-ink/10 p-8 rounded-sm bg-sand-light/10 space-y-6">
              <div className="flex items-center gap-4 border-b border-ink/10 pb-4">
                <div className="w-12 h-12 bg-teal-deep/5 rounded-full flex items-center justify-center text-teal-deep">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg md:text-xl font-bold text-teal-deep">{t('catTreatments')}</h3>
                  <span className="text-[10px] uppercase font-bold text-copper-deep tracking-wider">{language === 'en' ? 'Non-Invasive & Medical' : 'गैर-आक्रामक और नैदानिक'}</span>
                </div>
              </div>
              <ul className="space-y-3.5 text-xs md:text-sm font-medium text-ink/80">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-deep flex-shrink-0 mt-0.5" />
                  <span><b>Gastro-Oesophageal Reflux (GERD)</b> — {language === 'en' ? 'Chronic acid reflux management, diet plans.' : 'दीर्घकालिक एसिड रिफ्लक्स प्रबंधन और डाइट चार्ट।'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-deep flex-shrink-0 mt-0.5" />
                  <span><b>Gastroenteritis</b> — {language === 'en' ? 'Acute stomach infection treatment and hydration protocols.' : 'पेट के गंभीर संक्रमण का उपचार और हाइड्रेशन थेरेपी।'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-deep flex-shrink-0 mt-0.5" />
                  <span><b>Acute Pancreatitis</b> — {language === 'en' ? 'Pancreatic swelling management, hospital coordinate care.' : 'अग्न्याशय की सूजन का प्रबंधन और सहायक चिकित्सा।'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-deep flex-shrink-0 mt-0.5" />
                  <span><b>Pancreas Stone</b> — {language === 'en' ? 'Diagnostic staging and pain control therapies.' : 'अग्न्याशय पथरी का निदान और दर्द नियंत्रण उपचार।'}</span>
                </li>
              </ul>
            </div>

            {/* Category 2: Surgeries */}
            <div className="border border-ink/10 p-8 rounded-sm bg-sand-light/10 space-y-6">
              <div className="flex items-center gap-4 border-b border-ink/10 pb-4">
                <div className="w-12 h-12 bg-teal-deep/5 rounded-full flex items-center justify-center text-teal-deep">
                  <Scissors className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg md:text-xl font-bold text-teal-deep">{t('catSurgery')}</h3>
                  <span className="text-[10px] uppercase font-bold text-copper-deep tracking-wider">{language === 'en' ? 'Endoscopic Procedures' : 'एंडोस्कोपिक सर्जरी'}</span>
                </div>
              </div>
              <ul className="space-y-3.5 text-xs md:text-sm font-medium text-ink/80">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-deep flex-shrink-0 mt-0.5" />
                  <span><b>Endoscopic Variceal Banding</b> — {language === 'en' ? 'Treatment to prevent variceal bleeding in liver disease patients.' : 'लिवर सिरोसिस में भोजन नली की नसों में रक्तस्राव रोकने के लिए एंडोस्कोपिक बैंडिंग।'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-deep flex-shrink-0 mt-0.5" />
                  <span><b>PEG Tube Placement</b> — {language === 'en' ? 'Percutaneous Endoscopic Gastrostomy tube insertion for feeding.' : 'गंभीर मरीजों के लिए भोजन देने हेतु पेट में सीधे एंडोस्कोपिक फीडिंग ट्यूब डालना।'}</span>
                </li>
              </ul>
            </div>

            {/* Category 3: Procedures */}
            <div className="border border-ink/10 p-8 rounded-sm bg-sand-light/10 space-y-6">
              <div className="flex items-center gap-4 border-b border-ink/10 pb-4">
                <div className="w-12 h-12 bg-teal-deep/5 rounded-full flex items-center justify-center text-teal-deep">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg md:text-xl font-bold text-teal-deep">{t('catProcedures')}</h3>
                  <span className="text-[10px] uppercase font-bold text-copper-deep tracking-wider">{language === 'en' ? 'Interventional Gastro' : 'हस्तक्षेप चिकित्सा'}</span>
                </div>
              </div>
              <ul className="space-y-3.5 text-xs md:text-sm font-medium text-ink/80">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-deep flex-shrink-0 mt-0.5" />
                  <span><b>Esophageal Dilatation</b> — {language === 'en' ? 'Stretching of narrowed esophagus using specialized dilators.' : 'सिकुड़ी हुई भोजन नली को डाइलेटर की मदद से चौड़ा करना।'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-deep flex-shrink-0 mt-0.5" />
                  <span><b>Colonoscopy</b> — {language === 'en' ? 'Visual examination of large intestines and terminal ileum.' : 'कैमरे की मदद से बड़ी आंत की संपूर्ण जांच व बायोप्सी की सुविधा।'}</span>
                </li>
              </ul>
            </div>

            {/* Category 4: Tests */}
            <div className="border border-ink/10 p-8 rounded-sm bg-sand-light/10 space-y-6">
              <div className="flex items-center gap-4 border-b border-ink/10 pb-4">
                <div className="w-12 h-12 bg-teal-deep/5 rounded-full flex items-center justify-center text-teal-deep">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg md:text-xl font-bold text-teal-deep">{t('catTests')}</h3>
                  <span className="text-[10px] uppercase font-bold text-copper-deep tracking-wider">{language === 'en' ? 'Diagnostics' : 'डायग्नोस्टिक टेस्ट'}</span>
                </div>
              </div>
              <ul className="space-y-3.5 text-xs md:text-sm font-medium text-ink/80">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-deep flex-shrink-0 mt-0.5" />
                  <span><b>OGD Scopy</b> — {language === 'en' ? 'OesophagoGastroDuodenoscopy / Upper Gastrointestinal Endoscopy.' : 'अपर जीआई एंडोस्कोपी — भोजन नली, आमाशय और छोटी आंत के पहले हिस्से की जांच।'}</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* ================= INTERACTIVE ACCORDIONS SECTION ================= */}
      <section className="py-20 bg-bg-deep/45">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-copper-deep block mb-2">
              {language === 'en' ? 'Patient Guide' : 'मरीज मार्गदर्शिका'}
            </span>
            <h2 className="text-3xl font-serif text-teal-deep font-bold">
              {language === 'en' ? 'Understanding Your Symptoms & Tests' : 'अपने लक्षणों और जांचों को समझें'}
            </h2>
          </div>

          <div className="space-y-3">
            {accordionData.map((item, idx) => {
              const isOpen = openIndex === idx;
              const title = language === 'en' ? item.titleEn : item.titleHi;
              const content = language === 'en' ? item.contentEn : item.contentHi;

              return (
                <div 
                  key={idx} 
                  className="bg-white border border-ink/10 rounded-sm overflow-hidden shadow-xs hover:border-teal-deep/30 transition-all duration-300"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none cursor-pointer"
                  >
                    <span className="font-serif text-sm md:text-base font-bold text-teal-deep pr-4">
                      {title}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-copper-deep flex-shrink-0"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-5 md:px-6 md:pb-6 text-xs md:text-sm text-ink/75 leading-relaxed font-medium border-t border-ink/5 pt-3">
                          {content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= DIAGNOSTIC TECHNOLOGY ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
            <div className="max-w-xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-copper-deep block">
                {language === 'en' ? 'Equipment & Safety' : 'उपकरण और सुरक्षा'}
              </span>
              <h2 className="text-3xl font-serif text-teal-deep font-bold">
                {t('equipSecTitle')}
              </h2>
              <p className="text-xs md:text-sm text-ink/70 leading-relaxed font-medium">
                {t('equipSecDesc')}
              </p>
            </div>
            
            <div className="path-divider shrink-0 hidden md:block">
              <svg viewBox="0 0 180 20">
                <path d="M0 10 C30 10 30 2 50 2 S70 18 90 18 110 2 130 2 150 18 180 18" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-16 bg-bg-deep/45">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-copper-deep text-sand-light p-10 md:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 rounded-sm">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-serif text-2xl md:text-3xl font-bold max-w-xl leading-tight" style={{ color: '#f7f4ee' }}>
                {language === 'en' ? 'Unsure which treatment applies to you?' : 'समझ नहीं आ रहा कि कौन सा उपचार आपके लिए सही है?'}
              </h3>
            </div>
            <Link
              href="/book"
              className="px-8 py-3.5 bg-transparent border-2 font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-copper-deep transition-all duration-300 shadow-md select-none shrink-0"
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
