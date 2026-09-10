import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const isVi = lang === 'vi';

  return (
    <button
      type="button"
      className="lang-toggle"
      onClick={() => setLang(isVi ? 'en' : 'vi')}
      title={isVi ? 'Switch to English' : 'Chuyển sang tiếng Việt'}
      aria-label={isVi ? 'Switch to English' : 'Chuyển sang tiếng Việt'}
    >
      {isVi ? 'EN' : 'VI'}
    </button>
  );
}
