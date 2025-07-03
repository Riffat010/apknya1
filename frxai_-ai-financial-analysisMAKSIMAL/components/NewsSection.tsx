
import React, { useState, useEffect, useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { fetchNewsForAsset } from '../services/geminiService';
import type { NewsArticle } from '../types';
import { SearchIcon } from './icons/SearchIcon';
import { BullIcon } from './icons/BullIcon';
import { BearIcon } from './icons/BearIcon';
import { NeutralIcon } from './icons/NeutralIcon';

interface NewsSectionProps {
    onViewNews: (article: NewsArticle) => void;
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


const NewsCard: React.FC<{ article: NewsArticle; onClick: () => void; t: (key: string) => string; }> = ({ article, onClick, t }) => (
    <div 
        onClick={onClick}
        className="bg-white dark:bg-slate-800/50 p-4 rounded-xl shadow-md border border-gray-200 dark:border-slate-800 hover:shadow-lg hover:border-green-500/50 dark:hover:border-green-500/50 cursor-pointer transition-all duration-300"
    >
        {(article.sentiment || article.published_at) && (
             <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                {article.sentiment && <SentimentBadge sentiment={article.sentiment} t={t} />}
                {article.published_at && <p className="text-xs text-gray-400 dark:text-slate-500 flex-shrink-0">{article.published_at}</p>}
            </div>
        )}
        <h4 className="font-bold text-gray-900 dark:text-slate-50 mb-1 leading-tight">{article.title}</h4>
        <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">{t('news_source_label')}: {article.source}</p>
        <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-2">{article.snippet}</p>
    </div>
);

const NewsSection: React.FC<NewsSectionProps> = ({ onViewNews }) => {
    const { t, language } = useSettings();
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [assetToFetch, setAssetToFetch] = useState('EUR/USD');

    const loadNews = useCallback(async (asset: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedNews = await fetchNewsForAsset(asset, language);
            setNews(fetchedNews);
        } catch (e: any) {
            setError(e.message || t('news_error'));
            setNews([]);
        } finally {
            setIsLoading(false);
        }
    }, [language, t]);

    useEffect(() => {
        loadNews(assetToFetch);
    }, [loadNews, assetToFetch]);
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if(searchTerm.trim()) {
            setAssetToFetch(searchTerm.trim().toUpperCase());
        }
    };

    return (
        <div className="w-full max-w-md mx-auto mt-8">
            <h2 className="text-2xl font-bold text-left mb-4 text-gray-900 dark:text-slate-50">{t('news_section_title')}</h2>
            
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                    placeholder={t('news_search_placeholder')}
                    className="flex-grow bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-800 dark:text-slate-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                />
                <button type="submit" className="p-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow" aria-label={t('news_search_button_label')}>
                    <SearchIcon className="h-5 w-5" />
                </button>
            </form>

            <div className="space-y-3">
                {isLoading ? (
                    <p className="text-center text-gray-500 dark:text-slate-400">{t('news_loading')}</p>
                ) : error ? (
                    <p className="text-center text-red-500 dark:text-red-400">{error}</p>
                ) : news.length > 0 ? (
                    news.map((article, index) => (
                        <NewsCard key={index} article={article} onClick={() => onViewNews(article)} t={t} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-slate-400">{t('news_no_results')}</p>
                )}
            </div>
        </div>
    );
};

export default NewsSection;