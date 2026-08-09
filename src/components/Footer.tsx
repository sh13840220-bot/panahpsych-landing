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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '420px' }}>
            <span className="footer-text" style={{ fontWeight: 800, fontSize: '16px' }}>پناه © ۱۴۰۴</span>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: '1.7', opacity: 0.9 }}>
              <span>تمامی حقوق مادی و معنوی این وب‌سایت متعلق به پناه است.</span>
              <br />
              <span>کپی یا بازنشر بخش یا کل مطالب تنها با کسب مجوز مکتوب امکان‌پذیر است.</span>
            </p>
          </div>
          <div className="footer-social-group">
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
            <a
              href="https://facebook.com/panahpsych"
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
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              دنبال کردن در فیس‌بوک
            </a>
            <a
              href="https://www.threads.com/@panah.psych"
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
                <path d="M12 15.5c-1.75 0-3.15-1.4-3.15-3.15s1.4-3.15 3.15-3.15 3.15 1.4 3.15 3.15v1.15c0 1.05.85 1.9 1.9 1.9s1.9-.85 1.9-1.9V12c0-3.85-3.1-6.95-6.95-6.95S5.05 8.15 5.05 12s3.1 6.95 6.95 6.95c1.85 0 3.5-.75 4.75-1.95" />
              </svg>
              دنبال کردن در تردز
            </a>
            <div className="footer-social footer-social-disabled">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none"></polygon>
              </svg>
              <span>یوتیوب به زودی ...</span>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            margin: '16px 0',
          }}
        >
          <a
            referrerPolicy="origin"
            target="_blank"
            href="https://trustseal.enamad.ir/?id=770273&Code=1PHIsuWZnE85xB0P3zWWHGs8VEmTCh3x"
          >
            <img
              referrerPolicy="origin"
              src="https://trustseal.enamad.ir/logo.aspx?id=770273&Code=1PHIsuWZnE85xB0P3zWWHGs8VEmTCh3x"
              alt=""
              style={{ cursor: 'pointer' }}
            />
          </a>
        </div>
      </footer>
    </>
  );
}