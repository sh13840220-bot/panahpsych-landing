import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';

type AssessmentResult = {
  id: string;
  test_type: string;
  result: string;
  completed_at: string;
};

export function AssessmentResultsPage() {
  const { user, loading: authLoading } = useAuth();
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const { data, error } = await supabase
          .from('assessment_results')
          .select('id, test_type, result, completed_at')
          .order('completed_at', { ascending: false });

        if (!error && data) {
          setResults(data);
        }
      } catch (err) {
        console.warn('Error fetching assessment results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
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

  // Group results by test_type
  const groupedResults = results.reduce<Record<string, AssessmentResult[]>>((acc, item) => {
    const type = item.test_type || 'آزمون عمومی';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(item);
    return acc;
  }, {});

  const testTypes = Object.keys(groupedResults);

  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const dateStr = date.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const timeStr = date.toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return { dateStr, timeStr };
    } catch {
      return { dateStr: isoString, timeStr: '' };
    }
  };

  return (
    <>
      <main className="soon-container" style={{ paddingTop: '110px', paddingBottom: '80px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <Reveal className="soon-card glass" style={{ textAlign: 'right' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  کارنامه و نتایج آزمون‌ها
                </h1>
                <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  تاریخچه تمام ارزیابی‌های روان‌شناختی ثبت‌شده شما
                </p>
              </div>

              <Link to="/dashboard" className="btn-primary" style={{ padding: '8px 18px', fontSize: '14px' }}>
                بازگشت به پنل
              </Link>
            </div>

            <hr style={{ margin: '20px 0 28px', border: 'none', borderTop: '1px solid var(--border-glass)' }} />

            {loading && (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '30px 0' }}>
                در حال بارگیری نتایج...
              </p>
            )}

            {!loading && testTypes.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.3)',
                  border: '1px solid var(--border-glass)',
                }}
              >
                <p style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '16px' }}>
                  شما هنوز در هیچ آزمونی شرکت نکرده‌اید.
                </p>
                <Link to="/assessments" className="btn-primary">
                  مشاهده و شروع آزمون‌ها
                </Link>
              </div>
            )}

            {!loading && testTypes.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {testTypes.map((type) => {
                  const items = groupedResults[type];
                  return (
                    <div
                      key={type}
                      style={{
                        borderRadius: '20px',
                        background: 'rgba(255, 255, 255, 0.45)',
                        border: '1px solid var(--border-glass)',
                        padding: '20px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.03)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '16px',
                          borderBottom: '1px dashed rgba(0, 0, 0, 0.08)',
                          paddingBottom: '12px',
                        }}
                      >
                        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--color-primary-dark)' }}>
                          آزمون {type}
                        </h2>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '4px 12px',
                            borderRadius: '999px',
                            background: 'rgba(168, 197, 192, 0.25)',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {items.length} مرتبه انجام شده
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {items.map((item, index) => {
                          const { dateStr, timeStr } = formatDateTime(item.completed_at);
                          return (
                            <div
                              key={item.id}
                              style={{
                                padding: '14px 16px',
                                borderRadius: '14px',
                                background: 'rgba(255, 255, 255, 0.65)',
                                border: '1px solid rgba(255, 255, 255, 0.8)',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: '8px',
                                  flexWrap: 'wrap',
                                  gap: '8px',
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    color: 'var(--text-primary)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                  }}
                                >
                                  📌 ارزیابی شماره {items.length - index}
                                </span>

                                <div
                                  style={{
                                    display: 'flex',
                                    gap: '12px',
                                    fontSize: '12px',
                                    color: 'var(--text-secondary)',
                                  }}
                                >
                                  <span>📅 {dateStr}</span>
                                  {timeStr && <span>⏰ ساعت {timeStr}</span>}
                                </div>
                              </div>

                              <div
                                style={{
                                  fontSize: '14px',
                                  lineHeight: '1.7',
                                  color: 'var(--text-primary)',
                                  background: 'rgba(250, 249, 246, 0.8)',
                                  padding: '10px 14px',
                                  borderRadius: '10px',
                                  border: '1px solid rgba(0,0,0,0.04)',
                                }}
                              >
                                <strong>نتیجه:</strong> {item.result}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <Link to="/assessments" className="btn-primary">
                شرکت در آزمون جدید
              </Link>
            </div>
          </Reveal>
        </div>
      </main>

      <Footer />
    </>
  );
}
