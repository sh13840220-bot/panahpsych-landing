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
       <div style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '20px 0' }}>
  
    referrerPolicy="origin"
    target="_blank"
    href="https://trustseal.enamad.ir/?id=770273&Code=1PHIsuWZnE85xB0P3zWWHGs8VEmTCh3x"
  >
    <img
      referrerPolicy="origin"
      src="https://trustseal.enamad.ir/logo.aspx?id=770273&Code=1PHIsuWZnE85xB0P3zWWHGs8VEmTCh3x"
      alt=""
      style={{ cursor: 'pointer' }}
      code="1PHIsuWZnE85xB0P3zWWHGs8VEmTCh3x"
    />
  </a>
</div>
      </footer>
    </>
  );
}
