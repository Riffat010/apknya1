
import React, { useEffect, useState } from 'react';
import type { AnalysisResult } from '../types';
import Header from './Header';
import { useSettings } from '../contexts/SettingsContext';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface ResultScreenProps {
  onBack: () => void;
  result: AnalysisResult;
  image: string; // Now accepts base64 string or object URL
}

const InsightRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-800 last:border-b-0">
        <p className="text-gray-600 dark:text-slate-400 text-sm">{label}</p>
        <p className="font-semibold text-gray-900 dark:text-slate-50 text-right">{value}</p>
    </div>
);

const ConfidenceRow: React.FC<{ score: number; label: string }> = ({ score, label }) => {
    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = score;
        if (start === end) return;
        const duration = 1500;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                start = end;
                clearInterval(timer);
            }
            setDisplayScore(Math.ceil(start));
        }, 16);
        return () => clearInterval(timer);
    }, [score]);

    return (
        <div className="flex items-center justify-between py-3">
            <p className="text-gray-600 dark:text-slate-400 text-sm">{label}</p>
            <div className="flex items-center w-2/5">
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 mr-3">
                    <div className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${displayScore}%` }}></div>
                </div>
                <span className="font-bold text-yellow-500 dark:text-yellow-300 text-sm">{displayScore}%</span>
            </div>
        </div>
    );
};


const ResultScreen: React.FC<ResultScreenProps> = ({ onBack, result, image }) => {
  const { t } = useSettings();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-50 p-4 items-center">
      <Header title={t('result_title')} onBack={onBack} />
      <div className="w-full max-w-md mx-auto pb-8">
        <div className="rounded-xl overflow-hidden shadow-lg mb-6 border-2 border-gray-200 dark:border-slate-800">
            <img src={image} alt={t('result_image_alt')} className="w-full h-auto" />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 mb-6 relative overflow-hidden shadow-lg border border-gray-200 dark:border-slate-800">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
            <h3 className="text-xl font-bold text-left mb-2 text-gray-900 dark:text-slate-100">{t('result_insights_title')}</h3>
            <div className="space-y-1 px-2">
                {result.market_asset && <InsightRow label={t('result_market_asset')} value={result.market_asset} />}
                <InsightRow label={t('result_trend')} value={result.trend} />
                <InsightRow label={t('result_volatility')} value={result.volatility} />
                <InsightRow label={t('result_volume')} value={result.volume} />
                <InsightRow label={t('result_sentiment')} value={result.sentiment} />
                <ConfidenceRow score={result.confidenceScore} label={t('result_confidence')} />
            </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 mb-6 shadow-lg border border-gray-200 dark:border-slate-800">
             <h3 className="text-xl font-bold text-left mb-2 text-gray-900 dark:text-slate-100">{t('result_game_plan_title')}</h3>
             <p className="text-gray-700 dark:text-slate-300 text-sm font-medium px-2 whitespace-pre-wrap">{result.gamePlan}</p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-slate-800">
             <h3 className="text-xl font-bold text-left mb-2 text-gray-900 dark:text-slate-100">{t('result_fundamental_title')}</h3>
             <p className="text-gray-700 dark:text-slate-300 text-sm font-medium px-2 whitespace-pre-wrap">{result.fundamentalAnalysis}</p>
        </div>
        
        {result.sources && result.sources.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 mt-6 shadow-lg border border-gray-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-left mb-2 text-gray-900 dark:text-slate-100">{t('result_sources_title')}</h3>
            <div className="space-y-2">
              {result.sources.map((source, index) => (
                <a 
                  key={index} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <span className="flex-1 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline truncate pr-2">{source.title}</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultScreen;