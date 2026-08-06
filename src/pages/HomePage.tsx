import React, { useState, useEffect } from 'react';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';
import { CardLargeSkeleton, CardSideSkeleton, CardSmallSkeleton } from '../components/BentoSkeleton';

export function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <Reveal>
              <h1>مسیر، به پناه ختم می‌شود</h1>
            </Reveal>
            <Reveal>
              <p>
                پناه پلی است بین افرادی که به دنبال آرامش‌اند و روانشناسانی که برای کمک آماده‌اند. مسیری ساده، امن و بدون قضاوت برای پیدا کردن متخصص مناسب.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Bento Section: Collaboration + Trust */}
        <section>
          <div className="container">
            <div className="bento-grid">
              {isLoading ? (
                <>
                  <CardLargeSkeleton />
                  <CardSideSkeleton />
                </>
              ) : (
                <>
                  <Reveal className="card-large glass">
                    <h2>می‌خواهید همکار ما باشید؟</h2>
                    <p>
                      اگر روانشناس هستید و می‌خواهید به جمع همکاران پناه بپیوندید، اینجا شروع کنید.
                    </p>
                    <a
                      href="https://app.panahpsych.ir"
                      className="btn-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      همکاری با ما
                    </a>
                  </Reveal>

                  <Reveal className="card-side glass">
                    <div>
                      <div className="icon-wrap">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          width="28"
                          height="28"
                        >
                          <path d="M12 21c-4.97-3-8-6.5-8-10.5A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 8 4.5C20 14.5 16.97 18 12 21Z"></path>
                        </svg>
                      </div>
                      <h3 style={{ fontWeight: 700, fontSize: '20px', marginBottom: '12px' }}>
                        همراه شما در هر قدم
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
                        فضایی امن برای شنیده‌شدن، بدون قضاوت و با احترام کامل به تجربه شما.
                      </p>
                    </div>
                  </Reveal>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Bento Section: Three Value Cards */}
        <section>
          <div className="container">
            <Reveal className="section-title">
              <h2>چرا پناه؟</h2>
              <p>سه اصلی که هرگز از آن‌ها عبور نمی‌کنیم</p>
            </Reveal>

            <div className="bento-grid">
              {isLoading ? (
                <>
                  <CardSmallSkeleton />
                  <CardSmallSkeleton />
                  <CardSmallSkeleton />
                </>
              ) : (
                <>
                  <Reveal className="card-small glass">
                    <div className="icon-wrap">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="26"
                        height="26"
                      >
                        <path d="M9 3h6l1 4h4l-3 4 3 4h-4l-1 4H9l-1-4H4l3-4-3-4h4l1-4Z"></path>
                      </svg>
                    </div>
                    <h3>کیفیت علمی</h3>
                    <p>محتوا و خدمات ما همیشه مبتنی بر شواهد علمی است.</p>
                  </Reveal>

                  <Reveal className="card-small glass">
                    <div className="icon-wrap">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="26"
                        height="26"
                      >
                        <path d="M12 20.5s-7.5-4.5-7.5-10A4.5 4.5 0 0 1 12 7.5a4.5 4.5 0 0 1 7.5 3c0 5.5-7.5 10-7.5 10Z"></path>
                      </svg>
                    </div>
                    <h3>دغدغه‌مندی</h3>
                    <p>ما برای دیده‌شدن کار نمی‌کنیم، برای تاثیرگذاری کار می‌کنیم.</p>
                  </Reveal>

                  <Reveal className="card-small glass">
                    <div className="icon-wrap">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="26"
                        height="26"
                      >
                        <path d="M12 3 4 6.5v5c0 5 3.4 8.9 8 10.5 4.6-1.6 8-5.5 8-10.5v-5L12 3Z"></path>
                      </svg>
                    </div>
                    <h3>امنیت روانی</h3>
                    <p>اینجا هیچ قضاوتی وجود ندارد.</p>
                  </Reveal>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

