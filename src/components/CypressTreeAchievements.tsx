import React from 'react';
import { Reveal, StaggerGrid, StaggerItem } from './Reveal';

interface AchievementsProps {
  quote?: string;
}

export const CypressTreeAchievements: React.FC<AchievementsProps> = ({
  quote = '«ما به دنبال بیشترین تعداد درمانگر نیستیم؛ به دنبال درمانگرانی هستیم که کیفیت را جدی می‌گیرند.»',
}) => {
  const achievements = [
    {
      id: 1,
      title: 'معرفی مستمر مراجعین مناسب',
      desc: 'ارجاع هوشمند مراجعین متناسب با تخصص، متدولوژی و ظرفیت درمانگر',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'تسویه‌حساب منظم و کاملاً شفاف',
      desc: 'سیستم مالی دقیق، بدون ابهام و پرداختی‌های به موقع بر پایه توافقات شفاف',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
    },
    {
      id: 3,
      title: 'تمرکز گروهی بر کیفیت خدمات',
      desc: 'پایش مستمر استانداردهای حرفه‌ای و ایجاد بستر هم‌افزایی میان درمانگران',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      id: 4,
      title: 'حمایت از فرهنگ مراجعه به روانشناس',
      desc: 'ارتقای آگاهی جامعه و بسترسازی برای تابوزدایی از خدمات سلامت روان',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
    {
      id: 5,
      title: 'ساخت برند معتبر در حوزه سلامت روان',
      desc: 'حضور فعال در پلتفرمی حرفه‌ای، علمی و مورد اعتماد آحاد جامعه',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="horizontal-diagram-container" style={{ width: '100%', margin: '16px 0' }}>
      {/* Main Horizontal Layout Wrapper (RTL: Main card on Right, 5 Lines branching Left to 5 cards) */}
      <div className="horizontal-diagram-grid">
        {/* RIGHT SIDE: Main Hub Card ("دستاوردهای همکاری با پناه") */}
        <div className="diagram-hub-column">
          <Reveal style={{ width: '100%' }}>
            <div className="horizontal-hub-card glass">
              <div className="hub-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                  <path d="M12 2v20" />
                  <path d="M12 22l-4-4" />
                  <path d="M12 22l4-4" />
                  <path d="M12 14l-6-5" />
                  <path d="M12 14l6-5" />
                  <path d="M12 8L7 4" />
                  <path d="M12 8l5-4" />
                </svg>
              </div>
              <h3 className="hub-title">دستاوردهای همکاری با پناه</h3>
              <p className="hub-subtitle">پنج رکن کلیدی ارزش‌آفرینی پناه برای درمانگران و روانشناسان همراه</p>
            </div>
          </Reveal>
        </div>

        {/* MIDDLE: 5 Curved Notebook Dashed Lines */}
        <div className="diagram-lines-column">
          <svg
            className="horizontal-lines-svg"
            viewBox="0 0 120 540"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Origin on Right (x=120, y=270 - center of main card) */}
            {/* Line 1: to Item 1 top-left (x=0, y=50) */}
            <path
              d="M 120 270 C 80 270, 50 50, 0 50"
              stroke="var(--color-primary-dark)"
              strokeWidth="2"
              strokeDasharray="5 4"
              strokeLinecap="round"
            />
            <circle cx="0" cy="50" r="3.5" fill="var(--color-primary-dark)" />

            {/* Line 2: to Item 2 upper-left (x=0, y=160) */}
            <path
              d="M 120 270 C 80 270, 40 160, 0 160"
              stroke="var(--color-primary-dark)"
              strokeWidth="2"
              strokeDasharray="5 4"
              strokeLinecap="round"
            />
            <circle cx="0" cy="160" r="3.5" fill="var(--color-primary-dark)" />

            {/* Line 3: to Item 3 center-left (x=0, y=270) */}
            <path
              d="M 120 270 L 0 270"
              stroke="var(--color-primary-dark)"
              strokeWidth="2"
              strokeDasharray="5 4"
              strokeLinecap="round"
            />
            <circle cx="0" cy="270" r="3.5" fill="var(--color-primary-dark)" />

            {/* Line 4: to Item 4 lower-left (x=0, y=380) */}
            <path
              d="M 120 270 C 80 270, 40 380, 0 380"
              stroke="var(--color-primary-dark)"
              strokeWidth="2"
              strokeDasharray="5 4"
              strokeLinecap="round"
            />
            <circle cx="0" cy="380" r="3.5" fill="var(--color-primary-dark)" />

            {/* Line 5: to Item 5 bottom-left (x=0, y=490) */}
            <path
              d="M 120 270 C 80 270, 50 490, 0 490"
              stroke="var(--color-primary-dark)"
              strokeWidth="2"
              strokeDasharray="5 4"
              strokeLinecap="round"
            />
            <circle cx="0" cy="490" r="3.5" fill="var(--color-primary-dark)" />
          </svg>
        </div>

        {/* LEFT SIDE: 5 Achievement Cards */}
        <div className="diagram-cards-column">
          <StaggerGrid className="horizontal-cards-stack" staggerDelay={0.07}>
            {achievements.map((item, index) => (
              <StaggerItem key={item.id} className="horizontal-achievement-card glass">
                <div className="card-left-badge">{index + 1}</div>
                <div className="card-icon-box">{item.icon}</div>
                <div className="card-text-content">
                  <h4 className="card-title">{item.title}</h4>
                  <p className="card-desc">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </div>

      {/* Quote Card */}
      {quote && (
        <Reveal style={{ width: '100%', maxWidth: '820px', margin: '36px auto 0 auto' }}>
          <div className="notebook-quote-card glass">
            <div className="quote-handwritten-pin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="22">
                <path d="M12 17v5" />
                <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a3 3 0 1 0-6 0v3.76z" />
              </svg>
            </div>
            <div className="quote-body-text">{quote}</div>
          </div>
        </Reveal>
      )}

      {/* Scoped Styling */}
      <style>{`
        .horizontal-diagram-container {
          padding: 10px 0;
        }

        .horizontal-diagram-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          max-width: 1020px;
          margin: 0 auto;
        }

        .diagram-hub-column {
          flex: 0 0 320px;
          max-width: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .horizontal-hub-card {
          padding: 32px 24px;
          border-radius: 24px;
          text-align: center;
          border: 1.5px solid var(--color-primary-dark);
          background: linear-gradient(135deg, var(--bg-card) 0%, rgba(255, 255, 255, 0.85) 100%);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .hub-icon-wrapper {
          width: 54px;
          height: 54px;
          border-radius: 18px;
          background: var(--color-primary-dark);
          color: var(--bg-main);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .hub-title {
          font-size: 21px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 10px;
          line-height: 1.4;
        }

        .hub-subtitle {
          font-size: 13.5px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .diagram-lines-column {
          flex: 0 0 90px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .horizontal-lines-svg {
          width: 90px;
          height: 520px;
          pointer-events: none;
        }

        .diagram-cards-column {
          flex: 1;
          max-width: 580px;
        }

        .horizontal-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .horizontal-achievement-card {
          padding: 16px 18px;
          border-radius: 18px;
          border: 1px solid var(--border-glass);
          background: var(--bg-card);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          gap: 14px;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .horizontal-achievement-card:hover {
          transform: translateX(-4px);
          border-color: var(--color-primary-dark);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
        }

        .card-left-badge {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 1px dashed var(--color-primary-dark);
          color: var(--color-primary-dark);
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--icon-bg);
          flex-shrink: 0;
        }

        .card-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: var(--btn-primary-bg);
          color: var(--btn-primary-text);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .card-text-content {
          flex: 1;
        }

        .card-title {
          font-size: 15.5px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 3px;
          line-height: 1.4;
        }

        .card-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .notebook-quote-card {
          padding: 22px 24px;
          border-radius: 20px;
          border: 1px solid var(--border-glass);
          background: var(--bg-card);
          text-align: center;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .quote-handwritten-pin {
          color: var(--color-primary-dark);
          opacity: 0.8;
        }

        .quote-body-text {
          font-size: 15.5px;
          font-weight: 600;
          line-height: 1.8;
          color: var(--text-primary);
        }

        @media (max-width: 860px) {
          .horizontal-diagram-grid {
            flex-direction: column;
            gap: 20px;
          }
          .diagram-hub-column {
            flex: 1;
            max-width: 100%;
            width: 100%;
          }
          .diagram-lines-column {
            display: none;
          }
          .diagram-cards-column {
            width: 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CypressTreeAchievements;
