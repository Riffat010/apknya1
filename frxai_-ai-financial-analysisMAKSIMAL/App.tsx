


import React, { useState, useCallback, useEffect, useRef } from 'react';
import UploadScreen, { UploadScreenHandle } from './components/UploadScreen';
import ResultScreen from './components/ResultScreen';
import { Loader } from './components/Loader';
import { AppScreen, AnalysisResult, NewsArticle } from './types';
import { analyzeChart } from './services/geminiService';
import SettingsScreen from './components/SettingsScreen';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { fileToBase64 } from './utils/fileUtils';
import WelcomeScreen from './components/WelcomeScreen';
import OfflineScreen from './components/OfflineScreen';
import { CheckCircleIcon } from './components/icons/CheckCircleIcon';
import { XCircleIcon } from './components/icons/XCircleIcon';
import InstructionScreen from './components/InstructionScreen';
import NewsModal from './components/NewsModal';

const useOnlineStatus = () => {
    const [isOnline, setIsOnline] = useState(() => navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
};

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const MainApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.UPLOAD);
  const [viewingResult, setViewingResult] = useState<{ result: AnalysisResult; image: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [showCameraInstruction, setShowCameraInstruction] = useState(false);
  const [showUploadInstruction, setShowUploadInstruction] = useState(false);
  const [viewingNews, setViewingNews] = useState<NewsArticle | null>(null);
  const uploadScreenRef = useRef<UploadScreenHandle>(null);
  const { language, t } = useSettings();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' = 'error') => {
    setToast({ message, type, id: Date.now() });
  }

  const handleAnalyze = useCallback(async (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showToast(t('upload_error_file_size'), 'error');
        return;
    }
    setIsLoading(true);
    try {
      const result = await analyzeChart(file, language);
      const imageBase64 = await fileToBase64(file);
      
      setViewingResult({ result, image: imageBase64 });
    } catch (err: unknown) {
        if (err instanceof Error) {
            showToast(err.message, 'error');
        } else {
            showToast(t('error_unknown'), 'error');
        }
    } finally {
      setIsLoading(false);
    }
  }, [language, t]);
  
  const handleCloseResult = useCallback(() => {
    setViewingResult(null);
  }, []);
  
  const handleShowCameraInstruction = () => setShowCameraInstruction(true);
  const handleShowUploadInstruction = () => setShowUploadInstruction(true);

  const handleCameraInstructionComplete = () => {
    setShowCameraInstruction(false);
    uploadScreenRef.current?.triggerCamera();
  };

  const handleUploadInstructionComplete = () => {
    setShowUploadInstruction(false);
    uploadScreenRef.current?.triggerUpload();
  };


  const handleViewNews = (article: NewsArticle) => {
    setViewingNews(article);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {isLoading && <Loader />}
      
      {viewingResult ? (
        <ResultScreen onBack={handleCloseResult} result={viewingResult.result} image={viewingResult.image} />
      ) : (
        <>
          {currentScreen === AppScreen.SETTINGS && (
            <SettingsScreen onBack={() => setCurrentScreen(AppScreen.UPLOAD)} />
          )}
          {currentScreen === AppScreen.UPLOAD && (
            <UploadScreen
              ref={uploadScreenRef}
              onAnalyze={handleAnalyze}
              showToast={showToast}
              onGoToSettings={() => setCurrentScreen(AppScreen.SETTINGS)}
              onShowCameraInstruction={handleShowCameraInstruction}
              onShowUploadInstruction={handleShowUploadInstruction}
              onViewNews={handleViewNews}
            />
          )}
        </>
      )}
      
      {/* Overlays */}
      {viewingNews && <NewsModal article={viewingNews} onClose={() => setViewingNews(null)} />}
      
      {showCameraInstruction && (
          <InstructionScreen onComplete={handleCameraInstructionComplete} />
      )}
      {showUploadInstruction && (
          <InstructionScreen onComplete={handleUploadInstructionComplete} />
      )}

      {toast && (
        <div 
            key={toast.id}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-md p-4 rounded-xl shadow-2xl z-50 border flex items-start gap-3 transition-all duration-300 animate-fade-in-up
            ${toast.type === 'success' ? 'bg-green-600 border-green-700 text-white' : 'bg-red-600 border-red-700 text-white'}`}
        >
            {toast.type === 'success' ? <CheckCircleIcon className="h-6 w-6 flex-shrink-0" /> : <XCircleIcon className="h-6 w-6 flex-shrink-0" />}
            <div className="flex-grow">
                <p className="font-bold">{toast.type === 'success' ? t('toast_success_title') : t('error_analysis_failed')}</p>
                <p className="text-sm text-white/90">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-white/70 hover:text-white font-bold text-2xl leading-none flex-shrink-0">&times;</button>
        </div>
      )}
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translate(-50%, 20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};


const AppContent: React.FC = () => {
    const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
    const [hasOnboarded, setHasOnboarded] = useState(false);

    useEffect(() => {
        try {
            const onboarded = localStorage.getItem('frxai-has-onboarded') === 'true';
            setHasOnboarded(onboarded);
        } catch (e) {
            console.error("Failed to read onboarding status from localStorage", e);
            setHasOnboarded(false);
        } finally {
            setIsCheckingOnboarding(false);
        }
    }, []);

    const handleOnboardingComplete = () => {
        try {
            localStorage.setItem('frxai-has-onboarded', 'true');
            setHasOnboarded(true);
        } catch (e) {
            console.error("Failed to save onboarding status to localStorage", e);
            setHasOnboarded(true); // Proceed even if saving fails
        }
    };

    if (isCheckingOnboarding) {
        return <div className="min-h-screen bg-gray-50 dark:bg-slate-950" />;
    }

    if (!hasOnboarded) {
        return <WelcomeScreen onComplete={handleOnboardingComplete} />;
    }

    return <MainApp />;
}

const OnlineGate: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const isOnline = useOnlineStatus();
    if (!isOnline) {
        return <OfflineScreen />;
    }
    return <>{children}</>;
}


export const App: React.FC = () => (
  <SettingsProvider>
    <OnlineGate>
        <AppContent />
    </OnlineGate>
  </SettingsProvider>
);