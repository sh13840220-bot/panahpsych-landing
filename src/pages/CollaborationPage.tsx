import React from 'react';
import { Reveal, StaggerGrid, StaggerItem } from '../components/Reveal';
import { Footer } from '../components/Footer';
import CypressTreeAchievements from '../components/CypressTreeAchievements';

export function CollaborationPage() {
  return (
    <>
      <main className="collab-page">
        {/* Hero Section */}
        <section className="hero" style={{ paddingBottom: '32px' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <Reveal delay={0.05}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 18px',
                  borderRadius: '9999px',
                  background: 'var(--icon-bg)',
                  border: '1px solid var(--border-glass)',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                  marginBottom: '20px',
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                  <path d="M12 21c-4.97-3-8-6.5-8-10.5A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 8 4.5C20 14.5 16.97 18 12 21Z"></path>
                </svg>
                <span>راهنمای آغاز همکاری درمانگران • نسخه ۲.۰</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.25 }}>
                به پناه خوش آمدید
              </h1>
            </Reveal>

            <Reveal delay={0.15}>
              <p style={{ maxWidth: '680px', margin: '16px auto 0', color: 'var(--text-secondary)' }}>
                راهنمای جامع آشنایی با ارزش‌ها، فرآیندها و استانداردهای همکاری درمانگران در پناه
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div
                className="glass"
                style={{
                  maxWidth: '620px',
                  margin: '36px auto 0',
                  padding: '20px 28px',
                  borderRadius: '24px',
                  textAlign: 'center',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: 'var(--text-primary)',
                  borderRight: '4px solid var(--color-primary)',
                }}
              >
                «هر مراجعه، فرصتی برای تغییر یک زندگی است.»
              </div>
            </Reveal>
          </div>
        </section>

        {/* Founder Letter Section */}
        <section style={{ padding: '40px 0' }}>
          <div className="container">
            <Reveal className="glass" style={{ padding: '40px 36px', borderRadius: '28px', maxWidth: '860px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div
                  className="icon-wrap"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    background: 'var(--icon-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>چند کلمه از طرف بنیان‌گذار پناه</h2>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>پیام خوش‌آمدگویی سینا هاشمی</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', lineHeight: '2', color: 'var(--text-primary)', fontSize: '16.5px' }}>
                <p>سلام.</p>
                <p>
                  اگر این راهنما را می‌خوانید، احتمالاً به همکاری با پناه فکر می‌کنید و از همین حالا بابت وقتی که برای آشنایی با ما گذاشته‌اید از شما صمیمانه سپاسگزاریم.
                </p>

                <div
                  style={{
                    padding: '20px 24px',
                    borderRadius: '20px',
                    background: 'var(--icon-bg)',
                    border: '1px solid var(--border-glass)',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '18px',
                    color: 'var(--text-primary)',
                    margin: '12px 0',
                  }}
                >
                  «چرا مراجعه به روانشناس، با وجود نیاز بسیاری از مردم، هنوز برای خیلی‌ها سخت، ترسناک یا همراه با قضاوت است؟»
                </div>

                <p>
                  ما در پناه باور داریم که سلامت روان نباید یک موضوع لوکس یا دور از دسترس باشد. همان‌طور که مراجعه به پزشک برای سلامت جسم طبیعی است، مراجعه به روانشناس هم باید بخشی عادی و محترمانه از مراقبت از خود باشد. پناه تلاش می‌کند این مسیر را برای مردم ساده‌تر، امن‌تر و قابل اعتمادتر کند.
                </p>
                <p>
                  اگر شما هم به این نگاه باور دارید، بسیار خرسندیم که شاید بخشی از این مسیر ارزشمند را کنار هم طی کنیم.
                </p>

                <div style={{ marginTop: '20px', textAlign: 'left', fontWeight: 700, color: 'var(--text-primary)', fontSize: '17px' }}>
                  با احترام
                  <br />
                  <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-secondary)' }}>سینا هاشمی — بنیان‌گذار پناه</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* What is Panah? Section */}
        <section style={{ padding: '40px 0' }}>
          <div className="container">
            <Reveal className="section-title">
              <h2>پناه دقیقاً چیست؟</h2>
              <p>شفافیت در ماموریت و مسئولیت ما</p>
            </Reveal>

            <StaggerGrid className="bento-grid" staggerDelay={0.12}>
              <StaggerItem className="card-large glass">
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>یک پلتفرم تخصصی و ارتباطی</h3>
                <p style={{ lineHeight: '1.9', color: 'var(--text-secondary)' }}>
                  پناه یک <strong>کلینیک روانشناسی</strong> یا جایگزین <strong>روانشناس</strong> نیست؛ بلکه پلتفرمی حرفه‌ای است که زیرساخت لازم برای ارتباط شفاف، امن و بدون قضاوت میان مراجعین و متخصصان را فراهم می‌آورد.
                </p>
                <ul
                  style={{
                    marginTop: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    listStyle: 'none',
                    padding: 0,
                  }}
                >
                  {[
                    'انتخاب روانشناس مناسب را ساده‌تر کند.',
                    'مراجعه به روانشناس را در جامعه عادی‌تر کند.',
                    'با تولید محتوای علمی، سواد سلامت روان را ارتقا دهد.',
                    'میان مراجع و درمانگر، ارتباطی امن، محرمانه و شفاف ایجاد کند.',
                  ].map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'var(--icon-bg)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-primary)',
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </StaggerItem>

              <StaggerItem className="card-side glass" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="icon-wrap" style={{ marginBottom: '16px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '20px', marginBottom: '12px' }}>اصل حریم خصوصی</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15.5px', lineHeight: '1.8' }}>
                  امنیت داده‌ها، رازپوشی حرفه‌ای و احترام به حریم خصوصی مراجعه‌کننده و درمانگر، شالوده اصلی تمام خدمات پناه را تشکیل می‌دهد.
                </p>
              </StaggerItem>
            </StaggerGrid>
          </div>
        </section>

        {/* Our Values Section */}
        <section style={{ padding: '40px 0' }}>
          <div className="container">
            <Reveal className="section-title">
              <h2>ارزش‌های ما</h2>
              <p>چارچوبی که تمام مسیر ما را هدایت می‌کند</p>
            </Reveal>

            <StaggerGrid className="values-four-grid" staggerDelay={0.1}>
              <StaggerItem className="card-small glass">
                <div className="icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
                    <path d="M10 2v7.5M14 2v7.5M8.5 2h7M14 9.5a4.5 4.5 0 1 1-4 0" />
                    <path d="M8.5 14h7" />
                  </svg>
                </div>
                <h3>علم قبل از وایرال شدن</h3>
                <p>تلاش می‌کنیم محتوایی منتشر کنیم که جذاب باشد، اما هرگز از دقت علمی و استانداردهای حرفه‌ای فاصله نگیرد.</p>
              </StaggerItem>

              <StaggerItem className="card-small glass">
                <div className="icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3>احترام به محرمانگی</h3>
                <p>اعتماد مراجعین و درمانگران، ارزشمندترین و غیرقابل جایگزین‌ترین دارایی پناه است.</p>
              </StaggerItem>

              <StaggerItem className="card-small glass">
                <div className="icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <h3>تجربه بهتر برای مراجع</h3>
                <p>ساخت فضایی امن و آرام؛ از اولین پیام کاربر تا پایان جلسات مشاوره و پیگیری.</p>
              </StaggerItem>

              <StaggerItem className="card-small glass">
                <div className="icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
                    <path d="M12 20v-8M12 12L7 7M12 12l5-5" />
                    <path d="M5 21h14" />
                  </svg>
                </div>
                <h3>رشد درمانگران</h3>
                <p>ما باور داریم رشد پناه بدون رشد، پیشرفت، امنیت خاطر و رضایت درمانگران معنا ندارد.</p>
              </StaggerItem>
            </StaggerGrid>
          </div>
        </section>

        {/* Why Collaborate with Panah? - Cypress Tree Section */}
        <section style={{ padding: '48px 0' }}>
          <div className="container">
            <Reveal className="section-title">
              <h2>چرا با پناه همکاری کنیم؟</h2>
            </Reveal>

            <CypressTreeAchievements />
          </div>
        </section>

        {/* 5-Step Process Timeline Section */}
        <section style={{ padding: '40px 0' }}>
          <div className="container">
            <Reveal className="section-title">
              <h2>فرآیند همکاری</h2>
              <p>مراحل ساده و شفاف آغاز فعالیت</p>
            </Reveal>

            <StaggerGrid
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
              }}
              staggerDelay={0.1}
            >
              {[
                { num: '۱', title: 'تکمیل فرم', desc: 'تکمیل اطلاعات اولیه و رزومه در فرم همکاری' },
                { num: '۲', title: 'بررسی مدارک', desc: 'بررسی مدارک تحصیلی و مجوزهای نظام مشاوره' },
                { num: '۳', title: 'امضای قرارداد', desc: 'تنظیم و امضای قرارداد شفاف و دوطرفه' },
                { num: '۴', title: 'شروع همکاری', desc: 'فعال‌سازی پروفایل تخصصی در سامانه پناه' },
                { num: '۵', title: 'معرفی مراجع', desc: 'آغاز ارجاع مراجعین متناسب با حوزه تخصصی' },
              ].map((step, idx) => (
                <StaggerItem key={idx} className="glass" style={{ padding: '24px 20px', borderRadius: '22px', textAlign: 'center' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'var(--btn-primary-bg)',
                      color: 'var(--btn-primary-text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 700,
                      margin: '0 auto 14px',
                    }}
                  >
                    {step.num}
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>{step.title}</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{step.desc}</p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>

        {/* Mutual Expectations Section */}
        <section style={{ padding: '40px 0' }}>
          <div className="container">
            <Reveal className="section-title">
              <h2>آنچه از هم انتظار داریم</h2>
              <p>تعهدات متقابل برای ساخت تجربه‌ای اثربخش</p>
            </Reveal>

            <StaggerGrid className="expectations-two-grid" staggerDelay={0.14}>
              <StaggerItem className="card-expectation glass">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'var(--icon-bg)',
                      color: 'var(--color-primary-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '19px', fontWeight: 700 }}>انتظارات از درمانگر</h3>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {['رفتار کاملاً حرفه‌ای و رعایت اخلاق درمان', 'احترام به مراجع در تمام مراحل درمان', 'پایبندی دقیق به اصول و شواهد علمی', 'نظم و انضباط در برگزاری به‌موقع جلسات'].map(
                    (text, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: 'var(--text-primary)' }}>
                        <span style={{ color: 'var(--color-primary-dark)', fontWeight: 'bold', fontSize: '16px' }}>✓</span>
                        <span>{text}</span>
                      </li>
                    )
                  )}
                </ul>
              </StaggerItem>

              <StaggerItem className="card-expectation glass">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'var(--icon-bg)',
                      color: 'var(--color-primary-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
                      <path d="M12 21c-4.97-3-8-6.5-8-10.5A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 8 4.5C20 14.5 16.97 18 12 21Z" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '19px', fontWeight: 700 }}>تعهدات پناه</h3>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {['تسویه‌حساب شفاف، دقیق و به‌موقع', 'احترام متقابل به جایگاه تخصصی درمانگر', 'پاسخگویی سریع به دغدغه‌ها و پیشنهادات', 'حمایت همه‌جانبه از رشد فنی و زیرساختی'].map(
                    (text, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: 'var(--text-primary)' }}>
                        <span style={{ color: 'var(--color-primary-dark)', fontWeight: 'bold', fontSize: '16px' }}>✓</span>
                        <span>{text}</span>
                      </li>
                    )
                  )}
                </ul>
              </StaggerItem>
            </StaggerGrid>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ padding: '60px 0 40px' }}>
          <div className="container">
            <Reveal
              className="glass"
              style={{
                padding: '48px 32px',
                borderRadius: '32px',
                textAlign: 'center',
                maxWidth: '820px',
                margin: '0 auto',
              }}
            >
              <h2 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px' }}>خوشحال می‌شویم کنار هم باشیم</h2>
              <p style={{ maxWidth: '640px', margin: '0 auto 28px', color: 'var(--text-secondary)', lineHeight: '1.9', fontSize: '16.5px' }}>
                اگر بعد از مطالعه این راهنما احساس می‌کنید نگاه ما به سلامت روان با نگاه شما همسو است، کافی است فرم همکاری را تکمیل کنید. ما مدارک شما را بررسی می‌کنیم و در صورت تأیید، قرارداد همکاری برایتان ارسال خواهد شد.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="https://forms.gle/zdr8jV7EUTx9X5J6A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ padding: '14px 36px', fontSize: '16px' }}
                >
                  تکمیل فرم همکاری
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer showCollabNote={false} />
    </>
  );
}
