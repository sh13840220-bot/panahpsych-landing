import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';
import { SmartAnalysisCard } from '../components/SmartAnalysisCard';
import { saveAssessmentResult } from '../lib/saveAssessmentResult';

export interface BdiQuestion {
  id: number;
  text: string;
  options: string[];
}

export const BDI2_QUESTIONS: BdiQuestion[] = [
  {
    id: 1,
    text: 'در دو هفته‌ی اخیر، میزان غم و اندوه من چقدر بوده است؟',
    options: [
      'اصلاً غمگین نیستم',
      'گاهی غمگینم',
      'بیشتر اوقات غمگینم',
      'آن‌قدر غمگینم که تحملش برایم بسیار دشوار است',
    ],
  },
  {
    id: 2,
    text: 'در دو هفته‌ی اخیر، چقدر نسبت به آینده احساس ناامیدی داشته‌ام؟',
    options: [
      'نسبت به آینده ناامید نیستم',
      'گاهی نسبت به آینده نگران یا ناامیدم',
      'انتظار ندارم اوضاع بهتر شود',
      'احساس می‌کنم آینده کاملاً ناامیدکننده است',
    ],
  },
  {
    id: 3,
    text: 'در دو هفته‌ی اخیر، چقدر خودم را شکست‌خورده می‌دانسته‌ام؟',
    options: [
      'احساس شکست‌خوردگی ندارم',
      'بیش از گذشته احساس شکست داشته‌ام',
      'وقتی به گذشته نگاه می‌کنم شکست‌های زیادی می‌بینم',
      'احساس می‌کنم در همه چیز شکست خورده‌ام',
    ],
  },
  {
    id: 4,
    text: 'در دو هفته‌ی اخیر، میزان رضایت من از زندگی چقدر تغییر کرده است؟',
    options: [
      'از زندگی به اندازه قبل راضی‌ام',
      'مثل گذشته از چیزها لذت نمی‌برم',
      'تقریباً از هیچ چیز رضایت ندارم',
      'از زندگی کاملاً ناراضی‌ام',
    ],
  },
  {
    id: 5,
    text: 'در دو هفته‌ی اخیر، احساس گناه در من چقدر بوده است؟',
    options: [
      'احساس گناه خاصی ندارم',
      'گاهی احساس گناه می‌کنم',
      'اغلب احساس می‌کنم کارهای گذشته‌ام سزاوار سرزنش‌اند',
      'تقریباً همیشه خودم را مقصر می‌دانم',
    ],
  },
  {
    id: 6,
    text: 'در دو هفته‌ی اخیر، چقدر احساس می‌کردم مجازات می‌شوم یا سزاوار مجازاتم؟',
    options: [
      'احساس نمی‌کنم در حال مجازات شدن باشم',
      'گاهی چنین احساسی دارم',
      'انتظار دارم مجازات شوم',
      'احساس می‌کنم در حال مجازات شدن هستم',
    ],
  },
  {
    id: 7,
    text: 'در دو هفته‌ی اخیر، نگرش من نسبت به خودم چگونه بوده است؟',
    options: [
      'از خودم مثل گذشته راضی‌ام',
      'اعتمادم به خودم کمتر شده است',
      'از خودم ناامیدم',
      'از خودم بیزارم',
    ],
  },
  {
    id: 8,
    text: 'در دو هفته‌ی اخیر، چقدر خودم را سرزنش کرده‌ام؟',
    options: [
      'بیشتر از معمول خودم را سرزنش نمی‌کنم',
      'بیشتر از گذشته از خودم انتقاد می‌کنم',
      'اغلب خودم را به خاطر اشتباه‌هایم سرزنش می‌کنم',
      'برای هر اتفاق بدی خودم را مقصر می‌دانم',
    ],
  },
  {
    id: 9,
    text: 'در دو هفته‌ی اخیر، آیا به آسیب‌زدن به خود یا خودکشی فکر کرده‌ام؟',
    options: [
      'چنین فکری نداشته‌ام',
      'گاهی به این فکرها رسیده‌ام ولی قصد انجامشان را ندارم',
      'اغلب به خودکشی فکر می‌کنم',
      'قصد یا برنامه‌ای برای خودکشی دارم',
    ],
  },
  {
    id: 10,
    text: 'در دو هفته‌ی اخیر، میزان گریه‌کردن من چگونه بوده است؟',
    options: [
      'بیشتر از معمول گریه نمی‌کنم',
      'بیشتر از گذشته گریه می‌کنم',
      'برای کوچک‌ترین چیزها گریه می‌کنم',
      'می‌خواهم گریه کنم اما دیگر نمی‌توانم',
    ],
  },
  {
    id: 11,
    text: 'در دو هفته‌ی اخیر، چقدر تحریک‌پذیر یا بی‌حوصله بوده‌ام؟',
    options: [
      'بیشتر از معمول تحریک‌پذیر نیستم',
      'کمی زودرنج‌تر از گذشته‌ام',
      'بخش زیادی از زمان تحریک‌پذیرم',
      'تقریباً همیشه تحریک‌پذیرم',
    ],
  },
  {
    id: 12,
    text: 'در دو هفته‌ی اخیر، علاقه‌ام به دیگران و فعالیت‌ها چقدر بوده است؟',
    options: [
      'علاقه‌ام مثل گذشته است',
      'کمی کمتر از گذشته علاقه دارم',
      'بیشتر علاقه‌ام را از دست داده‌ام',
      'تقریباً هیچ علاقه‌ای ندارم',
    ],
  },
  {
    id: 13,
    text: 'در دو هفته‌ی اخیر، در تصمیم‌گیری چقدر مشکل داشته‌ام؟',
    options: [
      'مثل گذشته تصمیم می‌گیرم',
      'تصمیم‌گیری را بیشتر به تعویق می‌اندازم',
      'تصمیم‌گیری برایم بسیار دشوار شده است',
      'دیگر تقریباً نمی‌توانم تصمیم بگیرم',
    ],
  },
  {
    id: 14,
    text: 'در دو هفته‌ی اخیر، درباره‌ی ظاهر یا ارزشمندی خودم چه احساسی داشته‌ام؟',
    options: [
      'احساس نمی‌کنم ظاهر یا ارزشمندی‌ام بدتر شده باشد',
      'نگرانم که جذابیت یا ارزشمندی‌ام کمتر شده باشد',
      'احساس می‌کنم تغییر منفی قابل‌توجهی کرده‌ام',
      'مطمئنم زشت یا بی‌ارزش شده‌ام',
    ],
  },
  {
    id: 15,
    text: 'در دو هفته‌ی اخیر، توان و انرژی من چگونه بوده است؟',
    options: [
      'تقریباً به اندازه گذشته انرژی دارم',
      'انرژی‌ام کمتر از گذشته است',
      'برای انجام بسیاری از کارها انرژی کافی ندارم',
      'برای انجام بیشتر کارها انرژی ندارم',
    ],
  },
  {
    id: 16,
    text: 'در دو هفته‌ی اخیر، الگوی خواب من چقدر تغییر کرده است؟',
    options: [
      'خوابم تقریباً مثل گذشته است',
      'کمی بیشتر یا کمتر از گذشته می‌خوابم',
      'تغییر خوابم واضح و آزاردهنده شده است',
      'تقریباً بیشتر/کمتر از معمول می‌خوابم و این تغییر شدید است',
    ],
  },
  {
    id: 17,
    text: 'در دو هفته‌ی اخیر، میزان خستگی من چگونه بوده است؟',
    options: [
      'بیشتر از معمول خسته نیستم',
      'زودتر از گذشته خسته می‌شوم',
      'از انجام بسیاری از کارها خسته می‌شوم',
      'برای انجام بیشتر کارها بیش از حد خسته‌ام',
    ],
  },
  {
    id: 18,
    text: 'در دو هفته‌ی اخیر، اشتهای من چقدر تغییر کرده است؟',
    options: [
      'اشتهایم تقریباً مثل گذشته است',
      'اشتهایم کمی بیشتر یا کمتر شده است',
      'اشتهایم به‌طور محسوسی تغییر کرده است',
      'تقریباً اشتهایم را از دست داده‌ام یا بسیار زیاد شده است',
    ],
  },
  {
    id: 19,
    text: 'در دو هفته‌ی اخیر، تمرکز کردن چقدر برایم دشوار بوده است؟',
    options: [
      'مثل گذشته می‌توانم تمرکز کنم',
      'تمرکز کردن کمی دشوارتر شده است',
      'تمرکز کردن برایم بسیار دشوار است',
      'تقریباً نمی‌توانم روی چیزی تمرکز کنم',
    ],
  },
  {
    id: 20,
    text: 'در دو هفته‌ی اخیر، علاقه یا میل جنسی من چقدر تغییر کرده است؟',
    options: [
      'تغییری نسبت به گذشته احساس نمی‌کنم',
      'کمی کمتر شده است',
      'به‌طور محسوسی کمتر شده است',
      'تقریباً کاملاً از بین رفته است',
    ],
  },
  {
    id: 21,
    text: 'در دو هفته‌ی اخیر، عملکرد و فعالیت روزمره‌ام چقدر تحت تأثیر قرار گرفته است؟',
    options: [
      'فعالیت روزمره‌ام تقریباً مثل گذشته است',
      'کارها را با سختی بیشتری انجام می‌دهم',
      'بسیاری از فعالیت‌ها را به‌سختی انجام می‌دهم',
      'تقریباً نمی‌توانم فعالیت‌های معمولم را انجام دهم',
    ],
  },
];

const SEVERITY = [
  [0, 13, 'حداقل', 'level-normal'],
  [14, 19, 'خفیف', 'level-mild'],
  [20, 28, 'متوسط', 'level-moderate'],
  [29, 63, 'شدید', 'level-extreme'],
];

function getSeverity(score: number) {
  for (const [min, max, label, cls] of SEVERITY) {
    if (score >= (min as number) && score <= (max as number)) {
      return { label: label as string, cls: cls as string };
    }
  }
  return { label: '', cls: '' };
}

export function Bdi2QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const resultSavedRef = useRef(false);
  
  const [screen, setScreen] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [consent, setConsent] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(BDI2_QUESTIONS.length).fill(null));

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
    if (currentIndex < BDI2_QUESTIONS.length - 1) {
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
  setAnswers(new Array(BDI2_QUESTIONS.length).fill(null));
  setConsent(false);
  setScreen('intro');
};

  const totalScore = answers.reduce((sum, v) => sum + (v || 0), 0);
  const severity = getSeverity(totalScore);
  const hasSuicidalIdeation = answers[8] !== null && (answers[8] as number) >= 1;
    
  useEffect(() => {
    if (screen !== 'result') return;
    if (resultSavedRef.current) return;

    resultSavedRef.current = true;

    saveAssessmentResult({
      testType: 'BDI-II',
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
                <span className="pill">مدت زمان تقریبی: ۵–۱۰ دقیقه</span>
                <span className="pill">۲۱ سؤال</span>
                <span className="pill">رایگان</span>
              </div>
              <h1 className="dass-title">آزمون افسردگی بک-II (BDI-II)</h1>
              <p className="dass-subtitle">
                این پرسشنامه شدت نشانه‌های افسردگی را در دو هفته‌ی اخیر بررسی می‌کند و در پایان یک نمره‌ی کلی به شما می‌دهد.
              </p>
              <div className="dass-disclaimer">
                ⚠️ این آزمون یک ابزار <strong>غربالگری</strong> است، نه روش تشخیص. نتیجه‌ی آن جایگزین ارزیابی و تشخیص روان‌شناس یا روان‌پزشک نیست.
              </div>
              {!user && (
                <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '14px', background: 'rgba(168, 197, 192, 0.15)', border: '1px solid var(--border-glass)', fontSize: '14px', color: 'var(--text-primary)', textAlign: 'center' }}>
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
                <span>سؤال {currentIndex + 1} از {BDI2_QUESTIONS.length}</span>
                <span>{Math.round(((currentIndex + 1) / BDI2_QUESTIONS.length) * 100)}٪</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${((currentIndex + 1) / BDI2_QUESTIONS.length) * 100}%` }}
                />
              </div>

              <div className="question-text">
                {BDI2_QUESTIONS[currentIndex].text}
              </div>

              <div className="options-group">
                {BDI2_QUESTIONS[currentIndex].options.map((optText, valIndex) => {
                  const isSelected = answers[currentIndex] === valIndex;
                  return (
                    <button
                      key={valIndex}
                      type="button"
                      className={`option-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(valIndex)}
                    >
                      <span className="option-radio">{isSelected ? '✓' : ''}</span>
                      <span className="option-label">{optText}</span>
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
                  {currentIndex === BDI2_QUESTIONS.length - 1 ? 'مشاهده‌ی نتیجه' : 'سؤال بعد'}
                </button>
              </div>
            </Reveal>
          )}

          {screen === 'result' && (
            <Reveal className="dass-card glass">
              {/* Visible only in print mode */}
              <div className="print-header-brand">
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#20301E' }}>پناه | گزارش ارزیابی روان‌شناختی</h2>
                  <p style={{ fontSize: '13px', color: '#423828' }}>آزمون افسردگی بک (BDI-II)</p>
                </div>
                <div style={{ fontSize: '12px', color: '#6B6B65', textAlign: 'left' }}>
                  تاریخ: {new Date().toLocaleDateString('fa-IR')}
                </div>
              </div>

              <h1 className="dass-title">نتیجه‌ی آزمون شما</h1>
              <p className="dass-subtitle">
                این نمره بر اساس پاسخ‌های شما محاسبه شده است.
              </p>

              <div className="result-grid">
                <div className="result-item">
                  <div>
                    <div className="result-scale-label">شدت نشانه‌های افسردگی (BDI-II)</div>
                    <div className="result-score-text">نمره: {totalScore} از ۶۳</div>
                  </div>
                  <div className={`level-badge ${severity.cls}`}>{severity.label}</div>
                </div>
              </div>

              {hasSuicidalIdeation && (
                <div className="dass-warn-box">
                  یکی از پاسخ‌های شما نشان می‌دهد که ممکن است افکار مرتبط با مرگ یا خودکشی وجود داشته باشد. این نتیجه به‌تنهایی تشخیص یا ارزیابی خطر نیست، اما در صورت وجود خطر فوری یا احساس ناتوانی در حفظ امنیت خود، باید فوراً از خدمات اورژانسی یا یک متخصص کمک بگیرید.
                </div>
              )}

              <SmartAnalysisCard testType="BDI2" data={{ score: totalScore }} />

              <div className="dass-cta-box">
                <h3>می‌خواهید نتیجه را با متخصص بررسی کنید؟</h3>
                <p>می‌توانید نتیجه‌ی این غربالگری را با یکی از روان‌شناسان پناه در میان بگذارید.</p>
                <button
                  className="btn-primary-pill light-btn"
                  onClick={() => navigate('/clients-soon')}
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
      <Footer showCollabNote={true} isShort={true} />
    </>
  );
}
