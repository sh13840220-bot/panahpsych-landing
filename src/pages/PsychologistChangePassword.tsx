import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function PsychologistChangePassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('رمز عبور و تکرار آن یکسان نیستند.');
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('نشست شما منقضی شده. دوباره وارد شوید.');
        navigate('/ravanshenas/login', { replace: true });
        return;
      }

      // مرحله ۱: تغییر رمز در Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError('تغییر رمز عبور با خطا مواجه شد.');
        setLoading(false);
        return;
      }

      // مرحله ۲: خاموش کردن پرچم must_change_password
      const { error: dbError } = await supabase
        .from('psychologists')
        .update({ must_change_password: false })
        .eq('id', user.id);

      if (dbError) {
        setError('رمز عوض شد ولی بروزرسانی وضعیت با خطا مواجه شد.');
        setLoading(false);
        return;
      }

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
          تغییر رمز عبور
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          برای ادامه، لطفاً یک رمز عبور جدید تعیین کنید
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-700">
              رمز عبور جدید
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700">
              تکرار رمز عبور
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
            {loading ? 'در حال ذخیره...' : 'ذخیره و ادامه'}
          </button>
        </form>
      </div>
    </div>
  );
}
