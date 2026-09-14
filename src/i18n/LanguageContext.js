import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from './translations';

const LANGUAGE_KEY = 'app_language';
const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: value => value,
});

export const translate = (value, language) => {
  if (typeof value !== 'string') return value;
  const leading = value.match(/^\s*/)?.[0] || '';
  const trailing = value.match(/\s*$/)?.[0] || '';
  const content = value.trim();
  const translationKey = Object.keys(translations.en).find(
    key => key === content || translations.en[key] === content,
  );
  return `${leading}${translationKey ? translations[language]?.[translationKey] || content : content}${trailing}`;
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then(saved => {
      if (saved === 'en' || saved === 'hi') setLanguageState(saved);
    });
  }, []);

  const setLanguage = useCallback(nextLanguage => {
    const next = nextLanguage === 'hi' ? 'hi' : 'en';
    setLanguageState(next);
    AsyncStorage.setItem(LANGUAGE_KEY, next);
  }, []);

  const t = useCallback(value => translate(value, language), [language]);
  const contextValue = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
