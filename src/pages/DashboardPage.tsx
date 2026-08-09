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
      <main className="soon-container main-content-wrapper user-dashboard-page">
        <div className="container dashboard-container">
          <Reveal className="soon-card glass dashboard-card user-panel-box">

            <h1 className="user-panel-title">
              سلام، {displayName} 👋
            </h1>

            <p className="user-panel-subtitle">
              به پنل کاربری پناه خوش آمدید.
            </p>

            <div className="user-panel-info-box">
              <p className="user-panel-info-text">
                <strong>ایمیل:</strong> {profile?.email || user.email}
              </p>

              {profileLoading && (
                <p className="user-panel-loading">در حال دریافت اطلاعات پروفایل...</p>
              )}
            </div>

            <hr className="user-panel-divider" />

            <h2 className="user-panel-section-title">
              آزمون‌های من
            </h2>

            {resultsLoading && (
              <p className="user-panel-loading">
                در حال دریافت وضعیت آزمون‌ها...
              </p>
            )}

            {!resultsLoading && (
              <div className="user-panel-results-box">
                <p className="user-panel-results-count">
                  تعداد ارزیابی‌های ثبت‌شده شما: <strong>{results.length} آزمون</strong>
                </p>

                <div className="user-panel-btn-group">
                  <Link
                    to="/assessment-results"
                    className="user-panel-btn-primary"
                  >
                    مشاهده نتایج آزمون‌ها
                  </Link>

                  <Link
                    to="/assessments"
                    className="user-panel-btn-secondary"
                  >
                    شرکت در آزمون جدید
                  </Link>
                </div>
              </div>
            )}

            <div className="user-panel-actions">
              <button
                type="button"
                className="user-panel-btn-logout"
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