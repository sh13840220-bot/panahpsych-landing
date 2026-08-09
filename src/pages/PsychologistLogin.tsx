import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginColleague } from '../lib/colleagueAuth';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';

export default function PsychologistLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!username.trim() || !password) {
      setError('لطفاً نام کاربری و رمز عبور را وارد نمایید.');
      return;
    }

    setLoading(true);

    try {
      loginColleague(username, password);
      setMessage('ورود با موفقیت انجام شد. در حال انتقال به app.panahpsych.ir...');
      setTimeout(() => {
        window.location.href = 'https://app.panahpsych.ir';
      }, 700);
    } catch (err: any) {
      setError('خطا در احراز هویت همکار.');
      setLoading(false);
    }
  };

  return (
    <>
      <main className="soon-container">
        <div
          className="container flex justify-center items-center w-full"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Reveal className="soon-card glass" style={{ maxWidth: '580px', width: '100%', margin: '0 auto' }}>
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-[var(--color-primary-dark)] bg-[var(--color-primary)]/15 px-3.5 py-1.5 rounded-full inline-block mb-3">
                پنل تخصصی همکاران روانشناس
              </span>
              <h1 className="text-2xl font-bold mb-2">ورود همکاران</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                ورود روانشناسان و مشاوران همکار پناه جهت هدایت به سامانه اختصاصی
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <input
                type="text"
                className="auth-input"
                placeholder="یوزرنیم (نام کاربری همکار)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />

              <input
                type="password"
                className="auth-input"
                placeholder="رمز عبور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              {error && <div className="auth-msg-error">{error}</div>}
              {message && <div className="auth-msg-success">{message}</div>}

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', marginTop: '8px' }}
              >
                {loading ? 'در حال ورود...' : 'ورود و انتقال به app.panahpsych.ir'}
              </button>
            </form>

            <div className="bg-white/60 dark:bg-white/10 p-3.5 rounded-2xl border border-gray-200/50 dark:border-white/10 my-5 text-center">
              <p className="text-xs text-[var(--text-secondary)] mb-2 font-medium">
                ورود سریع با حساب نمونه:
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                <button
                  type="button"
                  className="text-xs text-teal-900 dark:text-teal-200 bg-teal-50 dark:bg-teal-900/40 hover:bg-teal-100 px-3 py-1.5 rounded-full border border-teal-200 dark:border-teal-700 transition-all font-medium"
                  onClick={() => {
                    setUsername('dr_tehrani');
                    setPassword('123456');
                  }}
                >
                  دکتر مریم تهرانی
                </button>
                <button
                  type="button"
                  className="text-xs text-slate-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 transition-all font-medium"
                  onClick={() => {
                    setUsername('dr_alavi');
                    setPassword('123456');
                  }}
                >
                  دکتر علی علوی
                </button>
              </div>
            </div>

            <div className="text-center mt-4">
              <Link to="/" className="btn-primary inline-block">
                بازگشت به صفحه اصلی
              </Link>
            </div>
          </Reveal>
        </div>
      </main>

      <Footer />
    </>
  );
}
