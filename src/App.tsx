import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { ScrollProgress } from './components/ScrollProgress';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { ClientsSoonPage } from './pages/ClientsSoonPage';
import { ArticlesSoonPage } from './pages/ArticlesSoonPage';
import { AuthSoonPage } from './pages/AuthSoonPage';

export default function App() {
  useEffect(() => {
    try {
      localStorage.removeItem('panah-selected-font');
    } catch {
      // ignore
    }
    document.body.style.fontFamily = "'Vazirmatn', Tahoma, sans-serif";
  }, []);

  return (
    <>
      <ScrollProgress />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/clients-soon" element={<ClientsSoonPage />} />
        <Route path="/articles-soon" element={<ArticlesSoonPage />} />
        <Route path="/auth-soon" element={<AuthSoonPage />} />
      </Routes>
      <ScrollToTop />
    </>
  );
}


