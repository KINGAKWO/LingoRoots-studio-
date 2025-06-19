'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  selectedLanguageId: string | null;
  setSelectedLanguageId: (id: string | null) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('english'); // Default general language
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | null>(null); // For LingoRoots specific language

  // Load selectedLanguageId from localStorage after component mounts
  useEffect(() => {
    const storedLanguageId = localStorage.getItem('selectedLanguageId');
    if (storedLanguageId) {
      setSelectedLanguageId(storedLanguageId);
    }
  }, []);

  // Update localStorage when selectedLanguageId changes
  useEffect(() => {
    if (selectedLanguageId !== null) {
      localStorage.setItem('selectedLanguageId', selectedLanguageId);
    } else {
      // Optionally clear or set to a default if null means "no language selected"
      localStorage.removeItem('selectedLanguageId');
    }
  }, [selectedLanguageId]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, selectedLanguageId, setSelectedLanguageId }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  // Ensure all expected values are returned, especially selectedLanguageId
  return context; 
};
