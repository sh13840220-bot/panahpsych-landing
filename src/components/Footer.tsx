import React from 'react';

interface FooterProps {
  showCollabNote?: boolean;
  isShort?: boolean;
}

export function Footer({ showCollabNote = false, isShort = false }: FooterProps) {
  return (
    <>
      {showCollabNote && (
        <div className="collab-note">
          <a
            href="https://instagram.com/panah.psych"
            target="_blank"
            rel="noopener noreferrer"
          >
            اگر شرایط همکاری دارید، با ما در ارتباط باشید
          </a>
        </div>
      )}
      <footer className={isShort ? 'footer-short' : ''}>
        <div className="container footer-inner">
          <span className="footer-text">پناه © ۱۴۰۴</span>
          <a
            href="https://instagram.com/panah.psych"
            className="footer-social"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="5"></rect>
              <circle cx="12" cy="12" r="4"></circle>
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"></circle>
            </svg>
            دنبال کردن در اینستاگرام
          </a>
        </div>
      </footer>
    </>
  );
}
