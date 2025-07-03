
import React from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
  return (
    <header className="p-4 flex items-center justify-center relative w-full max-w-md mx-auto">
      {onBack && (
        <button onClick={onBack} className="absolute left-4 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
      )}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50">{title}</h1>
    </header>
  );
};

export default Header;
