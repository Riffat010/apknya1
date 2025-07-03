


import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { WarningIcon } from './icons/WarningIcon';

interface InstructionScreenProps {
  onComplete: () => void;
}

const InstructionRule: React.FC<{ rule: string; }> = ({ rule }) => (
    <li className="flex items-start gap-3">
        <svg className="w-5 h-5 flex-shrink-0 text-green-500 mt-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-gray-600 dark:text-slate-300">{rule}</span>
    </li>
);

const InstructionScreen: React.FC<InstructionScreenProps> = ({ onComplete }) => {
  const { t } = useSettings();

  return (
    <div className="fixed inset-0 z-60 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-50 flex flex-col">
      <div className="flex-grow p-6 md:p-8 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto text-center">
            <header className="mb-10">
                <div className="flex justify-center mb-4">
                    <WarningIcon className="h-16 w-16 text-yellow-500 dark:text-yellow-400" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-slate-50">
                    {t('instruction_title')}
                </h1>
                <p className="text-gray-500 dark:text-slate-400 mt-2">
                    {t('instruction_subtitle')}
                </p>
            </header>

            <main className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 text-left">
                <ul className="space-y-4">
                    <InstructionRule rule={t('instruction_rule1')} />
                    <InstructionRule rule={t('instruction_rule2')} />
                    <InstructionRule rule={t('instruction_rule3')} />
                </ul>
            </main>
        </div>
      </div>
        
      <footer className="p-6 sticky bottom-0 bg-gray-50/80 dark:bg-slate-950/80 backdrop-blur-sm">
        <div className="w-full max-w-md mx-auto">
            <button
                onClick={onComplete}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/50 text-lg"
            >
                {t('instruction_button_start')}
            </button>
        </div>
      </footer>
    </div>
  );
};

export default InstructionScreen;