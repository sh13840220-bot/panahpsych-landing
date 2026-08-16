import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';
import { SmartAnalysisCard } from '../components/SmartAnalysisCard';
import { saveAssessmentResult } from '../lib/saveAssessmentResult';

/* =========================================================================
   ۱. بانک ۲۱ علامت شایع اضطراب بک (BAI) و تفکیک ابعاد
   - علائم بدنی (somatic): 1, 2, 3, 6, 7, 11, 12, 13, 15, 18, 19, 20, 21 (۱۳ گویه - حداکثر ۳۹)
   - علائم ذهنی (cognitive): 4, 8, 10 (۳ گویه - حداکثر ۹)
   - علائم ترس و هراس (fear): 5, 9, 14, 16, 17 (۵ گویه - حداکثر ۱۵)
   ========================================================================= */

export type BaiSubscale = 'somatic' | 'cognitive' | 'fear';

export interface BaiQuestion {
  id: number;
  text: string;
  subscale: BaiSubscale;
}

export const BAI_QUESTIONS: BaiQuestion[] = [
  { id: 1, text: 'کرختی و گزگز کردن (مورمور شدن دست و پا)', subscale: 'somatic' },
  { id: 2, text: 'احساس داغی و گرگرفتگی', subscale: 'somatic' },
  { id: 3, text: 'لرزش در پاها', subscale: 'somatic' },
  { id: 4, text: 'ناتوانی در رسیدن به آرامش و ریلکس شدن', subscale: 'cognitive' },
  { id: 5, text: 'ترس از وقوع حوادث بد و ناگوار', subscale: 'fear' },
  { id: 6, text: 'سرگیجه، منگی و سیاهی رفتن چشم‌ها', subscale: 'somatic' },
  { id: 7, text: 'تپش قلب شدید یا نفس‌نفس زدن', subscale: 'somatic' },
  { id: 8, text: 'حالت متغیر و بی‌ثباتی روانی/حرکتی', subscale: 'cognitive' },
  { id: 9, text: 'احساس وحشت‌زدگی و هراس شدید', subscale: 'fear' },
  { id: 10, text: 'احساس عصبی بودن و کلافگی', subscale: 'cognitive' },
  { id: 11, text: 'احساس خفگی و تنگی در گلو', subscale: 'somatic' },
  { id: 12, text: 'لرزش دست‌ها', subscale: 'somatic' },
  { id: 13, text: 'لرزش و رعشه در کل بدن', subscale: 'somatic' },
  { id: 14, text: 'ترس از دست دادن کنترل رفتار', subscale: 'fear' },
  { id: 15, text: 'به سختی نفس کشیدن و تنگی نفس', subscale: 'somatic' },
  { id: 16, text: 'ترس از مردن', subscale: 'fear' },
  { id: 17, text: 'احساس ترسیدگی (حالت مداوم ترس)', subscale: 'fear' },
  { id: 18, text: 'سوءهاضمه، دل‌پیچه و ناراحتی در ناحیه شکم', subscale: 'somatic' },
  { id: 19, text: 'احساس ضعف شدید یا از حال رفتن (غش کردن)', subscale: 'somatic' },
  { id: 20, text: 'سرخ شدن صورت', subscale: 'somatic' },
  { id: 21, text: 'عرق کردن زیاد (نه در اثر گرما)', subscale: 'somatic' },
];

export const BAI_OPTIONS = [
  { val: 0, label: '۰. اصلاً (اصلاً این علامت را نداشته‌ام)' },
  { val: 1, label: '۱. خفیف (وجود داشته اما زیاد ناراحتم نکرده است)' },
  { val: 2, label: '۲. متوسط (ناخوشایند بوده اما قابل تحمل است)' },
  { val: 3, label: '۳. شدید (بسیار شدید بوده و نمی‌توانم تحمل کنم)' },
];

export const SUBSCALE_META: Record<BaiSubscale, { title: string; desc: string; max: number; count: number; color: string }> = {
  somatic: {
    title: 'علائم بدنی و فیزیولوژیک (Somatic)',
    desc: '۱۳ گویه (تپش قلب، لرزش، تنفس، سرگیجه، عرق، سوءهاضمه و گرگرفتگی)',
    max: 39,
    count: 13,
    color: 'var(--color-primary)',
  },
  cognitive: {
    title: 'علائم ذهنی و شناختی (Cognitive)',
    desc: '۳ گویه (ناتوانی در آرامش، بی‌ثباتی، عصبی بودن و کلافگی)',
    max: 9,
    count: 3,
    color: 'var(--color-accent)',
  },
  fear: {
    title: 'علائم ترس و هراس (Panic / Fear)',
    desc: '۵ گویه (ترس از مرگ، حوادث ناگوار، از دست دادن کنترل و وحشت‌زدگی)',
    max: 15,
    count: 5,
    color: 'var(--status-cancelled-text)',
  },
};

function getBaiSeverity(score: number) {
  if (score <= 7) {
    return {
      level: 'هیچ یا کمترین حد اضطراب (Minimal Anxiety)',
      cls: 'level-normal',
      color: 'var(--color-primary)',
      badgeBg: 'var(--badge-inperson-bg)',
      analysis:
        'نمره اضطراب شما در محدوده کاملاً طبیعی و حداقل قرار دارد. این سطح نشان می‌دهد که در طول یک هفته گذشته علائم بدنی یا روانی آزاردهنده‌ای از اضطراب را تجربه نکرده‌اید و عملکرد روزمره شما تحت‌الشعاع تنش‌های مخرب قرار ندارد. تجارب استرس‌زای مقطعی شما متناسب با موقعیت‌های روزمره است.',
    };
  }
  if (score <= 15) {
    return {
      level: 'اضطراب خفیف (Mild Anxiety)',
      cls: 'level-mild',
      color: 'var(--color-accent)',
      badgeBg: 'var(--status-pending-bg)',
      analysis:
        'نمره شما نشان‌دهنده سطح خفیفی از اضطراب است. ممکن است گهگاه علائمی نظیر تپش قلب گذرا، دلشوره، یا تنش ذهنی را تجربه کنید اما این علائم مانع از جریان عادی زندگی شما نشده‌اند. استفاده از تکنیک‌های مدیریت استرس و ریلکسیشن می‌تواند از تشدید این حالت جلوگیری کند.',
    };
  }
  if (score <= 25) {
    return {
      level: 'اضطراب متوسط (Moderate Anxiety)',
      cls: 'level-moderate',
      color: 'var(--status-pending-text)',
      badgeBg: 'var(--status-pending-bg)',
      analysis:
        'نمره شما نشان‌دهنده سطح اضطراب متوسط است. علائم اضطرابی (به‌ویژه واکنش‌های فیزیولوژیک یا تنش‌های شناختی) در این سطح به طور ملموس باعث افت کیفیت تمرکز، خستگی بدنی یا پریشانی روانی می‌شوند. توصیه می‌شود ضمن بازبینی عوامل تنش‌زا، تمرینات بازسازی شناختی و تکنیک‌های آرام‌سازی را پیگیری نمایید.',
    };
  }
  return {
    level: 'اضطراب شدید (Severe Anxiety)',
    cls: 'level-extreme',
    color: 'var(--status-cancelled-text)',
    badgeBg: 'var(--status-cancelled-bg)',
    analysis:
      'نمره شما نشان‌دهنده اضطراب شدید و نیازمند توجه بالینی است. در این سطح، فرد معمولاً واکنش‌های شدید بدنی (مانند احساس خفگی، لرزش، گرگرفتگی، تپش قلب شدید) یا هراس‌های روانی مداوم (ترس از دست دادن کنترل، وحشت‌زدگی یا ترس از وقوع حادثه بد) را تجربه می‌کند. مراجعه به یک روان‌شناس یا مشاور بالینی جهت ارزیابی دقیق‌تر و دریافت مداخلات شناختی-رفتاری (CBT) اکیداً توصیه می‌شود.',
  };
}

export function BaiQuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const resultSavedRef = useRef(false);

  const [screen, setScreen] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [consent, setConsent] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(BAI_QUESTIONS.length).fill(null));

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

    // انتقال خودکار پس از ۲۲۰ میلی‌ثانیه
    if (currentIndex < BAI_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 220);
    }
  };

  const handleNext = () => {
    if (answers[currentIndex] === null) {
      alert('لطفاً شدت علامت را از بین ۴ گزینه انتخاب کنید.');
      return;
    }
    if (currentIndex < BAI_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const unanswered = answers.findIndex((a) => a === null);
      if (unanswered !== -1) {
        alert(`علامت شماره ${unanswered + 1} هنوز بی‌پاسخ مانده است.`);
        setCurrentIndex(unanswered);
        return;
      }
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
    setAnswers(new Array(BAI_QUESTIONS.length).fill(null));
    setConsent(false);
    setScreen('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // محاسبه نمرات
  const totalScore = answers.reduce<number>((sum, v) => sum + (v ?? 0), 0);
  const severity = getBaiSeverity(totalScore);

  let scoreSomatic = 0;
  let scoreCognitive = 0;
  let scoreFear = 0;

  BAI_QUESTIONS.forEach((q, idx) => {
    const val = answers[idx] ?? 0;
    if (q.subscale === 'somatic') scoreSomatic += val;
    else if (q.subscale === 'cognitive') scoreCognitive += val;
    else if (q.subscale === 'fear') scoreFear += val;
  });

  const answeredCount = answers.filter((a) => a !== null).length;
  const currentQ = BAI_QUESTIONS[currentIndex];

  useEffect(() => {
    if (screen !== 'result') return;
    if (resultSavedRef.current) return;

    resultSavedRef.current = true;

    saveAssessmentResult({
      testType: 'BAI (اضطراب بک)',
      result: `نمره کل: ${totalScore} از ۶۳ (${severity.level}) | بدنی: ${scoreSomatic}/۳۹، شناختی: ${scoreCognitive}/۹، هراس: ${scoreFear}/۱۵`,
    });
  }, [screen, totalScore, severity.level, scoreSomatic, scoreCognitive, scoreFear]);

  return (
    <>
      <main className="container" style={{ paddingTop: '110px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '20px' }}>
            <Link to="/assessments" className="back-link">
              ← بازگشت به لیست آزمون‌های روانشناسی
            </Link>
          </div>

          {/* =========================================================
              ۱. صفحه شروع و راهنما
             ========================================================= */}
          {screen === 'intro' && (
            <Reveal className="dass-card glass">
              <div className="meta-pills">
                <span className="pill">مدت زمان: ۵ الی ۸ دقیقه</span>
                <span className="pill">۲۱ علامت بالینی</span>
                <span className="pill">مقیاس استاندارد آرون بک</span>
              </div>

              <h1 className="dass-title">پرسشنامه اضطراب بک (BAI)</h1>
              <p className="dass-subtitle">
                پرسشنامه استاندارد خودگزارشی سنجش شدت نشانه‌های اضطراب در ۳ بُعد علائم بدنی، ذهنی و هراس در طول یک هفته گذشته
              </p>

              <div className="dass-disclaimer">
                ⚠️ این پرسشنامه یک ابزار معتبر <strong>غربالگری و سنجش شدت اضطراب</strong> است و نتیجه آن جایگزین معاینه و تشخیص تخصصی روان‌پزشک یا روان‌شناس بالینی نیست.
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                  gap: '14px',
                  margin: '20px 0',
                }}
              >
                <div
                  style={{
                    background: 'var(--header-bg)',
                    padding: '14px',
                    borderRadius: '14px',
                    textAlign: 'center',
                    border: '1px solid var(--border-glass)',
                  }}
                >
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>تعداد گویه‌ها</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-dark)', marginTop: '4px' }}>
                    ۲۱ علامت شایع
                  </div>
                </div>
                <div
                  style={{
                    background: 'var(--header-bg)',
                    padding: '14px',
                    borderRadius: '14px',
                    textAlign: 'center',
                    border: '1px solid var(--border-glass)',
                  }}
                >
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>طیف پاسخ‌دهی</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-dark)', marginTop: '4px' }}>
                    ۰ تا ۳ (شدت ناراحتی)
                  </div>
                </div>
                <div
                  style={{
                    background: 'var(--header-bg)',
                    padding: '14px',
                    borderRadius: '14px',
                    textAlign: 'center',
                    border: '1px solid var(--border-glass)',
                  }}
                >
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>دامنه نمره کل</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-dark)', marginTop: '4px' }}>
                    ۰ الی ۶۳ نمره
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--header-bg)',
                  padding: '18px 20px',
                  borderRadius: '16px',
                  border: '1px solid var(--border-glass)',
                  marginBottom: '20px',
                }}
              >
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  ۳ بُعد اختصاصی مورد سنجش در این مقیاس:
                </h3>
                <ul style={{ paddingRight: '20px', fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.9' }}>
                  <li>
                    <strong style={{ color: 'var(--text-primary)' }}>۱. علائم بدنی و فیزیولوژیک (۱۳ گویه):</strong> تپش قلب، لرزش، گرگرفتگی، احساس خفگی، بی‌حسی، تعریق و...
                  </li>
                  <li>
                    <strong style={{ color: 'var(--text-primary)' }}>۲. علائم ذهنی و شناختی (۳ گویه):</strong> ناتوانی در رسیدن به آرامش، بی‌ثباتی روانی/حرکتی و احساس عصبی بودن.
                  </li>
                  <li>
                    <strong style={{ color: 'var(--text-primary)' }}>۳. علائم ترس و هراس (۵ گویه):</strong> ترس از وقوع رویدادهای ناگوار، ترس از مرگ، از دست دادن کنترل و وحشت‌زدگی.
                  </li>
                </ul>
              </div>

              {!user && (
                <div
                  style={{
                    marginBottom: '16px',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    background: 'var(--icon-bg)',
                    border: '1px solid var(--border-glass)',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                  }}
                >
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
                  توضیحات و دستورالعمل آزمون را مطالعه نمودم و مایل به پاسخ‌گویی به ۲۱ علامت اضطراب هستم.
                </span>
              </label>

              <button
                type="button"
                className="btn-primary-pill"
                onClick={handleStart}
                disabled={!consent}
                style={{
                  width: '100%',
                  marginTop: '16px',
                  opacity: !consent ? 0.6 : 1,
                  cursor: !consent ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  padding: '14px 28px',
                }}
              >
                شروع پرسشنامه اضطراب بک (۲۱ علامت)
              </button>
            </Reveal>
          )}

          {/* =========================================================
              ۲. صفحه اجرای سؤالات
             ========================================================= */}
          {screen === 'quiz' && (
            <Reveal className="dass-card glass">
              
              {/* نوار پیشرفت */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span>
                    علامت <strong style={{ color: 'var(--text-primary)' }}>{currentQ.id}</strong> از ۲۱
                  </span>
                  <span>{Math.round(((currentIndex + 1) / BAI_QUESTIONS.length) * 100)}٪</span>
                </div>
                <div className="progress-bar-track" style={{ height: '8px', background: 'var(--header-bg)' }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${((currentIndex + 1) / BAI_QUESTIONS.length) * 100}%`,
                      background: 'var(--color-primary)',
                    }}
                  />
                </div>
              </div>

              {/* بخش سؤال */}
              <div style={{ minHeight: '260px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    marginBottom: '12px',
                    background: 'var(--icon-bg)',
                    color: 'var(--color-primary-dark)',
                    border: '1px solid var(--border-glass)',
                  }}
                >
                  {SUBSCALE_META[currentQ.subscale].title}
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  در طول یک هفته گذشته تا امروز، چقدر از علامت زیر احساس ناراحتی کرده‌اید؟
                </div>

                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '24px', lineHeight: '1.65' }}>
                  {currentQ.text}
                </h2>

                {/* گزینه‌ها */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {BAI_OPTIONS.map((opt) => {
                    const isSelected = answers[currentIndex] === opt.val;
                    return (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => handleSelectOption(opt.val)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 18px',
                          borderRadius: '14px',
                          border: isSelected ? '2px solid var(--color-primary-dark)' : '1px solid var(--border-glass)',
                          background: isSelected ? 'var(--badge-inperson-bg)' : 'var(--header-bg)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          textAlign: 'right',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <span style={{ fontSize: '15px', fontWeight: isSelected ? 700 : 500 }}>
                          {opt.label}
                        </span>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: '6px',
                            background: isSelected ? 'var(--color-primary)' : 'var(--border-glass)',
                            color: isSelected ? 'var(--bg-main)' : 'var(--text-secondary)',
                          }}
                        >
                          {opt.val} نمره
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* دکمه‌های ناوبری */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="btn-outline-pill"
                  style={{ opacity: currentIndex === 0 ? 0.4 : 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
                >
                  ← علامت قبلی
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary-pill"
                >
                  {currentIndex === BAI_QUESTIONS.length - 1 ? 'مشاهده و تحلیل کارنامه' : 'علامت بعدی →'}
                </button>
              </div>

              {/* نقشه سریع ۲۱ سؤال */}
              <div
                style={{
                  marginTop: '28px',
                  padding: '16px',
                  background: 'var(--header-bg)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-glass)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  <span>وضعیت پاسخ‌گویی به علائم:</span>
                  <span>{answeredCount} از ۲۱ پاسخ داده شده</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(32px, 1fr))', gap: '6px' }}>
                  {BAI_QUESTIONS.map((q, idx) => {
                    const isAnswered = answers[idx] !== null;
                    const isCurrent = idx === currentIndex;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        style={{
                          height: '32px',
                          borderRadius: '8px',
                          border: isCurrent ? '2px solid var(--color-primary-dark)' : '1px solid var(--border-glass)',
                          background: isCurrent ? 'var(--color-primary-dark)' : isAnswered ? 'var(--badge-inperson-bg)' : 'var(--bg-main)',
                          color: isCurrent ? '#ffffff' : isAnswered ? 'var(--color-primary-dark)' : 'var(--text-secondary)',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
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

          {/* =========================================================
              ۳. کارنامه جامع و تحلیل بالینی بک
             ========================================================= */}
          {screen === 'result' && (
            <Reveal className="dass-card glass">
              
              {/* بنر امتیاز کل */}
              <div
                style={{
                  borderRadius: '20px',
                  padding: '36px 24px',
                  textAlign: 'center',
                  background: 'var(--header-bg)',
                  border: '1px solid var(--border-glass)',
                  marginBottom: '28px',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  نمره کل مقیاس اضطراب بک (BAI)
                </div>
                <div style={{ fontSize: '52px', fontWeight: 900, color: 'var(--color-primary-dark)', lineHeight: '1.1', marginBottom: '8px' }}>
                  {totalScore} <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-secondary)' }}>از ۶۳</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: severity.color, marginBottom: '10px' }}>
                  {severity.level}
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '6px 18px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: severity.badgeBg,
                    color: severity.color,
                  }}
                >
                  دامنه استاندارد نمره‌گذاری: ۰–۷ کمترین، ۸–۱۵ خفیف، ۱۶–۲۵ متوسط، ۲۶–۶۳ شدید
                </div>
              </div>

              {/* تفکیک ۳ بُعد اضطراب */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
                  📊 تفکیک نمرات در ابعاد سه‌گانه اضطراب بک
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  
                  {/* بُعد بدنی */}
                  <div
                    style={{
                      background: 'var(--header-bg)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '16px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                        علائم بدنی و فیزیولوژیک
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.6' }}>
                        ۱۳ گویه (تپش قلب، لرزش، تنفس، سرگیجه، عرق و گرگرفتگی)
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800, marginBottom: '6px' }}>
                        <span>نمره کسب‌شده:</span>
                        <span style={{ color: 'var(--color-primary-dark)' }}>{scoreSomatic} از ۳۹</span>
                      </div>
                      <div className="progress-bar-track" style={{ height: '8px', background: 'var(--bg-main)' }}>
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${Math.round((scoreSomatic / 39) * 100)}%`,
                            background: 'var(--color-primary)',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* بُعد ذهنی */}
                  <div
                    style={{
                      background: 'var(--header-bg)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '16px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                        علائم ذهنی و شناختی
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.6' }}>
                        ۳ گویه (ناتوانی در آرامش، بی‌ثباتی، عصبی بودن و کلافگی)
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800, marginBottom: '6px' }}>
                        <span>نمره کسب‌شده:</span>
                        <span style={{ color: 'var(--color-primary-dark)' }}>{scoreCognitive} از ۹</span>
                      </div>
                      <div className="progress-bar-track" style={{ height: '8px', background: 'var(--bg-main)' }}>
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${Math.round((scoreCognitive / 9) * 100)}%`,
                            background: 'var(--color-accent)',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* بُعد ترس و هراس */}
                  <div
                    style={{
                      background: 'var(--header-bg)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '16px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                        علائم ترس و هراس
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.6' }}>
                        ۵ گویه (ترس از مرگ، حوادث بد، کنترل و وحشت‌زدگی)
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800, marginBottom: '6px' }}>
                        <span>نمره کسب‌شده:</span>
                        <span style={{ color: 'var(--color-primary-dark)' }}>{scoreFear} از ۱۵</span>
                      </div>
                      <div className="progress-bar-track" style={{ height: '8px', background: 'var(--bg-main)' }}>
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${Math.round((scoreFear / 15) * 100)}%`,
                            background: 'var(--status-cancelled-text)',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* تحلیل بالینی نمره */}
              <div
                style={{
                  background: 'var(--header-bg)',
                  borderRadius: '16px',
                  padding: '22px',
                  border: '1px solid var(--border-glass)',
                  marginBottom: '24px',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  🧠 تحلیل بالینی و سطح‌بندی شدت اضطراب شما
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.85', textAlign: 'justify', margin: 0 }}>
                  {severity.analysis}
                </p>
              </div>

              {/* کارت تحلیل هوشمند هوش مصنوعی پناه */}
              <div style={{ marginBottom: '24px' }}>
                <SmartAnalysisCard
                  testType="BAI (اضطراب بک)"
                  testResult={`نمره کل اضطراب بک: ${totalScore} از ۶۳ (${severity.level}). بُعد بدنی: ${scoreSomatic} از ۳۹، بُعد شناختی: ${scoreCognitive} از ۹، بُعد ترس و هراس: ${scoreFear} از ۱۵.`}
                  userAnswers={answers.map((v, i) => `${BAI_QUESTIONS[i].text}: ${v !== null ? BAI_OPTIONS[v]?.label : 'بدون پاسخ'}`)}
                />
              </div>

              {/* جدول تمایز استرس و اضطراب */}
              <div
                style={{
                  background: 'var(--header-bg)',
                  borderRadius: '16px',
                  padding: '22px',
                  border: '1px solid var(--border-glass)',
                  marginBottom: '24px',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  📘 تفاوت کلیدی استرس و اضطراب (راهنمای خودشناسی)
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  درک تمایز این دو حالت هیجانی به مدیریت هدفمندتر آن‌ها کمک شایانی می‌کند:
                </p>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'right' }}>
                    <thead>
                      <tr style={{ background: 'var(--icon-bg)', borderBottom: '1px solid var(--border-glass)' }}>
                        <th style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--text-primary)' }}>ویژگی</th>
                        <th style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--text-primary)' }}>استرس (Stress)</th>
                        <th style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--text-primary)' }}>اضطراب (Anxiety)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>منبع و محرک</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>دارای علت مشخص، بیرونی و روشن (امتحان، رانندگی، سخنرانی)</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>منشأ مبهم، ناشناخته یا فاقد تناسب منطقی با موقعیت</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>کارکرد و ماهیت</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>میزان کم آن سازنده است و به اقدام و هوشیاری کمک می‌کند</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>جنبه مثبتی ندارد و باعث فرسایش و احساس درماندگی می‌شود</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>مدت زمان بقا</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>با رفع عامل استرس‌زا یا اتمام موقعیت، محو می‌شود</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>حتی پس از پایان موقعیت باقی مانده و تنش فکری ایجاد می‌کند</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* راهکارهای علمی کنترل و کاهش اضطراب */}
              <div
                style={{
                  background: 'var(--badge-inperson-bg)',
                  borderRadius: '16px',
                  padding: '22px',
                  border: '1px solid var(--border-glass)',
                  marginBottom: '28px',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '12px' }}>
                  🌿 راهکارهای علمی کنترل و کاهش علائم اضطراب
                </h3>
                <ul style={{ paddingRight: '20px', fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: '1.9' }}>
                  <li>
                    <strong>تکنیک تنفس دیافراگمی (تنفس ۴-۷-۸):</strong> ۴ ثانیه دم عمیق از بینی، ۷ ثانیه حبس نفس و ۸ ثانیه بازدم آرام از دهان جهت مهار تحریک سیستم عصبی سمپاتیک.
                  </li>
                  <li>
                    <strong>تن‌آرامی پیش‌رونده جاکوبسن (PMR):</strong> انقباض و سپس رهاسازی عضلات از پاها تا صورت جهت کاهش علائم تنش بدنی.
                  </li>
                  <li>
                    <strong>بازداری از فاجعه‌سازی (CBT):</strong> افکار ترس‌آور را به چالش بکشید؛ از خود بپرسید: «واقعاً بدترین اتفاقی که ممکن است رخ دهد چیست و چقدر احتمال دارد؟»
                  </li>
                  <li>
                    <strong>کاهش مصرف محرک‌ها:</strong> کافئین، نوشیدنی‌های انرژی‌زا و نیکوتین ضربان قلب را بالا برده و علائم حمله اضطرابی را تشدید می‌کنند.
                  </li>
                </ul>
              </div>

              {/* دکمه‌های اقدام */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-primary-pill"
                  onClick={() => window.print()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 26px' }}
                >
                  🖨️ چاپ / ذخیره فایل PDF کارنامه
                </button>
                <button
                  type="button"
                  className="btn-outline-pill"
                  onClick={handleRestart}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 26px' }}
                >
                  🔄 شروع مجدد آزمون
                </button>
              </div>

            </Reveal>
          )}

        </div>
      </main>
      <Footer isShort={true} />
    </>
  );
}
