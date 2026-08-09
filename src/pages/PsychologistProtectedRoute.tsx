import React, { useEffect } from 'react';

export default function PsychologistProtectedRoute({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.location.replace('https://app.panahpsych.ir');
  }, []);

  return <>{children}</>;
}
