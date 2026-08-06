import React from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';

export function AuthSoonPage() {
  return (
    <>
      <main className="soon-container">
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <Reveal className="soon-card glass">
            <h1>به‌زودی</h1>
            <p>
              بخش ثبت‌نام و ورود کاربران پناه در حال آماده‌سازی است. به‌زودی می‌توانید حساب کاربری خود را ایجاد کرده و نوبت‌های خود را مدیریت نمایید.
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
