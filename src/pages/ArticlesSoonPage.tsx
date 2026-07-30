import React from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';

export function ArticlesSoonPage() {
  return (
    <>
      <main className="soon-container">
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <Reveal className="soon-card glass">
            <h1>به‌زودی</h1>
            <p>
              بخش مقالات پناه در حال آماده‌سازی است. به زودی محتوای علمی و معتبر در حوزه سلامت روان اینجا منتشر می‌شود.
            </p>
            <Link to="/" className="btn-primary">
              بازگشت به صفحه اصلی
            </Link>
          </Reveal>
        </div>
      </main>
      <Footer showCollabNote={true} isShort={true} />
    </>
  );
}
