import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';
import { SmartAnalysisCard } from '../components/SmartAnalysisCard';
import { saveAssessmentResult } from '../lib/saveAssessmentResult';

/* =========================================================================
   ۱. بانک جامع ۹۰ گویه آزمون SCL-90-R (درروگوتیس) و تفکیک ابعاد نه‌گانه + تکمیلی
   ========================================================================= */

export type SclDimension =
  | 'SOM'
  | 'OC'
  | 'INT'
  | 'DEP'
  | 'ANX'
  | 'HOS'
  | 'PHOB'
  | 'PAR'
  | 'PSY'
  | 'ADD';

export interface SclQuestion {
  id: number;
  text: string;
  dim: SclDimension;
}

export const SCL_QUESTIONS: SclQuestion[] = [
  { id: 1, text: 'آیا از هفته گذشته تا به امروز سر درد داشته‌اید؟', dim: 'SOM' },
  { id: 2, text: 'آیا از هفته گذشته تا به امروز عصبی بوده‌اید و از داخل بدن احساس لرزش داشته‌اید؟', dim: 'ANX' },
  { id: 3, text: 'آیا از هفته گذشته تا به امروز افکار، عقاید یا کلمات ناخوشایند و نامربوطی مرتباً وارد ذهن شما شده‌اند که رهایتان نکنند؟', dim: 'OC' },
  { id: 4, text: 'آیا از هفته گذشته تا به امروز دچار ضعف، بی‌حالی و یا سرگیجه بوده‌اید؟', dim: 'SOM' },
  { id: 5, text: 'آیا از هفته گذشته تا به امروز نسبت به روابط زناشویی بی‌میل شده‌اید؟', dim: 'DEP' },
  { id: 6, text: 'آیا از هفته گذشته تا به امروز ایرادگیر و بهانه‌جو شده‌اید؟', dim: 'INT' },
  { id: 7, text: 'آیا از هفته گذشته تا به امروز این اعتقاد را داشته‌اید که شخص دیگری می‌تواند افکار شما را از راه دور کنترل کند؟', dim: 'PSY' },
  { id: 8, text: 'آیا از هفته گذشته تا به امروز احساس کرده‌اید که دیگران باعث ناراحتی‌ها و گرفتاری‌های شما هستند؟', dim: 'PAR' },
  { id: 9, text: 'آیا از هفته گذشته تا به امروز فراموشکار شده‌اید؟', dim: 'OC' },
  { id: 10, text: 'آیا از هفته گذشته تا به امروز در کارها بی‌توجه و بی‌دقت شده‌اید؟', dim: 'OC' },
  { id: 11, text: 'آیا از هفته گذشته تا به امروز دلخور و یا عصبانی شده‌اید؟', dim: 'HOS' },
  { id: 12, text: 'آیا از هفته گذشته تا به امروز درد در ناحیه قلب یا سینه داشته‌اید؟', dim: 'SOM' },
  { id: 13, text: 'آیا از هفته گذشته تا به امروز از رفتن به جاهای باز یا خیابان احساس ترس کرده‌اید؟', dim: 'PHOB' },
  { id: 14, text: 'آیا از هفته گذشته تا به امروز احساس کرده‌اید که زور و بنیه سابق را ندارید و زود خسته می‌شوید؟', dim: 'DEP' },
  { id: 15, text: 'آیا از هفته گذشته تا به امروز این فکر به ذهنتان آمده که به زندگی خود خاتمه دهید؟', dim: 'DEP' },
  { id: 16, text: 'آیا از هفته گذشته تا به امروز صداهایی به گوشتان می‌آید که دیگران نمی‌توانستند آن‌ها را بشنوند؟', dim: 'PSY' },
  { id: 17, text: 'آیا از هفته گذشته تا به امروز احساس لرزش در اندام بدن خود داشته‌اید؟', dim: 'ANX' },
  { id: 18, text: 'آیا از هفته گذشته تا به امروز این احساس را داشته‌اید که به بیشتر مردم نمی‌شود اعتماد کرد؟', dim: 'PAR' },
  { id: 19, text: 'آیا از هفته گذشته تا به امروز زود به گریه افتاده‌اید؟', dim: 'ADD' },
  { id: 20, text: 'آیا از هفته گذشته تا به امروز بی‌اشتها شده‌اید؟', dim: 'DEP' },
  { id: 21, text: 'آیا از هفته گذشته تا به امروز در روابط اجتماعی و یا در رابطه با دیگران احساس خجالت کرده‌اید؟', dim: 'INT' },
  { id: 22, text: 'آیا از هفته گذشته تا به امروز این احساس را داشته‌اید که در یک بن‌بست گیر کرده‌اید که راه پس و پیش ندارید؟', dim: 'DEP' },
  { id: 23, text: 'آیا از هفته گذشته تا به امروز ناگهان و بدون دلیل دچار ترس شده‌اید؟', dim: 'ANX' },
  { id: 24, text: 'آیا از هفته گذشته تا به امروز طوری عصبانی شده‌اید که نتوانید جلو خودتان را بگیرید (به اصطلاح از کوره در رفته‌اید)؟', dim: 'HOS' },
  { id: 25, text: 'آیا از هفته گذشته تا به امروز این احساس را داشته‌اید که بترسید تنها از خانه بیرون بروید؟', dim: 'PHOB' },
  { id: 26, text: 'آیا از هفته گذشته تا به امروز برای هر چیز کوچکی خود را سرزنش کرده‌اید؟', dim: 'DEP' },
  { id: 27, text: 'آیا از هفته گذشته تا به امروز کمر درد داشته‌اید؟', dim: 'SOM' },
  { id: 28, text: 'آیا از هفته گذشته تا به امروز احساس کرده‌اید که کارهایتان پیشرفت نمی‌کند؟', dim: 'OC' },
  { id: 29, text: 'آیا از هفته گذشته تا به امروز احساس تنهایی کرده‌اید؟', dim: 'DEP' },
  { id: 30, text: 'آیا از هفته گذشته تا به امروز احساس غمگینی داشته‌اید؟', dim: 'DEP' },
  { id: 31, text: 'آیا از هفته گذشته تا به امروز برای هر چیز به شدت نگران و دلواپس شده‌اید؟', dim: 'DEP' },
  { id: 32, text: 'آیا از هفته گذشته تا به امروز نسبت به همه چیز بی‌علاقه شده‌اید؟', dim: 'DEP' },
  { id: 33, text: 'آیا از هفته گذشته تا به امروز احساس ترس داشته‌اید؟', dim: 'ANX' },
  { id: 34, text: 'آیا از هفته گذشته تا به امروز حساس و زودرنج شده‌اید؟', dim: 'INT' },
  { id: 35, text: 'آیا از هفته گذشته تا به امروز این احساس را داشته‌اید که سایرین از افکار خصوصی شما که به کسی نگفته‌اید باخبر می‌شوند؟', dim: 'PSY' },
  { id: 36, text: 'آیا از هفته گذشته تا به امروز این اعتقاد را داشته‌اید که دیگران شما را درک نمی‌کنند و یا با شما همدردی نمی‌کنند؟', dim: 'INT' },
  { id: 37, text: 'آیا از هفته گذشته تا به امروز این احساس را داشته‌اید که مردم نسبت به شما مهربان نیستند یا شما را دوست ندارند؟', dim: 'INT' },
  { id: 38, text: 'آیا از هفته گذشته تا به امروز برای اینکه کارها را درست انجام بدهید مجبور بوده‌اید آهسته کار کنید؟', dim: 'OC' },
  { id: 39, text: 'آیا از هفته گذشته تا به امروز تپش قلب داشته‌اید؟', dim: 'ANX' },
  { id: 40, text: 'آیا از هفته گذشته تا به امروز حالت تهوع یا دل‌به‌هم‌خوردگی داشته‌اید؟', dim: 'SOM' },
  { id: 41, text: 'آیا از هفته گذشته تا به امروز احساس حقارت داشته‌اید یا خود را از دیگران کمتر یا پایین‌تر حس کرده‌اید؟', dim: 'INT' },
  { id: 42, text: 'آیا از هفته گذشته تا به امروز احساس درد و کوفتگی در عضلات بدنتان داشته‌اید؟', dim: 'SOM' },
  { id: 43, text: 'آیا از هفته گذشته تا به امروز این احساس را داشته‌اید که دیگران شما را زیر نظر دارند یا درباره شما حرف می‌زنند؟', dim: 'PAR' },
  { id: 44, text: 'آیا از هفته گذشته تا به امروز در به خواب رفتن مشکل داشته‌اید؟', dim: 'ADD' },
  { id: 45, text: 'آیا از هفته گذشته تا به امروز وقتی کاری را انجام می‌دادید مجبور بوده‌اید آن را چند بار تکرار کنید تا مطمئن شوید درست انجام داده‌اید؟', dim: 'OC' },
  { id: 46, text: 'آیا از هفته گذشته تا به امروز در تصمیم گرفتن مشکل داشته‌اید؟', dim: 'OC' },
  { id: 47, text: 'آیا از هفته گذشته تا به امروز از مسافرت با اتوبوس یا قطار احساس ترس کرده‌اید؟', dim: 'PHOB' },
  { id: 48, text: 'آیا از هفته گذشته تا به امروز احساس تنگی نفس داشته‌اید؟', dim: 'SOM' },
  { id: 49, text: 'آیا از هفته گذشته تا به امروز دچار حالت گرگرفتگی یا سرما شده‌اید؟', dim: 'SOM' },
  { id: 50, text: 'آیا از هفته گذشته تا به امروز مجبور بوده‌اید بعضی کارها را نکنید یا بعضی جاها نروید؟', dim: 'PHOB' },
  { id: 51, text: 'آیا از هفته گذشته تا به امروز اتفاق افتاده که حس کنید مغزتان کار نمی‌کند؟', dim: 'OC' },
  { id: 52, text: 'آیا از هفته گذشته تا به امروز احساس کرده‌اید بدنتان خواب می‌رود یا گزگز (مورمور) می‌شود؟', dim: 'SOM' },
  { id: 53, text: 'آیا از هفته گذشته تا به امروز در گلویتان احساس گرفتگی کرده‌اید مثل اینکه چیزی در گلویتان گیر کرده باشد؟', dim: 'SOM' },
  { id: 54, text: 'آیا از هفته گذشته تا به امروز احساس کرده‌اید که نسبت به آینده امید خود را از دست داده‌اید؟', dim: 'DEP' },
  { id: 55, text: 'آیا از هفته گذشته تا به امروز تمرکز حواس نداشته‌اید؟ یعنی در جمع کردن حواس خود روی کارها مشکل داشته‌اید؟', dim: 'OC' },
  { id: 56, text: 'آیا از هفته گذشته تا به امروز در بعضی از قسمت‌های بدن خود احساس ضعف و سستی داشته‌اید؟', dim: 'SOM' },
  { id: 57, text: 'آیا از هفته گذشته تا به امروز دچار فشارهای روحی و گرفتگی بوده‌اید؟', dim: 'ANX' },
  { id: 58, text: 'آیا از هفته گذشته تا به امروز در دست‌ها و پاها احساس سنگینی کرده‌اید؟', dim: 'SOM' },
  { id: 59, text: 'آیا از هفته گذشته تا به امروز زیاد به فکر مرگ و مردن بوده‌اید؟', dim: 'ADD' },
  { id: 60, text: 'آیا از هفته گذشته تا به امروز پرخوری داشته‌اید؟', dim: 'ADD' },
  { id: 61, text: 'آیا از هفته گذشته تا به امروز وقتی مردم به شما نگاه می‌کنند یا درباره شما حرف می‌زنند احساس ناراحتی می‌کنید؟', dim: 'INT' },
  { id: 62, text: 'آیا از هفته گذشته تا به امروز افکاری به ذهنتان آمده که حس کنید مال خودتان نیست و دیگران آن‌ها را توی مغز شما گذاشته‌اند؟', dim: 'PSY' },
  { id: 63, text: 'آیا از هفته گذشته تا به امروز در خودتان میل شدیدی به آزار رساندن و زدن دیگران احساس کرده‌اید؟', dim: 'HOS' },
  { id: 64, text: 'آیا از هفته گذشته تا به امروز بعضی صبح‌ها زودتر از حد معمول بیدار شده‌اید؟', dim: 'ADD' },
  { id: 65, text: 'آیا از هفته گذشته تا به امروز مجبور بوده‌اید بعضی کارها همچون شستن، شمردن و دست زدن به اشیاء را تکرار کنید؟', dim: 'OC' },
  { id: 66, text: 'آیا از هفته گذشته تا به امروز دچار بدخوابی بوده‌اید و یا چندین بار در شب از خواب بیدار شده‌اید؟', dim: 'ADD' },
  { id: 67, text: 'آیا از هفته گذشته تا به امروز میل شدیدی به شکستن اشیاء و خرد کردن آن‌ها داشته‌اید؟', dim: 'HOS' },
  { id: 68, text: 'آیا از هفته گذشته تا به امروز این احساس را داشته‌اید که دارای افکار و عقایدی هستید که مخصوص خودتان است و دیگران آن را ندارند؟', dim: 'PAR' },
  { id: 69, text: 'آیا از هفته گذشته تا به امروز در موقع روبرو شدن با دیگران زیاد از حد به رفتار و حرکات خود توجه داشته‌اید؟', dim: 'INT' },
  { id: 70, text: 'آیا از هفته گذشته تا به امروز وقتی در جمع بوده‌اید و همچنین در بازار و مهمانی‌ها احساس ناراحتی کرده‌اید؟', dim: 'PHOB' },
  { id: 71, text: 'آیا از هفته گذشته تا به امروز حتی کارهای کوچک برایتان سخت و مشکل بوده است؟', dim: 'DEP' },
  { id: 72, text: 'آیا از هفته گذشته تا به امروز دچار هول و وحشت‌زدگی شده‌اید؟', dim: 'ANX' },
  { id: 73, text: 'آیا از هفته گذشته تا به امروز در مقابل دیگران یا جمع از اینکه چیزی بخورید احساس ناراحتی کرده‌اید؟', dim: 'INT' },
  { id: 74, text: 'آیا از هفته گذشته تا به امروز با مردم زیاد جر و بحث و درگیری داشته‌اید؟', dim: 'HOS' },
  { id: 75, text: 'آیا از هفته گذشته تا به امروز از تنها ماندن ترس و واهمه داشته‌اید؟', dim: 'PHOB' },
  { id: 76, text: 'آیا از هفته گذشته تا به امروز این احساس را داشته‌اید که دیگران ارزشی برای کارهایتان قائل نیستند؟', dim: 'PAR' },
  { id: 77, text: 'آیا از هفته گذشته تا به امروز حتی وقتی با دیگران بوده‌اید احساس تنهایی کرده‌اید؟', dim: 'PSY' },
  { id: 78, text: 'آیا از هفته گذشته تا به امروز گاهی طوری ناراحت و بی‌قرار شده‌اید که نتوانید یک‌جا آرام بگیرید؟', dim: 'ANX' },
  { id: 79, text: 'آیا از هفته گذشته تا به امروز احساس بی‌مصرفی و به درد نخوردن داشته‌اید؟', dim: 'DEP' },
  { id: 80, text: 'آیا از هفته گذشته تا به امروز این احساس را داشته‌اید که اتفاق بدی برایتان خواهد افتاد؟', dim: 'ANX' },
  { id: 81, text: 'آیا از هفته گذشته تا به امروز داد و فریاد راه انداخته‌اید و یا چیزهایی را پرتاب کرده‌اید؟', dim: 'HOS' },
  { id: 82, text: 'آیا از هفته گذشته تا به امروز ترس از افتادن و از حال رفتن در کوچه و خیابان یا در انظار مردم داشته‌اید؟', dim: 'PHOB' },
  { id: 83, text: 'آیا از هفته گذشته تا به امروز این احساس را داشته‌اید که اگر به دیگران رو بدهید از شما سوءاستفاده می‌کنند؟', dim: 'PAR' },
  { id: 84, text: 'آیا از هفته گذشته تا به امروز درباره امور جنسی افکاری داشته‌اید که شما را نگران کند؟', dim: 'PSY' },
  { id: 85, text: 'آیا از هفته گذشته تا به امروز این اعتقاد را داشته‌اید که به خاطر گناهانی که مرتکب شده‌اید مستوجب تنبیه و مجازات هستید؟', dim: 'PSY' },
  { id: 86, text: 'آیا از هفته گذشته تا به امروز اعتقاد و تصورات ترس‌آمیز داشته‌اید؟', dim: 'ANX' },
  { id: 87, text: 'آیا از هفته گذشته تا به امروز این احساس را داشته‌اید که عیب و نقص مهمی در بدنتان پیدا شده است؟', dim: 'PSY' },
  { id: 88, text: 'آیا از هفته گذشته تا به امروز احساس کرده‌اید که در این دنیا با کسی صمیمی نیستید؟', dim: 'PSY' },
  { id: 89, text: 'آیا از هفته گذشته تا به امروز احساس گناه و تقصیر داشته‌اید؟', dim: 'ADD' },
  { id: 90, text: 'آیا از هفته گذشته تا به امروز احساس کرده‌اید که دچار بیماری فکری شده‌اید؟', dim: 'PSY' },
];

export const SCL_OPTIONS = [
  { val: 0, label: '۰. هیچ (به هیچ وجه این حالت را نداشته‌ام)' },
  { val: 1, label: '۱. کمی (به مقدار کم اذیت شده‌ام)' },
  { val: 2, label: '۲. تا حدی (به حد متوسط احساس شده است)' },
  { val: 3, label: '۳. زیاد (بسیار آزاردهنده بوده است)' },
  { val: 4, label: '۴. بسیار زیاد (شدیداً بر زندگی‌ام تأثیر گذاشته است)' },
];

export const DIMENSIONS_INFO: Record<
  SclDimension,
  { name: string; full: string; desc: string; count: number; color: string }
> = {
  SOM: {
    name: 'شکایات جسمانی (SOM)',
    full: 'جسمانی‌سازی و ناراحتی‌های بدنی',
    desc: '۱۲ گویه (سردرد، دردهای عضلانی، ناراحتی‌های قلبی-عروقی، گوارشی و تنگی نفس)',
    count: 12,
    color: 'var(--color-primary)',
  },
  OC: {
    name: 'وسواس و اجبار (O-C)',
    full: 'افکار وسواسی و اعمال اجباری',
    desc: '۱۰ گویه (تکرار اعمال، افکار ناخواسته، دشواری در تصمیم‌گیری و فراموشکاری)',
    count: 10,
    color: 'var(--color-accent)',
  },
  INT: {
    name: 'حساسیت بین‌فردی (INT)',
    full: 'حساسیت در روابط متقابل',
    desc: '۹ گویه (احساس حقارت، خودکم‌بینی، خجالت و ناراحتی در تعامل با دیگران)',
    count: 9,
    color: 'var(--color-primary-dark)',
  },
  DEP: {
    name: 'افسردگی (DEP)',
    full: 'نشانگان بالینی افسردگی',
    desc: '۱۳ گویه (خلق پایین، بی‌انگیزگی، احساس تنهایی، درماندگی و افکار خودکشی)',
    count: 13,
    color: 'var(--status-cancelled-text)',
  },
  ANX: {
    name: 'اضطراب (ANX)',
    full: 'نشانگان اضطراب و تشویش',
    desc: '۱۰ گویه (تنش، لرزش، احساس هراس، دلشوره، تپش قلب و بی‌قراری مداوم)',
    count: 10,
    color: 'var(--status-pending-text)',
  },
  HOS: {
    name: 'پرخاشگری و خصومت (HOS)',
    full: 'خصومت و تحریک‌پذیری',
    desc: '۶ گویه (خشم، تمایل به شکستن اشیاء، داد و فریاد و مشاجره با دیگران)',
    count: 6,
    color: 'var(--status-cancelled-text)',
  },
  PHOB: {
    name: 'ترس مرضی / فوبیا (PHOB)',
    full: 'فوبیا و گذارهراسی',
    desc: '۷ گویه (ترس‌های نامعقول و اجتناب از مکان‌های باز، بازار، تنهایی و مسافرت)',
    count: 7,
    color: 'var(--color-accent)',
  },
  PAR: {
    name: 'افکار پارانوئیدی (PAR)',
    full: 'سوءظن و بدبینی',
    desc: '۶ گویه (فرافکنی، احساس تحت‌نظر بودن و عدم اعتماد به دیگران)',
    count: 6,
    color: 'var(--color-primary-dark)',
  },
  PSY: {
    name: 'روان‌پریشی (PSY)',
    full: 'روان‌گسسته‌گرایی و بیگانگی',
    desc: '۱۰ گویه (انزوای شدید، کنترل فکر و احساس گسستگی روانی از جهان)',
    count: 10,
    color: 'var(--status-cancelled-text)',
  },
  ADD: {
    name: 'سؤالات تکمیلی (ADD)',
    full: 'نشانه‌های ویژه بالینی',
    desc: '۷ گویه (خواب، اشتها، افکار مرگ، احساس گناه و پرخوری)',
    count: 7,
    color: 'var(--text-secondary)',
  },
};

export const CRITICAL_ITEMS_MAP = [
  { id: 19, title: 'زود به گریه افتادن', flag: 'افسردگی و شکنندگی هیجانی' },
  { id: 44, title: 'مشکل در به خواب رفتن', flag: 'اضطراب و استرس' },
  { id: 59, title: 'فکر زیاد به مرگ و مردن', flag: 'افسردگی شدید و نیازمند مراقبت' },
  { id: 60, title: 'پرخوری عصبی', flag: 'افسردگی آتیپیک و تنظیم هیجان' },
  { id: 64, title: 'زود بیدار شدن از خواب صبحگاهی', flag: 'افسردگی ملانکولیک' },
  { id: 66, title: 'بدخوابی و بیدار شدن مکرر در شب', flag: 'نشانگان اضطراب/افسردگی' },
  { id: 89, title: 'احساس گناه و تقصیر', flag: 'مالیخولیا و خودسرزنشی' },
];

export function Scl90QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const resultSavedRef = useRef(false);

  const [screen, setScreen] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [consent, setConsent] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(SCL_QUESTIONS.length).fill(null)
  );

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
    if (currentIndex < SCL_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 220);
    }
  };

  const handleNext = () => {
    if (answers[currentIndex] === null) {
      alert('لطفاً یکی از ۵ گزینه را برای این سؤال انتخاب فرمایید.');
      return;
    }
    if (currentIndex < SCL_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const unanswered = answers.findIndex((a) => a === null);
      if (unanswered !== -1) {
        alert(`سؤال شماره ${unanswered + 1} هنوز بی‌پاسخ مانده است.`);
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
    setAnswers(new Array(SCL_QUESTIONS.length).fill(null));
    setConsent(false);
    setScreen('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // محاسبات بالینی دروگوتیس
  let totalRaw = 0;
  let pstCount = 0;
  const dimTotals: Record<SclDimension, number> = {
    SOM: 0,
    OC: 0,
    INT: 0,
    DEP: 0,
    ANX: 0,
    HOS: 0,
    PHOB: 0,
    PAR: 0,
    PSY: 0,
    ADD: 0,
  };

  SCL_QUESTIONS.forEach((q, idx) => {
    const val = answers[idx] ?? 0;
    totalRaw += val;
    if (val > 0) pstCount++;
    dimTotals[q.dim] += val;
  });

  // سه شاخص کلی
  const gsi = parseFloat((totalRaw / 90).toFixed(2));
  const pst = pstCount;
  const psdi = pst > 0 ? parseFloat((totalRaw / pst).toFixed(2)) : 0.0;

  // میانگین ابعاد
  const dimMeans: Record<SclDimension, number> = {
    SOM: parseFloat((dimTotals.SOM / DIMENSIONS_INFO.SOM.count).toFixed(2)),
    OC: parseFloat((dimTotals.OC / DIMENSIONS_INFO.OC.count).toFixed(2)),
    INT: parseFloat((dimTotals.INT / DIMENSIONS_INFO.INT.count).toFixed(2)),
    DEP: parseFloat((dimTotals.DEP / DIMENSIONS_INFO.DEP.count).toFixed(2)),
    ANX: parseFloat((dimTotals.ANX / DIMENSIONS_INFO.ANX.count).toFixed(2)),
    HOS: parseFloat((dimTotals.HOS / DIMENSIONS_INFO.HOS.count).toFixed(2)),
    PHOB: parseFloat((dimTotals.PHOB / DIMENSIONS_INFO.PHOB.count).toFixed(2)),
    PAR: parseFloat((dimTotals.PAR / DIMENSIONS_INFO.PAR.count).toFixed(2)),
    PSY: parseFloat((dimTotals.PSY / DIMENSIONS_INFO.PSY.count).toFixed(2)),
    ADD: parseFloat((dimTotals.ADD / DIMENSIONS_INFO.ADD.count).toFixed(2)),
  };

  const answeredCount = answers.filter((a) => a !== null).length;
  const currentQ = SCL_QUESTIONS[currentIndex];

  // تحلیل سطح GSI
  let gsiStatus = {
    level: 'وضعیت مطلوب و بهنجار (Normal / Healthy)',
    badge: 'شاخص GSI کمتر از نقطه برش ۰.۷۰ (فاقد پریشانی معنادار)',
    color: 'var(--color-primary-dark)',
    bg: 'var(--badge-inperson-bg)',
    analysis: `شاخص شدت کلی شما (GSI = ${gsi}) و نمره خام کل (${totalRaw} از ۳۶۰) پایین‌تر از نقطه برش بالینی (۰.۷۰ و ۶۳) قرار دارد. این نتیجه نشان می‌دهد که در طول هفته گذشته سطح معناداری از آشفتگی، علائم روانی یا پریشانی عملکردی را تجربه نکرده‌اید و سلامت روانی عمومی شما در محدوده مطلوب جامعه ارزیابی می‌شود.`,
  };

  if (gsi >= 1.5) {
    gsiStatus = {
      level: 'نشانگان آشفتگی بالینی معنادار (Clinically Significant Distress)',
      badge: 'شاخص GSI بالاتر از ۱.۵ (نیازمند ارزیابی بالینی تخصصی)',
      color: 'var(--status-cancelled-text)',
      bg: 'var(--status-cancelled-bg)',
      analysis: `شاخص شدت کلی شما (GSI = ${gsi}) نشان‌دهنده برافراشتگی چشمگیر در چندین بعد بالینی است. طبق راهنمای تفسیر SCL-90-R، نمرات بالای ۱.۵ بیانگر تأثیر محسوس نشانه‌های روان‌شناختی بر کیفیت زندگی، روابط یا عملکرد شغلی/تحصیلی است. مراجعه به یک روان‌شناس یا روان‌پزشک جهت ارزیابی دقیق‌تر و مصاحبه بالینی توصیه می‌شود.`,
    };
  } else if (gsi >= 0.7) {
    gsiStatus = {
      level: 'پریشانی روانی خفیف تا متوسط (Mild-Moderate Distress)',
      badge: 'شاخص GSI بالاتر از نقطه برش ۰.۷۰ (نیازمند پایش و توجه)',
      color: 'var(--status-pending-text)',
      bg: 'var(--status-pending-bg)',
      analysis: `شاخص شدت کلی شما (GSI = ${gsi}) بالاتر از نقطه برش استاندارد (۰.۷۰) است که حاکی از تجربه سطوحی از ناراحتی‌های هیجانی یا جسمانی طی هفته گذشته می‌باشد. شما به ${pst} علامت روانی اذعان داشته‌اید. بررسی ابعاد دارای برافراشتگی و به‌کارگیری مهارت‌های خودآگاهی و مدیریت استرس توصیه می‌شود.`,
    };
  }

  useEffect(() => {
    if (screen !== 'result') return;
    if (resultSavedRef.current) return;

    resultSavedRef.current = true;

    saveAssessmentResult({
      testType: 'SCL-90-R (نشانه‌های روانی)',
      result: `شاخص کلی GSI: ${gsi} (${gsiStatus.level}) | تعداد نشانه‌ها PST: ${pst}/۹۰ | شدت PSDI: ${psdi} | نمره کل خام: ${totalRaw}/۳۶۰`,
    });
  }, [screen, gsi, gsiStatus.level, pst, psdi, totalRaw]);

  return (
    <>
      <main className="container" style={{ paddingTop: '110px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <Link to="/assessments" className="back-link">
              ← بازگشت به لیست آزمون‌های روانشناسی
            </Link>
          </div>

          {/* =========================================================
              ۱. صفحه معرفی و دستورالعمل
             ========================================================= */}
          {screen === 'intro' && (
            <Reveal className="dass-card glass">
              <div className="meta-pills">
                <span className="pill">مدت زمان: ۱۵ الی ۲۰ دقیقه</span>
                <span className="pill">۹۰ سؤال استاندارد</span>
                <span className="pill">چک‌لیست لئونارد دروگوتیس</span>
                <span className="pill">۹ بعد بالینی + ۳ شاخص کلان</span>
              </div>

              <h1 className="dass-title">پرسشنامه نشانه‌های روانی (SCL-90-R)</h1>
              <p className="dass-subtitle">
                ابزار جامع، چندبُعدی و استاندارد جهانی برای ارزیابی و غربالگری نوع و شدت نشانه‌های روان‌شناختی در طول یک هفته گذشته
              </p>

              <div className="dass-disclaimer">
                ⚠️ پرسشنامه SCL-90-R یک ابزار غربالگری خودگزارشی است و نمرات آن جنبه توصیفی دارند و جایگزین تشخیص قطعی روان‌پزشک یا روان‌شناس بالینی نیستند.
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '14px',
                  margin: '22px 0',
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
                    ۹۰ سؤال
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
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>طیف نمره‌دهی</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-dark)', marginTop: '4px' }}>
                    ۰ تا ۴ (۵ درجه‌ای)
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
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>شاخص‌های کلان</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-dark)', marginTop: '4px' }}>
                    GSI ، PST و PSDI
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
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ابعاد بالینی</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-dark)', marginTop: '4px' }}>
                    ۹ بُعد تشخیصی
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
                  ابعاد نه‌گانه مورد ارزیابی در پرسشنامه SCL-90-R:
                </h3>
                <ul style={{ paddingRight: '20px', fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.9' }}>
                  <li><strong>شکایات جسمانی (SOM):</strong> ناراحتی‌های قلبی، تنفسی، گوارشی، سردرد و دردهای عضلانی.</li>
                  <li><strong>وسواس و اجبار (O-C):</strong> افکار و تکانه‌های ناخواسته و رفتارهای تکراری اجباری.</li>
                  <li><strong>حساسیت بین‌فردی (INT):</strong> احساس حقارت، خودکم‌بینی و ناراحتی در تعامل با دیگران.</li>
                  <li><strong>افسردگی (DEP):</strong> خلق پایین، بی‌علاقگی، فقدان انگیزه و افکار خودکشی.</li>
                  <li><strong>اضطراب (ANX):</strong> تنش، لرزش، هراس، بی‌قراری و علائم جسمانی اضطراب.</li>
                  <li><strong>پرخاشگری و خصومت (HOS):</strong> احساس خشم، تحریک‌پذیری، مشاجره و تهاجم.</li>
                  <li><strong>ترس مرضی / فوبیا (PHOB):</strong> ترس نامعقول از مکان‌های باز، مسافرت، بازار و تنهایی.</li>
                  <li><strong>افکار پارانوئیدی (PAR):</strong> سوءظن، بدبینی، ترس از سوءاستفاده و فرافکنی.</li>
                  <li><strong>روان‌پریشی (PSY):</strong> انزوا و گوشه‌گیری تا احساس کنترل فکر توسط دیگران.</li>
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
                  توضیحات و دستورالعمل آزمون را مطالعه نمودم و آماده پاسخ‌گویی دقیق به ۹۰ گویه هستم.
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
                شروع آزمون جامع ۹۰ سؤالی SCL-90-R
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
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    marginBottom: '8px',
                  }}
                >
                  <span>
                    سؤال <strong style={{ color: 'var(--text-primary)' }}>{currentQ.id}</strong> از ۹۰
                  </span>
                  <span>{Math.round(((currentIndex + 1) / SCL_QUESTIONS.length) * 100)}٪</span>
                </div>
                <div className="progress-bar-track" style={{ height: '8px', background: 'var(--header-bg)' }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${((currentIndex + 1) / SCL_QUESTIONS.length) * 100}%`,
                      background: 'var(--color-primary)',
                    }}
                  />
                </div>
              </div>

              {/* متن سؤال */}
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
                  {DIMENSIONS_INFO[currentQ.dim].name}
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  طی هفته گذشته تا به امروز، این مسئله تا چه اندازه باعث ناراحتی شما شده است؟
                </div>

                <h2
                  style={{
                    fontSize: '19px',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginBottom: '22px',
                    lineHeight: '1.7',
                  }}
                >
                  {currentQ.text}
                </h2>

                {/* گزینه‌های ۵ درجه‌ای */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {SCL_OPTIONS.map((opt) => {
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
                          padding: '13px 18px',
                          borderRadius: '14px',
                          border: isSelected
                            ? '2px solid var(--color-primary-dark)'
                            : '1px solid var(--border-glass)',
                          background: isSelected ? 'var(--badge-inperson-bg)' : 'var(--header-bg)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          textAlign: 'right',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <span style={{ fontSize: '14.5px', fontWeight: isSelected ? 700 : 500 }}>
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

              {/* ناوبری */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '28px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--border-glass)',
                }}
              >
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="btn-outline-pill"
                  style={{
                    opacity: currentIndex === 0 ? 0.4 : 1,
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  ← سؤال قبلی
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary-pill"
                >
                  {currentIndex === SCL_QUESTIONS.length - 1 ? 'مشاهده و تحلیل کارنامه' : 'سؤال بعدی →'}
                </button>
              </div>

              {/* دسترسی سریع به ۹۰ سؤال */}
              <div
                style={{
                  marginTop: '26px',
                  padding: '16px',
                  background: 'var(--header-bg)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-glass)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    marginBottom: '10px',
                  }}
                >
                  <span>دسترسی سریع به سؤالات:</span>
                  <span>{answeredCount} از ۹۰ پاسخ داده شده</span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(30px, 1fr))',
                    gap: '5px',
                    maxHeight: '150px',
                    overflowY: 'auto',
                    padding: '4px',
                  }}
                >
                  {SCL_QUESTIONS.map((q, idx) => {
                    const isAnswered = answers[idx] !== null;
                    const isCurrent = idx === currentIndex;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        style={{
                          height: '28px',
                          borderRadius: '6px',
                          border: isCurrent
                            ? '2px solid var(--color-primary-dark)'
                            : '1px solid var(--border-glass)',
                          background: isCurrent
                            ? 'var(--color-primary-dark)'
                            : isAnswered
                            ? 'var(--badge-inperson-bg)'
                            : 'var(--bg-main)',
                          color: isCurrent
                            ? '#ffffff'
                            : isAnswered
                            ? 'var(--color-primary-dark)'
                            : 'var(--text-secondary)',
                          fontSize: '11px',
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
              ۳. صفحه کارنامه و گزارش جامع بالینی
             ========================================================= */}
          {screen === 'result' && (
            <Reveal className="dass-card glass">
              
              {/* بنر امتیاز کل GSI */}
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
                  شاخص شدت کلی ناراحتی (GSI - Global Severity Index)
                </div>
                <div
                  style={{
                    fontSize: '52px',
                    fontWeight: 900,
                    color: 'var(--color-primary-dark)',
                    lineHeight: '1.1',
                    marginBottom: '8px',
                  }}
                >
                  {gsi.toFixed(2)} <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-secondary)' }}>از ۴.۰۰</span>
                </div>
                <div style={{ fontSize: '19px', fontWeight: 800, color: gsiStatus.color, marginBottom: '10px' }}>
                  {gsiStatus.level}
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '6px 18px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: gsiStatus.bg,
                    color: gsiStatus.color,
                  }}
                >
                  {gsiStatus.badge}
                </div>
              </div>

              {/* شاخص‌های سه‌گانه کلی */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
                  📊 شاخص‌های سه‌گانه کلی آسیب‌شناسی روانی (Global Indices)
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '14px',
                  }}
                >
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
                      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '2px' }}>
                        شاخص شدت کلی (GSI)
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                        Global Severity Index
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
                        {gsi.toFixed(2)}
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                      بهترین شاخص سطح عمق اختلالات. نقطه برش بالینی برابر با ۰.۷۰ است.
                    </p>
                  </div>

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
                      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-accent)', marginBottom: '2px' }}>
                        تعداد نشانه‌های مثبت (PST)
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                        Positive Symptom Total
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-accent)', marginBottom: '8px' }}>
                        {pst} <span style={{ fontSize: '14px', fontWeight: 600 }}>از ۹۰</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                      تعداد کل علائمی که با شدت ۱ تا ۴ تجربه کرده‌اید (بیانگر تنوع و گستردگی علائم).
                    </p>
                  </div>

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
                      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '2px' }}>
                        شاخص ناراحتی علائم (PSDI)
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                        Positive Symptom Distress
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-primary)', marginBottom: '8px' }}>
                        {psdi.toFixed(2)}
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                      میانگین خالص شدت ناراحتی در نشانه‌هایی که گزارش داده‌اید (مجموع نمرات تقسیم بر PST).
                    </p>
                  </div>
                </div>
              </div>

              {/* پروفایل نمرات ابعاد نه‌گانه بالینی */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  🎯 پروفایل نمرات در ابعاد نه‌گانه بالینی (Symptom Dimensions)
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  نمرات بر پایه میانگین گویه‌ها (از ۰ تا ۴) محاسبه شده‌اند (میانگین بالای ۱.۵ قابل‌توجه و بالای ۲.۵ مرضی و بالینی محسوب می‌شود):
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {(Object.keys(DIMENSIONS_INFO) as SclDimension[]).map((dimKey) => {
                    if (dimKey === 'ADD') return null; // جداگانه نمایش داده می‌شود
                    const info = DIMENSIONS_INFO[dimKey];
                    const mean = dimMeans[dimKey];
                    const pct = Math.min(100, Math.round((mean / 4) * 100));

                    let statusText = 'طبیعی (زیر ۱.۵)';
                    let statusColor = 'var(--color-primary-dark)';
                    let statusBg = 'var(--badge-inperson-bg)';

                    if (mean >= 3.0) {
                      statusText = 'اختلال جدی (بالای ۳)';
                      statusColor = 'var(--status-cancelled-text)';
                      statusBg = 'var(--status-cancelled-bg)';
                    } else if (mean >= 2.5) {
                      statusText = 'مرضی و بالینی (۲.۵ تا ۳)';
                      statusColor = 'var(--status-cancelled-text)';
                      statusBg = 'var(--status-cancelled-bg)';
                    } else if (mean >= 1.5) {
                      statusText = 'متوسط و قابل‌توجه';
                      statusColor = 'var(--status-pending-text)';
                      statusBg = 'var(--status-pending-bg)';
                    }

                    return (
                      <div
                        key={dimKey}
                        style={{
                          background: 'var(--header-bg)',
                          border: '1px solid var(--border-glass)',
                          borderRadius: '14px',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '4px',
                            }}
                          >
                            <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-primary)' }}>
                              {info.name}
                            </span>
                            <span
                              style={{
                                fontSize: '14px',
                                fontWeight: 800,
                                color: mean >= 2.5 ? 'var(--status-cancelled-text)' : 'var(--color-primary-dark)',
                              }}
                            >
                              {mean.toFixed(2)}
                            </span>
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                            {info.desc}
                          </div>
                        </div>

                        <div>
                          <div className="progress-bar-track" style={{ height: '7px', background: 'var(--bg-main)' }}>
                            <div
                              className="progress-bar-fill"
                              style={{
                                width: `${pct}%`,
                                background:
                                  mean >= 2.5
                                    ? 'var(--status-cancelled-text)'
                                    : mean >= 1.5
                                    ? 'var(--color-accent)'
                                    : 'var(--color-primary)',
                              }}
                            />
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginTop: '8px',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: statusBg,
                                color: statusColor,
                              }}
                            >
                              {statusText}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                              مجموع نمره: {dimTotals[dimKey]}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* گویه‌های حساس بالینی */}
              <div
                style={{
                  background: 'var(--header-bg)',
                  borderRadius: '16px',
                  padding: '22px',
                  border: '1px solid var(--border-glass)',
                  marginBottom: '24px',
                }}
              >
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--status-cancelled-text)', marginBottom: '8px' }}>
                  ⚠️ ارزیابی گویه‌های حساس بالینی و تکمیلی (Critical Items)
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  ۷ سؤال تکمیلی به طور اختصاصی نشانه‌های مهم بالینی در زمینه‌های خواب، اشتها، افکار مرگ و گناه را بررسی می‌کنند:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px' }}>
                  {CRITICAL_ITEMS_MAP.map((item) => {
                    const val = answers[item.id - 1] ?? 0;
                    const opt = SCL_OPTIONS.find((o) => o.val === val);
                    const isHigh = val >= 2;
                    return (
                      <div
                        key={item.id}
                        style={{
                          background: isHigh ? 'var(--status-cancelled-bg)' : 'var(--icon-bg)',
                          border: isHigh ? '1px solid var(--border-glass)' : '1px solid var(--border-glass)',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          fontSize: '13px',
                          color: isHigh ? 'var(--status-cancelled-text)' : 'var(--text-primary)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <strong>سؤال {item.id} ({item.title}):</strong>
                          <div style={{ fontSize: '11.5px', opacity: 0.85 }}>{item.flag}</div>
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '12px' }}>
                          نمره {val} ({opt?.label.split(' ')[1] || 'هیچ'})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* تفسیر جامع روان‌شناختی */}
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
                  🧠 تحلیل بالینی و تفسیر روان‌شناختی وضعیت شما
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.85', textAlign: 'justify', margin: 0 }}>
                  {gsiStatus.analysis}
                </p>
              </div>

              {/* کارت تحلیل هوشمند هوش مصنوعی پناه */}
              <div style={{ marginBottom: '24px' }}>
                <SmartAnalysisCard
                  testType="SCL-90-R (نشانه‌های روانی)"
                  testResult={`شاخص کلی شدت (GSI): ${gsi} (${gsiStatus.level}). تعداد علائم مثبت (PST): ${pst} از ۹۰. میانگین ابعاد: شکایات جسمانی ${dimMeans.SOM}، وسواس ${dimMeans.OC}، حساسیت فردی ${dimMeans.INT}، افسردگی ${dimMeans.DEP}، اضطراب ${dimMeans.ANX}، پرخاشگری ${dimMeans.HOS}، فوبیا ${dimMeans.PHOB}، پارانوئید ${dimMeans.PAR}، روان‌پریشی ${dimMeans.PSY}.`}
                  userAnswers={answers.map(
                    (v, i) =>
                      `${SCL_QUESTIONS[i].text}: ${v !== null ? SCL_OPTIONS[v]?.label : 'بدون پاسخ'}`
                  )}
                />
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
