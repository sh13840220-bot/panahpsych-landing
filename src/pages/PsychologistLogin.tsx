import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PsychologistLogin() {
  return <Navigate to="/auth-soon?mode=colleague" replace />;
}
