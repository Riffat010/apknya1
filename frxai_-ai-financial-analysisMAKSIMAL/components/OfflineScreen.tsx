import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { WifiOffIcon } from './icons/WifiOffIcon';

const OfflineScreen: React.FC = () => {
  const { t } = useSettings();

  const handleRetry = () => {
    // A simple page reload is the most straightforward way to re-check everything.
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center text-center p-4 z-[100]">
        <div className="flex flex-col items-center">
            <WifiOffIcon className="w-24 h-24 text-red-500 dark:text-red-400 mb-6" />
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-slate-100 mb-2">
                {t('offline_title')}
            </h1>
            <p className="max-w-md text-gray-600 dark:text-slate-400 mb-8">
                {t('offline_subtitle')}
            </p>
            <button
                onClick={handleRetry}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/50"
            >
                {t('offline_retry_button')}
            </button>
        </div>
    </div>
  );
};

export default OfflineScreen;