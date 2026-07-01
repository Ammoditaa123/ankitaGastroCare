'use client';
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface VideoCard {
  titleEn: string;
  titleHi: string;
  categoryEn: string;
  categoryHi: string;
  link: string;
  youtubeId?: string;
  isChannelCard?: boolean;
}

const videosList: VideoCard[] = [
  {
    titleEn: "Understanding Liver & GI Biopsy",
    titleHi: "बायोप्सी जांच: क्यों और कैसे की जाती है?",
    categoryEn: "Procedure Guide",
    categoryHi: "जांच की जानकारी",
    link: "https://www.youtube.com/watch?v=GfbNOkEWqgQ&list=PLx0bjcIY2TcRtwan-7y0A-x3bK0xF4k1b",
    youtubeId: "GfbNOkEWqgQ"
  },
  {
    titleEn: "Colonoscopy: Purpose & What to Expect",
    titleHi: "कोलोनोस्कोपी: बड़ी आंत की जांच और तैयारी",
    categoryEn: "Procedure Guide",
    categoryHi: "जांच की जानकारी",
    link: "https://www.youtube.com/watch?v=V9QdmJkea_I&list=PLx0bjcIY2TcRmNqL5iJ28tFSvUKioTiHZ",
    youtubeId: "V9QdmJkea_I"
  },
  {
    titleEn: "Diabetes and Digestive Health",
    titleHi: "मधुमेह (शुगर) और पाचन तंत्र पर इसका प्रभाव",
    categoryEn: "Patient Education",
    categoryHi: "मरीज जागरूकता",
    link: "https://www.youtube.com/watch?v=ZJqYZubQrZQ&list=PLx0bjcIY2TcS5R4J6MNhyH5Wrs0WQVsjl",
    youtubeId: "ZJqYZubQrZQ"
  },
  {
    titleEn: "Fatty Liver: Prevention, Stages & Care",
    titleHi: "फैटी लिवर: कारण, लक्षण, बचाव और इलाज",
    categoryEn: "Preventive Care",
    categoryHi: "निवारक देखभाल",
    link: "https://www.youtube.com/watch?v=oJXMLUIRq94&list=PLx0bjcIY2TcR4SsMQp4DBjYXbu_HgwaKw&index=4",
    youtubeId: "oJXMLUIRq94"
  },
  {
    titleEn: "Inflammatory Bowel Disease (IBD) Explained",
    titleHi: "आईबीडी (IBD - अल्सरेटिव कोलाइटिस) के लक्षण व इलाज",
    categoryEn: "Patient Education",
    categoryHi: "मरीज जागरूकता",
    link: "https://www.youtube.com/watch?v=YY0nzp016O8&list=PLx0bjcIY2TcS07f3qwiPhjsPNyz9Ktxly",
    youtubeId: "YY0nzp016O8"
  },
  {
    titleEn: "ERCP Procedure: Bile & Pancreatic Stones",
    titleHi: "ईआरसीपी (ERCP): पित्त और अग्न्याशय की पथरी निकालना",
    categoryEn: "Procedure Guide",
    categoryHi: "जांच की जानकारी",
    link: "https://www.youtube.com/watch?v=SsNJ8ZNlB_w&list=PLx0bjcIY2TcQ211W178Kgoh_1FFbo1jTm",
    youtubeId: "SsNJ8ZNlB_w"
  },
  {
    titleEn: "Endoscopy (OGD Scopy) Patient Guide",
    titleHi: "एंडोस्कोपी (अपर जीआई स्कोपी) कैसे होती है?",
    categoryEn: "Procedure Guide",
    categoryHi: "जांच की जानकारी",
    link: "https://www.youtube.com/watch?v=oQH296fpHrc&list=PLx0bjcIY2TcQDsvizTDSlllTBSyDaT16g",
    youtubeId: "oQH296fpHrc"
  },
  {
    titleEn: "Jaundice (Pilia): Causes & Diagnosis",
    titleHi: "पीलिया (Jaundice) क्यों होता है? लक्षण व उपचार",
    categoryEn: "Patient Education",
    categoryHi: "मरीज जागरूकता",
    link: "https://www.youtube.com/watch?v=lWZY0CQhMIg&list=PLx0bjcIY2TcQPTOdbSRIKgIgdEHs48Ln4",
    youtubeId: "lWZY0CQhMIg"
  },
  {
    titleEn: "Gastrointestinal Problems in Kids",
    titleHi: "बच्चों में पेट और पाचन संबंधी सामान्य समस्याएं",
    categoryEn: "Pediatric Care",
    categoryHi: "बच्चों की देखभाल",
    link: "https://www.youtube.com/watch?v=Ihgurv9woHc&list=PLx0bjcIY2TcS1f2b6gDcarq5LUStryAYQ",
    youtubeId: "Ihgurv9woHc"
  },
  {
    titleEn: "Cirrhosis of Liver: Complications",
    titleHi: "लिवर सिरोसिस: लक्षण, जटिलताएं और प्रबंधन",
    categoryEn: "Patient Education",
    categoryHi: "मरीज जागरूकता",
    link: "https://www.youtube.com/watch?v=eMpvuemPnuM&list=PLx0bjcIY2TcRrp3UCwjAxv3mOsG8DCfM7",
    youtubeId: "eMpvuemPnuM"
  },
  {
    titleEn: "Ankita Gastro Care YouTube Channel",
    titleHi: "अंकिता गैस्ट्रो केयर यूट्यूब चैनल",
    categoryEn: "Official Channel",
    categoryHi: "आधिकारिक चैनल",
    link: "https://www.youtube.com/@AnkitaGastroCare-haldwani",
    isChannelCard: true
  }
];

export default function Videos() {
  const { t, language } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
    }
  };

  const channelUrl = "https://www.youtube.com/@AnkitaGastroCare-haldwani";

  return (
    <div className="w-full">
      {/* ================= PAGE HERO ================= */}
      <section className="bg-teal-deep text-sand-light py-10 md:py-14 relative overflow-hidden">
        <div className="absolute right-[-100px] top-[-100px] w-[350px] h-[350px] border border-sand-light/10 rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-4">
          <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-sand-light/50">
            Home / {language === 'en' ? 'Videos' : 'वीडियो'}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
            {t('videosTitle')}
          </h1>
          <p className="text-xs md:text-sm font-semibold tracking-wider text-copper-soft uppercase max-w-xl">
            {t('videosDesc')}
          </p>
        </div>
      </section>

      {/* ================= VIDEOS GRID ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          
          <div className="border-b border-ink/10 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-copper-deep block">
                {t('youtubeChannel')}
              </span>
              <h2 className="text-xl md:text-2xl font-serif text-teal-deep font-bold mt-1">
                {language === 'en' ? 'Educational Library' : 'शैक्षणिक वीडियो संग्रह'}
              </h2>
            </div>
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-copper-deep hover:text-teal-deep flex items-center gap-1 border-b border-copper-deep hover:border-teal-deep pb-0.5 transition-all"
            >
              <span>{language === 'en' ? 'Go to YouTube' : 'यूट्यूब पर जाएं'}</span>
            </a>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {videosList.map((video, idx) => {
              const title = language === 'en' ? video.titleEn : video.titleHi;
              const category = language === 'en' ? video.categoryEn : video.categoryHi;

              return (
                <motion.a
                  key={idx}
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={cardVariants}
                  className={`bg-white border rounded-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 ${
                    video.isChannelCard 
                      ? 'border-red-500/30 bg-red-50/5 hover:border-red-500/60' 
                      : 'border-ink/10 hover:border-teal-deep/30'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-teal-deep to-teal-light flex items-center justify-center relative overflow-hidden">
                    {video.isChannelCard ? (
                      // Special red YouTube background for channel card
                      <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white text-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 z-10">
                          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        </div>
                      </div>
                    ) : (
                      // Fetch actual thumbnail from YouTube
                      <>
                        <img 
                          src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                        <div className="w-12 h-12 rounded-full bg-sand-light/90 text-teal-deep flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-white transition-all duration-300 z-10">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </>
                    )}

                    <span className={`absolute bottom-2 right-2 text-[9px] font-bold py-0.5 px-1.5 tracking-wider rounded-xs text-white ${
                      video.isChannelCard ? 'bg-red-600/90' : 'bg-black/75'
                    }`}>
                      {video.isChannelCard ? 'CHANNEL' : 'YOUTUBE'}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <h4 className={`font-serif text-sm md:text-base font-bold leading-snug transition-colors ${
                      video.isChannelCard 
                        ? 'text-red-700 group-hover:text-red-800' 
                        : 'text-teal-deep group-hover:text-copper-deep'
                    }`}>
                      {title}
                    </h4>
                    <span className={`text-[10px] uppercase font-bold tracking-widest leading-none ${
                      video.isChannelCard ? 'text-red-500/85' : 'text-ink/40'
                    }`}>
                      {category}
                    </span>
                  </div>
                </motion.a>
              );
            })}
          </motion.div>

          {/* YT CTA strip */}
          <div className="bg-bg-deep/45 p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 border border-ink/10 rounded-sm">
            <div className="flex items-center gap-4 text-center lg:text-left flex-col sm:flex-row">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm shrink-0 border border-ink/5">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-teal-deep">
                  {t('ytCtaTitle')}
                </h4>
                <p className="text-xs md:text-sm text-ink/75 font-medium mt-0.5">
                  {t('ytCtaDesc')}
                </p>
              </div>
            </div>
            
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-teal-deep text-sand-light text-xs font-bold uppercase tracking-wider hover:bg-copper-deep shadow-sm transition-all duration-300 shrink-0 border border-teal-deep"
            >
              {t('ytVisitBtn')}
            </a>
          </div>

        </div>
      </section>

    </div>
  );
}
