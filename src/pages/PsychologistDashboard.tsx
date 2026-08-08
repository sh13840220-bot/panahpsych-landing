import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function PsychologistDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/ravanshenas/login', { replace: true });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">پنل روانشناس</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          خروج
        </button>
      </div>

      <p className="text-gray-600">
        خوش آمدید. این صفحه فعلاً یک نمونه‌ی اولیه است — می‌توانیم بعداً
        محتوای واقعی پنل (بیماران، جلسات و...) را اینجا اضافه کنیم.
      </p>
    </div>
  );
}
