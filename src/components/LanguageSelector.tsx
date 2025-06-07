'use client';

import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageContext';

const LanguageSelector: React.FC = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('LanguageSelector must be used within a LanguageProvider');
  }

  const { language, setLanguage } = context;

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  return (
    <div>
      <label htmlFor="language-select" className="sr-only">
        Select language
      </label>
      <select
        id="language-select"
        value={language}
        onChange={handleLanguageChange}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="english">English</option>
        <option value="spanish">Spanish</option>
        <option value="french">French</option>
      </select>
    </div>
  );
};

export default LanguageSelector;