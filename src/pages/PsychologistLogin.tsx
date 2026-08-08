import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// این پسوند فقط داخل Supabase استفاده می‌شه، هیچ ایمیلی هیچ‌وقت ارسال نمی‌شه.
// اگر خواستی می‌تونی این مقدار رو به هر چیز دیگه‌ای تغییر بدی،
// فقط باید همینو موقع ساخت حساب کاربری هم استفاده کنی.
const PSYCHOLOGIST_EMAIL_DOMAIN = 'ravanshenas.local';

function usernameToEmail(username: string) {
  const clean = username.trim().toLowerCase();
  return `${clean}@${PSYCHOLOGIST_EMAIL_DOMAIN}`;
}

export default function PsychologistLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('یوزرنیم و رمز عبور را وارد کنید.');
      return;
    }

    setLoading(true);

    try {
      const email = usernameToEmail(username);

      // مرحله ۱: ورود با Supabase Auth
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError || !signInData.user) {
        setError('یوزرنیم یا رمز عبور اشتباه است.');
        setLoading(false);
        return;
      }

      const userId = signInData.user.id;

      // مرحله ۲: بررسی اینکه این کاربر واقعاً توی جدول psychologists هست یا نه
      const { data: psychRow, error: psychError } = await supabase
        .from('psychologists')
        .select('id, status, must_change_password')
        .eq('id', userId)
        .maybeSingle();

      if (psychError || !psychRow) {
        // این حساب روانشناس نیست — اجازه ورود از این مسیر رو نداره
        await supabase.auth.signOut();
        setError('این حساب برای ورود روانشناسان مجاز نیست.');
        setLoading(false);
        return;
      }

      if (psychRow.status && psychRow.status !== 'active') {
        await supabase.auth.signOut();
        setError('حساب شما هنوز فعال نشده است. با پشتیبانی تماس بگیرید.');
        setLoading(false);
        return;
      }

      // مرحله ۳: اگر اولین ورود است، اجبار به تغییر رمز
      if (psychRow.must_change_password) {
        navigate('/ravanshenas/change-password', { replace: true });
        return;
      }

      // مرحله ۴: ورود موفق -> پنل روانشناس
      navigate('/ravanshenas/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
      setError('خطایی رخ داد. دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-xl font-bold text-center mb-1">
          ورود روانشناسان
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          ورود مخصوص روانشناسان همکار
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-700">
              یوزرنیم
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700">
              رمز عبور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-lg py-2 font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>
      </div>
    </div>
  );
}
