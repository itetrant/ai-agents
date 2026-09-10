import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext({ lang: 'vi', setLang: () => {} });

function getInitialLang() {
  try {
    const saved = window.localStorage.getItem('lang');
    if (saved === 'vi' || saved === 'en') return saved;
  } catch (e) {
    // localStorage khong kha dung - bo qua
  }
  return 'vi';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    try {
      window.localStorage.setItem('lang', lang);
    } catch (e) {
      // bo qua neu khong luu duoc
    }
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
