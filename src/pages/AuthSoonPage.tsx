import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { loginColleague } from '../lib/colleagueAuth';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';

type AuthMode = 'login' | 'signup' | 'forgot' | 'colleague';

export function AuthSoonPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const redirectTarget = (location.state as { from?: string })?.from || searchParams.get('redirect') || '/';

  const [mode, setMode] = useState<AuthMode>('login');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [colleagueUsername, setColleagueUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // If user is already logged in as general user, redirect them
  useEffect(() => {
    if (user && !message && mode !== 'colleague') {
      navigate(redirectTarget, { replace: true });
    }
  }, [user]);

  const resetMessages = () => {
    setMessage('');
    setError('');
  };

  const checkConfig = () => {
    if (!isSupabaseConfigured) {
      setError('متغیرهای محیطی Supabase تنظیم نشده‌اند.');
      return false;
    }
    return true;
  };

  const handleColleagueLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!colleagueUsername.trim() || !password) {
      setError('لطفاً یوزرنیم و رمز عبور را وارد کنید.');
      return;
    }

    setLoading(true);

    try {
      loginColleague(colleagueUsername, password);
      setMessage('ورود با موفقیت انجام شد. در حال انتقال به سامانه همکاران...');
      setTimeout(() => {
        window.location.href = 'https://app.panahpsych.ir';
      }, 700);
    } catch (err: any) {
      setError('خطا در ورود به حساب همکار.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!checkConfig()) return;

    if (!fullName.trim()) {
      setError('لطفاً نام و نام خانوادگی خود را وارد کنید.');
      return;
    }

    if (password.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد.');
      return;
    }

    if (password !== confirmPassword) {
      setError('رمز عبور و تکرار آن یکسان نیستند.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data?.session) {
        setMessage('حساب شما با موفقیت ساخته شد و وارد شدید. در حال انتقال...');
        setTimeout(() => {
          navigate(redirectTarget, { replace: true });
        }, 800);
      } else {
        setMessage(
          'حساب شما ساخته شد. لطفاً ایمیل خود را بررسی کنید و لینک تأیید حساب را بزنید.'
        );
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setError(err?.message || 'خطا در ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!checkConfig()) return;

    if (!email.trim() || !password) {
      setError('ایمیل و رمز عبور را وارد کنید.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setError('ایمیل یا رمز عبور صحیح نیست.');
        return;
      }

      setMessage('ورود با موفقیت انجام شد. در حال انتقال...');
      setTimeout(() => {
        navigate(redirectTarget, { replace: true });
      }, 700);
    } catch (err: any) {
      setError(err?.message || 'خطا در ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!checkConfig()) return;

    if (!email.trim()) {
      setError('ایمیل خود را وارد کنید.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth-soon`,
        }
      );

      if (error) {
        setError(error.message);
        return;
      }

      setMessage(
        'اگر این ایمیل در پناه ثبت شده باشد، لینک بازیابی رمز عبور برای آن ارسال می‌شود.'
      );
    } catch (err: any) {
      setError(err?.message || 'خطا در ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

  const changeMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetMessages();
    setPassword('');
    setConfirmPassword('');
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
          <Reveal className="soon-card glass" style={{ maxWidth: '680px', width: '100%', margin: '0 auto' }}>
            {/* Top Auth Mode Tabs */}
            <div className="flex bg-white/50 p-1 rounded-full border border-gray-200/50 mb-6 max-w-sm mx-auto shadow-xs">
              <button
                type="button"
                onClick={() => changeMode('login')}
                className={`flex-1 py-2 px-3 text-xs md:text-sm font-semibold rounded-full transition-all ${
                  mode === 'login' || mode === 'signup' || mode === 'forgot'
                    ? 'bg-[var(--color-primary)] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                ورود مراجعین
              </button>
              <button
                type="button"
                onClick={() => changeMode('colleague')}
                className={`flex-1 py-2 px-3 text-xs md:text-sm font-semibold rounded-full transition-all ${
                  mode === 'colleague'
                    ? 'bg-[var(--color-primary)] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                ورود همکاران
              </button>
            </div>

            {mode === 'login' && (
              <>
                <h1>ورود به حساب مراجعین</h1>

                <p>
                  برای ورود به حساب کاربری پناه، اطلاعات خود را وارد کنید.
                </p>

                <form onSubmit={handleLogin} className="auth-form">
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="ایمیل"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
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

                  {error && (
                    <div className="auth-msg-error">{error}</div>
                  )}

                  {message && (
                    <div className="auth-msg-success">{message}</div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    {loading ? 'در حال ورود...' : 'ورود'}
                  </button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', marginBottom: '24px' }}>
                  <button
                    type="button"
                    className="auth-text-btn"
                    onClick={() => changeMode('forgot')}
                  >
                    رمز عبورم را فراموش کرده‌ام
                  </button>

                  <p style={{ margin: 0, fontSize: '14px' }}>
                    حساب کاربری ندارید؟{' '}
                    <button
                      type="button"
                      className="auth-text-btn"
                      onClick={() => changeMode('signup')}
                    >
                      ثبت‌نام کنید
                    </button>
                  </p>
                </div>
              </>
            )}

            {mode === 'colleague' && (
              <>
                <h1>ورود همکاران و روانشناسان</h1>

                <p>
                  ورود به پنل کاربری ویژه مشاوران و روانشناسان همکار پناه با یوزرنیم و رمز عبور.
                </p>

                <form onSubmit={handleColleagueLogin} className="auth-form">
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="یوزرنیم (نام کاربری همکار)"
                    value={colleagueUsername}
                    onChange={(e) => setColleagueUsername(e.target.value)}
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

                  {error && (
                    <div className="auth-msg-error">{error}</div>
                  )}

                  {message && (
                    <div className="auth-msg-success">{message}</div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    {loading ? 'در حال بررسی...' : 'ورود و انتقال به سامانه همکاران'}
                  </button>
                </form>

                <div className="bg-white/60 dark:bg-white/10 p-3.5 rounded-2xl border border-gray-200/50 dark:border-white/10 my-4 text-center">
                  <p className="text-xs text-[var(--text-secondary)] mb-2 font-medium">
                    ورود سریع با حساب نمونه:
                  </p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    <button
                      type="button"
                      className="text-xs text-teal-900 dark:text-teal-200 bg-teal-50 dark:bg-teal-900/40 hover:bg-teal-100 px-3 py-1.5 rounded-full border border-teal-200 dark:border-teal-700 transition-all font-medium"
                      onClick={() => {
                        setColleagueUsername('dr_tehrani');
                        setPassword('123456');
                      }}
                    >
                      دکتر مریم تهرانی
                    </button>
                    <button
                      type="button"
                      className="text-xs text-slate-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 transition-all font-medium"
                      onClick={() => {
                        setColleagueUsername('dr_alavi');
                        setPassword('123456');
                      }}
                    >
                      دکتر علی علوی
                    </button>
                  </div>
                </div>
              </>
            )}

            {mode === 'signup' && (
              <>
                <h1>ایجاد حساب</h1>

                <p>
                  برای ساخت حساب کاربری در پناه، اطلاعات زیر را وارد کنید.
                </p>

                <form onSubmit={handleSignUp} className="auth-form">
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="نام و نام خانوادگی"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                    required
                  />

                  <input
                    type="email"
                    className="auth-input"
                    placeholder="ایمیل"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />

                  <input
                    type="password"
                    className="auth-input"
                    placeholder="رمز عبور (حداقل ۸ کاراکتر)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />

                  <input
                    type="password"
                    className="auth-input"
                    placeholder="تکرار رمز عبور"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    autoComplete="new-password"
                    required
                  />

                  {error && (
                    <div className="auth-msg-error">{error}</div>
                  )}

                  {message && (
                    <div className="auth-msg-success">{message}</div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    {loading ? 'در حال ساخت حساب...' : 'ثبت‌نام'}
                  </button>
                </form>

                <div style={{ marginBottom: '24px' }}>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    قبلاً حساب ساخته‌اید؟{' '}
                    <button
                      type="button"
                      className="auth-text-btn"
                      onClick={() => changeMode('login')}
                    >
                      وارد شوید
                    </button>
                  </p>
                </div>
              </>
            )}

            {mode === 'forgot' && (
              <>
                <h1>بازیابی رمز عبور</h1>

                <p>
                  ایمیل حساب خود را وارد کنید تا لینک بازیابی رمز برایتان
                  ارسال شود.
                </p>

                <form onSubmit={handleForgotPassword} className="auth-form">
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="ایمیل"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />

                  {error && (
                    <div className="auth-msg-error">{error}</div>
                  )}

                  {message && (
                    <div className="auth-msg-success">{message}</div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    {loading
                      ? 'در حال ارسال...'
                      : 'ارسال لینک بازیابی'}
                  </button>
                </form>

                <div style={{ marginBottom: '24px' }}>
                  <button
                    type="button"
                    className="auth-text-btn"
                    onClick={() => changeMode('login')}
                  >
                    بازگشت به ورود
                  </button>
                </div>
              </>
            )}

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
