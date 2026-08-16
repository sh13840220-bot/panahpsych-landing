import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';
import { SmartAnalysisCard } from '../components/SmartAnalysisCard';
import { saveAssessmentResult } from '../lib/saveAssessmentResult';

/* =========================================================================
   ۱. بانک گویه‌ها و مشخصات استاندارد پرسشنامه انعطاف‌پذیری شناختی (CFI)
   (Dennis & Vander Wal, 2010)
   - گویه‌های معکوس: ۲، ۴، ۷، ۹، ۱۱، ۱۷
   - عامل ۱ (گزینه‌های مختلف): ۳، ۵، ۶، ۱۲، ۱۳، ۱۴، ۱۶، ۱۸، ۱۹، ۲۰ (حداکثر ۷۰)
   - عامل ۲ (کنترل‌پذیری): ۱، ۲، ۴، ۷، ۹، ۱۱، ۱۵، ۱۷ (حداکثر ۵۶)
   - عامل ۳ (توجیه رفتار): ۸، ۱۰ (حداکثر ۱۴)
   ========================================================================= */
export type CfiFactor = 'alternatives' | 'control' | 'justification';

export interface CfiQuestion {
  id: number;
  text: string;
  factor: CfiFactor;
  reverse: boolean;
}

export const CFI_QUESTIONS: CfiQuestion[] = [
  { id: 1, text: 'من در درک موقعیت‌ها، توانایی خوبی دارم.', factor: 'control', reverse: false },
  { id: 2, text: 'هنگامی که با موقعیت‌های دشوار روبرو می‌شوم، تصمیم‌گیری برایم مشکل است.', factor: 'control', reverse: true },
  { id: 3, text: 'هنگام تصمیم‌گیری، چندین گزینه را در نظر می‌گیرم.', factor: 'alternatives', reverse: false },
  { id: 4, text: 'وقتی با موقعیت‌های سخت روبرو می‌شوم، احساس می‌کنم کنترل خودم را از دست می‌دهم.', factor: 'control', reverse: true },
  { id: 5, text: 'دوست دارم به موقعیت‌های سخت، از جهات مختلف نگاه کنم.', factor: 'alternatives', reverse: false },
  { id: 6, text: 'قبل از نتیجه‌گیری در مورد علل یک رفتار، به دنبال اطلاعات بیشتری می‌گردم.', factor: 'alternatives', reverse: false },
  { id: 7, text: 'هر زمان که با موقعیت‌های سخت روبرو هستم، آنقدر مضطرب می‌شوم که نمی‌توانم به راه‌حلی برای حل آن موقعیت فکر کنم.', factor: 'control', reverse: true },
  { id: 8, text: 'من سعی می‌کنم از دیدگاه افراد دیگر، به مسایل فکر کنم.', factor: 'justification', reverse: false },
  { id: 9, text: 'درک اینکه روش‌های بسیار متعددی برای کنار آمدن با موقعیت‌های سخت وجود دارد، برایم دشوار است.', factor: 'control', reverse: true },
  { id: 10, text: 'من خوب می‌توانم خودم را به جای دیگران قرار دهم.', factor: 'justification', reverse: false },
  { id: 11, text: 'وقتی با موقعیت‌های سخت روبرو می‌شوم، واقعاً نمی‌دانم چه کاری باید انجام دهم.', factor: 'control', reverse: true },
  { id: 12, text: 'مهم است که به موقعیت‌های سخت از زوایای زیادی نگاه کرد.', factor: 'alternatives', reverse: false },
  { id: 13, text: 'وقتی در موقعیت‌های دشواری هستم، قبل از تصمیم‌گیری در مورد نحوه‌ی مقابله با وضعیت به وجود آمده، چندین گزینه را در نظر می‌گیرم.', factor: 'alternatives', reverse: false },
  { id: 14, text: 'من اغلب از دیدگاه‌های مختلف، به یک موقعیت نگاه می‌کنم.', factor: 'alternatives', reverse: false },
  { id: 15, text: 'می‌توانم بر مشکلاتی که در زندگی با آن روبرو می‌شوم، غلبه کنم.', factor: 'control', reverse: false },
  { id: 16, text: 'هنگام نتیجه‌گیری در مورد علل یک رفتار، تمام اطلاعات و واقعیت‌های موجود را در نظر می‌گیرم.', factor: 'alternatives', reverse: false },
  { id: 17, text: 'احساس می‌کنم که در موقعیت‌های سخت، توانایی تغییر مسایل را ندارم.', factor: 'control', reverse: true },
  { id: 18, text: 'وقتی با موقعیت‌های سخت روبرو می‌شوم، صبر کرده و سعی می‌کنم به چندین راه‌حل برای حل آن موقعیت فکر کنم.', factor: 'alternatives', reverse: false },
  { id: 19, text: 'می‌توانم برای رفع موقعیت دشواری که با آن روبرو می‌شوم، به بیش از یک راه‌حل فکر کنم.', factor: 'alternatives', reverse: false },
  { id: 20, text: 'چندین گزینه را قبل از واکنش نشان دادن به موقعیت‌های دشوار، در نظر می‌گیرم.', factor: 'alternatives', reverse: false },
];

export const CFI_OPTIONS = [
  { val: 1, label: '۱. بسیار مخالفم' },
  { val: 2, label: '۲. مخالفم' },
  { val: 3, label: '۳. تا حدودی مخالفم' },
  { val: 4, label: '۴. نظری ندارم' },
  { val: 5, label: '۵. تا حدودی موافقم' },
  { val: 6, label: '۶. موافقم' },
  { val: 7, label: '۷. بسیار موافقم' },
];

export const FACTOR_CONFIG: Record<CfiFactor, { label: string; max: number; desc: string; count: number; color: string }> = {
  alternatives: {
    label: 'ادراک گزینه‌های مختلف (خلق راهکارها)',
    max: 70,
    desc: 'توانایی در نظر گرفتن چندین راهکار و زاویه دید منعطف در برخورد با مسائل',
    count: 10,
    color: 'var(--color-primary)',
  },
  control: {
    label: 'ادراک کنترل‌پذیری (مهار موقعیت دشوار)',
    max: 56,
    desc: 'باور به توانایی مدیریت، تسلط و جهت‌دهی مثبت به شرایط بحرانی زندگی',
    count: 8,
    color: 'var(--color-accent)',
  },
  justification: {
    label: 'ادراک توجیه رفتار (دیدگاه‌گیری و همدلی)',
    max: 14,
    desc: 'توانایی درک دیدگاه، انگیزه‌ها و دلایل رفتاری سایر افراد بدون پیش‌داوری منفی',
    count: 2,
    color: 'var(--text-primary)',
  },
};

function getCfiLevel(score: number) {
  if (score >= 105) {
    return {
      label: 'سطح بالا (انعطاف‌پذیری شناختی مطلوب و تاب‌آوری بالا)',
      cls: 'level-normal',
      color: 'var(--color-primary)',
      badgeBg: 'var(--badge-inperson-bg)',
      analysis:
        'نمره کل شما نشان‌دهنده انعطاف‌پذیری شناختی بسیار مطلوب است. بر اساس الگوی استاندارد دنیس و وندروال، شما در مواجهه با چالش‌های زندگی توانایی بالایی در بازسازی شناختی و جایگزینی افکار ناکارآمد با نگرش‌های سازنده دارید. در شرایط بحرانی، کنترل خود را حفظ کرده و به جای فرورفتن در نشخوار فکری و احساس درماندگی، گزینه‌ها و راه‌حل‌های متعددی را ارزیابی می‌کنید. این ویژگی نقشی اساسی در پیشگیری از افسردگی، اضطراب و پریشانی روانی عمومی ایفا می‌کند.',
    };
  }
  if (score >= 70) {
    return {
      label: 'سطح متوسط (انعطاف‌پذیری شناختی در حد نرمال)',
      cls: 'level-mild',
      color: 'var(--color-accent)',
      badgeBg: 'var(--status-pending-bg)',
      analysis:
        'نمره کل شما در محدوده متوسط قرار دارد. شما در شرایط عادی قادر به یافتن راه‌حل‌های جایگزین و تطبیق با رویدادها هستید؛ اما در شرایط استرس شدید یا خستگی روانی، ممکن است موقتاً کنترل درونی خود را تضعیف‌شده احساس کرده یا دچار خطای شناختی تک‌گزینه‌ای شوید. تقویت مهارت بازبینی گزینه‌ها و دیدگاه‌گیری از زاویه افراد دیگر به شما کمک می‌کند تاب‌آوری روانی‌تان را در شرایط پیچیده به شکل چشمگیری ارتقا دهید.',
    };
  }
  return {
    label: 'سطح پایین (انعطاف‌پذیری شناختی ضعیف / مستعد نشخوار فکری)',
    cls: 'level-moderate',
    color: 'var(--status-pending-text)',
    badgeBg: 'var(--status-pending-bg)',
    analysis:
      'نمره کل شما نشان‌دهنده گرایش به سرسختی شناختی و انعطاف‌پذیری پایین است. طبق نتایج پژوهش‌ها، افراد در این محدوده نمره، هنگام بروز ناکامی‌ها تمایل زیادی به فرورفتن در نشخوارهای فکری مکرر و باور به غیرقابل کنترل بودن موقعیت‌ها دارند که می‌تواند به تشدید افسردگی یا اضطراب منجر شود. تقویت آگاهانه راهکارهای جایگزین و استفاده از تکنیک‌های درمان شناختی-رفتاری (CBT) برای به چالش کشیدن باورهای منفی اکیداً توصیه می‌شود.',
  };
}

export function CfiQuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const resultSavedRef = useRef(false);

  const [screen, setScreen] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [consent, setConsent] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(CFI_QUESTIONS.length).fill(null));

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

  const handleSelectOption = (val: number) => {
    const updated = [...answers];
    updated[currentIndex] = val;
    setAnswers(updated);

    // Auto-advance after brief delay
    if (currentIndex < CFI_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 230);
    }
  };

  const handleNext = () => {
    if (answers[currentIndex] === null) {
      alert('لطفاً یکی از گزینه‌های طیف ۷ درجه‌ای را انتخاب فرمایید.');
      return;
    }
    if (currentIndex < CFI_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const unanswered = answers.findIndex((a) => a === null);
      if (unanswered !== -1) {
        alert(`گویه شماره ${unanswered + 1} هنوز بی‌پاسخ مانده است.`);
        setCurrentIndex(unanswered);
        return;
      }
      setScreen('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setAnswers(new Array(CFI_QUESTIONS.length).fill(null));
    setConsent(false);
    setScreen('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculations
  let totalScore = 0;
  let scoreAlternatives = 0;
  let scoreControl = 0;
  let scoreJustification = 0;

  CFI_QUESTIONS.forEach((q, i) => {
    const raw = answers[i] ?? 4;
    const itemScore = q.reverse ? 8 - raw : raw;
    totalScore += itemScore;

    if (q.factor === 'alternatives') scoreAlternatives += itemScore;
    else if (q.factor === 'control') scoreControl += itemScore;
    else if (q.factor === 'justification') scoreJustification += itemScore;
  });

  const levelInfo = getCfiLevel(totalScore);
  const answeredCount = answers.filter((a) => a !== null).length;

  useEffect(() => {
    if (screen !== 'result') return;
    if (resultSavedRef.current) return;

    resultSavedRef.current = true;

    saveAssessmentResult({
      testType: 'انعطاف‌پذیری شناختی (CFI)',
      result: `نمره کل ${totalScore} از ۱۴۰ (${levelInfo.label}) | گزینه‌ها: ${scoreAlternatives}/۷۰ | کنترل: ${scoreControl}/۵۶ | توجیه رفتار: ${scoreJustification}/۱۴`,
    });
  }, [screen, totalScore, levelInfo.label, scoreAlternatives, scoreControl, scoreJustification]);

  const currentQ = CFI_QUESTIONS[currentIndex];

  return (
    <>
      <main className="container" style={{ paddingTop: '110px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>

          <div style={{ marginBottom: '20px' }}>
            <Link to="/assessments" className="back-link">
              ← بازگشت به لیست آزمون‌های روانشناسی
            </Link>
          </div>

          {/* =========================================================================
              صفحه ۱: معرفی و راهنمای آزمون
             ========================================================================= */}
          {screen === 'intro' && (
            <Reveal className="dass-card glass">
              <div className="meta-pills">
                <span className="pill">مدت زمان: ۵ الی ۱۰ دقیقه</span>
                <span className="pill">۲۰ سؤال (طیف ۷ درجه‌ای)</span>
                <span className="pill">استاندارد دنیس و وندروال (۲۰۱۰)</span>
                <span className="pill">رایگان</span>
              </div>

              <h1 className="dass-title">آزمون انعطاف‌پذیری شناختی (CFI)</h1>
              <p className="dass-subtitle" style={{ textAlign: 'justify', lineHeight: 1.85 }}>
                انعطاف‌پذیری شناختی مهارتی بنیادین است که به انسان توانایی می‌دهد در مواجهه با استرس‌ها و چالش‌های دشوار،
                افکار ناکارآمد خود را به چالش کشیده و آن‌ها را با راه‌حل‌ها و تفاسیر منطقی جایگزین نماید. این پرسشنامه میزان
                گرایش شما به <strong>کنترل درونی شرایط</strong>، <strong>خلق گزینه‌های چندگانه</strong> و <strong>درک رفتارهای دیگران</strong> را می‌سنجد.
              </p>

              {/* ابعاد سه‌گانه */}
              <div style={{ margin: '24px 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '6px' }}>
                    💡 ادراک گزینه‌های مختلف
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    توانایی خلق چندین راه‌حل و فرضیه جایگزین برای حل مسائل پیچیده زندگی.
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-accent)', marginBottom: '6px' }}>
                    🛡️ ادراک کنترل‌پذیری
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    میزان باور به امکان تسلط و مهار فعالانه رویدادهای استرس‌زا به جای درماندگی.
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    🤝 ادراک توجیه رفتار
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    توانایی دیدگاه‌گیری، درک احساسات و چرایی منطقی رفتار سایر انسان‌ها.
                  </div>
                </div>
              </div>

              <div className="dass-disclaimer">
                ⚠️ این آزمون یک ابزار <strong>ارزیابی روان‌شناختی و خودشناسی</strong> است. نتیجه‌ی آن برای درک الگوهای فکری و تقویت سازگاری فردی طراحی شده و جایگزین مصاحبه بالینی نیست.
              </div>

              {!user && (
                <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '14px', background: 'var(--icon-bg)', border: '1px solid var(--border-glass)', fontSize: '14px', color: 'var(--text-primary)', textAlign: 'center' }}>
                  🔒 برای شرکت در آزمون و ذخیره نتیجه در پرونده کاربری، باید <strong>وارد حساب کاربری</strong> خود شوید.
                </div>
              )}

              <label className="dass-consent-label">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  با آگاهی از هدف پژوهشی و خودشناسی آزمون، آماده پاسخ‌دهی صادقانه به ۲۰ گویه هستم.
                </span>
              </label>

              <button
                className="btn-primary-pill"
                onClick={handleStart}
                disabled={!consent}
                style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
              >
                {user ? 'شروع آزمون انعطاف‌پذیری شناختی' : 'ورود / ثبت‌نام برای شروع آزمون'}
              </button>
            </Reveal>
          )}

          {/* =========================================================================
              صفحه ۲: اجرای پرسشنامه
             ========================================================================= */}
          {screen === 'quiz' && (
            <Reveal className="dass-card glass">
              <div className="progress-header">
                <span>گویه {currentIndex + 1} از {CFI_QUESTIONS.length}</span>
                <span>{Math.round(((currentIndex + 1) / CFI_QUESTIONS.length) * 100)}٪</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${((currentIndex + 1) / CFI_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* برچسب مؤلفه گویه */}
              <div style={{ marginTop: '16px', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: 'var(--icon-bg)',
                    color: 'var(--text-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>📌</span>
                  <span>{FACTOR_CONFIG[currentQ.factor].label}</span>
                </span>
              </div>

              <div className="question-text" style={{ fontSize: '18px', fontWeight: 800, marginTop: '10px', marginBottom: '22px' }}>
                {currentQ.text}
              </div>

              {/* گزینه‌های ۷ درجه‌ای لیکرت */}
              <div className="options-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {CFI_OPTIONS.map((opt) => {
                  const isSelected = answers[currentIndex] === opt.val;
                  return (
                    <button
                      key={opt.val}
                      type="button"
                      className={`option-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(opt.val)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 18px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="option-radio">{isSelected ? '✓' : ''}</span>
                        <span className="option-label" style={{ fontWeight: isSelected ? 700 : 500 }}>
                          {opt.label}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: isSelected ? 'var(--color-primary)' : 'var(--border-glass)',
                          color: isSelected ? 'var(--bg-main)' : 'var(--text-secondary)',
                        }}
                      >
                        نمره {opt.val}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* دکمه‌های ناوبری */}
              <div className="quiz-nav-row" style={{ marginTop: '26px' }}>
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
                  {currentIndex === CFI_QUESTIONS.length - 1 ? 'مشاهده و تحلیل کارنامه' : 'سؤال بعد'}
                </button>
              </div>

              {/* نقشه سریع دسترسی به سؤالات */}
              <div
                style={{
                  marginTop: '28px',
                  padding: '16px',
                  background: 'var(--header-bg)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-glass)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  <span>وضعیت پاسخ به گویه‌ها:</span>
                  <span>{answeredCount} از ۲۰ پاسخ داده شده</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(32px, 1fr))', gap: '6px' }}>
                  {CFI_QUESTIONS.map((q, idx) => {
                    const isAns = answers[idx] !== null;
                    const isCurrent = idx === currentIndex;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`quiz-question-number-btn ${isCurrent ? 'is-current' : ''} ${isAns ? 'is-ans' : ''}`}
                        style={{
                          height: '32px',
                          borderRadius: '8px',
                          border: isCurrent ? '2px solid var(--color-primary)' : '1px solid var(--border-glass)',
                          background: isCurrent ? 'var(--btn-primary-bg)' : isAns ? 'var(--badge-inperson-bg)' : 'var(--bg-card)',
                          color: isCurrent ? 'var(--btn-primary-text)' : isAns ? 'var(--badge-inperson-text)' : 'var(--text-secondary)',
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        {q.id}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          )}

          {/* =========================================================================
              صفحه ۳: گزارش و تحلیل نهایی کارنامه
             ========================================================================= */}
          {screen === 'result' && (
            <Reveal className="dass-card glass">
              {/* هدر چاپی */}
              <div className="print-header-brand">
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>پناه | گزارش ارزیابی روان‌شناختی</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>پرسشنامه استاندارد انعطاف‌پذیری شناختی (CFI)</p>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'left' }}>
                  تاریخ ارزیابی: {new Date().toLocaleDateString('fa-IR')}
                </div>
              </div>

              <h1 className="dass-title">نتیجه و کارنامه تفصیلی شما</h1>
              <p className="dass-subtitle">
                در این آزمون، نمرات بالاتر نشان‌دهنده توانایی سازگاری بیشتر، مهار استرس و انعطاف‌پذیری شناختی مطلوب‌تر است.
              </p>

              {/* بنر نتیجه کلی */}
              <div
                style={{
                  background: 'var(--btn-primary-bg)',
                  color: 'var(--btn-primary-text)',
                  borderRadius: '20px',
                  padding: '30px 24px',
                  textAlign: 'center',
                  marginBottom: '26px',
                  border: '1px solid var(--border-glass)',
                }}
              >
                <div style={{ fontSize: '13px', color: 'var(--btn-primary-text)', opacity: 0.9, marginBottom: '4px', fontWeight: 700 }}>
                  نمره کل انعطاف‌پذیری شناختی
                </div>
                <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--btn-primary-text)', lineHeight: 1.1, marginBottom: '8px' }}>
                  {totalScore} <span style={{ fontSize: '20px', color: 'var(--btn-primary-text)', opacity: 0.85, fontWeight: 600 }}>از ۱۴۰</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--btn-primary-text)' }}>
                  {levelInfo.label}
                </div>
                <div style={{ display: 'inline-block', background: 'var(--icon-bg)', color: 'var(--text-primary)', padding: '4px 16px', borderRadius: '50px', fontSize: '12.5px', border: '1px solid var(--border-glass)' }}>
                  دامنه نمرات از ۲۰ تا ۱۴۰ (میانگین نرمال: ۷۰ الی ۱۰۵)
                </div>
              </div>

              {/* خرده مقیاس‌های سه‌گانه */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📊</span>
                  <span>نمرات به تفکیک خرده‌مقیاس‌های سه‌گانه</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px' }}>
                  {/* عامل ۱: گزینه‌ها */}
                  <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '18px', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '4px' }}>
                        ادراک گزینه‌های مختلف
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
                        توانایی خلق چند راه‌حل و زاویه دید منعطف (۱۰ گویه)
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px', fontWeight: 800, marginBottom: '6px' }}>
                        <span>نمره کسب‌شده:</span>
                        <span style={{ color: 'var(--color-primary)', fontSize: '16px' }}>{scoreAlternatives} از ۷۰</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'var(--header-bg)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.round((scoreAlternatives / 70) * 100)}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '10px' }} />
                      </div>
                    </div>
                  </div>

                  {/* عامل ۲: کنترل پذیری */}
                  <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '18px', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-accent)', marginBottom: '4px' }}>
                        ادراک کنترل‌پذیری
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
                        باور به مهار و هدایت موقعیت‌های پرتنش (۸ گویه)
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px', fontWeight: 800, marginBottom: '6px' }}>
                        <span>نمره کسب‌شده:</span>
                        <span style={{ color: 'var(--color-accent)', fontSize: '16px' }}>{scoreControl} از ۵۶</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'var(--header-bg)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.round((scoreControl / 56) * 100)}%`, height: '100%', background: 'var(--color-accent)', borderRadius: '10px' }} />
                      </div>
                    </div>
                  </div>

                  {/* عامل ۳: توجیه رفتار */}
                  <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '18px', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                        ادراک توجیه رفتار
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
                        دیدگاه‌گیری و درک منطقی رفتار دیگران (۲ گویه)
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px', fontWeight: 800, marginBottom: '6px' }}>
                        <span>نمره کسب‌شده:</span>
                        <span style={{ color: 'var(--text-primary)', fontSize: '16px' }}>{scoreJustification} از ۱۴</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'var(--header-bg)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.round((scoreJustification / 14) * 100)}%`, height: '100%', background: 'var(--text-primary)', borderRadius: '10px' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* تحلیل بالینی */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '18px',
                  padding: '22px',
                  border: '1px solid var(--border-glass)',
                  marginBottom: '24px',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🧠</span>
                  <span>تفسیر روان‌شناختی وضعیت شما</span>
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.85, color: 'var(--text-secondary)', textAlign: 'justify', margin: 0 }}>
                  {levelInfo.analysis}
                </p>
              </div>

              {/* کارت تحلیل هوشمند و راهکارها */}
              <SmartAnalysisCard
                testType="CFI"
                data={{
                  score: totalScore,
                  alternatives: scoreAlternatives,
                  control: scoreControl,
                  justification: scoreJustification,
                }}
              />

              {/* جعبه رزرو مشاوره */}
              <div className="dass-cta-box" style={{ marginTop: '28px' }}>
                <h3>تمایل دارید مهارت‌های شناختی خود را ارتقا دهید؟</h3>
                <p>می‌توانید کارنامه خود را با روان‌شناسان و مشاوران شناختی پناه بررسی کنید.</p>
                <button
                  className="btn-primary-pill light-btn"
                  onClick={() => navigate('/assessments')}
                >
                  مشاهده متخصصان پناه
                </button>
              </div>

              {/* دکمه‌های اقدام */}
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
