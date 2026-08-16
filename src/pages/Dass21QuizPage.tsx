import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';
import { SmartAnalysisCard } from '../components/SmartAnalysisCard';
import { saveAssessmentResult } from '../lib/saveAssessmentResult';

export interface Question {
  id: number;
  scale: 'D' | 'A' | 'S';
  text: string;
}

export const QUESTIONS: Question[] = [
  { id: 1,  scale: 'S', text: 'به سختی می‌توانستم آرام بگیرم و از فشار روانی رها شوم.' },
  { id: 2,  scale: 'A', text: 'متوجه خشکی دهانم می‌شدم.' },
  { id: 3,  scale: 'D', text: 'انگار اصلاً نمی‌توانستم هیچ احساس مثبتی را تجربه کنم.' },
  { id: 4,  scale: 'A', text: 'دچار مشکل تنفسی می‌شدم (مثلاً نفس‌نفس‌زدن یا تنگی نفس بدون هیچ فعالیت بدنی).' },
  { id: 5,  scale: 'D', text: 'برایم سخت بود که انگیزه‌ای برای انجام کارها پیدا کنم.' },
  { id: 6,  scale: 'S', text: 'تمایل داشتم نسبت به موقعیت‌ها واکنش بیش از حد نشان دهم.' },
  { id: 7,  scale: 'A', text: 'دچار لرزش می‌شدم (مثلاً در دست‌هایم).' },
  { id: 8,  scale: 'S', text: 'احساس می‌کردم انرژی عصبی زیادی مصرف می‌کنم.' },
  { id: 9,  scale: 'A', text: 'نگران موقعیت‌هایی بودم که ممکن بود دچار وحشت‌زدگی بشوم و جلوی دیگران خجالت بکشم.' },
  { id: 10, scale: 'D', text: 'احساس می‌کردم چیزی برای امیدوار بودن به آن ندارم.' },
  { id: 11, scale: 'S', text: 'خودم را در حالت بی‌قراری و آشفتگی می‌یافتم.' },
  { id: 12, scale: 'S', text: 'آرام‌شدن برایم دشوار بود.' },
  { id: 13, scale: 'D', text: 'احساس دلتنگی و غمگینی می‌کردم.' },
  { id: 14, scale: 'S', text: 'نسبت به هر چیزی که مانع ادامه‌ی کارم می‌شد، بی‌تحمل بودم.' },
  { id: 15, scale: 'A', text: 'احساس می‌کردم نزدیک به یک حمله‌ی وحشت‌زدگی هستم.' },
  { id: 16, scale: 'D', text: 'نمی‌توانستم نسبت به هیچ چیزی مشتاق و پرانرژی باشم.' },
  { id: 17, scale: 'D', text: 'احساس می‌کردم به‌عنوان یک انسان، ارزش چندانی ندارم.' },
  { id: 18, scale: 'S', text: 'احساس می‌کردم نسبتاً زودرنج شده‌ام.' },
  { id: 19, scale: 'A', text: 'بدون هیچ فعالیت بدنی، متوجه ضربان قلبم می‌شدم (مثلاً افزایش ضربان یا جاافتادن یک ضربان).' },
  { id: 20, scale: 'A', text: 'بدون دلیل موجه، احساس ترس می‌کردم.' },
  { id: 21, scale: 'D', text: 'احساس می‌کردم زندگی بی‌معناست.' },
];

export const OPTIONS = [
  { value: 0, label: 'اصلاً شامل حال من نمی‌شد' },
  { value: 1, label: 'تا حدی شامل حال من می‌شد، یا گاهی' },
  { value: 2, label: 'تا حد زیادی شامل حال من می‌شد، یا اغلب اوقات' },
  { value: 3, label: 'خیلی زیاد شامل حال من می‌شد، یا بیشتر اوقات' },
];

const SEVERITY = {
  D: [
    [0, 9, 'طبیعی', 'level-normal'],
    [10, 13, 'خفیف', 'level-mild'],
    [14, 20, 'متوسط', 'level-moderate'],
    [21, 27, 'شدید', 'level-severe'],
    [28, 999, 'شدید بسیار زیاد', 'level-extreme'],
  ],
  A: [
    [0, 7, 'طبیعی', 'level-normal'],
    [8, 9, 'خفیف', 'level-mild'],
    [10, 14, 'متوسط', 'level-moderate'],
    [15, 19, 'شدید', 'level-severe'],
    [20, 999, 'شدید بسیار زیاد', 'level-extreme'],
  ],
  S: [
    [0, 14, 'طبیعی', 'level-normal'],
    [15, 18, 'خفیف', 'level-mild'],
    [19, 25, 'متوسط', 'level-moderate'],
    [26, 33, 'شدید', 'level-severe'],
    [34, 999, 'شدید بسیار زیاد', 'level-extreme'],
  ],
};

const SCALE_LABEL: Record<'D' | 'A' | 'S', string> = {
  D: 'افسردگی',
  A: 'اضطراب',
  S: 'استرس',
};

function getSeverity(scale: 'D' | 'A' | 'S', score: number) {
  const table = SEVERITY[scale];
  for (const [min, max, label, cls] of table) {
    if (score >= (min as number) && score <= (max as number)) {
      return { label: label as string, cls: cls as string };
    }
  }
  return { label: '', cls: '' };
}

export function Dass21QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const resultSavedRef = useRef(false);
  const [screen, setScreen] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [consent, setConsent] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUESTIONS.length).fill(null));

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
    if (currentIndex < QUESTIONS.length - 1) {
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
    setAnswers(new Array(QUESTIONS.length).fill(null));
    setConsent(false);
    setScreen('intro');
  };

  // Calculate scores
  const raw = { D: 0, A: 0, S: 0 };
  QUESTIONS.forEach((q, i) => {
    const ans = answers[i] ?? 0;
    raw[q.scale] += ans;
  });
  const finalScores = { D: raw.D * 2, A: raw.A * 2, S: raw.S * 2 };
  const hasExtreme =
    getSeverity('D', finalScores.D).cls === 'level-extreme' ||
    getSeverity('A', finalScores.A).cls === 'level-extreme' ||
    getSeverity('S', finalScores.S).cls === 'level-extreme';

  useEffect(() => {
    if (screen !== 'result') return;
    if (resultSavedRef.current) return;

    resultSavedRef.current = true;

    const dSev = getSeverity('D', finalScores.D).label;
    const aSev = getSeverity('A', finalScores.A).label;
    const sSev = getSeverity('S', finalScores.S).label;

    saveAssessmentResult({
      testType: 'DASS-21',
      result: `افسردگی: ${finalScores.D} (${dSev}) | اضطراب: ${finalScores.A} (${aSev}) | استرس: ${finalScores.S} (${sSev})`,
    });
  }, [screen, finalScores.D, finalScores.A, finalScores.S]);

  return (
    <>
      <main className="dass21-page container" style={{ paddingTop: '110px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '20px' }}>
            <Link to="/assessments" className="back-link">
              ← بازگشت به لیست آزمون‌های روانشناسی
            </Link>
          </div>

          {screen === 'intro' && (
            <Reveal className="dass-card glass">
              <div className="meta-pills">
                <span className="pill">مدت زمان تقریبی: ۵ دقیقه</span>
                <span className="pill">۲۱ سؤال</span>
                <span className="pill">رایگان</span>
              </div>
              <h1 className="dass-title">آزمون DASS-21</h1>
              <p className="dass-subtitle">
                این آزمون سه حالت روانی — افسردگی، اضطراب و استرس — را در دو هفته‌ی اخیر شما می‌سنجد و در پایان، سطح هر یک را به شما نشان می‌دهد. لطفاً هر جمله را بخوانید و بگویید هر کدام تا چه اندازه در طول دو هفته‌ی گذشته برای شما صادق بوده است.
              </p>
              <div className="dass-disclaimer">
                ⚠️ این آزمون یک ابزار <strong>غربالگری</strong> است، نه یک روش تشخیصی. نتیجه‌ی آن جایگزین ارزیابی و تشخیص روان‌شناس یا روان‌پزشک نیست و صرفاً برای آشنایی اولیه‌ی شما با وضعیت روانی‌تان طراحی شده است.
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
                <span>سؤال {currentIndex + 1} از {QUESTIONS.length}</span>
                <span>{Math.round(((currentIndex + 1) / QUESTIONS.length) * 100)}٪</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>

              <div className="question-text">
                {QUESTIONS[currentIndex].text}
              </div>

              <div className="options-group">
                {OPTIONS.map((opt) => {
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
                  {currentIndex === QUESTIONS.length - 1 ? 'مشاهده‌ی نتیجه' : 'سؤال بعد'}
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
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>آزمون مقیاس‌های افسردگی، اضطراب و استرس (DASS-21)</p>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'left' }}>
                  تاریخ: {new Date().toLocaleDateString('fa-IR')}
                </div>
              </div>

              <h1 className="dass-title">نتیجه‌ی آزمون شما</h1>
              <p className="dass-subtitle">
                این نتایج بر اساس پاسخ‌های شما به سؤالات محاسبه شده‌اند.
              </p>

              <div className="result-grid">
                {(['D', 'A', 'S'] as const).map((scale) => {
                  const score = finalScores[scale];
                  const { label, cls } = getSeverity(scale, score);
                  return (
                    <div key={scale} className="result-item">
                      <div>
                        <div className="result-scale-label">{SCALE_LABEL[scale]}</div>
                        <div className="result-score-text">نمره: {score}</div>
                      </div>
                      <div className={`level-badge ${cls}`}>{label}</div>
                    </div>
                  );
                })}
              </div>

              {hasExtreme && (
                <div className="dass-warn-box">
                  نمرات شما در برخی مقیاس‌ها در محدوده‌ی بالایی قرار دارد. توصیه‌ی جدی می‌شود که در اسرع وقت با یک روان‌شناس یا روان‌پزشک متخصص صحبت کنید. شما تنها نیستید و کمک گرفتن نشانه‌ی قدرت است.
                </div>
              )}

              <SmartAnalysisCard testType="DASS21" data={finalScores} />

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
