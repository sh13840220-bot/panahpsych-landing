import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';

type AuthMode = 'login' | 'signup' | 'forgot';

export function AuthSoonPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const redirectTarget = (location.state as { from?: string })?.from || searchParams.get('redirect') || '/';

  const [mode, setMode] = useState<AuthMode>('login');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // If user is already logged in, redirect them
  useEffect(() => {
    if (user && !message) {
      navigate(redirectTarget, { replace: true });
    }
  }, [user]);

  const resetMessages = () => {
    setMessage('');
    setError('');
  };

  const checkConfig = () => {
    if (!isSupabaseConfigured) {
      setError('متغیرهای محیطی Supabase (VITE_SUPABASE_URL و VITE_SUPABASE_PUBLISHABLE_KEY) تنظیم نشده‌اند.');
      return false;
    }
    return true;
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
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Reveal className="soon-card glass">
            {mode === 'login' && (
              <>
                <h1>ورود به حساب</h1>

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