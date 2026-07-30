import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header>
      <nav className="container header-inner">
        <Link to="/" className="logo">
          پناه
        </Link>

        <div className="nav-group">
          {/* Desktop Nav Links */}
          <div className="nav-links">
            <a
              href="https://app.panahpsych.ir"
              target="_blank"
              rel="noopener noreferrer"
            >
              همکاری
            </a>
            <NavLink to="/clients-soon">مراجعه‌کنندگان</NavLink>
            <NavLink to="/articles-soon">مقالات</NavLink>
          </div>

          {/* Theme Toggle Button */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            type="button"
            aria-label="تغییر حالت روشن و تاریک"
            aria-pressed={theme === 'dark'}
          >
            {theme === 'dark' ? (
              <svg
                className="icon-sun"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>
              </svg>
            ) : (
              <svg
                className="icon-moon"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"></path>
              </svg>
            )}
          </button>

          {/* Hamburger Button (Mobile) */}
          <button
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            type="button"
            aria-label="باز کردن منو"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-inner">
          <a
            href="https://app.panahpsych.ir"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            همکاری
          </a>
          <NavLink to="/clients-soon" onClick={closeMenu}>
            مراجعه‌کنندگان
          </NavLink>
          <NavLink to="/articles-soon" onClick={closeMenu}>
            مقالات
          </NavLink>
        </div>
      </div>
    </header>
  );
}

