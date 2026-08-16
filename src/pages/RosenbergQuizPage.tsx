import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';
import { SmartAnalysisCard } from '../components/SmartAnalysisCard';
import { saveAssessmentResult } from '../lib/saveAssessmentResult';

export interface Question {
  id: number;
  reverse: boolean;
  text: string;
}

export const ROSENBERG_QUESTIONS: Question[] = [
  { id: 1,  reverse: false, text: 'در مجموع، از خودم راضی هستم.' },
  { id: 2,  reverse: true,  text: 'گاهی فکر می‌کنم اصلاً آدم بی‌ارزشی هستم.' },
  { id: 3,  reverse: false, text: 'احساس می‌کنم ویژگی‌های خوب زیادی دارم.' },
  { id: 4,  reverse: false, text: 'می‌توانم کارها را به‌خوبی اکثر افراد دیگر انجام دهم.' },
  { id: 5,  reverse: true,  text: 'احساس می‌کنم چیز زیادی برای افتخارکردن ندارم.' },
  { id: 6,  reverse: true,  text: 'گاهی واقعاً احساس بی‌فایده‌بودن می‌کنم.' },
  { id: 7,  reverse: false, text: 'احساس می‌کنم انسان باارزشی هستم، دست‌کم هم‌سطح دیگران.' },
  { id: 8,  reverse: true,  text: 'ای‌کاش می‌توانستم احترام بیشتری برای خودم قائل باشم.' },
  { id: 9,  reverse: true,  text: 'در مجموع، تمایل دارم فکر کنم که آدم شکست‌خورده‌ای هستم.' },
  { id: 10, reverse: false, text: 'نگرش مثبتی نسبت به خودم دارم.' },
];

export const ROSENBERG_OPTIONS = [
  { value: 0, label: 'کاملاً مخالفم' },
  { value: 1, label: 'مخالفم' },
  { value: 2, label: 'موافقم' },
  { value: 3, label: 'کاملاً موافقم' },
];

function getLevel(score: number) {
  if (score <= 14) return { label: 'پایین', cls: 'level-moderate' };
  if (score <= 25) return { label: 'متوسط / طبیعی', cls: 'level-normal' };
  return { label: 'بالا', cls: 'level-normal' };
}

export function RosenbergQuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const resultSavedRef = useRef(false);
  const [screen, setScreen] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [consent, setConsent] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(ROSENBERG_QUESTIONS.length).fill(null));

  const handleStart = () => {
    if (!user) {
      navigate(`/auth-soon?redirect=${encodeURIComponent(location.pathname)}`, {
        state: { from: location.pathname },
      });
      return;
    }
    if (!consent) return;
    setScreen('quiz');
  };

  const handleSelectOption = (value: number) => {
    const updated = [...answers];
    updated[currentIndex] = value;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex < ROSENBERG_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setScreen('result');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    resultSavedRef.current = false;
    setCurrentIndex(0);
    setAnswers(new Array(ROSENBERG_QUESTIONS.length).fill(null));
    setConsent(false);
    setScreen('intro');
  };

  let totalScore = 0;
  ROSENBERG_QUESTIONS.forEach((q, i) => {
    const raw = answers[i] ?? 0;
    totalScore += q.reverse ? 3 - raw : raw;
  });

  const levelInfo = getLevel(totalScore);

  useEffect(() => {
    if (screen !== 'result') return;
    if (resultSavedRef.current) return;

    resultSavedRef.current = true;

    saveAssessmentResult({
      testType: 'عزت نفس روزنبرگ',
      result: `نمره ${totalScore} از ۳۰ - سطح ${levelInfo.label}`,
    });
  }, [screen, totalScore, levelInfo.label]);

  return (
    <>
      <main className="container" style={{ paddingTop: '110px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          <div style={{ marginBottom: '20px' }}>
            <Link to="/assessments" className="back-link">
              ← بازگشت به لیست آزمون‌های روانشناسی
            </Link>
          </div>

          {screen === 'intro' && (
            <Reveal className="dass-card glass">
              <div className="meta-pills">
                <span className="pill">مدت زمان تقریبی: ۳ دقیقه</span>
                <span className="pill">۱۰ سؤال</span>
                <span className="pill">رایگان</span>
              </div>
              <h1 className="dass-title">آزمون عزت نفس روزنبرگ</h1>
              <p className="dass-subtitle">
                این آزمون یکی از شناخته‌شده‌ترین ابزارهای سنجش عزت نفس در دنیاست و دیدگاه کلی شما نسبت به ارزش خودتان را می‌سنجد.
              </p>
              <div className="dass-disclaimer">
                ⚠️ این آزمون یک ابزار <strong>غربالگری</strong> است، نه تشخیصی. نتیجه‌ی آن جایگزین ارزیابی روان‌شناس نیست.
              </div>
              {!user && (
                <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '14px', background: 'var(--icon-bg)', border: '1px solid var(--border-glass)', fontSize: '14px', color: 'var(--text-primary)', textAlign: 'center' }}>
                  🔒 برای شرکت در آزمون و ذخیره نتیجه در پنل کاربری، باید <strong>وارد حساب کاربری</strong> خود شوید.
                </div>
              )}
              <label className="dass-consent-label">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  می‌پذیرم که این آزمون جنبه‌ی غربالگری دارد و نتیجه‌ی آن را به‌عنوان تشخیص قطعی تلقی نمی‌کنم.
                </span>
              </label>
              <button
                className="btn-primary-pill"
                onClick={handleStart}
                disabled={!consent}
                style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
              >
                {user ? 'شروع آزمون' : 'ورود / ثبت‌نام برای شروع آزمون'}
              </button>
            </Reveal>
          )}

          {screen === 'quiz' && (
            <Reveal className="dass-card glass">
              <div className="progress-header">
                <span>سؤال {currentIndex + 1} از {ROSENBERG_QUESTIONS.length}</span>
                <span>{Math.round(((currentIndex + 1) / ROSENBERG_QUESTIONS.length) * 100)}٪</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${((currentIndex + 1) / ROSENBERG_QUESTIONS.length) * 100}%` }}
                />
              </div>

              <div className="question-text">
                {ROSENBERG_QUESTIONS[currentIndex].text}
              </div>

              <div className="options-group">
                {ROSENBERG_OPTIONS.map((opt) => {
                  const isSelected = answers[currentIndex] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={`option-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(opt.value)}
                    >
                      <span className="option-radio">{isSelected ? '✓' : ''}</span>
                      <span className="option-label">{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="quiz-nav-row">
                <button
                  type="button"
                  className="btn-outline-pill"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  style={{ opacity: currentIndex === 0 ? 0.3 : 1 }}
                >
                  سؤال قبل
                </button>
                <button
                  type="button"
                  className="btn-primary-pill"
                  onClick={handleNext}
                  disabled={answers[currentIndex] === null}
                >
                  {currentIndex === ROSENBERG_QUESTIONS.length - 1 ? 'مشاهده‌ی نتیجه' : 'سؤال بعد'}
                </button>
              </div>
            </Reveal>
          )}

          {screen === 'result' && (
            <Reveal className="dass-card glass">
              {/* Visible only in print mode */}
              <div className="print-header-brand">
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>پناه | گزارش ارزیابی روان‌شناختی</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>آزمون مقیاس عزت نفس روزنبرگ (RSES)</p>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'left' }}>
                  تاریخ: {new Date().toLocaleDateString('fa-IR')}
                </div>
              </div>

              <h1 className="dass-title">نتیجه‌ی آزمون شما</h1>
              <p className="dass-subtitle">
                برخلاف بعضی آزمون‌های دیگر، در این آزمون نمره‌ی <strong>بالاتر</strong> به معنای عزت نفس <strong>مطلوب‌تر</strong> است.
              </p>

              <div className="result-grid">
                <div className="result-item">
                  <div>
                    <div className="result-scale-label">سطح عزت نفس</div>
                    <div className="result-score-text">نمره: {totalScore} از ۳۰</div>
                  </div>
                  <div className={`level-badge ${levelInfo.cls}`}>{levelInfo.label}</div>
                </div>
              </div>

              <SmartAnalysisCard testType="ROSENBERG" data={{ score: totalScore }} />

              <div className="dass-cta-box">
                <h3>می‌خواهید بیشتر روی این موضوع کار کنید؟</h3>
                <p>می‌توانید نتیجه‌ی این آزمون را با یکی از روان‌شناسان پناه در میان بگذارید.</p>
                <button
                  className="btn-primary-pill light-btn"
                  onClick={() => navigate('/assessments')}
                >
                  رزرو مشاوره
                </button>
              </div>

              <div style={{ marginTop: '24px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }} className="no-print">
                <button type="button" className="btn-outline-pill" onClick={() => window.print()}>
                  🖨️ چاپ / ذخیره فایل PDF
                </button>
                <button type="button" className="btn-outline-pill" onClick={handleRestart}>
                  شروع دوباره‌ی آزمون
                </button>
              </div>
            </Reveal>
          )}

        </div>
      </main>
      <Footer showCollabNote={false} isShort={true} />
    </>
  );
}
