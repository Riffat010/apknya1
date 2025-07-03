import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

export const Loader: React.FC = () => {
  const { t } = useSettings();
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <style>{`
        @keyframes bullish-path-anim {
          0% { motion-offset: 0%; }
          100% { motion-offset: 100%; }
        }
        @keyframes pulse-glow-anim {
          0%, 100% { filter: drop-shadow(0 0 2px #34d399); }
          50% { filter: drop-shadow(0 0 7px #34d399); }
        }
        .bullish-dot {
          animation: bullish-path-anim 2s ease-in-out infinite, pulse-glow-anim 1.5s ease-in-out infinite;
          offset-path: path("M10,80 C40,85 50,60 70,45 S100,10 120,15");
        }
      `}</style>
      <div className="relative w-[130px] h-[100px]">
        <svg width="130" height="100" viewBox="0 0 130 100" className="text-gray-300 dark:text-slate-700">
          {/* Grid */}
          <path d="M10 0 V100 M40 0 V100 M70 0 V100 M100 0 V100 M120 0 V100 M0 20 H130 M0 40 H130 M0 60 H130 M0 80 H130" stroke="currentColor" strokeWidth="0.5" />
          {/* Main path */}
          <path d="M10,80 C40,85 50,60 70,45 S100,10 120,15" stroke="#34d399" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </svg>
        {/* Animated dot */}
        <div className="absolute top-0 left-0 w-3 h-3 rounded-full bg-green-400 bullish-dot" style={{ offsetRotate: '0deg' }}></div>
      </div>
      <p className="text-gray-800 dark:text-slate-100 text-lg mt-4">{t('loader_analyzing')}</p>
      <p className="text-gray-500 dark:text-slate-400 text-sm">{t('loader_wait')}</p>
    </div>
  );
};
