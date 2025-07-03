
import React, { useEffect } from 'react';
import type { NewsArticle } from '../types';
import { XCircleIcon } from './icons/XCircleIcon';
import { useSettings } from '../contexts/SettingsContext';
import { BullIcon } from './icons/BullIcon';
import { BearIcon } from './icons/BearIcon';
import { NeutralIcon } from './icons/NeutralIcon';

interface NewsModalProps {
    article: NewsArticle;
    onClose: () => void;
}

const SentimentBadge: React.FC<{ sentiment: 'Bullish' | 'Bearish' | 'Neutral', t: (key: string) => string }> = ({ sentiment, t }) => {
  const sentimentMap = {
    Bullish: {
      label: t('news_sentiment_bullish'),
      icon: <BullIcon className="h-4 w-4" />,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-400',
    },
    Bearish: {
      label: t('news_sentiment_bearish'),
      icon: <BearIcon className="h-4 w-4" />,
      color: 'text-red-500 bg-red-100 dark:bg-red-900/50 dark:text-red-400',
    },
    Neutral: {
      label: t('news_sentiment_neutral'),
      icon: <NeutralIcon className="h-4 w-4" />,
      color: 'text-gray-500 bg-gray-200 dark:bg-slate-700 dark:text-slate-300',
    },
  };
  
  const currentSentiment = sentimentMap[sentiment] || sentimentMap.Neutral;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${currentSentiment.color}`}>
      {currentSentiment.icon}
      <span>{currentSentiment.label}</span>
    </div>
  );
};


const NewsModal: React.FC<NewsModalProps> = ({ article, onClose }) => {
    const { t } = useSettings();
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col relative animate-slide-in-up"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-gray-200 dark:border-slate-800 flex-shrink-0">
                    <div className="pr-10">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-2">{article.title}</h2>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                             <p className="text-sm text-gray-500 dark:text-slate-400">{t('news_source_label')}: {article.source}</p>
                             <div className="flex items-center gap-3">
                                {article.sentiment && <SentimentBadge sentiment={article.sentiment} t={t} />}
                                {article.published_at && <p className="text-sm text-gray-500 dark:text-slate-400">{article.published_at}</p>}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                        <XCircleIcon className="h-8 w-8" />
                    </button>
                </header>
                <main className="p-6 overflow-y-auto">
                    <p className="text-gray-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{article.content}</p>
                </main>
            </div>
            <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                @keyframes slide-in-up { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                .animate-slide-in-up { animation: slide-in-up 0.4s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default NewsModal;