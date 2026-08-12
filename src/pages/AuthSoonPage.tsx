import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { User, Unlock, Briefcase, UserPlus } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { loginColleague } from '../lib/colleagueAuth';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';

type AuthMode = 'select' | 'login' | 'signup' | 'forgot' | 'colleague';

export function AuthSoonPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const redirectTarget = (location.state as { from?: string })?.from || searchParams.get('redirect') || '/';

  const initialModeParam = searchParams.get('mode');
  const [mode, setMode] = useState<AuthMode>(() => {
    if (initialModeParam === 'signup') return 'signup';
    if (initialModeParam === 'login') return 'login';
    if (initialModeParam === 'colleague') return 'colleague';
    if (initialModeParam === 'forgot') return 'forgot';
    return 'select';
  });

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
            {mode === 'select' ? (
              <div className="py-4 text-center max-w-sm mx-auto">
                <h1 className="text-xl sm:text-2xl font-bold mb-6 text-[var(--text-primary)]">
                  ورود / ثبت‌نام
                </h1>

                <div className="flex flex-col gap-3.5 w-full">
                  <button
                    type="button"
                    onClick={() => changeMode('signup')}
                    className="w-full py-3.5 px-6 rounded-full bg-[var(--color-primary)] text-white font-bold text-base hover:bg-[var(--color-primary-dark)] transition-all shadow-sm hover:shadow cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    <UserPlus className="w-5 h-5 shrink-0" />
                    <span>ثبت‌نام</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => changeMode('login')}
                    style={{ backgroundColor: '#a3b69a' }}
                    className="w-full py-3.5 px-6 rounded-full text-white font-bold text-base border border-transparent transition-all shadow-xs hover:shadow-sm cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    <Unlock className="w-5 h-5 shrink-0 text-white" />
                    <span>ورود</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => changeMode('colleague')}
                    style={{ backgroundColor: '#a3b69a' }}
                    className="w-full py-3.5 px-6 rounded-full text-white font-bold text-base border border-transparent transition-all shadow-xs hover:shadow-sm cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    <Briefcase className="w-5 h-5 shrink-0 text-white" />
                    <span>ورود همکاران</span>
                  </button>
                </div>
              </div>
            ) : null}

            {mode === 'login' && (
              <>
                <h1>ورود به حساب مراجعین</h1>

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
                </div>
              </>
            )}

            {mode === 'colleague' && (
              <>
                <h1>ورود همکاران و روانشناسان</h1>

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
              </>
            )}

            {mode === 'signup' && (
              <>
                <h1>ایجاد حساب</h1>

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
              </>
            )}

            {mode === 'forgot' && (
              <>
                <h1>بازیابی رمز عبور</h1>

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

            <div className="mt-6 pt-2 text-center flex justify-center">
              <Link
                to="/"
                className="btn-primary"
                style={{
                  width: '197px',
                  height: '33px',
                  padding: '0 16px',
                  fontSize: '14px',
                  marginTop: '15px',
                }}
              >
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
