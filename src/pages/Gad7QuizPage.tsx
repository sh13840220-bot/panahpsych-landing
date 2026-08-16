import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';
import { SmartAnalysisCard } from '../components/SmartAnalysisCard';
import { saveAssessmentResult } from '../lib/saveAssessmentResult';

export interface Question {
  id: number;
  text: string;
}

export const GAD7_QUESTIONS: Question[] = [
  { id: 1, text: 'احساس عصبانیت، اضطراب یا دلشوره می‌کردم.' },
  { id: 2, text: 'نمی‌توانستم جلوی نگرانی‌هایم را بگیرم یا آن‌ها را متوقف کنم.' },
  { id: 3, text: 'درباره‌ی موضوعات مختلف بیش از حد نگران می‌شدم.' },
  { id: 4, text: 'در آرام‌گرفتن مشکل داشتم.' },
  { id: 5, text: 'آن‌قدر بی‌قرار بودم که نشستن آرام برایم سخت بود.' },
  { id: 6, text: 'به‌راحتی عصبی یا زودرنج می‌شدم.' },
  { id: 7, text: 'احساس ترس می‌کردم، انگار ممکن بود اتفاق بدی بیفتد.' },
];

export const GAD7_OPTIONS = [
  { value: 0, label: 'اصلاً' },
  { value: 1, label: 'چند روز' },
  { value: 2, label: 'بیشتر روزها (بیش از نیمی از روزها)' },
  { value: 3, label: 'تقریباً هر روز' },
];

const SEVERITY = [
  [0, 4, 'حداقلی / طبیعی', 'level-normal'],
  [5, 9, 'خفیف', 'level-mild'],
  [10, 14, 'متوسط', 'level-moderate'],
  [15, 21, 'شدید', 'level-severe'],
];

function getSeverity(score: number) {
  for (const [min, max, label, cls] of SEVERITY) {
    if (score >= (min as number) && score <= (max as number)) {
      return { label: label as string, cls: cls as string };
    }
  }
  return { label: '', cls: '' };
}

export function Gad7QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const resultSavedRef = useRef(false);
  const [screen, setScreen] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [consent, setConsent] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(GAD7_QUESTIONS.length).fill(null));

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
    if (currentIndex < GAD7_QUESTIONS.length - 1) {
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
    setAnswers(new Array(GAD7_QUESTIONS.length).fill(null));
    setConsent(false);
    setScreen('intro');
  };

  const totalScore = answers.reduce((sum, v) => sum + (v || 0), 0);
  const severity = getSeverity(totalScore);

  useEffect(() => {
    if (screen !== 'result') return;
    if (resultSavedRef.current) return;

    resultSavedRef.current = true;

    saveAssessmentResult({
      testType: 'GAD-7',
      result: `${totalScore} - ${severity.label}`,
    });
  }, [screen, totalScore, severity.label]);

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
                <span className="pill">مدت زمان تقریبی: ۲ دقیقه</span>
                <span className="pill">۷ سؤال</span>
                <span className="pill">رایگان</span>
              </div>
              <h1 className="dass-title">آزمون GAD-7 (غربالگری اضطراب فراگیر)</h1>
              <p className="dass-subtitle">
                این آزمون میزان نشانه‌های اضطراب فراگیر شما را در دو هفته‌ی اخیر می‌سنجد و یک تصویر کلی از سطح اضطراب فعلی‌تان به شما می‌دهد.
              </p>
              <div className="dass-disclaimer">
                ⚠️ این آزمون یک ابزار <strong>غربالگری</strong> است، نه تشخیصی. نتیجه‌ی آن جایگزین ارزیابی روان‌شناس یا روان‌پزشک نیست.
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
                <span>سؤال {currentIndex + 1} از {GAD7_QUESTIONS.length}</span>
                <span>{Math.round(((currentIndex + 1) / GAD7_QUESTIONS.length) * 100)}٪</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${((currentIndex + 1) / GAD7_QUESTIONS.length) * 100}%` }}
                />
              </div>

              <div className="question-text">
                {GAD7_QUESTIONS[currentIndex].text}
              </div>

              <div className="options-group">
                {GAD7_OPTIONS.map((opt) => {
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
                  {currentIndex === GAD7_QUESTIONS.length - 1 ? 'مشاهده‌ی نتیجه' : 'سؤال بعد'}
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
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>آزمون غربالگری اضطراب فراگیر (GAD-7)</p>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'left' }}>
                  تاریخ: {new Date().toLocaleDateString('fa-IR')}
                </div>
              </div>

              <h1 className="dass-title">نتیجه‌ی آزمون شما</h1>
              <p className="dass-subtitle">
                این نتیجه بر اساس پاسخ‌های شما محاسبه شده است.
              </p>

              <div className="result-grid">
                <div className="result-item">
                  <div>
                    <div className="result-scale-label">سطح اضطراب</div>
                    <div className="result-score-text">نمره: {totalScore} از ۲۱</div>
                  </div>
                  <div className={`level-badge ${severity.cls}`}>{severity.label}</div>
                </div>
              </div>

              {severity.cls === 'level-severe' && (
                <div className="dass-warn-box">
                  نمره‌ی شما در محدوده‌ی نسبتاً بالایی قرار دارد. توصیه می‌شود در اسرع وقت با یک روان‌شناس یا روان‌پزشک متخصص صحبت کنید.
                </div>
              )}

              <SmartAnalysisCard testType="GAD7" data={{ score: totalScore }} />

              <div className="dass-cta-box">
                <h3>می‌خواهید در این مسیر تنها نباشید؟</h3>
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
