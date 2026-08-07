import React, { useState, useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

import panahLogo from '../assets/images/panah_logo_official_1786092935571.jpg';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = React.memo(function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
      <div className="mobile-menu-inner">
        <NavLink to="/collaboration" onClick={onClose}>
          همکاری
        </NavLink>
        <NavLink to="/clients-soon" onClick={onClose}>
          مراجعه‌کنندگان
        </NavLink>
        <NavLink to="/tests-soon" onClick={onClose}>
          آزمون‌های روانشناسی
        </NavLink>
        <NavLink to="/articles-soon" onClick={onClose}>
          مقالات
        </NavLink>
        <NavLink to="/auth-soon" className="mobile-auth-link" onClick={onClose}>
          ثبت نام / ورود
        </NavLink>
      </div>
    </div>
  );
});

export const Header = React.memo(function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      {/* Mobile Menu Backdrop */}
      <div
        className={`mobile-menu-backdrop ${isMenuOpen ? 'active' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <header className={isMenuOpen ? 'has-open-menu' : ''}>
        <nav className="header-inner">
          <Link to="/" className="logo" aria-label="پناه">
            <img
              src={panahLogo}
              alt="پناه"
              className="logo-brand-img"
              referrerPolicy="no-referrer"
            />
          </Link>

          <div className="nav-group">
            {/* Desktop Nav Links */}
            <div className="nav-links">
              <NavLink to="/clients-soon">مراجعه‌کنندگان</NavLink>
              <NavLink to="/tests-soon">آزمون‌های روانشناسی</NavLink>
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

            {/* Sign Up / Login Pill Button */}
            <NavLink
              to="/auth-soon"
              className="nav-auth-btn"
              onClick={closeMenu}
              title="ثبت نام / ورود"
              aria-label="ثبت نام / ورود"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="18"
                height="18"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>ثبت نام / ورود</span>
            </NavLink>

            {/* Hamburger Button (Mobile) */}
            <button
              className={`hamburger ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
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
        <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
      </header>
    </>
  );
});


