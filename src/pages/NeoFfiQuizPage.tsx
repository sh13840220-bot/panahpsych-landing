import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';
import { SmartAnalysisCard } from '../components/SmartAnalysisCard';
import { saveAssessmentResult } from '../lib/saveAssessmentResult';

export interface NeoQuestion {
  id: number;
  factor: 'N' | 'E' | 'O' | 'A' | 'C';
  reverse: boolean;
  text: string;
}

export const NEO_QUESTIONS: NeoQuestion[] = [
  { id: 1, factor: 'N', reverse: false, text: 'در موقعیت‌های پراسترس معمولاً خیلی زود نگران می‌شوم.' },
  { id: 2, factor: 'E', reverse: false, text: 'از بودن در جمع و تعامل با آدم‌های مختلف انرژی می‌گیرم.' },
  { id: 3, factor: 'O', reverse: false, text: 'از تجربه کردن ایده‌ها، سبک‌ها یا دیدگاه‌های تازه لذت می‌برم.' },
  { id: 4, factor: 'A', reverse: false, text: 'معمولاً سعی می‌کنم احساسات و نیازهای دیگران را در نظر بگیرم.' },
  { id: 5, factor: 'C', reverse: false, text: 'برای کارهای مهمم برنامه می‌ریزم و معمولاً طبق برنامه پیش می‌روم.' },
  { id: 6, factor: 'N', reverse: true, text: 'حتی وقتی شرایط سخت می‌شود، معمولاً آرامش خودم را حفظ می‌کنم.' },
  { id: 7, factor: 'E', reverse: true, text: 'اغلب ترجیح می‌دهم در جمع ساکت بمانم و وارد تعامل نشوم.' },
  { id: 8, factor: 'O', reverse: false, text: 'موضوعات پیچیده و فکری می‌توانند برای مدت طولانی ذهنم را درگیر کنند.' },
  { id: 9, factor: 'A', reverse: false, text: 'وقتی با کسی اختلاف دارم، سعی می‌کنم قبل از قضاوت حرفش را بفهمم.' },
  { id: 10, factor: 'C', reverse: false, text: 'اگر کاری را شروع کنم، معمولاً تلاش می‌کنم آن را تا پایان انجام دهم.' },

  { id: 11, factor: 'N', reverse: false, text: 'گاهی بدون دلیل مشخص احساس بی‌قراری یا تنش می‌کنم.' },
  { id: 12, factor: 'E', reverse: false, text: 'شروع کردن گفت‌وگو با افراد جدید معمولاً برایم راحت است.' },
  { id: 13, factor: 'O', reverse: false, text: 'از هنر، موسیقی، ادبیات یا تجربه‌های زیبایی‌شناختی لذت می‌برم.' },
  { id: 14, factor: 'A', reverse: false, text: 'اگر کسی به کمک نیاز داشته باشد، معمولاً سعی می‌کنم تا جایی که بتوانم کمکش کنم.' },
  { id: 15, factor: 'C', reverse: false, text: 'کارهایم را طوری مرتب می‌کنم که بدانم چه چیزی باید اول انجام شود.' },
  { id: 16, factor: 'N', reverse: false, text: 'انتقاد یا شکست می‌تواند مدت زیادی ذهنم را درگیر کند.' },
  { id: 17, factor: 'E', reverse: false, text: 'در محیط‌های پرتحرک و اجتماعی معمولاً احساس راحتی می‌کنم.' },
  { id: 18, factor: 'O', reverse: true, text: 'معمولاً به روش‌های آشنا بیشتر از تجربه‌های تازه اعتماد دارم.' },
  { id: 19, factor: 'A', reverse: true, text: 'وقتی کسی با من مخالفت می‌کند، معمولاً سریع حالت دفاعی می‌گیرم.' },
  { id: 20, factor: 'C', reverse: false, text: 'قبل از تحویل دادن کار، معمولاً آن را دوباره بررسی می‌کنم.' },

  { id: 21, factor: 'N', reverse: false, text: 'گاهی احساس می‌کنم اتفاق بدی قرار است بیفتد، حتی وقتی دلیل مشخصی ندارم.' },
  { id: 22, factor: 'E', reverse: true, text: 'بعد از مدت زیادی معاشرت، معمولاً ترجیح می‌دهم مدتی کاملاً تنها باشم.' },
  { id: 23, factor: 'O', reverse: false, text: 'از یاد گرفتن چیزهایی که خارج از علایق همیشگی من هستند استقبال می‌کنم.' },
  { id: 24, factor: 'A', reverse: false, text: 'برایم مهم است که حتی در اختلاف نظر، با دیگران محترمانه رفتار کنم.' },
  { id: 25, factor: 'C', reverse: false, text: 'معمولاً کارهای ضروری را به آخرین لحظه موکول نمی‌کنم.' },
  { id: 26, factor: 'N', reverse: false, text: 'خلق‌وخویم گاهی خیلی سریع تحت تأثیر اتفاقات روز قرار می‌گیرد.' },
  { id: 27, factor: 'E', reverse: false, text: 'وقتی هیجان‌زده می‌شوم، معمولاً آن را راحت با دیگران نشان می‌دهم.' },
  { id: 28, factor: 'O', reverse: false, text: 'از فکر کردن به اینکه آینده می‌تواند چه شکل‌های متفاوتی داشته باشد لذت می‌برم.' },
  { id: 29, factor: 'A', reverse: true, text: 'گاهی برای رسیدن به خواسته‌ام حاضر می‌شوم احساسات دیگران را نادیده بگیرم.' },
  { id: 30, factor: 'C', reverse: false, text: 'وقتی هدفی تعیین می‌کنم، معمولاً پیگیر می‌مانم تا به آن برسم.' },

  { id: 31, factor: 'N', reverse: true, text: 'در بیشتر روزها از نظر عاطفی احساس ثبات می‌کنم.' },
  { id: 32, factor: 'E', reverse: false, text: 'معمولاً ترجیح می‌دهم به‌جای ماندن در خانه، در فعالیتی بیرون از خانه شرکت کنم.' },
  { id: 33, factor: 'O', reverse: false, text: 'از دیدن یک مسئله از چند زاویه‌ی متفاوت لذت می‌برم.' },
  { id: 34, factor: 'A', reverse: false, text: 'اگر اشتباهی از من سر بزند، معمولاً می‌توانم مسئولیتش را بپذیرم.' },
  { id: 35, factor: 'C', reverse: false, text: 'داشتن محیط مرتب به من کمک می‌کند بهتر کار کنم.' },
  { id: 36, factor: 'N', reverse: false, text: 'گاهی احساسات من آن‌قدر شدید می‌شوند که تمرکز روی کارهای روزمره سخت می‌شود.' },
  { id: 37, factor: 'E', reverse: false, text: 'در گروه‌ها معمولاً راحت نظر خودم را بیان می‌کنم.' },
  { id: 38, factor: 'O', reverse: true, text: 'موضوعات انتزاعی و نظری معمولاً حوصله‌ام را سر می‌برند.' },
  { id: 39, factor: 'A', reverse: false, text: 'معمولاً به دیگران فرصت می‌دهم توضیح خودشان را کامل کنند.' },
  { id: 40, factor: 'C', reverse: true, text: 'گاهی آن‌قدر کارها را عقب می‌اندازم که مجبور می‌شوم با عجله تمامشان کنم.' },

  { id: 41, factor: 'N', reverse: false, text: 'در برابر مشکلات کوچک هم ممکن است بیشتر از حد لازم مضطرب شوم.' },
  { id: 42, factor: 'E', reverse: true, text: 'اغلب ترجیح می‌دهم دیگران شروع‌کننده‌ی تعامل اجتماعی باشند.' },
  { id: 43, factor: 'O', reverse: false, text: 'اگر با فرهنگی متفاوت یا سبک زندگی جدیدی آشنا شوم، دوست دارم درباره‌اش بیشتر بدانم.' },
  { id: 44, factor: 'A', reverse: true, text: 'اگر از کسی ناراحت باشم، ممکن است مدت زیادی رفتارم را نسبت به او سرد کنم.' },
  { id: 45, factor: 'C', reverse: false, text: 'وقتی مسئولیتی قبول می‌کنم، معمولاً می‌توان روی انجام شدنش حساب کرد.' },
  { id: 46, factor: 'N', reverse: true, text: 'حتی در شرایط نامطمئن هم معمولاً می‌توانم نگرانی‌هایم را مدیریت کنم.' },
  { id: 47, factor: 'E', reverse: false, text: 'آشنایی با افراد جدید معمولاً برایم جذاب است.' },
  { id: 48, factor: 'O', reverse: true, text: 'در تصمیم‌گیری، معمولاً چیزهای عملی و آشنا را به ایده‌های تازه ترجیح می‌دهم.' },
  { id: 49, factor: 'A', reverse: false, text: 'اگر بتوانم جلوی یک سوءتفاهم را بگیرم، ترجیح می‌دهم با گفت‌وگو مسئله را حل کنم.' },
  { id: 50, factor: 'C', reverse: false, text: 'حتی وقتی انگیزه ندارم، معمولاً می‌توانم خودم را وادار کنم کار مهمم را انجام دهم.' },

  { id: 51, factor: 'N', reverse: false, text: 'گاهی نگرانی‌هایم بیشتر از چیزی می‌شوند که واقعاً ارزشش را دارند.' },
  { id: 52, factor: 'E', reverse: true, text: 'معمولاً در جمع‌های بزرگ ترجیح می‌دهم بیشتر شنونده باشم.' },
  { id: 53, factor: 'O', reverse: false, text: 'تغییر دیدگاه و یاد گرفتن چیزی که قبلاً نمی‌دانستم برایم لذت‌بخش است.' },
  { id: 54, factor: 'A', reverse: false, text: 'معمولاً تلاش می‌کنم در برخورد با دیگران منصف باشم.' },
  { id: 55, factor: 'C', reverse: false, text: 'برای رسیدن به هدف‌های بلندمدت می‌توانم مدتی منظم و پیوسته تلاش کنم.' },
  { id: 56, factor: 'N', reverse: true, text: 'معمولاً اجازه نمی‌دهم نگرانی‌هایم کنترل رفتار روزمره‌ام را به دست بگیرند.' },
  { id: 57, factor: 'E', reverse: false, text: 'وقتی در یک جمع دوستانه هستم، معمولاً فعالانه در گفت‌وگو شرکت می‌کنم.' },
  { id: 58, factor: 'O', reverse: true, text: 'معمولاً ترجیح می‌دهم همان روش‌های امتحان‌شده را ادامه دهم تا اینکه روش تازه‌ای امتحان کنم.' },
  { id: 59, factor: 'A', reverse: true, text: 'در بحث‌ها گاهی برایم مهم‌تر است که حرف خودم را ثابت کنم تا اینکه به توافق برسیم.' },
  { id: 60, factor: 'C', reverse: true, text: 'اگر کارها فوریت نداشته باشند، ممکن است مرتب انجام دادنشان را عقب بیندازم.' }
];

export const NEO_OPTIONS = [
  { value: 1, label: 'کاملاً مخالفم' },
  { value: 2, label: 'مخالفم' },
  { value: 3, label: 'نه موافقم نه مخالف' },
  { value: 4, label: 'موافقم' },
  { value: 5, label: 'کاملاً موافقم' }
];

export const FACTORS: Record<string, { title: string; short: string; low: string; high: string }> = {
  N: { title: 'روان‌رنجورخویی (Neuroticism)', short: 'N', low: 'ثبات هیجانی بیشتر', high: 'حساسیت هیجانی بیشتر' },
  E: { title: 'برون‌گرایی (Extraversion)', short: 'E', low: 'درون‌گرایی بیشتر', high: 'برون‌گرایی بیشتر' },
  O: { title: 'گشودگی به تجربه (Openness)', short: 'O', low: 'عمل‌گرایی و ترجیح آشنایی', high: 'کنجکاوی و گشودگی بیشتر' },
  A: { title: 'توافق‌پذیری (Agreeableness)', short: 'A', low: 'قاطعیت و رقابت بیشتر', high: 'همکاری و همدلی بیشتر' },
  C: { title: 'وظیفه‌شناسی (Conscientiousness)', short: 'C', low: 'انعطاف و خودجوشی بیشتر', high: 'نظم و هدفمندی بیشتر' }
};

export function NeoFfiQuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const resultSavedRef = useRef(false);
  const [screen, setScreen] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [consent, setConsent] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(NEO_QUESTIONS.length).fill(null));

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
    if (currentIndex < NEO_QUESTIONS.length - 1) {
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
    setAnswers(new Array(NEO_QUESTIONS.length).fill(null));
    setConsent(false);
    setScreen('intro');
  };

  // Compute NEO scores
  const scores: Record<string, number> = { N: 0, E: 0, O: 0, A: 0, C: 0 };
  const counts: Record<string, number> = { N: 0, E: 0, O: 0, A: 0, C: 0 };

  NEO_QUESTIONS.forEach((q, i) => {
    let v = answers[i];
    if (v === null) v = 3;
    if (q.reverse) v = 6 - v;
    scores[q.factor] += v;
    counts[q.factor]++;
  });

  const sortedFactors = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
  const highestFactors = sortedFactors.slice(0, 2).map((k) => FACTORS[k].title.split(' ')[0]).join(' و ');

  useEffect(() => {
    if (screen !== 'result') return;
    if (resultSavedRef.current) return;

    resultSavedRef.current = true;

    saveAssessmentResult({
      testType: 'NEO-FFI',
      result: `N: ${scores.N} | E: ${scores.E} | O: ${scores.O} | A: ${scores.A} | C: ${scores.C}`,
    });
  }, [screen, scores.N, scores.E, scores.O, scores.A, scores.C]);

  return (
    <>
      <main className="container" style={{ paddingTop: '110px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          <div style={{ marginBottom: '20px' }} className="no-print">
            <Link to="/assessments" className="back-link">
              ← بازگشت به لیست آزمون‌های روانشناسی
            </Link>
          </div>

          {screen === 'intro' && (
            <Reveal className="dass-card glass">
              <div className="meta-pills">
                <span className="pill">مدت زمان تقریبی: ۸–۱۰ دقیقه</span>
                <span className="pill">۶۰ سؤال</span>
                <span className="pill">رایگان</span>
              </div>
              <h1 className="dass-title">آزمون پنج عامل بزرگ شخصیت (NEO-FFI)</h1>
              <p className="dass-subtitle">
                این آزمون پنج بُعد اصلی شخصیت را بررسی می‌کند: روان‌رنجورخویی، برون‌گرایی، گشودگی به تجربه، توافق‌پذیری و وظیفه‌شناسی.
              </p>
              <div className="dass-disclaimer">
                ⚠️ این نسخه برای <strong>خودشناسی و غربالگری اولیه</strong> طراحی شده است و جایگزین ارزیابی مستقیم روان‌شناس نیست.
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
                  می‌پذیرم که نتیجه‌ی این آزمون برای خودشناسی است و تشخیص قطعی ویژگی‌های شخصیتی یا اختلال روان‌شناختی محسوب نمی‌شود.
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
                <span>سؤال {currentIndex + 1} از {NEO_QUESTIONS.length}</span>
                <span>{Math.round(((currentIndex + 1) / NEO_QUESTIONS.length) * 100)}٪</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${((currentIndex + 1) / NEO_QUESTIONS.length) * 100}%` }}
                />
              </div>

              <div className="question-text">
                {NEO_QUESTIONS[currentIndex].text}
              </div>

              <div className="options-group">
                {NEO_OPTIONS.map((opt) => {
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
                  {currentIndex === NEO_QUESTIONS.length - 1 ? 'مشاهده‌ی نتیجه' : 'سؤال بعد'}
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
                  <p style={{ fontSize: '13px', color: '#423828' }}>آزمون پنج عامل بزرگ شخصیت (NEO-FFI)</p>
                </div>
                <div style={{ fontSize: '12px', color: '#6B6B65', textAlign: 'left' }}>
                  تاریخ: {new Date().toLocaleDateString('fa-IR')}
                </div>
              </div>

              <h1 className="dass-title">پروفایل پنج‌عاملی شما</h1>
              <p className="dass-subtitle">
                نمره‌های شما در پنج بُعد اصلی شخصیت در ادامه نمایش داده شده‌اند.
              </p>

              <div className="result-grid">
                {Object.keys(FACTORS).map((key) => {
                  const maxPossible = counts[key] * 5;
                  const pct = Math.round((scores[key] / maxPossible) * 100);
                  const level = pct < 40 ? 'پایین' : pct < 60 ? 'متوسط' : 'بالا';

                  return (
                    <div key={key} className="result-item">
                      <div>
                        <div className="result-scale-label">{FACTORS[key].title} ({key})</div>
                        <div className="result-score-text">
                          نمره: {scores[key]} از {maxPossible}
                        </div>
                      </div>
                      <div className="level-badge level-normal">
                        {level} · {pct}٪
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="dass-disclaimer" style={{ marginTop: '20px' }}>
                <strong>جمع‌بندی تحلیلی:</strong>
                <br />
                در این پروفایل، بالاترین نمره‌ها مربوط به <strong>{highestFactors}</strong> است.
                <br />
                نمره‌ی هر عامل را باید در کنار چهار عامل دیگر و با توجه به شرایط فردی تفسیر کرد. این نمره‌ها به‌تنهایی نشان‌دهنده خوب یا بد بودن شخصیت نیستند.
              </div>

              <SmartAnalysisCard testType="NEOFFI" data={{ scores }} />

              <div className="dass-cta-box">
                <h3>می‌خواهید نتیجه را دقیق‌تر بررسی کنید؟</h3>
                <p>می‌توانید این پروفایل را به‌عنوان نقطه‌ی شروع گفت‌وگو با روان‌شناس در نظر بگیرید.</p>
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
      <Footer showCollabNote={false} isShort={true} />
    </>
  );
}
