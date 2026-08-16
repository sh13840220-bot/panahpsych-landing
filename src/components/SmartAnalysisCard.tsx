import React, { useState } from 'react';

export type TestType = 'DASS21' | 'GAD7' | 'BDI2' | 'ROSENBERG' | 'MBTI' | 'NEOFFI' | 'CFI' | 'BARON';

interface SmartAnalysisProps {
  testType: TestType;
  // DASS21: { D: number, A: number, S: number }
  // GAD7: { score: number }
  // BDI2: { score: number }
  // ROSENBERG: { score: number }
  // MBTI: { type: string, percentages?: Record<string, number> }
  // NEOFFI: { scores: Record<string, number> }
  // CFI: { score: number, alternatives?: number, control?: number, justification?: number }
  // BARON: { score: number, composites?: Record<string, number>, subscales?: Record<string, number> }
  data: any;
}

export type CategoryType =
  | 'سبک زندگی'
  | 'فعالیت‌های روزانه'
  | 'نیاز به مراجعه به متخصص'
  | 'تنظیم هیجان'
  | 'اصلاح شناختی'
  | 'خودمراقبتی'
  | 'ارتباطات و مرزبندی'
  | 'رشد فردی';

export interface RecommendationItem {
  title: string;
  category: CategoryType;
  icon: string;
  description: string;
  isHighPriority?: boolean;
}

export const CATEGORY_CONFIG: Record<
  CategoryType,
  {
    label: string;
    icon: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
  }
> = {
  'سبک زندگی': {
    label: 'سبک زندگی',
    icon: '🌿',
    bgClass: 'var(--badge-inperson-bg)',
    textClass: 'var(--text-primary)',
    borderClass: 'var(--border-glass)',
  },
  'فعالیت‌های روزانه': {
    label: 'فعالیت‌های روزانه',
    icon: '🗓️',
    bgClass: 'var(--icon-bg)',
    textClass: 'var(--text-primary)',
    borderClass: 'var(--border-glass)',
  },
  'نیاز به مراجعه به متخصص': {
    label: 'نیاز به مراجعه به متخصص',
    icon: '🩺',
    bgClass: 'var(--status-pending-bg)',
    textClass: 'var(--color-accent)',
    borderClass: 'var(--status-pending-border)',
  },
  'تنظیم هیجان': {
    label: 'تنظیم هیجان',
    icon: '🌊',
    bgClass: 'var(--badge-online-bg)',
    textClass: 'var(--text-primary)',
    borderClass: 'var(--border-glass)',
  },
  'اصلاح شناختی': {
    label: 'اصلاح شناختی',
    icon: '💡',
    bgClass: 'var(--status-pending-bg)',
    textClass: 'var(--color-accent)',
    borderClass: 'var(--status-pending-border)',
  },
  'خودمراقبتی': {
    label: 'خودمراقبتی',
    icon: '🫧',
    bgClass: 'var(--badge-inperson-bg)',
    textClass: 'var(--text-primary)',
    borderClass: 'var(--border-glass)',
  },
  'ارتباطات و مرزبندی': {
    label: 'ارتباطات و مرزبندی',
    icon: '🛡️',
    bgClass: 'var(--icon-bg)',
    textClass: 'var(--text-primary)',
    borderClass: 'var(--border-glass)',
  },
  'رشد فردی': {
    label: 'رشد فردی',
    icon: '🚀',
    bgClass: 'var(--badge-online-bg)',
    textClass: 'var(--text-primary)',
    borderClass: 'var(--border-glass)',
  },
};

export interface AnalysisResult {
  summaryTitle: string;
  summaryText: string;
  recommendations: RecommendationItem[];
  exerciseTitle: string;
  exerciseSteps: string[];
}

export function generateSmartAnalysis(testType: TestType, data: any): AnalysisResult {
  if (testType === 'DASS21') {
    const { D = 0, A = 0, S = 0 } = data || {};
    // Calculate predominant area
    const isHighD = D >= 14;
    const isHighA = A >= 10;
    const isHighS = S >= 19;

    let summaryTitle = 'تحلیل متوازن شاخص‌های هیجانی';
    let summaryText = 'پاسخ‌های شما نشان‌دهنده تعادل نسبی در سیستم هیجانی است. در ادامه چند راهکار پیشگیرانه برای حفظ این هوشیاری عاطفی ارائه‌شده است.';
    
    if (isHighD || isHighA || isHighS) {
      const areas: string[] = [];
      if (isHighD) areas.push('خلق‌پایین و افت انرژی');
      if (isHighA) areas.push('برانگیختگی سیستم اضطرابی');
      if (isHighS) areas.push('فشار و تنش روانی بالا');
      
      summaryTitle = `تحلیل هوشمند: نیاز به توجه به ${areas.join(' و ')}`;
      summaryText = `تحلیل الگوی پاسخ‌های شما نشان می‌دهد که سیستم عصبی شما در حال حاضر فشار قابل توجهی را در حوزه ${areas.join(' و ')} تجربه می‌کند. این وضعیت کاملاً قابل مدیریت است و با راهکارهای هدفمند زیر می‌توانید به آرامش بیشتری برسید.`;
    }

    const recommendations: RecommendationItem[] = [];

    if (S >= 10) {
      recommendations.push({
        title: 'مدیریت بار شناختی و کاهش تنش مزمن',
        category: 'خودمراقبتی',
        icon: '🌿',
        description: 'تقسیم کارهای بزرگ به قدم‌های بسیار کوچک ۱۰ دقیقه‌ای و ثبت لیست اولویت‌ها برای کاهش فشار ذهنی ناگهانی.'
      });
      recommendations.push({
        title: 'تنظیم ریتم تنفس و آزادسازی عضلانی',
        category: 'تنظیم هیجان',
        icon: '🌬️',
        description: 'تمرین تنفس دیافراگمی (۴ ثانیه دم، ۴ ثانیه مکث، ۶ ثانیه بازدم) روزانه ۲ بار به مدت ۵ دقیقه برای بازگرداندن سیستم عصبی پاراسمپاتیک.'
      });
    }

    if (A >= 8) {
      recommendations.push({
        title: 'زمین‌گیری (Grounding) هنگام هجوم افکار مضطرب',
        category: 'اصلاح شناختی',
        icon: '🌱',
        description: 'استفاده از تکنیک ۵-۴-۳-۲-۱ برای بازگرداندن توجه از سناریوهای فاجعه‌ساز ذهنی به زمان حال و حواس پنج‌گانه.'
      });
      recommendations.push({
        title: 'کاهش محرک‌های محیطی تشدیدکننده',
        category: 'خودمراقبتی',
        icon: '☕',
        description: 'کاهش مصرف کافئین، محدود کردن چک کردن اخبار و شبکه‌های اجتماعی قبل از خواب و ایجاد بازه زمانی آرام‌سازی شبانه.'
      });
    }

    if (D >= 10) {
      recommendations.push({
        title: 'تکنیک فعال‌سازی رفتاری خرد (Micro-Action)',
        category: 'رشد فردی',
        icon: '🚶‍♂️',
        description: 'انتخاب یک فعالیت بسیار کوچک اما لذت‌بخش یا معنا‌دار در روز (مانند ۵ دقیقه پیاده‌روی در نور خورشید یا گوش دادن به یک قطعه موسیقی آرام).'
      });
      recommendations.push({
        title: 'بازنگری منتقد درونی و شفقت به خود',
        category: 'اصلاح شناختی',
        icon: '🤍',
        description: 'وقتی افکار سرزنش‌گرانه بروز می‌کنند، از خود بپرسید: «اگر دوستم در این شرایط بود، با چه لحن مهربانانه‌ای با او صحبت می‌کردم؟»'
      });
    }

    if (recommendations.length < 3) {
      recommendations.push({
        title: 'حفظ و تقویت انعطاف‌پذیری روانی',
        category: 'خودمراقبتی',
        icon: '☀️',
        description: 'حفظ خواب منظم ۷-۸ ساعته و تخصیص زمان مشخصی در هفته برای سرگرمی‌های بدون فشار کاری.'
      });
    }

    return {
      summaryTitle,
      summaryText,
      recommendations,
      exerciseTitle: 'تمرین پیشنهادی: «تنفس آرام‌بخش ۴-۷-۸»',
      exerciseSteps: [
        'در وضعیتی راحت بنشینید و زبان خود را پشت دندان‌های جلویی بالا قرار دهید.',
        'تمام هوا را از طریق دهان بیرون دهید.',
        'با شماره ۱ تا ۴ از طریق بینی دم بگیرید.',
        'نفس خود را تا شماره ۷ نگه دارید.',
        'با شماره ۱ تا ۸ به آرامی و با صدای ملایم از دهان بازدم انجام دهید. این چرخه را ۴ بار تکرار کنید.'
      ]
    };
  }

  if (testType === 'GAD7') {
    const score = data?.score || 0;
    let summaryTitle = 'تحلیل سطح اضطراب و الگوی نگرانی';
    let summaryText = '';

    if (score <= 4) {
      summaryText = 'سطح اضطراب شما در محدوده طبیعی است. الگوی ذهنی شما توانایی خوبی در مواجهه با چالش‌های روزمره نشان می‌دهد.';
    } else if (score <= 9) {
      summaryText = 'نمره شما نشان‌دهنده اضطراب خفیف است. نگرانی‌ها ممکن است گاهی تمرکز یا خواب شما را تحت تأثیر قرار دهند، اما با تکنیک‌های پایه قابل مهار هستند.';
    } else if (score <= 14) {
      summaryText = 'نمره شما در محدوده اضطراب متوسط قرار دارد. سیستم هشدار ذهنی شما بیش از حد فعال شده و نیازمند راهکارهای ساختارمند جهت بازگرداندن آرامش است.';
    } else {
      summaryText = 'نمره شما نشان‌دهنده اضطراب شدید است. سیستم عصبی شما در حالت آماده‌باش مداوم قرار دارد. دریافت حمایت حرفه‌ای تخصصی در کنار تکنیک‌های زیر بسیار ارزشمند خواهد بود.';
    }

    return {
      summaryTitle,
      summaryText,
      recommendations: [
        {
          title: 'جداسازی «نگرانی‌های مفید» از «نگرانی‌های غیرقابل‌کنترل»',
          category: 'اصلاح شناختی',
          icon: '📝',
          description: 'نگرانی‌های خود را روی کاغذ بنویسید. زیر مواردی که همین امروز اقدامی برایشان ممکن است خط بکشید و بقیه را رها کنید.'
        },
        {
          title: 'تعیین «وقت نگرانی مشخص» (Worry Time)',
          category: 'تنظیم هیجان',
          icon: '⏰',
          description: 'هر روز ۱۵ دقیقه در ساعت ۵ عصر را به افکار نگران‌کننده اختصاص دهید. اگر در طول روز فکری آمد، آن را به «وقت نگرانی» موکول کنید.'
        },
        {
          title: 'آرام‌سازی تعمقی بدن (PMR)',
          category: 'خودمراقبتی',
          icon: '🧘‍♀️',
          description: 'سفت کردن ۵ ثانیه‌ای و سپس رهاسازی کامل گروه‌های عضلانی (پاها، شانه‌ها، فک) برای تخلیه فیزیکی اضطراب.'
        }
      ],
      exerciseTitle: 'تمرین پیشنهادی: «تکنیک زمین‌گیری ۵-۴-۳-۲-۱»',
      exerciseSteps: [
        '۵ چیزی که در اطراف خود می‌بینید را نام ببرید.',
        '۴ چیزی که می‌توانید لمس کنید یا حس کنید (مثل لمس لباس یا صندلی) را لمس کنید.',
        '۳ صدایی که در محیط می‌شنوید را تشخیص دهید.',
        '۲ بویی که احساس می‌کنید یا دوست دارید را یادآوری کنید.',
        '۱ طعم یا احساس مثبت در دهان را مرور کنید.'
      ]
    };
  }

  if (testType === 'BDI2') {
    const score = data?.score || 0;
    let summaryTitle = 'تحلیل نشانه‌های خلق و سطح انرژی';
    let summaryText = '';

    if (score <= 13) {
      summaryText = 'سطح خُلق شما در محدوده طبیعی قرار دارد. نوسانات خُلق در زندگی طبیعی است و شما ابزارهای روانی لازم را دارا هستید.';
    } else if (score <= 19) {
      summaryText = 'نشانه‌هایی از خُلق پایین و افسردگی خفیف دیده می‌شود. افت انرژی و احساس خستگی ممکن است تمایل شما به فعالیت را کاهش داده باشد.';
    } else if (score <= 28) {
      summaryText = 'نمره شما در محدوده افسردگی متوسط است. افکار منفی خودکار و احساس افت انگیزه نیازمند توجه دقیق و اقدامات ساختارمند روزانه هستند.';
    } else {
      summaryText = 'نمره شما نشان‌دهنده نشانه‌های افسردگی شدید است. احساس سنگینی روانی و ناامیدی ممکن است توان روزمره را کاهش داده باشد. گفتگو با روان‌شناس پناه بسیار توصیه‌می‌شود.';
    }

    return {
      summaryTitle,
      summaryText,
      recommendations: [
        {
          title: 'فعال‌سازی رفتاری و اقدام پیش از انگیزه',
          category: 'خودمراقبتی',
          icon: '🌱',
          description: 'منتظر آمدن حس و حال یا انگیزه نمانید. قانون «فقط ۵ دقیقه» را اجرا کنید؛ ۵ دقیقه کاری ساده را شروع کنید، سپس در صورت تمایل ادامه دهید.'
        },
        {
          title: 'شناسایی و به چالش کشیدن افکار «همه‌یا-هیچ»',
          category: 'اصلاح شناختی',
          icon: '💡',
          description: 'وقتی فکری مثل «من هیچ‌کاری را درست انجام نمی‌دهم» آمد، شواهد نقض آن را از روزهای گذشته یادداشت کنید.'
        },
        {
          title: 'تنظیم نور خورشید و ریتم شبانه‌روزی',
          category: 'خودمراقبتی',
          icon: '☀️',
          description: 'هر روز صبح ظرف ۳۰ دقیقه پس از بیدار شدن، ۱۰ تا ۱۵ دقیقه در معرض نور طبیعی روز قرار بگیرید تا هورمون‌های خلق تنظیم شوند.'
        }
      ],
      exerciseTitle: 'تمرین پیشنهادی: «ثبت سه پیروزی کوچک روزانه»',
      exerciseSteps: [
        'در پایان هر روز، دفتری یادداشت کنار تخت قرار دهید.',
        'سه کار کوچک اما واقعی که انجام داده‌اید (مثل مسواک زدن، نوشیدن آب، پاسخ به یک پیام) را بنویسید.',
        'جلوی هر کدام یک جمله کوتاه در تمجید از تلاش کوچک خود ثبت کنید.'
      ]
    };
  }

  if (testType === 'ROSENBERG') {
    const score = data?.score || 0;
    let summaryTitle = 'تحلیل ارزیابی از خود و عزت‌نفس';
    let summaryText = '';

    if (score >= 25) {
      summaryText = 'شما از عزت‌نفس سالم و مطلوب برخوردار هستید. تصویر ذهنی شما از ارزشمندی خود شفاف و باثبات است.';
    } else if (score >= 15) {
      summaryText = 'عزت‌نفس شما در محدوده متوسط قرار دارد. در برخی موقعیت‌ها خود را باور دارید اما در مواجهه با انتقاد یا شکست ممکن است دچار تردید شوید.';
    } else {
      summaryText = 'نمره شما نشان‌دهنده عزت‌نفس پایین و نقد درونی شدید است. شما تمایل دارید موفقیت‌های خود را نادیده بگیرید و نقاط ضعف را بزرگنمایی کنید.';
    }

    return {
      summaryTitle,
      summaryText,
      recommendations: [
        {
          title: 'تفکیک «ارزشمندی درونی» از «عملکرد بیرونی»',
          category: 'اصلاح شناختی',
          icon: '💎',
          description: 'ارزش انسانی شما به میزان اشتباهات یا دستاوردهای امروز وابسته نیست. عملکرد قابلیت بهبود دارد اما ارزش انسانی شما ثابت است.'
        },
        {
          title: 'تمرین مرزبندی و نه گفتن بدون احساس گناه',
          category: 'ارتباطات و مرزبندی',
          icon: '🛡️',
          description: 'در برابر درخواست‌هایی که فراتر از توان یا تمایل شماست، با احترام بگویید: «در حال حاضر امکانش را ندارم» بدون نیاز به توجیحات طولانی.'
        },
        {
          title: 'خاموش کردن صدای منتقد بیرونی و درونی',
          category: 'خودمراقبتی',
          icon: '🤍',
          description: 'به جای مقایسه با دیگران در شبکه‌های اجتماعی، مسیر رشد فردی خود را صرفاً با خودِ گذشته‌تان مقایسه کنید.'
        }
      ],
      exerciseTitle: 'تمرین پیشنهادی: «نامه شفقت به خود»',
      exerciseSteps: [
        'موقعیتی که در آن احساس ناکامی یا خودانتقادی دارید را مجسم کنید.',
        'نامه‌ای کوتاه خطاب به خود بنویسید، انگار که مهربان‌ترین و داناترین دوست دنیا دارد برای شما می‌نویسد.',
        'در نامه یادآوری کنید که انسان بودن یعنی جایز الخطا بودن و شما شایسته مهر و احترام هستید.'
      ]
    };
  }

  if (testType === 'MBTI') {
    const type = data?.type || 'INFJ';

    return {
      summaryTitle: `تحلیل هوشمند استعدادها و نقاط رشد تیپ ${type}`,
      summaryText: `تیپ شخصیتی ${type} دارای ساختار شناختی و ترجیحات رفتار منحصر‌به‌فردی است. درک الگوهای این تیپ به شما کمک می‌کند در روابط و مسیر شغلی هوشمندانه‌تر عمل کنید.`,
      recommendations: [
        {
          title: 'استفاده حداکثری از نقاط قوت ترجیحات شناختی',
          category: 'رشد فردی',
          icon: '🚀',
          description: 'محیط کاری و زندگی خود را به‌گونه‌ای تنظیم کنید که از شیوه دریافت اطلاعات و تصمیم‌گیری طبیعی شما پشتیبانی کند.'
        },
        {
          title: 'مدیریت نقاط سایه و محرک‌های استرس‌زا',
          category: 'تنظیم هیجان',
          icon: '⚖️',
          description: 'شناسایی شرایطی که باعث خستگی مفرط این تیپ می‌شود و برنامه‌ریزی برای بازیابی انرژی پیش از تخلیه کامل.'
        },
        {
          title: 'بهبود ارتباطات بین‌فردی با تیپ‌های متفاوت',
          category: 'ارتباطات و مرزبندی',
          icon: '🤝',
          description: 'درک اینکه دیگران ممکن است اطلاعات را به شیوه‌ای کاملاً متفاوت پردازش کنند، تنش‌های ارتباطی را به شکل چشمگیری کاهش می‌دهد.'
        }
      ],
      exerciseTitle: 'تمرین پیشنهادی: «تعادل‌بخشی به ترجیحات روانی»',
      exerciseSteps: [
        'یک وضعیت چالش‌برانگیز اخیر را بازخوانی کنید.',
        'نگاه کنید ببینید چه مقدار بر اساس ترجیح غالب خود عمل کرده‌اید.',
        'یک اقدام کوچک بر اساس کارکرد مکمل خود تعریف و اجرا کنید.'
      ]
    };
  }

  if (testType === 'CFI') {
    const score = data?.score ?? 70;
    const isHigh = score >= 105;
    const isModerate = score >= 70 && score < 105;

    return {
      summaryTitle: isHigh
        ? 'تحلیل تاب‌آوری و انعطاف‌پذیری شناختی بالا'
        : isModerate
        ? 'تحلیل انعطاف‌پذیری شناختی متعادل'
        : 'تحلیل نیاز به تقویت انعطاف‌پذیری شناختی',
      summaryText: isHigh
        ? 'شما توانمندی بالایی در بازسازی شناختی و خروج از بن‌بست‌های فکری دارید. در شرایط پرتنش، به جای درماندگی، سناریوها و راه‌حل‌های متعددی را به کار می‌گیرید.'
        : isModerate
        ? 'شما در شرایط معمول سازگاری خوبی نشان می‌دهید؛ اما در شرایط بحرانی یا خستگی ممکن است تمایل به تفکر تک‌بعدی پیدا کنید. با تمرین بارش فکری می‌توانید این مهارت را ارتقا دهید.'
        : 'الگوهای پاسخ شما نشان‌دهنده گرایش به نشخوار فکری و احساس عدم کنترل بر شرایط دشوار است. تقویت مهارت بازسازی شناختی و پذیرش زاویه‌دیدهای جایگزین برای شما بسیار حیاتی است.',
      recommendations: [
        {
          title: 'بازسازی شناختی و چالش با افکار منفی خودکار (CBT)',
          category: 'اصلاح شناختی',
          icon: '💡',
          description:
            'در لحظات تنش‌زا از خود بپرسید: «آیا زاویه‌دید دیگری برای دیدن این مسئله وجود دارد؟ بدترین، محتمل‌ترین و بهترین سناریو کدام است؟»'
        },
        {
          title: 'تکنیک بارش فکری چندگزینه‌ای قبل از اقدام',
          category: 'فعالیت‌های روزانه',
          icon: '📝',
          description:
            'هنگام برخورد با چالش‌ها، پیش از هر قضاوتی حداقل ۳ راه‌حل مستقل یادداشت کنید تا ذهن شما در دام گزاره «هیچ راهی نیست» گرفتار نشود.'
        },
        {
          title: 'تفکیک دایره کنترل از دایره دغدغه',
          category: 'تنظیم هیجان',
          icon: '🎯',
          description:
            'مسائل را به دو دسته کنترل‌پذیر و غیرقابل کنترل تقسیم کنید و توان روانی خود را صرفاً بر بخش‌هایی متمرکز کنید که اقدام عملی روی آن ممکن است.'
        },
        {
          title: 'تمرین دیدگاه‌گیری همدلانه در روابط',
          category: 'ارتباطات و مرزبندی',
          icon: '🤝',
          description:
            'هنگام بروز اختلاف نظر، دلایل و فرضیات احتمالی طرف مقابل را بدون قضاوت اولیه بازسازی کنید تا انعطاف رفتاری‌تان افزایش یابد.'
        }
      ],
      exerciseTitle: 'تمرین کاربردی: «جدول سه‌ستونه زاویه دید جایگزین»',
      exerciseSteps: [
        'یک رویداد استرس‌زا یا ناکام‌کننده هفته اخیر را بالای یک برگه بنویسید.',
        'در ستون اول، اولین فکر خودکار یا تفسیر منفی خود را با صداقت ثبت کنید.',
        'در ستون دوم، شواهد واقعی له و علیه این فکر منفی را جدا کنید.',
        'در ستون سوم، ۲ تا ۳ تفسیر واقع‌بینانه و راه‌حل جایگزین را بازنویسی کنید.'
      ]
    };
  }

  if (testType === 'BARON') {
    const score = data?.score ?? 300;
    const isVeryHigh = score >= 380;
    const isHigh = score >= 320 && score < 380;
    const isModerate = score >= 250 && score < 320;

    return {
      summaryTitle: isVeryHigh
        ? 'تحلیل جامع هوش هیجانی بسیار بالا و بلوغ ارتباطی'
        : isHigh
        ? 'تحلیل جامع هوش هیجانی کارآمد و بهینه'
        : isModerate
        ? 'تحلیل هوش هیجانی در حد متوسط و بهنجار'
        : 'تحلیل نیاز به تقویت شایستگی‌های هوش هیجانی',
      summaryText: isVeryHigh
        ? 'شما از خودآگاهی عمیق، پختگی عاطفی و مهارت‌های ارتباطی و بین‌فردی برجسته‌ای برخوردارید و توانایی هدایت احساسات در شرایط پرفشار را دارید.'
        : isHigh
        ? 'هوش هیجانی شما در سطح مطلوب قرار دارد و در اکثر شرایط قادر به مهار استرس، تصمیم‌گیری واقع‌بینانه و همدلی موثر با دیگران هستید.'
        : isModerate
        ? 'شما در تعاملات روزمره عملکرد پایداری دارید، اما در مواجهه با چالش‌ها یا فشارهای شدید ممکن است مدیریت تکانه یا جرئت‌ورزی نیاز به تمرکز بیشتری داشته باشد.'
        : 'نتایج نشان‌دهنده چالش در مهار هیجانات شدید یا بیان مرزهای بین‌فردی است. با تمرین‌های خودآگاهی و توسعه فردی، هوش هیجانی ارتقاپذیر است.',
      recommendations: [
        {
          title: 'دفترچه ثبت و نام‌گذاری احساسات (Emotion Journaling)',
          category: 'تنظیم هیجان',
          icon: '📖',
          description:
            'روزانه ۳ بار احساس بدنی و نام دقیق هیجان فعلی‌تان (غم، ناکامی، حسادت، امید و...) را بدون سرکوب یادداشت کنید تا خودآگاهی هیجانی تقویت شود.'
        },
        {
          title: 'تکنیک مکث ۵ ثانیه‌ای در مدیریت خشم و کنترل تکانه',
          category: 'اصلاح شناختی',
          icon: '⏸️',
          description:
            'قبل از هر واکنش تند کلامی یا پیام عجولانه، ۳ نفس عمیق بکشید و از خود بپرسید: «آیا این واکنش سازنده است یا صرفاً تخلیه تکانشی؟»'
        },
        {
          title: 'تمرین جرئت‌ورزی با فرمول گفتگوی محترمانه',
          category: 'ارتباطات و مرزبندی',
          icon: '🗣️',
          description:
            'نیازها و مرزهای خود را با فرمول «هنگامی که... من احساس می‌کنم... و ترجیح می‌دهم که...» بدون پرخاشگری یا انفعال بیان کنید.'
        },
        {
          title: 'همدلی فعال و شنیدن بدون پیش‌داوری',
          category: 'رشد فردی',
          icon: '👂',
          description:
            'در گفتگوهای حساس، ابتدا صحبت طرف مقابل را با زبان خودش بازگو کنید («اگر درست متوجه شده باشم منظور شما این است که...») سپس نظر خود را مطرح کنید.'
        }
      ],
      exerciseTitle: 'تمرین کاربردی: «نقشه تحلیل موقعیت هیجانی (STAR-E)»',
      exerciseSteps: [
        'یک موقعیت تنش‌زای اخیر را در نظر بگیرید (Situation).',
        'هیجانی که در آن لحظه احساس کردید را دقیق مشخص کنید (Emotion).',
        'واکنشی که نشان دادید را ارزیابی نمایید (Action).',
        'برای دفعات مشابه آینده، یک اقدام سازنده‌تر با تکیه بر خودآگاهی و همدلی طراحی کنید (Result & Reflection).'
      ]
    };
  }

  // NEOFFI
  const scores = data?.scores || {};
  return {
    summaryTitle: 'تحلیل هوشمند ابعاد ۵ گانه شخصیت (NEO-FFI)',
    summaryText: 'ویژگی‌های شخصیتی شما تعامل منحصر‌به‌فردی از پنج بعد اصلی را نشان می‌دهند. این الگوها ثابت نیستند و با آگاهی می‌توانید رفتارهای خود را متعادل کنید.',
    recommendations: [
      {
        title: 'تنظیم سیستم هیجانی (مدیریت روان‌رنجورخویی)',
        category: 'تنظیم هیجان',
        icon: '🌊',
        description: 'تمرین تکنیک‌های تاب‌آوری و فاصله گرفتن از واکنش‌های هیجانی آنی در مواجهه با اخبار یا استرس‌های محیطی.'
      },
      {
        title: 'ایجاد تعادل میان تعاملات اجتماعی و تنهایی',
        category: 'ارتباطات و مرزبندی',
        icon: '⚖️',
        description: 'تنظیم میزان حضور در جمع و زمان‌های خلوت فردی متناسب با نمره برون‌گرایی جهت جلوگیری از فرسودگی.'
      },
      {
        title: 'بهینه‌سازی وظیفه‌شناسی و برنامه‌ریزی',
        category: 'رشد فردی',
        icon: '🎯',
        description: 'اگر نمره وظیفه‌شناسی بالاست، انعطاف‌پذیری و پذیرش خطا را تمرین کنید؛ اگر پایین است، سیستم‌های یادآوری ساختارمند ایجاد کنید.'
      }
    ],
    exerciseTitle: 'تمرین پیشنهادی: «بازنگری رفتاری هفتگی»',
    exerciseSteps: [
      'در پایان هفته یکی از ۵ بعد اصلی که در آن احساس فشار یا عدم تعادل کرده‌اید را انتخاب کنید.',
      'دو موقعیتی که در آن این ویژگی بروز کرده را یادداشت کنید.',
      'برای هفته آینده یک جایگزین رفتاری ساده و آگاهانه طراحی کنید.'
    ]
  };
}

export const SmartAnalysisCard: React.FC<SmartAnalysisProps> = ({ testType, data }) => {
  const [activeTab, setActiveTab] = useState<'recs' | 'exercise'>('recs');
  const analysis = generateSmartAnalysis(testType, data);

  return (
    <div
      style={{
        marginTop: '28px',
        padding: '24px',
        borderRadius: '24px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-glass)',
        textAlign: 'right',
        direction: 'rtl',
      }}
      className="smart-analysis-container"
    >
      {/* Header Tag */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--color-primary)',
              color: 'var(--bg-main)',
              fontSize: '18px',
              fontWeight: 800,
            }}
          >
            ✨
          </span>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            تحلیل هوشمند و راهکارهای اختصاصی
          </h2>
        </div>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            background: 'var(--icon-bg)',
            color: 'var(--text-primary)',
            padding: '5px 14px',
            borderRadius: '999px',
            border: '1px solid var(--border-glass)',
          }}
        >
          سامانه هوشمند پناه
        </span>
      </div>

      {/* Summary Box */}
      <div
        style={{
          background: 'var(--header-bg)',
          borderRadius: '16px',
          padding: '18px 20px',
          marginBottom: '22px',
          borderRight: '4px solid var(--color-primary)',
        }}
      >
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginTop: 0,
            marginBottom: '8px',
          }}
        >
          {analysis.summaryTitle}
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
          {analysis.summaryText}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div
        className="smart-tab-nav no-print"
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '18px',
          borderBottom: '1px solid var(--border-glass)',
          paddingBottom: '12px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('recs')}
          className={activeTab === 'recs' ? 'active' : ''}
          style={{
            padding: '8px 18px',
            borderRadius: '999px',
            fontSize: '13.5px',
            fontWeight: 700,
            border: '1px solid var(--border-glass)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activeTab === 'recs' ? 'var(--btn-primary-bg)' : 'var(--header-bg)',
            color: activeTab === 'recs' ? 'var(--btn-primary-text)' : 'var(--text-secondary)',
          }}
        >
          🌱 راهکارهای پیشنهادی ({analysis.recommendations.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('exercise')}
          className={activeTab === 'exercise' ? 'active' : ''}
          style={{
            padding: '8px 18px',
            borderRadius: '999px',
            fontSize: '13.5px',
            fontWeight: 700,
            border: '1px solid var(--border-glass)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activeTab === 'exercise' ? 'var(--btn-primary-bg)' : 'var(--header-bg)',
            color: activeTab === 'exercise' ? 'var(--btn-primary-text)' : 'var(--text-secondary)',
          }}
        >
          📝 تمرین عملی کاربردی
        </button>
      </div>

      {/* Content Tab 1: Recommendations */}
      <div
        className={`smart-recs-section ${activeTab !== 'recs' ? 'hide-on-screen-only' : ''}`}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        {/* Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {analysis.recommendations.map((item, idx) => {
            const catConfig = CATEGORY_CONFIG[item.category] || {
              label: item.category,
              icon: item.icon,
              bgClass: 'var(--icon-bg)',
              textClass: 'var(--text-primary)',
              borderClass: 'var(--border-glass)',
            };

            return (
              <div
                key={idx}
                style={{
                  background: item.isHighPriority ? 'var(--status-pending-bg)' : 'var(--header-bg)',
                  borderRadius: '16px',
                  padding: '18px',
                  border: item.isHighPriority
                    ? '1.5px solid var(--status-pending-border)'
                    : '1px solid var(--border-glass)',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  transition: 'transform 0.2s ease',
                }}
                className="smart-recommendation-card"
              >
                {/* Icon box */}
                <div
                  style={{
                    fontSize: '26px',
                    background: item.isHighPriority ? 'var(--status-pending-bg)' : catConfig.bgClass,
                    color: catConfig.textClass,
                    padding: '10px',
                    borderRadius: '14px',
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${catConfig.borderClass}`,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>

                {/* Text details */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '6px',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '15px',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {item.title}
                    </h4>

                    {/* Color-coded category badge */}
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 700,
                        color: catConfig.textClass,
                        background: catConfig.bgClass,
                        border: `1px solid ${catConfig.borderClass}`,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span>{catConfig.icon}</span>
                      <span>{catConfig.label}</span>
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: '13.5px',
                      color: 'var(--text-secondary)',
                      margin: 0,
                      lineHeight: 1.65,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Tab 2: Practical Exercise */}
      <div
        className={`smart-exercise-section ${activeTab !== 'exercise' ? 'hide-on-screen-only' : ''}`}
        style={{
          background: 'var(--header-bg)',
          borderRadius: '18px',
          padding: '22px',
          border: '1px solid var(--border-glass)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span style={{ fontSize: '20px' }}>🧘‍♂️</span>
          <h4
            style={{
              fontSize: '16px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {analysis.exerciseTitle}
          </h4>
        </div>

        <ol
          style={{
            paddingRight: '22px',
            margin: 0,
            color: 'var(--text-secondary)',
            fontSize: '14px',
            lineHeight: 1.85,
          }}
        >
          {analysis.exerciseSteps.map((step, sIdx) => (
            <li key={sIdx} style={{ marginBottom: '10px' }}>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
