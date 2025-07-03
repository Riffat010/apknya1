
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import type { Theme, Language } from '../types';

// Locales are now embedded to ensure synchronous loading and prevent text from disappearing on load.
const enTranslations = {
    "settings_title": "Settings",
    "upload_header_title": "FrxAI",
    "upload_main_subtitle": "Upload a screenshot or get instant Trading Analysis",
    "upload_subtitle": "Upload a screenshot for instant trading analysis.",
    "upload_card_title": "Upload a Chart Photo",
    "upload_take_photo": "Take Photo",
    "upload_image": "Upload Image",
    "upload_detect_banner_title": "In-Depth Analysis at Your Fingertips",
    "upload_detect_banner_body": "FrxAI uses advanced AI to dissect every aspect of your forex chart. We identify key candlestick patterns, measure trend strength with moving averages and RSI, and map out crucial support and resistance levels. This analysis gives you a comprehensive picture of market dynamics, helping you make smarter, more informed trading decisions.",
    "upload_error_file_size": "File size exceeds 10MB. Please upload a smaller image.",
    "error_reference_image_load": "Failed to load the reference image. Please check your connection.",
    "result_title": "Analysis Result",
    "result_image_alt": "Analyzed chart",
    "result_insights_title": "Key Insights",
    "result_trend": "Market Trend",
    "result_volatility": "Volatility",
    "result_volume": "Volume",
    "result_sentiment": "Market Sentiment",
    "result_confidence": "Confidence Score",
    "result_game_plan_title": "Game Plan",
    "result_fundamental_title": "Fundamental Analysis",
    "result_market_asset": "Market Asset",
    "result_sources_title": "News Sources",
    "settings_language": "Language",
    "settings_theme": "Appearance",
    "settings_theme_light": "Light",
    "settings_theme_dark": "Dark",
    "settings_theme_system": "System",
    "loader_analyzing": "Analyzing your chart...",
    "loader_wait": "This may take a moment.",
    "error_analysis_failed": "Analysis Failed",
    "toast_success_title": "Success",
    "error_unknown": "An unknown error occurred.",
    "welcome_title": "Welcome to FrxAI",
    "welcome_subtitle": "Your personal AI trading analyst. Turn complex charts into clear, actionable insights.",
    "welcome_feature1_title": "Snap or Upload",
    "welcome_feature1_desc": "Instantly analyze any forex or stock chart from a photo or a screenshot.",
    "welcome_feature2_title": "AI-Powered Analysis",
    "welcome_feature2_desc": "Our AI identifies trends, sentiment, volatility, and key market patterns.",
    "welcome_feature3_title": "Actionable Game Plan",
    "welcome_feature3_desc": "Get a concise, data-driven trading strategy for your next move.",
    "welcome_button": "Get Started",
    "offline_title": "No Internet Connection",
    "offline_subtitle": "This application requires an internet connection to function. Please check your network.",
    "offline_retry_button": "Retry",
    "instruction_title": "Instructions",
    "instruction_subtitle": "For the best analysis results, please follow these guidelines:",
    "instruction_rule1": "Ensure the Asset Name (e.g., EUR/USD) is clearly visible.",
    "instruction_rule2": "Use a sharp, non-blurry image.",
    "instruction_rule3": "Position the camera straight and frame the entire chart area.",
    "instruction_button_start": "Let's Start",
    "news_section_title": "Latest Market News",
    "news_search_placeholder": "Search asset (e.g., EUR/USD)...",
    "news_search_button_label": "Search News",
    "news_source_label": "Source",
    "news_loading": "Fetching news...",
    "news_error": "Failed to load news. Please try again.",
    "news_no_results": "No news found for this asset.",
    "news_sentiment_bullish": "Bullish",
    "news_sentiment_bearish": "Bearish",
    "news_sentiment_neutral": "Neutral"
};

const idTranslations = {
    "settings_title": "Pengaturan",
    "upload_header_title": "FrxAI",
    "upload_main_subtitle": "Unggah tangkapan layar atau dapatkan Analisis Trading instan",
    "upload_subtitle": "Unggah tangkapan layar untuk analisis trading instan.",
    "upload_card_title": "Unggah Foto Chart",
    "upload_take_photo": "Ambil Foto",
    "upload_image": "Unggah Gambar",
    "upload_detect_banner_title": "Analisis Mendalam di Ujung Jari Anda",
    "upload_detect_banner_body": "FrxAI menggunakan AI canggih untuk membedah setiap aspek dari chart forex Anda. Kami mengidentifikasi pola candlestick kunci, mengukur kekuatan tren dengan moving average dan RSI, serta memetakan level support dan resistance krusial. Analisis ini memberi Anda gambaran menyeluruh tentang dinamika pasar, membantu Anda membuat keputusan trading yang lebih cerdas dan terinformasi.",
    "upload_error_file_size": "Ukuran file melebihi 10MB. Harap unggah gambar yang lebih kecil.",
    "error_reference_image_load": "Gagal memuat gambar referensi. Silakan periksa koneksi Anda.",
    "result_title": "Hasil Analisis",
    "result_image_alt": "Chart yang dianalisis",
    "result_insights_title": "Wawasan Utama",
    "result_trend": "Tren Pasar",
    "result_volatility": "Volatilitas",
    "result_volume": "Volume",
    "result_sentiment": "Sentimen Pasar",
    "result_confidence": "Tingkat Keyakinan",
    "result_game_plan_title": "Rencana Aksi",
    "result_fundamental_title": "Analisis Fundamental",
    "result_market_asset": "Aset Pasar",
    "result_sources_title": "Sumber Berita",
    "settings_language": "Bahasa",
    "settings_theme": "Tampilan",
    "settings_theme_light": "Terang",
    "settings_theme_dark": "Gelap",
    "settings_theme_system": "Sistem",
    "loader_analyzing": "Menganalisis chart Anda...",
    "loader_wait": "Proses ini mungkin perlu beberapa saat.",
    "error_analysis_failed": "Analisis Gagal",
    "toast_success_title": "Berhasil",
    "error_unknown": "Terjadi sebuah kesalahan yang tidak diketahui.",
    "welcome_title": "Selamat Datang di FrxAI",
    "welcome_subtitle": "Analis trading AI pribadi Anda. Ubah chart kompleks menjadi wawasan yang jelas dan dapat ditindaklanjuti.",
    "welcome_feature1_title": "Ambil atau Unggah Foto",
    "welcome_feature1_desc": "Analisis chart forex atau saham apa pun secara instan dari foto atau tangkapan layar.",
    "welcome_feature2_title": "Analisis Berbasis AI",
    "welcome_feature2_desc": "AI kami mengidentifikasi tren, sentimen, volatilitas, dan pola pasar utama.",
    "welcome_feature3_title": "Rencana Aksi Praktis",
    "welcome_feature3_desc": "Dapatkan strategi trading berbasis data yang ringkas untuk langkah Anda selanjutnya.",
    "welcome_button": "Mulai",
    "offline_title": "Tidak Ada Koneksi Internet",
    "offline_subtitle": "Aplikasi ini memerlukan koneksi internet untuk berfungsi. Harap periksa jaringan Anda.",
    "offline_retry_button": "Coba Lagi",
    "instruction_title": "Instruksi",
    "instruction_subtitle": "Untuk hasil analisis terbaik, harap ikuti panduan ini:",
    "instruction_rule1": "Pastikan Nama Aset (misal: EUR/USD) terlihat jelas.",
    "instruction_rule2": "Gunakan gambar yang fokus dan tidak buram.",
    "instruction_rule3": "Posisikan kamera lurus dan cakup seluruh area chart yang relevan.",
    "instruction_button_start": "Ayo Mulai",
    "news_section_title": "Berita Pasar Terkini",
    "news_search_placeholder": "Cari aset (misal: EUR/USD)...",
    "news_search_button_label": "Cari Berita",
    "news_source_label": "Sumber",
    "news_loading": "Mengambil berita...",
    "news_error": "Gagal memuat berita. Silakan coba lagi.",
    "news_no_results": "Tidak ada berita ditemukan untuk aset ini.",
    "news_sentiment_bullish": "Bullish",
    "news_sentiment_bearish": "Bearish",
    "news_sentiment_neutral": "Netral"
};

const translations: { [key in Language]: { [key: string]: string } } = {
  en: enTranslations,
  id: idTranslations,
};


interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Create context with a default value to prevent crash on use
const defaultSettings: SettingsContextType = {
    theme: 'system',
    setTheme: () => {},
    language: 'en',
    setLanguage: () => {},
    t: (key: string) => key,
};

const SettingsContext = createContext<SettingsContextType>(defaultSettings);

// This function now robustly determines the initial state without causing re-renders
const getInitialState = () => {
    try {
        const storedTheme = localStorage.getItem('frxai-theme') as Theme | null;
        const storedLang = localStorage.getItem('frxai-lang') as Language | null;

        const initialTheme = storedTheme || 'system';
        
        let initialLang: Language = 'en';
        if (storedLang) {
            initialLang = storedLang;
        } else {
            const browserLang = (navigator.language || 'en').split('-')[0];
            if (browserLang === 'id') {
                initialLang = 'id';
            }
        }
        return { initialTheme, initialLang };
    } catch (error) {
        console.error("Failed to initialize settings from localStorage:", error);
        return { initialTheme: 'system' as Theme, initialLang: 'en' as Language };
    }
};


export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state directly using the function, this runs only once.
  const [{ initialTheme, initialLang }] = useState(getInitialState);
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [language, setLanguageState] = useState<Language>(initialLang);

  // Effect for applying theme to DOM
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    root.classList.remove('light', 'dark');
    root.classList.add(isDark ? 'dark' : 'light');

    // Add listener for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
        if (theme === 'system') {
            setThemeState('system'); // Re-trigger effect
        }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
        localStorage.setItem('frxai-theme', newTheme);
    } catch (e) {
        console.error("Failed to save theme to localStorage", e);
    }
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    try {
        localStorage.setItem('frxai-lang', newLang);
    } catch(e) {
        console.error("Failed to save language to localStorage", e);
    }
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  const value = { theme, setTheme, language, setLanguage, t };
  
  // The provider now renders its children immediately with the correct initial values.
  // This completely eliminates the "white screen" or "flicker" issue.
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  // The context will always be defined because we provide a default value.
  return context;
};