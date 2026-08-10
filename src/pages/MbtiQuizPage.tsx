import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';
import { SmartAnalysisCard } from '../components/SmartAnalysisCard';
import { saveAssessmentResult } from '../lib/saveAssessmentResult';

export interface MbtiQuestion {
  id: number;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  positive: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  text: string;
}

export const MBTI_QUESTIONS: MbtiQuestion[] = [
  // E / I
  { id: 1,  dimension: 'EI', positive: 'E', text: 'در جمع‌های ناآشنا معمولاً خودم سر صحبت را باز می‌کنم.' },
  { id: 2,  dimension: 'EI', positive: 'I', text: 'بعد از یک روز شلوغ اجتماعی، برای بازیابی انرژی به تنهایی نیاز دارم.' },
  { id: 3,  dimension: 'EI', positive: 'E', text: 'فکر کردن با صدای بلند به من کمک می‌کند ایده‌هایم را شکل بدهم.' },
  { id: 4,  dimension: 'EI', positive: 'I', text: 'قبل از بیان نظر مهم، ترجیح می‌دهم مدتی در ذهنم آن را بررسی کنم.' },
  { id: 5,  dimension: 'EI', positive: 'E', text: 'از داشتن تعامل و فعالیت با آدم‌های مختلف در طول روز انرژی می‌گیرم.' },
  { id: 6,  dimension: 'EI', positive: 'I', text: 'معمولاً ترجیح می‌دهم چند رابطه‌ی عمیق داشته باشم تا ارتباط‌های زیاد و سطحی.' },
  { id: 7,  dimension: 'EI', positive: 'E', text: 'وقتی مشکلی پیش می‌آید، صحبت کردن با دیگران معمولاً به حل آن کمک می‌کند.' },
  { id: 8,  dimension: 'EI', positive: 'I', text: 'تفریح مورد علاقه‌ام اغلب کاری است که بتوانم به‌تنهایی انجامش دهم.' },
  { id: 9,  dimension: 'EI', positive: 'E', text: 'در محیط‌های اجتماعی جدید، معمولاً سریع با فضا جور می‌شوم.' },
  { id: 10, dimension: 'EI', positive: 'I', text: 'اگر مدت زیادی در جمع باشم، معمولاً به زمان تنهایی احتیاج پیدا می‌کنم.' },
  { id: 11, dimension: 'EI', positive: 'E', text: 'هیجان و واکنش اولیه‌ام را راحت با دیگران در میان می‌گذارم.' },
  { id: 12, dimension: 'EI', positive: 'I', text: 'پیش از تصمیم‌گیری درباره‌ی موضوعی شخصی، ترجیح می‌دهم خودم با آن کلنجار بروم.' },

  // S / N
  { id: 13, dimension: 'SN', positive: 'S', text: 'وقتی چیزی را یاد می‌گیرم، مثال‌های واقعی و کاربردی برایم مهم‌ترند.' },
  { id: 14, dimension: 'SN', positive: 'N', text: 'بیشتر از جزئیات، به ایده‌ی کلی و معنای پشت یک موضوع توجه می‌کنم.' },
  { id: 15, dimension: 'SN', positive: 'S', text: 'در توضیح دادن یک کار، ترتیب مراحل و جزئیات عملی را مهم می‌دانم.' },
  { id: 16, dimension: 'SN', positive: 'N', text: 'اغلب هنگام فکر کردن به یک موضوع، چند احتمال و مسیر متفاوت در ذهنم شکل می‌گیرد.' },
  { id: 17, dimension: 'SN', positive: 'S', text: 'به تجربه‌ی قبلی و چیزهایی که قبلاً جواب داده‌اند اعتماد زیادی دارم.' },
  { id: 18, dimension: 'SN', positive: 'N', text: 'موضوعات نظری، فرضیه‌ها و ایده‌های عجیب می‌توانند مدت زیادی ذهنم را درگیر کنند.' },
  { id: 19, dimension: 'SN', positive: 'S', text: 'وقتی دستورالعمل واضح وجود دارد، ترجیح می‌دهم همان را مرحله‌به‌مرحله اجرا کنم.' },
  { id: 20, dimension: 'SN', positive: 'N', text: 'اغلب قبل از اینکه همه‌ی اطلاعات را داشته باشم، الگو یا ارتباطی بین چیزها پیدا می‌کنم.' },
  { id: 21, dimension: 'SN', positive: 'S', text: 'چیزی که واقعاً قابل مشاهده و اندازه‌گیری باشد برایم قانع‌کننده‌تر است.' },
  { id: 22, dimension: 'SN', positive: 'N', text: 'بیشتر به این فکر می‌کنم که یک چیز چه می‌تواند بشود، نه فقط اینکه الان چیست.' },
  { id: 23, dimension: 'SN', positive: 'S', text: 'در کارهای روزمره، واقع‌بینی و عملی بودن را به خلاقیت بدون کاربرد ترجیح می‌دهم.' },
  { id: 24, dimension: 'SN', positive: 'N', text: 'از پیدا کردن ارتباط میان موضوعاتی که ظاهراً ربطی به هم ندارند لذت می‌برم.' },

  // T / F
  { id: 25, dimension: 'TF', positive: 'T', text: 'هنگام تصمیم‌گیری، منطقی بودن نتیجه برایم مهم‌تر از ناراحت نشدن افراد است.' },
  { id: 26, dimension: 'TF', positive: 'F', text: 'قبل از تصمیمی که روی دیگران اثر می‌گذارد، به احساسات آن‌ها زیاد فکر می‌کنم.' },
  { id: 27, dimension: 'TF', positive: 'T', text: 'وقتی با نظر کسی مخالفم، ترجیح می‌دهم مستقیماً ایراد منطقی آن را مطرح کنم.' },
  { id: 28, dimension: 'TF', positive: 'F', text: 'اگر کسی ناراحت باشد، معمولاً اول سعی می‌کنم احساسش را درک کنم، بعد سراغ راه‌حل بروم.' },
  { id: 29, dimension: 'TF', positive: 'T', text: 'در یک بحث، درست بودن استدلال برایم مهم‌تر از حفظ فضای کاملاً دوستانه است.' },
  { id: 30, dimension: 'TF', positive: 'F', text: 'هماهنگی میان افراد برایم آن‌قدر مهم است که گاهی از گفتن نظر تند خودداری می‌کنم.' },
  { id: 31, dimension: 'TF', positive: 'T', text: 'وقتی باید انتخاب کنم، معمولاً مزایا و معایب را با معیارهای مشخص مقایسه می‌کنم.' },
  { id: 32, dimension: 'TF', positive: 'F', text: 'تصمیمی که از نظر منطقی درست است اگر با ارزش‌های من تضاد داشته باشد، برایم قابل قبول نیست.' },
  { id: 33, dimension: 'TF', positive: 'T', text: 'بازخورد صریح را ترجیح می‌دهم، حتی اگر شنیدنش کمی ناخوشایند باشد.' },
  { id: 34, dimension: 'TF', positive: 'F', text: 'نحوه‌ی گفتن یک حرف برایم تقریباً به اندازه‌ی خود حرف اهمیت دارد.' },
  { id: 35, dimension: 'TF', positive: 'T', text: 'در حل اختلاف، سعی می‌کنم مسئله را از احساسات شخصی جدا کنم.' },
  { id: 36, dimension: 'TF', positive: 'F', text: 'معمولاً می‌توانم دیدگاه طرف مقابل را حتی وقتی با آن موافق نیستم، در نظر بگیرم.' },

  // J / P
  { id: 37, dimension: 'JP', positive: 'J', text: 'دوست دارم برنامه‌ام از قبل مشخص باشد و بدانم قدم بعدی چیست.' },
  { id: 38, dimension: 'JP', positive: 'P', text: 'ترجیح می‌دهم گزینه‌ها را باز نگه دارم و تصمیم نهایی را دیرتر بگیرم.' },
  { id: 39, dimension: 'JP', positive: 'J', text: 'تمام کردن یک کار قبل از شروع کار بعدی برایم راحت‌تر است.' },
  { id: 40, dimension: 'JP', positive: 'P', text: 'گاهی بهترین نتیجه را وقتی می‌گیرم که در لحظه و بدون برنامه‌ی دقیق پیش بروم.' },
  { id: 41, dimension: 'JP', positive: 'J', text: 'نامشخص بودن برنامه یا زمان‌بندی معمولاً آزارم می‌دهد.' },
  { id: 42, dimension: 'JP', positive: 'P', text: 'تغییر ناگهانی برنامه لزوماً ناراحتم نمی‌کند و حتی می‌تواند جالب باشد.' },
  { id: 43, dimension: 'JP', positive: 'J', text: 'برای کارهای مهم معمولاً زودتر از موعد برنامه‌ریزی می‌کنم.' },
  { id: 44, dimension: 'JP', positive: 'P', text: 'گاهی کارها را نزدیک ضرب‌الاجل انجام می‌دهم و تحت فشار بهتر متمرکز می‌شوم.' },
  { id: 45, dimension: 'JP', positive: 'J', text: 'وقتی تصمیمی گرفته شد، ترجیح می‌دهم زیاد دوباره آن را باز نکنیم.' },
  { id: 46, dimension: 'JP', positive: 'P', text: 'اگر اطلاعات جدیدی پیدا کنم، به‌راحتی برنامه یا تصمیم قبلی‌ام را تغییر می‌دهم.' },
  { id: 47, dimension: 'JP', positive: 'J', text: 'داشتن نظم مشخص در محیط کار یا مطالعه به من کمک می‌کند بهتر عمل کنم.' },
  { id: 48, dimension: 'JP', positive: 'P', text: 'برنامه‌ی بیش از حد دقیق ممکن است احساس محدودیت به من بدهد.' },
];

export const MBTI_OPTIONS = [
  { value: 2, label: 'کاملاً موافقم' },
  { value: 1, label: 'تا حدی موافقم' },
  { value: 0, label: 'نه موافقم نه مخالف' },
  { value: -1, label: 'تا حدی مخالفم' },
  { value: -2, label: 'کاملاً مخالفم' },
];

export const TYPE_INFO: Record<string, { name: string; desc: string }> = {
  ISTJ: { name: 'بازرس', desc: 'معمولاً منظم، مسئولیت‌پذیر، دقیق و متکی بر واقعیت‌های قابل اتکا.' },
  ISFJ: { name: 'حامی', desc: 'معمولاً قابل اعتماد، ملاحظه‌گر، دقیق و متوجه نیازهای دیگران.' },
  INFJ: { name: 'مشاور', desc: 'معمولاً معناگرا، آینده‌نگر، عمیق و حساس به ارزش‌ها و روابط انسانی.' },
  INTJ: { name: 'معمار', desc: 'معمولاً مستقل، تحلیلی، آینده‌نگر و علاقه‌مند به ساختن سیستم‌های کارآمد.' },
  ISTP: { name: 'حل‌کننده', desc: 'معمولاً عمل‌گرا، آرام، انعطاف‌پذیر و علاقه‌مند به فهم سازوکار چیزها.' },
  ISFP: { name: 'هنرمند', desc: 'معمولاً منعطف، ارزش‌محور، آرام و حساس به تجربه و زیبایی‌شناسی.' },
  INFP: { name: 'میانجی', desc: 'معمولاً ارزش‌محور، خیال‌پرداز، همدل و علاقه‌مند به معنا و اصالت.' },
  INTP: { name: 'تحلیل‌گر', desc: 'معمولاً کنجکاو، منطقی، مستقل و علاقه‌مند به بررسی عمیق ایده‌ها.' },
  ESTP: { name: 'کارآفرین', desc: 'معمولاً عمل‌گرا، سریع، اجتماعی و علاقه‌مند به تجربه و حل مسئله در لحظه.' },
  ESFP: { name: 'اجراکننده', desc: 'معمولاً اجتماعی، پرانرژی، تجربه‌گرا و متوجه فضای اطراف.' },
  ENFP: { name: 'پویشگر', desc: 'معمولاً خلاق، کنجکاو، انسان‌محور و علاقه‌مند به امکان‌های تازه.' },
  ENTP: { name: 'مجادله‌گر', desc: 'معمولاً نوآور، تحلیل‌گر، کنجکاو و علاقه‌مند به چالش کشیدن ایده‌ها.' },
  ESTJ: { name: 'مدیر', desc: 'معمولاً ساختارمند، مستقیم، مسئولیت‌پذیر و متمرکز بر نتیجه.' },
  ESFJ: { name: 'سفیر', desc: 'معمولاً اجتماعی، مسئول، هماهنگ‌کننده و متوجه نیازهای جمع.' },
  ENFJ: { name: 'قهرمان', desc: 'معمولاً انسان‌محور، سازمان‌دهنده، ارتباط‌گرا و متوجه رشد دیگران.' },
  ENTJ: { name: 'فرمانده', desc: 'معمولاً هدف‌محور، قاطع، تحلیلی و علاقه‌مند به سازمان‌دهی منابع برای رسیدن به نتیجه.' },
};

function getDimension(scores: Record<string, number>, a: string, b: string) {
  if (scores[a] > scores[b]) return a;
  if (scores[b] > scores[a]) return b;
  return a;
}

export function MbtiQuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const resultSavedRef = useRef(false);
  const [screen, setScreen] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [consent, setConsent] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(MBTI_QUESTIONS.length).fill(null));

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
    if (currentIndex < MBTI_QUESTIONS.length - 1) {
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
    setAnswers(new Array(MBTI_QUESTIONS.length).fill(null));
    setConsent(false);
    setScreen('intro');
  };

  // Compute MBTI result
  const scores: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  MBTI_QUESTIONS.forEach((q, i) => {
    const v = answers[i] ?? 0;
    scores[q.positive] += v;
    const opposite = ({ E: 'I', I: 'E', S: 'N', N: 'S', T: 'F', F: 'T', J: 'P', P: 'J' } as Record<string, string>)[q.positive];
    scores[opposite] -= v;
  });

  const type =
    getDimension(scores, 'E', 'I') +
    getDimension(scores, 'S', 'N') +
    getDimension(scores, 'T', 'F') +
    getDimension(scores, 'J', 'P');

  const typeDetails = TYPE_INFO[type] || { name: 'نامشخص', desc: '' };

  useEffect(() => {
    if (screen !== 'result') return;
    if (resultSavedRef.current) return;

    resultSavedRef.current = true;

    saveAssessmentResult({
      testType: 'MBTI',
      result: `${type} (${typeDetails.name})`,
    });
  }, [screen, type, typeDetails.name]);

  const dimensionsList: Array<[string, string, string]> = [
    ['E', 'I', 'برون‌گرایی / درون‌گرایی'],
    ['S', 'N', 'حسی / شهودی'],
    ['T', 'F', 'منطقی / عاطفی'],
    ['J', 'P', 'ساختارگرا / منعطف'],
  ];

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
                <span className="pill">مدت زمان تقریبی: ۸–۱۰ دقیقه</span>
                <span className="pill">۴۸ سؤال</span>
                <span className="pill">رایگان</span>
              </div>
              <h1 className="dass-title">آزمون شخصیت‌شناسی MBTI</h1>
              <p className="dass-subtitle">
                این آزمون ترجیحات شخصیتی شما را در چهار بُعد بررسی می‌کند و در پایان یکی از ۱۶ تیپ شخصیتی را به شما نشان می‌دهد.
              </p>
              <div className="dass-disclaimer">
                ⚠️ این آزمون برای <strong>خودشناسی و آشنایی اولیه</strong> طراحی شده است و ابزار تشخیص اختلالات روان‌شناختی یا ارزیابی بالینی نیست.
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
                  می‌پذیرم که نتیجه‌ی این آزمون صرفاً برای خودشناسی است و یک تشخیص روان‌شناختی قطعی محسوب نمی‌شود.
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
                <span>سؤال {currentIndex + 1} از {MBTI_QUESTIONS.length}</span>
                <span>{Math.round(((currentIndex + 1) / MBTI_QUESTIONS.length) * 100)}٪</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${((currentIndex + 1) / MBTI_QUESTIONS.length) * 100}%` }}
                />
              </div>

              <div className="question-text">
                {MBTI_QUESTIONS[currentIndex].text}
              </div>

              <div className="options-group">
                {MBTI_OPTIONS.map((opt) => {
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
                  {currentIndex === MBTI_QUESTIONS.length - 1 ? 'مشاهده‌ی نتیجه' : 'سؤال بعد'}
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
                  <p style={{ fontSize: '13px', color: '#423828' }}>آزمون شخصیت‌شناسی MBTI</p>
                </div>
                <div style={{ fontSize: '12px', color: '#6B6B65', textAlign: 'left' }}>
                  تاریخ: {new Date().toLocaleDateString('fa-IR')}
                </div>
              </div>

              <h1 className="dass-title">تیپ شخصیتی شما</h1>
              <p className="dass-subtitle">
                نتیجه بر اساس الگوی پاسخ‌های شما در چهار بُعد شخصیتی محاسبه شده است.
              </p>

              <div style={{ textAlign: 'center', margin: '20px 0 28px' }}>
                <div style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '2px', color: 'var(--text-primary)' }}>
                  {type}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px', color: 'var(--color-primary-dark)' }}>
                  {typeDetails.name}
                </div>
              </div>

              <div className="result-grid">
                {dimensionsList.map(([a, b, label]) => {
                  const selected = type.includes(a) ? a : b;
                  const absA = Math.abs(scores[a]);
                  const absB = Math.abs(scores[b]);
                  const total = absA + absB || 1;
                  const pct = Math.round((Math.max(absA, absB) / total) * 100);

                  return (
                    <div key={a + b} className="result-item">
                      <div>
                        <div className="result-scale-label">{label}</div>
                        <div className="result-score-text">
                          {a}: {scores[a]} &nbsp;|&nbsp; {b}: {scores[b]}
                        </div>
                      </div>
                      <div className="level-badge level-normal">
                        {selected} · {pct}٪
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="dass-disclaimer" style={{ marginTop: '20px' }}>
                <strong>{type} — {typeDetails.name}</strong>
                <br />
                {typeDetails.desc}
                <br />
                <br />
                این نتیجه نشان‌دهنده‌ی «ترجیحات» پاسخ‌دهنده در این آزمون است، نه یک برچسب قطعی درباره‌ی شخصیت او.
              </div>

              <SmartAnalysisCard testType="MBTI" data={{ type }} />

              <div className="dass-cta-box">
                <h3>می‌خواهید تیپ شخصیتی‌تان را بیشتر بررسی کنید؟</h3>
                <p>می‌توانید نتیجه را به‌عنوان نقطه‌ی شروعی برای گفت‌وگو با روان‌شناس در نظر بگیرید.</p>
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
