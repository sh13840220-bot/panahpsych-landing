import React from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';

export function TestsSoonPage() {
  return (
    <>
      <main className="soon-container">
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <Reveal className="soon-card glass">
            <h1>به‌زودی</h1>
            <p>
              بخش آزمون‌های روانشناسی پناه در حال آماده‌سازی است. به زودی آزمون‌های تخصصی، سنجش و خودشناسی معتبر در این بخش در دسترس خواهند بود.
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
