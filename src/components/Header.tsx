import React, { useState, useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

import panahLogoLight from '../assets/images/panah_logo_light.webp';
import panahLogoDark from '../assets/images/panah_logo_dark.webp';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TESTS_LIST = [
  {
    slug: 'dass-21',
    title: 'ارزیابی افسردگی، اضطراب و استرس (DASS-21)',
    desc: 'سنجش سریع سه بعد هیجانی اصلی',
    icon: '📊',
    path: '/assessments/dass-21',
  },
  {
    slug: 'gad-7',
    title: 'غربالگری اضطراب فراگیر (GAD-7)',
    desc: 'ارزیابی میزان نگرانی و اضطراب',
    icon: '🌿',
    path: '/assessments/gad-7',
  },
  {
    slug: 'bdi-ii',
    title: 'ارزیابی افسردگی بک (BDI-II)',
    desc: 'سنجش شدت نشانه شناسی افسردگی',
    icon: '🌧️',
    path: '/assessments/bdi-ii',
  },
  {
    slug: 'rosenberg',
    title: 'مقیاس عزت نفس روزنبرگ (RSES)',
    desc: 'ارزیابی حس ارزشمندی و عزت نفس',
    icon: '💎',
    path: '/assessments/rosenberg',
  },
  {
    slug: 'mbti',
    title: 'شخصیت‌شناسی مایرز-بریگز (MBTI)',
    desc: 'شناخت ترجیحات شخصیتی ۱۶ گانه',
    icon: '🧩',
    path: '/assessments/mbti',
  },
  {
    slug: 'neo-ffi',
    title: 'پنج عامل بزرگ شخصیت (NEO-FFI)',
    desc: 'تحلیل ابعاد ۵‌گانه روان‌رنجورخویی، برون‌گرایی و...',
    icon: '🌌',
    path: '/assessments/neo-ffi',
  },
];

export const MobileMenu = React.memo(function MobileMenu({
  isOpen,
  onClose,
}: MobileMenuProps) {
  const { user } = useAuth();

  return (
    <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
      <div className="mobile-menu-inner">
        <NavLink to="/collaboration" onClick={onClose}>
          همکاری
        </NavLink>

        <NavLink to="/clients-soon" onClick={onClose}>
          مراجعه‌کنندگان
        </NavLink>

        <NavLink to="/assessments" onClick={onClose}>
          آزمون‌های روانشناسی
        </NavLink>

        <NavLink to="/articles-soon" onClick={onClose}>
          مقالات
        </NavLink>

        <NavLink
          to={user ? '/dashboard' : '/auth-soon'}
          className="mobile-auth-link"
          onClick={onClose}
        >
          {user ? 'پنل کاربری' : 'ثبت نام / ورود'}
        </NavLink>
      </div>
    </div>
  );
});

export const Header = React.memo(function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTestsDropdownOpen, setIsTestsDropdownOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setIsTestsDropdownOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const currentLogo = theme === 'dark' ? panahLogoDark : panahLogoLight;

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
              src={currentLogo}
              alt="پناه"
              className="logo-brand-img"
              referrerPolicy="no-referrer"
            />
          </Link>

          <div className="nav-group">
            {/* Desktop Nav Links */}
            <div className="nav-links">
              <NavLink to="/clients-soon">مراجعه‌کنندگان</NavLink>

              <div
                className="nav-dropdown-wrapper"
                onMouseEnter={() => setIsTestsDropdownOpen(true)}
                onMouseLeave={() => setIsTestsDropdownOpen(false)}
              >
                <NavLink
                  to="/assessments"
                  className={({ isActive }) =>
                    `nav-dropdown-trigger ${isActive ? 'active' : ''}`
                  }
                >
                  <span>آزمون‌های روانشناسی</span>

                  <svg
                    className={`chevron-icon ${
                      isTestsDropdownOpen ? 'open' : ''
                    }`}
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </NavLink>

                {isTestsDropdownOpen && (
                  <div className="nav-dropdown-menu">
                    <div className="nav-dropdown-header">
                      <span className="dropdown-title">
                        لیست آزمون‌های روان‌شناختی
                      </span>

                      <Link
                        to="/assessments"
                        className="all-tests-link"
                        onClick={() => setIsTestsDropdownOpen(false)}
                      >
                        مشاهده همه ←
                      </Link>
                    </div>

                    <div className="nav-dropdown-list">
                      {TESTS_LIST.map((test) => (
                        <Link
                          key={test.slug}
                          to={test.path}
                          className="dropdown-item"
                          onClick={() => setIsTestsDropdownOpen(false)}
                        >
                          <span className="item-icon">{test.icon}</span>

                          <div className="item-text">
                            <span className="item-title">
                              {test.title}
                            </span>

                            <span className="item-desc">
                              {test.desc}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

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
              to={user ? '/dashboard' : '/auth-soon'}
              className="nav-auth-btn"
              onClick={closeMenu}
              title={user ? 'پنل کاربری' : 'ثبت نام / ورود'}
              aria-label={user ? 'پنل کاربری' : 'ثبت نام / ورود'}
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

              <span>
                {user ? 'پنل کاربری' : 'ثبت نام / ورود'}
              </span>
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