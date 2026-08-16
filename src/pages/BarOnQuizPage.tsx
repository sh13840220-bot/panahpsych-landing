import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';
import { SmartAnalysisCard } from '../components/SmartAnalysisCard';
import { saveAssessmentResult } from '../lib/saveAssessmentResult';

/* =========================================================================
   ۱. بانک اطلاعاتی ۹۰ گویه استاندارد پرسشنامه هوش هیجانی بار-آن (Bar-On EQ-i)
   شامل ۱۵ خرده‌مقیاس در ۵ حیطه کلی
   ========================================================================= */
export type BarOnScaleKey =
  | 'ES' | 'AS' | 'SR' | 'SA' | 'IN'
  | 'EM' | 'IR' | 'RE'
  | 'PS' | 'RT' | 'FL'
  | 'ST' | 'IC'
  | 'OP' | 'HA';

export type BarOnCompositeKey = 'intrapersonal' | 'interpersonal' | 'adaptability' | 'stress' | 'generalMood';

export interface BarOnQuestion {
  id: number;
  text: string;
  scale: BarOnScaleKey;
  reverse: boolean;
}

export const BARON_QUESTIONS: BarOnQuestion[] = [
  { id: 1,  text: 'به نظر من برای غلبه بر مشکلات باید گام به گام پیش رفت.', scale: 'PS', reverse: false },
  { id: 2,  text: 'لذت بردن از زندگی برایم مشکل است.', scale: 'HA', reverse: true },
  { id: 3,  text: 'شغلی را ترجیح می‌دهم که حتی‌الامکان، من تصمیم گیرنده باشم.', scale: 'IN', reverse: false },
  { id: 4,  text: 'می‌توانم بدون تنش زاید، با مشکلات مقابله کنم.', scale: 'ST', reverse: false },
  { id: 5,  text: 'می‌توانم برای معنی دادن به زندگی تا حد امکان تلاش کنم.', scale: 'SA', reverse: false },
  { id: 6,  text: 'نسبت به هیجان‌هایم آگاهی دارم.', scale: 'ES', reverse: false },
  { id: 7,  text: 'سعی می‌کنم بدون خیال‌پردازی، واقعیت امور را در نظر بگیرم.', scale: 'RT', reverse: false },
  { id: 8,  text: 'به راحتی با دیگران دوست می‌شوم.', scale: 'IR', reverse: false },
  { id: 9,  text: 'معتقدم توانایی تسلط بر شرایط دشوار را دارم.', scale: 'OP', reverse: false },
  { id: 10, text: 'بیشتر مواقع به خودم اطمینان دارم.', scale: 'SR', reverse: false },
  { id: 11, text: 'کنترل خشم برایم مشکل است.', scale: 'IC', reverse: true },
  { id: 12, text: 'شروع دوباره برایم سخت است.', scale: 'FL', reverse: true },
  { id: 13, text: 'کمک کردن به دیگران را دوست دارم.', scale: 'RE', reverse: false },
  { id: 14, text: 'بخوبی می‌توانم احساسات دیگران را درک کنم.', scale: 'EM', reverse: false },
  { id: 15, text: 'هنگامی که از دیگران خشمگین می‌شوم، نمی‌توانم با آن‌ها در این مورد بحث کنم.', scale: 'AS', reverse: true },
  { id: 16, text: 'هنگام رویارویی با یک موقعیت دشوار، دوست دارم تا حد ممکن در مورد آن اطلاعات جمع‌آوری کنم.', scale: 'PS', reverse: false },
  { id: 17, text: 'خندیدن برایم سخت است.', scale: 'HA', reverse: true },
  { id: 18, text: 'هنگام کار کردن با دیگران، بیشتر پیرو افکار آن‌ها هستم تا خودم.', scale: 'IN', reverse: true },
  { id: 19, text: 'نمی‌توانم بخوبی فشارها را تحمل کنم.', scale: 'ST', reverse: true },
  { id: 20, text: 'در چند سال گذشته کمتر کاری را به نتیجه رسانده‌ام.', scale: 'SA', reverse: true },
  { id: 21, text: 'به سختی می‌توانم احساسات عمیقم را با دیگران در میان بگذارم.', scale: 'ES', reverse: true },
  { id: 22, text: 'دیگران نمی‌فهمند که من چه فکری دارم.', scale: 'RT', reverse: true },
  { id: 23, text: 'به خوبی با دیگران همراهی می‌کنم.', scale: 'IR', reverse: false },
  { id: 24, text: 'به اغلب کارهایی که انجام می‌دهم خوش‌بین هستم.', scale: 'OP', reverse: false },
  { id: 25, text: 'برای خودم احترام قائل هستم.', scale: 'SR', reverse: false },
  { id: 26, text: 'عصبی بودنم مشکل ایجاد می‌کند.', scale: 'IC', reverse: true },
  { id: 27, text: 'به سختی می‌توانم فکرم را در مورد مسائل تغییر دهم.', scale: 'FL', reverse: true },
  { id: 28, text: 'کمک به دیگران مرا کسل نمی‌کند، بخصوص اگر شایستگی آن را داشته باشم.', scale: 'RE', reverse: false },
  { id: 29, text: 'دوستانم می‌توانند مسائل خصوصی خودشان را با من در میان بگذارند.', scale: 'EM', reverse: false },
  { id: 30, text: 'می‌توانم مخالفتم را با دیگران ابراز نمایم.', scale: 'AS', reverse: false },
  { id: 31, text: 'هنگام مواجهه با یک مشکل، اولین کاری که انجام می‌دهم دست نگه داشتن و فکر کردن است.', scale: 'PS', reverse: false },
  { id: 32, text: 'فرد با نشاطی هستم.', scale: 'HA', reverse: false },
  { id: 33, text: 'ترجیح می‌دهم دیگران برایم تصمیم بگیرند.', scale: 'IN', reverse: true },
  { id: 34, text: 'احساس می‌کنم کنترل اضطراب برایم مشکل است.', scale: 'ST', reverse: true },
  { id: 35, text: 'از کارهایی که انجام می‌دهم راضی نیستم.', scale: 'SA', reverse: true },
  { id: 36, text: 'به سختی می‌فهمم چه احساسی دارم.', scale: 'ES', reverse: true },
  { id: 37, text: 'تمایل دارم با آن چه در اطرافم می‌گذرد روبه‌رو نشوم و از برخورد با آن‌ها طفره می‌روم.', scale: 'RT', reverse: true },
  { id: 38, text: 'روابط صمیمی با دوستانم برای هر دو طرفمان اهمیت دارد.', scale: 'IR', reverse: false },
  { id: 39, text: 'حتی در موقعیت‌های دشوار، معمولاً برای ادامه کار انگیزه دارم.', scale: 'OP', reverse: false },
  { id: 40, text: 'نمی‌توانم خودم را این‌طور که هستم بپذیرم.', scale: 'SR', reverse: true },
  { id: 41, text: 'دیگران به من می‌گویند هنگام بحث، آرام‌تر صحبت کنم.', scale: 'IC', reverse: true },
  { id: 42, text: 'به آسانی با شرایط جدید سازگار می‌شوم.', scale: 'FL', reverse: false },
  { id: 43, text: 'به کودک گمشده کمک می‌کنم، حتی اگر همان موقع جای دیگری کار داشته باشم.', scale: 'RE', reverse: false },
  { id: 44, text: 'به اتفاقی که برای دیگران می‌افتد، توجه دارم.', scale: 'EM', reverse: false },
  { id: 45, text: '"نه گفتن" برایم مشکل است.', scale: 'AS', reverse: true },
  { id: 46, text: 'هنگام تلاش برای حل یک مشکل، راه‌حل‌های ممکن را در نظر می‌آورم، سپس بهترین را انتخاب می‌کنم.', scale: 'PS', reverse: false },
  { id: 47, text: 'از زندگی‌ام راضیم.', scale: 'HA', reverse: false },
  { id: 48, text: 'تصمیم‌گیری برایم مشکل است.', scale: 'IN', reverse: true },
  { id: 49, text: 'می‌دانم در شرایط دشوار چگونه آرامشم را حفظ کنم.', scale: 'ST', reverse: false },
  { id: 50, text: 'هیچ چیز در من علاقه ایجاد نمی‌کند.', scale: 'SA', reverse: true },
  { id: 51, text: 'از احساسی که دارم آگاهم.', scale: 'ES', reverse: false },
  { id: 52, text: 'در تصورات و خیال‌پردازی‌هایم غرق می‌شوم.', scale: 'RT', reverse: true },
  { id: 53, text: 'با دیگران رابطه خوبی دارم.', scale: 'IR', reverse: false },
  { id: 54, text: 'معمولاً انتظار دارم مشکلات به خوبی ختم شوند، هر چند گاهی چنین نمی‌شود.', scale: 'OP', reverse: false },
  { id: 55, text: 'از اندام و ظاهر خود راضی هستم.', scale: 'SR', reverse: false },
  { id: 56, text: 'کم‌صبر هستم.', scale: 'IC', reverse: true },
  { id: 57, text: 'می‌توانم عادات قبلی‌ام را تغییر دهم.', scale: 'FL', reverse: false },
  { id: 58, text: 'اگر لازم باشد با زیر پا گذاشتن قانون از موقعیتی فرار کنم، این کار را انجام می‌دهم.', scale: 'RE', reverse: true },
  { id: 59, text: 'نسبت به احساسات دیگران حساس هستم.', scale: 'EM', reverse: false },
  { id: 60, text: 'می‌توانم به راحتی افکارم را به دیگران بگویم.', scale: 'AS', reverse: false },
  { id: 61, text: 'هنگام حل مسائل، به سختی می‌توانم در مورد انتخاب بهترین راه‌حل تصمیم‌گیری کنم.', scale: 'PS', reverse: true },
  { id: 62, text: 'اهل شوخی هستم.', scale: 'HA', reverse: false },
  { id: 63, text: 'در انجام دادن کارها و امور مختلف به دیگران وابسته‌ام.', scale: 'IN', reverse: true },
  { id: 64, text: 'رویارویی با مسائل ناخوشایند برایم مشکل است.', scale: 'ST', reverse: true },
  { id: 65, text: 'حتی‌الامکان کارهایی را به عهده می‌گیرم که برایم لذت‌بخش هستند.', scale: 'SA', reverse: false },
  { id: 66, text: 'حتی هنگام آشفتگی از آنچه در من اتفاق می‌افتد، آگاهم.', scale: 'ES', reverse: false },
  { id: 67, text: 'تمایل به مبالغه‌گویی دارم.', scale: 'RT', reverse: true },
  { id: 68, text: 'به نظر دیگران، من فردی اجتماعی هستم.', scale: 'IR', reverse: false },
  { id: 69, text: 'به توانایی‌ام برای مقابله با دشوارترین مسائل اطمینان دارم.', scale: 'OP', reverse: false },
  { id: 70, text: 'از شیوه نگرش و فکرم راضی هستم.', scale: 'SR', reverse: false },
  { id: 71, text: 'بدجوری خشمگین می‌شوم.', scale: 'IC', reverse: true },
  { id: 72, text: 'معمولاً ایجاد تغییر در زندگی روزانه برایم سخت است.', scale: 'FL', reverse: true },
  { id: 73, text: 'قادر هستم احترام به دیگران را حفظ کنم.', scale: 'RE', reverse: false },
  { id: 74, text: 'دیدن رنج دیگران برایم سخت است.', scale: 'EM', reverse: false },
  { id: 75, text: 'به نظر دیگران، من نمی‌توانم احساسات و افکارم را بروز دهم.', scale: 'AS', reverse: true },
  { id: 76, text: 'هنگام روبه‌رو شدن با شرایط دشوار سعی می‌کنم در مورد راه‌حل‌های ممکن فکر کنم.', scale: 'PS', reverse: false },
  { id: 77, text: 'افسرده هستم.', scale: 'HA', reverse: true },
  { id: 78, text: 'فکر می‌کنم من به دیگران بیشتر احتیاج دارم تا دیگران به من.', scale: 'IN', reverse: true },
  { id: 79, text: 'مضطرب هستم.', scale: 'ST', reverse: true },
  { id: 80, text: 'در مورد آنچه می‌خواهم در زندگی انجام دهم، فکر مشخص و خوبی ندارم.', scale: 'SA', reverse: true },
  { id: 81, text: 'به سختی می‌توانم از امور برداشت صحیحی داشته باشم.', scale: 'RT', reverse: true },
  { id: 82, text: 'به سختی می‌توانم احساساتم را بیان کنم.', scale: 'ES', reverse: true },
  { id: 83, text: 'با دوستانم رابطه صمیمی برقرار می‌کنم.', scale: 'IR', reverse: false },
  { id: 84, text: 'قبل از شروع کارهای جدید معمولاً احساس می‌کنم شکست خواهم خورد.', scale: 'OP', reverse: true },
  { id: 85, text: 'هنگام بررسی نقاط ضعف و قوتم باز هم در مورد خودم احساس خوبی دارم.', scale: 'SR', reverse: false },
  { id: 86, text: 'هنگام عصبانیت زود از کوره در می‌روم.', scale: 'IC', reverse: true },
  { id: 87, text: 'اگر مجبور به ترک وطنم باشم، سازگاری برایم دشوار خواهد بود.', scale: 'FL', reverse: true },
  { id: 88, text: 'به نظر من پایبندی یک شهروند به قانون مهم است.', scale: 'RE', reverse: false },
  { id: 89, text: 'از جریحه‌دار کردن احساسات دیگران خودداری می‌کنم.', scale: 'EM', reverse: false },
  { id: 90, text: 'مشکل می‌توانم از حق خودم دفاع کنم.', scale: 'AS', reverse: true }
];

export const BARON_OPTIONS = [
  { val: 1, label: '۱. کاملاً مخالفم' },
  { val: 2, label: '۲. مخالفم' },
  { val: 3, label: '۳. نظری ندارم' },
  { val: 4, label: '۴. موافقم' },
  { val: 5, label: '۵. کاملاً موافقم' }
];

export const SCALES_INFO: Record<BarOnScaleKey, { name: string; comp: BarOnCompositeKey; desc: string }> = {
  ES: { name: 'خودآگاهی هیجانی', comp: 'intrapersonal', desc: 'شناخت و آگاهی از احساسات و حالات درونی خود' },
  AS: { name: 'جرئت‌ورزی / خودابرازی', comp: 'intrapersonal', desc: 'ابراز احساسات، نظرات و دفاع از حقوق خود' },
  SR: { name: 'عزت‌نفس / احترام به خود', comp: 'intrapersonal', desc: 'پذیرش خود و احساس ارزشمندی درونی' },
  SA: { name: 'خودشکوفایی', comp: 'intrapersonal', desc: 'تلاش برای تحقق حداکثر استعدادها و اهداف فردی' },
  IN: { name: 'استقلال', comp: 'intrapersonal', desc: 'خودمختاری فکری و عدم وابستگی شدید به دیگران' },

  EM: { name: 'همدلی', comp: 'interpersonal', desc: 'درک، حساسیت و اهمیت قائل شدن برای احساسات دیگران' },
  IR: { name: 'روابط بین‌فردی', comp: 'interpersonal', desc: 'توانایی ایجاد و حفظ روابط رضایت‌بخش و صمیمانه' },
  RE: { name: 'مسئولیت‌پذیری اجتماعی', comp: 'interpersonal', desc: 'تعهد به جامعه، احترام به قانون و یاری‌رسانی' },

  PS: { name: 'حل مسئله', comp: 'adaptability', desc: 'برخورد منطقی و گام‌به‌گام با چالش‌های زندگی' },
  RT: { name: 'واقع‌گرایی (آزمون واقعیت)', comp: 'adaptability', desc: 'دیدن امور همان‌گونه که هستند بدون خیال‌پردازی' },
  FL: { name: 'انعطاف‌پذیری', comp: 'adaptability', desc: 'تطبیق آسان افکار و رفتار با تغییر شرایط' },

  ST: { name: 'تحمل فشار روانی', comp: 'stress', desc: 'کنترل اضطراب و حفظ آرامش در موقعیت‌های تنش‌زا' },
  IC: { name: 'کنترل تکانه', comp: 'stress', desc: 'مهار خشم و مقاومت در برابر واکنش‌های ناگهانی' },

  OP: { name: 'خوش‌بینی', comp: 'generalMood', desc: 'نگاه مثبت، امیدوارانه و سازنده به آینده' },
  HA: { name: 'شادکامی', comp: 'generalMood', desc: 'احساس رضایت از زندگی و نشاط درونی' }
};

export const COMPOSITES_INFO: Record<BarOnCompositeKey, { name: string; max: number; desc: string; icon: string }> = {
  intrapersonal: { name: 'مؤلفه درون‌فردی', max: 150, desc: 'مهارت‌های خودآگاهی، عزت‌نفس و خودمختاری', icon: '🧠' },
  interpersonal: { name: 'مؤلفه بین‌فردی', max: 90, desc: 'مهارت‌های همدلی، ارتباطات و تعهد اجتماعی', icon: '🤝' },
  adaptability:   { name: 'مؤلفه سازگاری / انطباق‌پذیری', max: 90, desc: 'توانایی واکنش به تغییرات و حل مسائل', icon: '🔄' },
  stress:         { name: 'مؤلفه مدیریت استرس', max: 60, desc: 'مهار هیجانات پرفشار و کنترل تکانه', icon: '🛡️' },
  generalMood:    { name: 'مؤلفه خلق عمومی', max: 60, desc: 'امیدواری، شادابی و رضایت درونی از زندگی', icon: '☀️' }
};

function getBarOnLevel(score: number) {
  if (score >= 380) {
    return {
      label: 'بسیار بالا (توانمندی و استعداد هیجانی-اجتماعی برجسته)',
      cls: 'level-normal',
      badgeBg: 'var(--badge-inperson-bg)',
      color: 'var(--color-primary)',
      analysis:
        'نمره کل هوش هیجانی شما در بالاترین چارک ارزیابی قرار دارد. شما از پختگی عاطفی، خودآگاهی عمیق و مهارت‌های ارتباطی و بین‌فردی فوق‌العاده‌ای برخوردارید. در مواجهه با بحران‌ها خونسردی خود را حفظ کرده، سریعاً با شرایط جدید سازگار می‌شوید و توانایی هدایت و اثرگذاری مثبت بر دیگران را دارا هستید.'
    };
  }
  if (score >= 320) {
    return {
      label: 'بالا / خوب (هوش هیجانی کارآمد و موفق)',
      cls: 'level-mild',
      badgeBg: 'var(--badge-online-bg)',
      color: 'var(--color-primary-dark)',
      analysis:
        'نمره کل شما نشان‌دهنده هوش هیجانی مطلوب و عملکرد بهینه در روابط و محیط کار است. شما در اکثر موقعیت‌ها قادر به مهار استرس، تصمیم‌گیری واقع‌بینانه و ابراز مناسب هیجانات خود هستید. با تقویت نقاط قابل رشد می‌توانید به اوج بهره‌وری فردی و حرفه‌ای برسید.'
    };
  }
  if (score >= 250) {
    return {
      label: 'متوسط / بهنجار (هوش هیجانی در حد معمول جامعه)',
      cls: 'level-mild',
      badgeBg: 'var(--status-pending-bg)',
      color: 'var(--color-accent)',
      analysis:
        'نمره کل شما در دامنه متوسط قرار دارد. شما توانایی‌های پایه‌ای در کنترل احساسات و تعامل با دیگران دارید؛ اما در شرایط فشار روانی بالا، ممکن است تکانشی عمل کرده یا دچار تردید و اضطراب شوید. ارتقای خودآگاهی و استقلال فکری به شما کمک می‌کند در مواجهه با چالش‌ها کارآمدتر عمل کنید.'
    };
  }
  return {
    label: 'پایین / نیازمند توسعه (آسیب‌پذیری هیجانی و ارتباطی)',
    cls: 'level-moderate',
    badgeBg: 'var(--status-cancelled-bg)',
    color: 'var(--status-cancelled-text)',
    analysis:
      'نمره کل شما نشان می‌دهد که در مدیریت هیجانات، روابط بین‌فردی و مواجهه با استرس‌ها با چالش‌هایی روبرو هستید. نمرات پایین معمولاً با تمایل به انفعال، پرخاشگری ناخواسته یا دشواری در انطباق با تغییرات همراه است. با آموزش و تمرین‌های خودشناسی، هوش هیجانی قابلیت ارتقای چشمگیری دارد.'
  };
}

export function BarOnQuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const resultSavedRef = useRef(false);

  const [screen, setScreen] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [consent, setConsent] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(BARON_QUESTIONS.length).fill(null));

  const handleStart = () => {
    if (!user) {
      navigate(`/auth-soon?redirect=${encodeURIComponent(location.pathname)}`, {
        state: { from: location.pathname }
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

    // Auto advance
    if (currentIndex < BARON_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 220);
    }
  };

  const handleNext = () => {
    if (answers[currentIndex] === null) {
      alert('لطفاً یکی از ۵ گزینه را برای این سؤال انتخاب نمایید.');
      return;
    }
    if (currentIndex < BARON_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const unanswered = answers.findIndex((a) => a === null);
      if (unanswered !== -1) {
        alert(`سؤال شماره ${unanswered + 1} هنوز بی‌پاسخ مانده است.`);
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
    setAnswers(new Array(BARON_QUESTIONS.length).fill(null));
    setConsent(false);
    setScreen('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculations
  let totalScore = 0;
  const subscaleScores: Record<BarOnScaleKey, number> = {
    ES: 0, AS: 0, SR: 0, SA: 0, IN: 0,
    EM: 0, IR: 0, RE: 0,
    PS: 0, RT: 0, FL: 0,
    ST: 0, IC: 0,
    OP: 0, HA: 0
  };

  const compositeScores: Record<BarOnCompositeKey, number> = {
    intrapersonal: 0,
    interpersonal: 0,
    adaptability: 0,
    stress: 0,
    generalMood: 0
  };

  BARON_QUESTIONS.forEach((q, idx) => {
    const raw = answers[idx] ?? 3;
    const itemScore = q.reverse ? 6 - raw : raw;

    totalScore += itemScore;
    subscaleScores[q.scale] += itemScore;
    compositeScores[SCALES_INFO[q.scale].comp] += itemScore;
  });

  const levelInfo = getBarOnLevel(totalScore);
  const answeredCount = answers.filter((a) => a !== null).length;

  useEffect(() => {
    if (screen !== 'result') return;
    if (resultSavedRef.current) return;

    resultSavedRef.current = true;

    saveAssessmentResult({
      testType: 'هوش هیجانی بار-آن (Bar-On EQ-i)',
      result: `نمره کل ${totalScore} از ۴۵۰ (${levelInfo.label}) | درون‌فردی: ${compositeScores.intrapersonal}/۱۵۰ | بین‌فردی: ${compositeScores.interpersonal}/۹۰ | سازگاری: ${compositeScores.adaptability}/۹۰ | مدیریت استرس: ${compositeScores.stress}/۶۰ | خلق عمومی: ${compositeScores.generalMood}/۶۰`
    });
  }, [screen, totalScore, levelInfo.label, compositeScores]);

  const currentQ = BARON_QUESTIONS[currentIndex];
  const currentScale = SCALES_INFO[currentQ.scale];

  return (
    <>
      <main className="container" style={{ paddingTop: '110px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>

          <div style={{ marginBottom: '20px' }}>
            <Link to="/assessments" className="back-link">
              ← بازگشت به لیست آزمون‌های روانشناسی
            </Link>
          </div>

          {/* =========================================================================
              صفحه ۱: معرفی و دستورالعمل آزمون
             ========================================================================= */}
          {screen === 'intro' && (
            <Reveal className="dass-card glass">
              <div className="meta-pills">
                <span className="pill">مدت زمان: ۱۵ الی ۲۵ دقیقه</span>
                <span className="pill">۹۰ سؤال (طیف ۵ درجه‌ای)</span>
                <span className="pill">مدل استاندارد روون بار-آن (Bar-On)</span>
                <span className="pill">رایگان</span>
              </div>

              <h1 className="dass-title">پرسشنامه جامع هوش هیجانی بار-آن (Bar-On EQ-i)</h1>
              <p className="dass-subtitle" style={{ textAlign: 'justify', lineHeight: 1.85 }}>
                مدل هوش هیجانی-اجتماعی بار-آن یکی از معتبرترین ابزارهای سنجش شایستگی‌ها و مهارت‌های عاطفی در دنیاست.
                این آزمون توانایی شما را در <strong>شناخت و هدایت هیجانات</strong>، <strong>روابط بین‌فردی مؤثر</strong>،
                <strong>انطباق با تغییرات</strong>، <strong>مدیریت استرس</strong> و <strong>امیدواری و شادکامی</strong> در قالب ۱۵ مقیاس تفکیکی می‌سنجد.
              </p>

              {/* ۵ حیطه اصلی */}
              <div style={{ margin: '24px 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                {Object.entries(COMPOSITES_INFO).map(([k, info]) => (
                  <div
                    key={k}
                    style={{
                      padding: '16px',
                      borderRadius: '14px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-glass)'
                    }}
                  >
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{info.icon}</span>
                      <span>{info.name}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {info.desc}
                    </div>
                  </div>
                ))}
              </div>

              <div className="dass-disclaimer">
                💡 این آزمون به منظور <strong>خودشناسی، توسعه فردی و شغلی و ارتقای شایستگی‌های هوش عاطفی</strong> طراحی شده است. هیچ پاسخ صحیح یا غلطی وجود ندارد؛ لطفاً با صداقت به گویه‌ها پاسخ دهید.
              </div>

              {!user && (
                <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '14px', background: 'var(--icon-bg)', border: '1px solid var(--border-glass)', fontSize: '14px', color: 'var(--text-primary)', textAlign: 'center' }}>
                  🔒 برای شرکت در آزمون و ثبت کارنامه در داشبورد کاربری، باید <strong>وارد حساب کاربری</strong> خود شوید.
                </div>
              )}

              <label className="dass-consent-label">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  با آگاهی از هدف خودشناسی و ارتقای مهارت‌های هوش هیجانی، آماده پاسخ‌دهی به ۹۰ سؤال هستم.
                </span>
              </label>

              <button
                className="btn-primary-pill"
                onClick={handleStart}
                disabled={!consent}
                style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
              >
                {user ? 'شروع آزمون جامع هوش هیجانی (۹۰ سؤال)' : 'ورود / ثبت‌نام برای شروع آزمون'}
              </button>
            </Reveal>
          )}

          {/* =========================================================================
              صفحه ۲: اجرای پرسشنامه
             ========================================================================= */}
          {screen === 'quiz' && (
            <Reveal className="dass-card glass">
              <div className="progress-header">
                <span>سؤال {currentIndex + 1} از {BARON_QUESTIONS.length}</span>
                <span>{Math.round(((currentIndex + 1) / BARON_QUESTIONS.length) * 100)}٪</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${((currentIndex + 1) / BARON_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* برچسب خرده‌مقیاس */}
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
                    gap: '6px'
                  }}
                >
                  <span>📌</span>
                  <span>{currentScale.name} ({COMPOSITES_INFO[currentScale.comp].name})</span>
                </span>
              </div>

              <div className="question-text" style={{ fontSize: '18.5px', fontWeight: 800, marginTop: '10px', marginBottom: '22px' }}>
                {currentQ.text}
              </div>

              {/* گزینه‌های ۵ درجه‌ای لیکرت */}
              <div className="options-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {BARON_OPTIONS.map((opt) => {
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
                        padding: '12px 18px'
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
                          color: isSelected ? 'var(--bg-main)' : 'var(--text-secondary)'
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
                  {currentIndex === BARON_QUESTIONS.length - 1 ? 'مشاهده و تحلیل کارنامه' : 'سؤال بعد'}
                </button>
              </div>

              {/* نقشه دسترسی سریع ۹۰ سؤال */}
              <div
                style={{
                  marginTop: '28px',
                  padding: '16px',
                  background: 'var(--header-bg)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-glass)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  <span>دسترسی سریع به ۹۰ گویه:</span>
                  <span>{answeredCount} از ۹۰ پاسخ داده شده</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(32px, 1fr))', gap: '5px', maxHeight: '160px', overflowY: 'auto', padding: '4px' }}>
                  {BARON_QUESTIONS.map((q, idx) => {
                    const isAns = answers[idx] !== null;
                    const isCurrent = idx === currentIndex;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`quiz-question-number-btn ${isCurrent ? 'is-current' : ''} ${isAns ? 'is-ans' : ''}`}
                        style={{
                          height: '30px',
                          borderRadius: '6px',
                          border: isCurrent ? '2px solid var(--color-primary)' : '1px solid var(--border-glass)',
                          background: isCurrent ? 'var(--btn-primary-bg)' : isAns ? 'var(--badge-inperson-bg)' : 'var(--bg-card)',
                          color: isCurrent ? 'var(--btn-primary-text)' : isAns ? 'var(--badge-inperson-text)' : 'var(--text-secondary)',
                          fontWeight: 700,
                          fontSize: '11px',
                          cursor: 'pointer'
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
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>پرسشنامه هوش هیجانی بار-آن (Bar-On EQ-i)</p>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'left' }}>
                  تاریخ ارزیابی: {new Date().toLocaleDateString('fa-IR')}
                </div>
              </div>

              <h1 className="dass-title">نتیجه و کارنامه جامع هوش هیجانی شما</h1>
              <p className="dass-subtitle">
                نمرات در این آزمون نشان‌دهنده میزان کارآمدی در شناخت و مدیریت احساسات، ارتباطات اجتماعی و حل مسائل است.
              </p>

              {/* بنر امتیاز کل */}
              <div
                style={{
                  background: 'var(--btn-primary-bg)',
                  color: 'var(--btn-primary-text)',
                  borderRadius: '20px',
                  padding: '32px 24px',
                  textAlign: 'center',
                  marginBottom: '26px',
                  border: '1px solid var(--border-glass)'
                }}
              >
                <div style={{ fontSize: '13px', color: 'var(--btn-primary-text)', opacity: 0.9, marginBottom: '4px', fontWeight: 700 }}>
                  نمره کل هوش هیجانی (EQ-i)
                </div>
                <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--btn-primary-text)', lineHeight: 1.1, marginBottom: '8px' }}>
                  {totalScore} <span style={{ fontSize: '20px', color: 'var(--btn-primary-text)', opacity: 0.85, fontWeight: 600 }}>از ۴۵۰</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--btn-primary-text)' }}>
                  {levelInfo.label}
                </div>
                <div style={{ display: 'inline-block', background: 'var(--icon-bg)', color: 'var(--text-primary)', padding: '4px 16px', borderRadius: '50px', fontSize: '12.5px', border: '1px solid var(--border-glass)' }}>
                  دامنه نمرات از ۹۰ تا ۴۵۰ (شاخص کلی سازگاری هیجانی و روان‌شناختی)
                </div>
              </div>

              {/* ۵ حیطه ترکیبی اصلی */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📊</span>
                  <span>نمرات پنج حیطه ترکیبی هوش هیجانی (Composite Scales)</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  {Object.entries(COMPOSITES_INFO).map(([key, info]) => {
                    const cKey = key as BarOnCompositeKey;
                    const sc = compositeScores[cKey];
                    const pct = Math.round((sc / info.max) * 100);
                    return (
                      <div
                        key={key}
                        style={{
                          background: 'var(--bg-card)',
                          borderRadius: '16px',
                          padding: '18px',
                          border: '1px solid var(--border-glass)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{info.name}</span>
                            <span style={{ color: 'var(--color-primary)' }}>{sc} از {info.max}</span>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
                            {info.desc}
                          </div>
                        </div>
                        <div>
                          <div style={{ width: '100%', height: '8px', background: 'var(--header-bg)', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '10px' }} />
                          </div>
                          <div style={{ fontSize: '11px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '4px' }}>
                            {pct}٪ کارایی
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ۱۵ خرده‌مقیاس تفکیکی */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🎯</span>
                  <span>نمرات تفکیکی مقیاس‌های ۱۵ گانه بار-آن</span>
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  هر مقیاس شامل ۶ گویه اختصاصی است (دامنه نمره: ۶ الی ۳۰):
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                  {Object.entries(SCALES_INFO).map(([key, info]) => {
                    const sKey = key as BarOnScaleKey;
                    const sc = subscaleScores[sKey];
                    const pct = Math.round((sc / 30) * 100);
                    return (
                      <div
                        key={key}
                        style={{
                          background: 'var(--bg-card)',
                          borderRadius: '12px',
                          padding: '14px 16px',
                          border: '1px solid var(--border-glass)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>{info.name}</span>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary)' }}>{sc} / ۳۰</span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{info.desc}</div>
                        <div style={{ width: '100%', height: '6px', background: 'var(--header-bg)', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-accent)', borderRadius: '6px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* تحلیل بالینی */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '18px',
                  padding: '22px',
                  border: '1px solid var(--border-glass)',
                  marginBottom: '24px'
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🧠</span>
                  <span>تفسیر روان‌شناختی وضعیت هوش هیجانی شما</span>
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.85, color: 'var(--text-secondary)', textAlign: 'justify', margin: 0 }}>
                  {levelInfo.analysis}
                </p>
              </div>

              {/* کارت تحلیل هوشمند و راهکارها */}
              <SmartAnalysisCard
                testType="BARON"
                data={{
                  score: totalScore,
                  composites: compositeScores,
                  subscales: subscaleScores
                }}
              />

              {/* جعبه رزرو مشاوره */}
              <div className="dass-cta-box" style={{ marginTop: '28px' }}>
                <h3>تمایل دارید هوش هیجانی و مهارت‌های ارتباطی خود را ارتقا دهید؟</h3>
                <p>می‌توانید با روان‌شناسان و مشاوران پناه جلسات توسعه مهارت‌های فردی داشته باشید.</p>
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
