import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type Status = 'checking' | 'allowed' | 'denied';

export default function PsychologistProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<Status>('checking');

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (mounted) setStatus('denied');
        return;
      }

      const { data, error } = await supabase
        .from('psychologists')
        .select('id, status')
        .eq('id', user.id)
        .maybeSingle();

      if (!mounted) return;

      if (error || !data || (data.status && data.status !== 'active')) {
        setStatus('denied');
        return;
      }

      setStatus('allowed');
    };

    check();

    return () => {
      mounted = false;
    };
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        در حال بررسی...
      </div>
    );
  }

  if (status === 'denied') {
    return <Navigate to="/ravanshenas/login" replace />;
  }

  return <>{children}</>;
}
