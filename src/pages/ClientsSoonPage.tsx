import React from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';

export function ClientsSoonPage() {
  return (
    <>
      <main className="soon-container">
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <Reveal className="soon-card glass">
            <h1>به‌زودی</h1>
            <p>
              بخش مراجعه‌کنندگان پناه در حال آماده‌سازی است. به زودی می‌توانید از اینجا مسیر خود را برای پیدا کردن روانشناس مناسب آغاز کنید.
            </p>
            <Link to="/" className="btn-primary">
              بازگشت به صفحه اصلی
            </Link>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
