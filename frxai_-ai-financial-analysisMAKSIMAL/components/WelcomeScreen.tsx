import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { CameraIcon } from './icons/CameraIcon';
import { ChartSquareIcon } from './icons/ChartSquareIcon';
import { BarChartIcon } from './icons/BarChartIcon';
import { LogoIcon } from './icons/LogoIcon';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const FeatureCard: React.FC<{
  Icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
}> = ({ Icon, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-900/50 rounded-xl">
      <Icon className="h-7 w-7 text-green-600 dark:text-green-400" />
    </div>
    <div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-slate-50">{title}</h3>
      <p className="text-gray-600 dark:text-slate-400">{description}</p>
    </div>
  </div>
);

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const { t } = useSettings();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-50 flex flex-col">
      <div className="flex-grow p-6 md:p-8 flex flex-col justify-center">
        <header className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <LogoIcon className="h-24 w-24" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-slate-50 mb-2">
            {t('welcome_title')}
          </h1>
          <p className="text-lg text-gray-500 dark:text-slate-400 max-w-lg mx-auto">
            {t('welcome_subtitle')}
          </p>
        </header>

        <main className="w-full max-w-md mx-auto space-y-8">
          <FeatureCard
            Icon={CameraIcon}
            title={t('welcome_feature1_title')}
            description={t('welcome_feature1_desc')}
          />
          <FeatureCard
            Icon={ChartSquareIcon}
            title={t('welcome_feature2_title')}
            description={t('welcome_feature2_desc')}
          />
          <FeatureCard
            Icon={BarChartIcon}
            title={t('welcome_feature3_title')}
            description={t('welcome_feature3_desc')}
          />
        </main>
      </div>

      <footer className="p-6 sticky bottom-0 bg-gray-50/80 dark:bg-slate-950/80 backdrop-blur-sm">
        <div className="w-full max-w-md mx-auto">
          <button
            onClick={onComplete}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/50 text-base"
          >
            {t('welcome_button')}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default WelcomeScreen;