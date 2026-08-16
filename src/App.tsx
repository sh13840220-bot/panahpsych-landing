import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { Header } from './components/Header';
import { ScrollProgress } from './components/ScrollProgress';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { CollaborationPage } from './pages/CollaborationPage';
import { PsychologyTestsPage } from './pages/PsychologyTestsPage';
import { Dass21QuizPage } from './pages/Dass21QuizPage';
import { Gad7QuizPage } from './pages/Gad7QuizPage';
import { RosenbergQuizPage } from './pages/RosenbergQuizPage';
import { Bdi2QuizPage } from './pages/Bdi2QuizPage';
import { MbtiQuizPage } from './pages/MbtiQuizPage';
import { NeoFfiQuizPage } from './pages/NeoFfiQuizPage';
import { CfiQuizPage } from './pages/CfiQuizPage';
import { BarOnQuizPage } from './pages/BarOnQuizPage';
import { BaiQuizPage } from './pages/BaiQuizPage';
import { Scl90QuizPage } from './pages/Scl90QuizPage';
import { NeoQuizPage } from './pages/NeoQuizPage';
import { ArticlesSoonPage } from './pages/ArticlesSoonPage';
import { AuthSoonPage } from './pages/AuthSoonPage';
import { AssessmentResultsPage } from './pages/AssessmentResultsPage';
import PsychologistLogin from './pages/PsychologistLogin';
import PsychologistChangePassword from './pages/PsychologistChangePassword';
import PsychologistDashboard from './pages/PsychologistDashboard';
import PsychologistProtectedRoute from './pages/PsychologistProtectedRoute';

export default function App() {
  useEffect(() => {
    try {
      localStorage.removeItem('panah-selected-font');
    } catch {
      // ignore
    }
  }, []);

  return (
    <>
      <ScrollProgress />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collaboration" element={<CollaborationPage />} />
        <Route path="/tests-soon" element={<PsychologyTestsPage />} />
        <Route path="/assessments" element={<PsychologyTestsPage />} />
        <Route path="/assessments/gad-7" element={<Gad7QuizPage />} />
        <Route path="/assessments/rosenberg" element={<RosenbergQuizPage />} />
        <Route path="/assessments/bdi-ii" element={<Bdi2QuizPage />} />
        <Route path="/assessments/mbti" element={<MbtiQuizPage />} />
        <Route path="/assessments/neo-ffi" element={<NeoFfiQuizPage />} />
        <Route path="/assessments/neo" element={<NeoQuizPage />} />
        <Route path="/assessments/neo-240" element={<NeoQuizPage />} />
        <Route path="/assessments/neo-pir" element={<NeoQuizPage />} />
        <Route path="/assessments/cfi" element={<CfiQuizPage />} />
        <Route path="/assessments/bar-on" element={<BarOnQuizPage />} />
        <Route path="/assessments/baron" element={<BarOnQuizPage />} />
        <Route path="/assessments/bai" element={<BaiQuizPage />} />
        <Route path="/assessments/beck-anxiety" element={<BaiQuizPage />} />
        <Route path="/assessments/scl-90" element={<Scl90QuizPage />} />
        <Route path="/assessments/scl90" element={<Scl90QuizPage />} />
        <Route path="/assessments/scl-90-r" element={<Scl90QuizPage />} />
        <Route path="/assessments/dass-21" element={<Dass21QuizPage />} />
        <Route path="/articles-soon" element={<ArticlesSoonPage />} />
        <Route path="/auth-soon" element={<AuthSoonPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/assessment-results" element={<AssessmentResultsPage />} />

        {/* ورود جداگانه‌ی روانشناسان */}
        <Route path="/ravanshenas/login" element={<PsychologistLogin />} />
        <Route
          path="/ravanshenas/change-password"
          element={<PsychologistChangePassword />}
        />
        <Route
          path="/ravanshenas/dashboard"
          element={
            <PsychologistProtectedRoute>
              <PsychologistDashboard />
            </PsychologistProtectedRoute>
          }
        />
      </Routes>
      <ScrollToTop />
    </>
  );
}
