
import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { CameraIcon } from './icons/CameraIcon';
import { UploadIcon } from './icons/UploadIcon';
import { useSettings } from '../contexts/SettingsContext';
import { LogoIcon } from './icons/LogoIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import NewsSection from './NewsSection';
import type { NewsArticle } from '../types';

export interface UploadScreenHandle {
  triggerCamera: () => void;
  triggerUpload: () => void;
}

interface UploadScreenProps {
  onAnalyze: (file: File) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
  onGoToSettings: () => void;
  onShowCameraInstruction: () => void;
  onShowUploadInstruction: () => void;
  onViewNews: (article: NewsArticle) => void;
}

const UploadScreen: React.ForwardRefRenderFunction<UploadScreenHandle, UploadScreenProps> = ({ onAnalyze, showToast, onGoToSettings, onShowCameraInstruction, onShowUploadInstruction, onViewNews }, ref) => {
  const { t } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showToast(t('upload_error_file_size'), 'error');
        return;
      }
      onAnalyze(file);
    }
  };
  
  useImperativeHandle(ref, () => ({
    triggerCamera() {
      if (fileInputRef.current) {
        fileInputRef.current.setAttribute('capture', 'environment');
        fileInputRef.current.click();
      }
    },
    triggerUpload() {
      if (fileInputRef.current) {
        fileInputRef.current.removeAttribute('capture');
        fileInputRef.current.click();
      }
    },
  }));

  return (
    <div className="p-4 flex flex-col items-center min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="w-full max-w-md mx-auto flex justify-between items-center mt-4 pt-2">
        <div className="flex items-center gap-3">
            <LogoIcon className="h-12 w-12" />
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-50">
                {t('upload_header_title')}
            </h1>
        </div>
         <button 
            onClick={onGoToSettings}
            className="p-2 rounded-full text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
            aria-label={t('settings_title')}
        >
            <SettingsIcon className="h-7 w-7" />
        </button>
      </div>

      <div className="w-full max-w-md mx-auto text-center mt-2">
        <p className="text-gray-500 dark:text-slate-400">
          {t('upload_main_subtitle')}
        </p>
      </div>


      <div className="w-full max-w-md mx-auto mt-8 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-center mb-5 text-gray-900 dark:text-slate-50">{t('upload_card_title')}</h2>
        <div className="flex flex-col gap-4">
           <button onClick={onShowCameraInstruction} className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/50">
                <CameraIcon className="h-6 w-6" />
                <span>{t('upload_take_photo')}</span>
            </button>
            <button onClick={onShowUploadInstruction} className="flex items-center justify-center gap-3 w-full bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 font-bold py-3 px-4 rounded-xl transition-all duration-300">
                <UploadIcon className="h-6 w-6" />
                <span>{t('upload_image')}</span>
            </button>
        </div>
         <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
        />
      </div>

      <div className="w-full max-w-md mx-auto mt-8 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-gray-200 dark:border-slate-800">
         <h3 className="text-xl font-bold text-left mb-2 text-gray-900 dark:text-slate-100">{t('upload_detect_banner_title')}</h3>
         <p className="text-gray-600 dark:text-slate-400 text-sm">{t('upload_detect_banner_body')}</p>
      </div>

      <NewsSection onViewNews={onViewNews} />

      <div className="h-20"></div>
    </div>
  );
};

export default forwardRef(UploadScreen);