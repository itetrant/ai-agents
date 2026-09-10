import React from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../i18n/LanguageContext';

const links = {
  vi: [
    { to: '/', label: 'Tổng quan', end: true },
    { to: '/bat-dau', label: 'Bắt đầu' },
    { to: '/huong-dan-web', label: 'Hướng dẫn Web' },
    { to: '/huong-dan-app', label: 'Hướng dẫn App/Backend' },
    { to: '/api-standard', label: 'API Standard' },
    { to: '/quy-uoc', label: 'Quy ước & Code style' },
  ],
  en: [
    { to: '/', label: 'Overview', end: true },
    { to: '/bat-dau', label: 'Getting Started' },
    { to: '/huong-dan-web', label: 'Web Guide' },
    { to: '/huong-dan-app', label: 'App/Backend Guide' },
    { to: '/api-standard', label: 'API Standard' },
    { to: '/quy-uoc', label: 'Conventions & Code Style' },
  ],
};

export default function Layout({ children }) {
  const { lang } = useLanguage();
  const brandSub = lang === 'en' ? 'Internal dev portal' : 'Cổng dev nội bộ';

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">MM</span>
          <div>
            <div className="brand-title">developers.mmvietnam.com</div>
            <div className="brand-sub">{brandSub}</div>
          </div>
        </div>
        <div className="toolbar">
          <ThemeToggle />
          <LanguageToggle />
        </div>
        <nav>
          {links[lang].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          Stack: Node.js + React (CommonJS) &middot; v1
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
