import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SUPPORTED_LANGUAGES, LanguageConfig, getTranslation } from '@shared/translations';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  availableLanguages: LanguageConfig[];
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isLoading, setIsLoading] = useState(true);

  // Auto-detect language on mount
  useEffect(() => {
    const detectLanguage = async () => {
      try {
        // Check localStorage first
        const savedLanguage = localStorage.getItem('preferred-language');
        if (savedLanguage && SUPPORTED_LANGUAGES.find(l => l.code === savedLanguage)) {
          setCurrentLanguage(savedLanguage);
          setIsLoading(false);
          return;
        }

        // Try to get language from server based on IP
        const response = await fetch('/api/user/language-preference');
        if (response.ok) {
          const data = await response.json();
          if (data.language && SUPPORTED_LANGUAGES.find(l => l.code === data.language)) {
            setCurrentLanguage(data.language);
            localStorage.setItem('preferred-language', data.language);
            setIsLoading(false);
            return;
          }
        }

        // Fallback to browser language
        const browserLanguage = navigator.language.split('-')[0];
        const supportedLanguage = SUPPORTED_LANGUAGES.find(l => l.code === browserLanguage);
        if (supportedLanguage) {
          setCurrentLanguage(supportedLanguage.code);
          localStorage.setItem('preferred-language', supportedLanguage.code);
        }
      } catch (error) {
        console.error('Error detecting language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    detectLanguage();
  }, []);

  const setLanguage = (language: string) => {
    if (SUPPORTED_LANGUAGES.find(l => l.code === language)) {
      setCurrentLanguage(language);
      localStorage.setItem('preferred-language', language);
      
      // Optionally save to server
      fetch('/api/user/language-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language })
      }).catch(console.error);
    }
  };

  const t = (key: string) => getTranslation(key, currentLanguage);

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    availableLanguages: SUPPORTED_LANGUAGES,
    isLoading
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}