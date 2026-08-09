import React, { useEffect } from 'react';

export default function PsychologistChangePassword() {
  useEffect(() => {
    window.location.replace('https://app.panahpsych.ir');
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      direction: 'rtl',
      fontFamily: 'Vazirmatn, sans-serif',
      color: 'var(--text-primary)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
          در حال انتقال به سامانه همکاران...
        </p>
        <a
          href="https://app.panahpsych.ir"
          style={{ color: 'var(--color-primary-dark)', textDecoration: 'underline', fontSize: '14px' }}
        >
          ورود به سامانه همکاران (app.panahpsych.ir)
        </a>
      </div>
    </div>
  );
}
