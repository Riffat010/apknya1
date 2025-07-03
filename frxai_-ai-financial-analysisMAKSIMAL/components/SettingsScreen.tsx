
import React from 'react';
import Header from './Header';
import { useSettings } from '../contexts/SettingsContext';
import { Language, Theme } from '../types';

interface SettingsScreenProps {
    onBack: () => void;
}

interface SettingRowProps {
    label: string;
    children: React.ReactNode;
}

const SettingRow: React.FC<SettingRowProps> = ({ label, children }) => (
    <div className="flex items-center justify-between py-4">
        <p className="text-gray-800 dark:text-slate-200">{label}</p>
        <div>{children}</div>
    </div>
);

const SegmentedControl: React.FC<{ options: {label: string, value: string}[], value: string, onChange: (value: any) => void }> = ({ options, value, onChange }) => {
    return (
        <div className="flex items-center bg-gray-200 dark:bg-slate-800 rounded-lg p-1">
            {options.map(option => (
                <button 
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${value === option.value ? 'bg-white dark:bg-slate-700 text-green-600 dark:text-green-400 shadow-sm' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-300/50 dark:hover:bg-slate-700/50'}`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};


const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { theme, setTheme, language, setLanguage, t } = useSettings();

  const themeOptions = [
    { label: t('settings_theme_light'), value: 'light' },
    { label: t('settings_theme_dark'), value: 'dark' },
    { label: t('settings_theme_system'), value: 'system' },
  ];

  const languageOptions = [
      { label: 'EN', value: 'en' },
      { label: 'ID', value: 'id' },
  ];

  return (
    <div className="p-4 bg-gray-100 dark:bg-slate-950 min-h-screen">
        <Header title={t('settings_title')} onBack={onBack} />
        <div className="mt-4 flex flex-col gap-4 max-w-md mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 px-4 divide-y divide-gray-200 dark:divide-slate-800">
                <SettingRow label={t('settings_language')}>
                    <SegmentedControl options={languageOptions} value={language} onChange={(val) => setLanguage(val as Language)} />
                </SettingRow>
                <SettingRow label={t('settings_theme')}>
                    <SegmentedControl options={themeOptions} value={theme} onChange={(val) => setTheme(val as Theme)} />
                </SettingRow>
            </div>

             <div className="text-center text-gray-500 dark:text-slate-500 text-sm mt-8">
                <p>FrxAI Version 1.2.0</p>
            </div>
        </div>
    </div>
  );
};

export default SettingsScreen;