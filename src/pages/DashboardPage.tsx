import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';

type Profile = {
  full_name: string | null;
  email: string | null;
};

type AssessmentResult = {
  id: string;
  test_type: string;
  result: string;
  completed_at: string;
};

export function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [resultsLoading, setResultsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfileLoading(false);
      setResultsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        // دریافت پروفایل
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }
      } catch (err) {
        console.warn('Error fetching profile:', err);
      } finally {
        setProfileLoading(false);
      }

      try {
        // دریافت نتایج آزمون‌ها
        const { data: resultsData, error } = await supabase
          .from('assessment_results')
          .select('id, test_type, result, completed_at')
          .order('completed_at', { ascending: false });

        if (!error && resultsData) {
          setResults(resultsData);
        }
      } catch (err) {
        console.warn('Error fetching assessment results:', err);
      } finally {
        setResultsLoading(false);
      }
    };

    loadData();
  }, [user]);


  if (authLoading) {
    return (
      <main className="soon-container">
        <div className="container">
          <div className="soon-card glass">
            <p>در حال بررسی حساب کاربری...</p>
          </div>
        </div>
      </main>
    );
  }


  if (!user) {
    return <Navigate to="/auth-soon" replace />;
  }


  const handleSignOut = async () => {
    await signOut();
  };


  const displayName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    'کاربر پناه';


  return (
    <>
      <main className="soon-container">
        <div className="container">
          <Reveal className="soon-card glass dashboard-card">

            <h1 style={{ fontSize: '38px', marginBottom: '12px' }}>
              سلام، {displayName} 👋
            </h1>

            <p style={{ marginBottom: '20px' }}>
              به پنل کاربری پناه خوش آمدید.
            </p>


            <div style={{ marginTop: '16px', padding: '16px 20px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.4)', border: '1px solid var(--border-glass)' }}>
              <p style={{ margin: 0, fontSize: '15px' }}>
                <strong>ایمیل:</strong>{' '}
                {profile?.email || user.email}
              </p>

              {profileLoading && (
                <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>در حال دریافت اطلاعات پروفایل...</p>
              )}
            </div>


            <hr style={{ margin: '28px 0', border: 'none', borderTop: '1px solid var(--divider)' }} />


            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
              آزمون‌های من
            </h2>


            {resultsLoading && (
              <p style={{ color: 'var(--text-secondary)' }}>
                در حال دریافت وضعیت آزمون‌ها...
              </p>
            )}


            {!resultsLoading && (
              <div
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.4)',
                  border: '1px solid var(--border-glass)',
                  textAlign: 'center',
                }}
              >
                <p style={{ margin: '0 0 16px', fontSize: '15px', color: 'var(--text-primary)' }}>
                  تعداد ارزیابی‌های ثبت‌شده شما: <strong>{results.length} آزمون</strong>
                </p>

                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <Link
                    to="/assessment-results"
                    className="btn-primary"
                    style={{ padding: '10px 22px', fontSize: '15px' }}
                  >
                    مشاهده نتایج آزمون‌ها
                  </Link>

                  <Link
                    to="/assessments"
                    className="btn-primary"
                    style={{ padding: '10px 22px', fontSize: '15px', opacity: 0.9 }}
                  >
                    شرکت در آزمون جدید
                  </Link>
                </div>
              </div>
            )}


            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                marginTop: '32px',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                className="btn-primary"
                style={{ opacity: 0.8, fontSize: '14px', background: 'rgba(43, 43, 40, 0.8)' }}
                onClick={handleSignOut}
              >
                خروج از حساب
              </button>
            </div>

          </Reveal>
        </div>
      </main>

      <Footer />
    </>
  );
}