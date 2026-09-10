import React from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const links = [
  { to: '/', label: 'Tổng quan', end: true },
  { to: '/bat-dau', label: 'Bắt đầu' },
  { to: '/huong-dan-web', label: 'Hướng dẫn Web' },
  { to: '/huong-dan-app', label: 'Hướng dẫn App/Backend' },
  { to: '/api-standard', label: 'API Standard' },
  { to: '/quy-uoc', label: 'Quy ước & Code style' },
];

export default function Layout({ children }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">MM</span>
          <div>
            <div className="brand-title">developers.mmvietnam.com</div>
            <div className="brand-sub">Cổng dev nội bộ</div>
          </div>
          <ThemeToggle />
        </div>
        <nav>
          {links.map((link) => (
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
