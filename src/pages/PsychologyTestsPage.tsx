import React from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';

export interface AssessmentItem {
  id: string;
  title: string;
  description: string;
  time: string;
  questions: string;
  status: 'active' | 'soon';
  link?: string;
}

const ASSESSMENTS: AssessmentItem[] = [
  {
    id: 'rosenberg',
    title: 'آزمون عزت نفس روزنبرگ (RSES)',
    description:
      'یکی از شناخته‌شده‌ترین ابزارهای سنجش عزت نفس در دنیا برای سنجش میزان خودارزشمندی و نگرش مثبت به خود.',
    time: '۳ دقیقه',
    questions: '۱۰ سؤال',
    status: 'active',
    link: '/assessments/rosenberg',
  },
  {
    id: 'gad-7',
    title: 'آزمون GAD-7 (غربالگری اضطراب فراگیر)',
    description:
      'سنجش میزان نشانه‌های اضطراب فراگیر و عمومی در دو هفته‌ی اخیر برای ارزیابی سطح اضطراب فعلی.',
    time: '۲ دقیقه',
    questions: '۷ سؤال',
    status: 'active',
    link: '/assessments/gad-7',
  },
  {
    id: 'dass-21',
    title: 'آزمون DASS-21 (افسردگی، اضطراب، استرس)',
    description:
      'سنجش سه‌بعدی میزان افسردگی، اضطراب و استرس روانی در دو هفته‌ی اخیر. آزمونی استاندارد و معتبر برای خودشناسی اولویه.',
    time: '۵ دقیقه',
    questions: '۲۱ سؤال',
    status: 'active',
    link: '/assessments/dass-21',
  },
  {
    id: 'mbti',
    title: 'آزمون شخصیت‌شناسی MBTI',
    description:
      'شناخت تیپ شخصیتی، ترجیحات فردی در تصمیم‌گیری و نحوه تعامل با جهان اطراف.',
    time: '۸–۱۰ دقیقه',
    questions: '۴۸ سؤال',
    status: 'active',
    link: '/assessments/mbti',
  },
  {
    id: 'beck-depression',
    title: 'آزمون افسردگی بک (BDI-II)',
    description:
      'ارزیابی دقیق و استاندارد شدت نشانه‌ها و علائم افسردگی در دو هفته‌ی اخیر.',
    time: '۵–۱۰ دقیقه',
    questions: '۲۱ سؤال',
    status: 'active',
    link: '/assessments/bdi-ii',
  },
  {
    id: 'beck-anxiety',
    title: 'پرسشنامه اضطراب بک (BAI)',
    description:
      'ارزیابی تخصصی شدت علائم اضطراب در ۳ بعد علائم بدنی، ذهنی و هراس در طول یک هفته گذشته.',
    time: '۵–۸ دقیقه',
    questions: '۲۱ سؤال',
    status: 'active',
    link: '/assessments/bai',
  },
  {
    id: 'scl-90',
    title: 'پرسشنامه نشانه‌های روانی (SCL-90-R)',
    description:
      'غربالگری و ارزیابی جامع نشانه‌های روان‌شناختی در ۹ بعد بالینی و ۳ شاخص کلان آسیب‌شناسی روانی (GSI, PST, PSDI).',
    time: '۱۵–۲۰ دقیقه',
    questions: '۹۰ سؤال',
    status: 'active',
    link: '/assessments/scl-90',
  },
  {
    id: 'cfi',
    title: 'آزمون انعطاف‌پذیری شناختی (CFI)',
    description:
      'سنجش توانایی چالش و جایگزینی افکار ناکارآمد با نگرش‌های سازنده، ادراک کنترل‌پذیری و خلق گزینه‌های چندگانه.',
    time: '۵–۱۰ دقیقه',
    questions: '۲۰ سؤال',
    status: 'active',
    link: '/assessments/cfi',
  },
  {
    id: 'bar-on',
    title: 'پرسشنامه هوش هیجانی بار-آن (Bar-On EQ-i)',
    description:
      'سنجش جامع ۱۵ مهارت هوش هیجانی و اجتماعی در ۵ حیطه درون‌فردی، بین‌فردی، سازگاری، مدیریت استرس و خلق عمومی.',
    time: '۱۵–۲۵ دقیقه',
    questions: '۹۰ سؤال',
    status: 'active',
    link: '/assessments/bar-on',
  },
  {
    id: 'neo-240',
    title: 'آزمون NEO',
    description:
      'پرسشنامه جامع ۲۴۰ سؤالی ارزیابی شخصیت (NEO PI-R) برای سنجش دقیق ۵ عامل اصلی و ۳۰ ویژگی و خرده‌مقیاس تخصصی شخصیتی.',
    time: '۳۰–۴۵ دقیقه',
    questions: '۲۴۰ سؤال',
    status: 'active',
    link: '/assessments/neo',
  },
  {
    id: 'neo-mff',
    title: 'آزمون ۵ عامل بزرگ شخصیت (NEO-FFI)',
    description:
      'ارزیابی پنج بعد اصلی شخصیت شامل روان‌رنجورخویی، برون‌گرایی، گشودگی، توافق‌پذیری و مسئولیت‌پذیری.',
    time: '۸–۱۰ دقیقه',
    questions: '۶۰ سؤال',
    status: 'active',
    link: '/assessments/neo-ffi',
  },
];

export function PsychologyTestsPage() {
  return (
    <>
      <main className="container" style={{ paddingTop: '110px', paddingBottom: '80px' }}>
        <Reveal className="assessments-header">
          <h1>آزمون‌های روانشناسی پناه</h1>
          <p>
            مجموعه‌ای از تست‌ها و ابزارهای استاندارد غربالگری برای سنجش خودشناسی، سلامت روان و وضعیت هیجانی شما.
          </p>
        </Reveal>

        <div className="assessments-grid">
          {ASSESSMENTS.map((test, index) => (
            <Reveal key={test.id} style={{ animationDelay: `${index * 0.08}s` }}>
              <div className="test-card">
                <div className="test-card-top">
                  {test.status === 'active' ? (
                    <span className="test-badge-active">● آماده پاسخ‌دهی</span>
                  ) : (
                    <span className="test-badge-soon">به‌زودی</span>
                  )}
                  <h2>{test.title}</h2>
                  <p>{test.description}</p>
                </div>

                <div>
                  <div className="test-meta">
                    <span>⏱ {test.time}</span>
                    <span>📝 {test.questions}</span>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    {test.status === 'active' && test.link ? (
                      <Link to={test.link} className="btn-primary-pill" style={{ width: '100%' }}>
                        ورود به آزمون
                      </Link>
                    ) : (
                      <button className="btn-outline-pill" disabled style={{ width: '100%', opacity: 0.65 }}>
                        در حال آماده‌سازی
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </main>
      <Footer isShort={true} />
    </>
  );
}
