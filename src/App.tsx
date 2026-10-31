import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Public Marketing Pages
import { LandingPage } from './pages/public/LandingPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { PricingPage } from './pages/public/PricingPage';
import { WhatIsNdviPage } from './pages/public/WhatIsNdviPage';
import { FaqPage } from './pages/public/FaqPage';
import { BlogPage } from './pages/public/BlogPage';
import { BlogPostPage } from './pages/public/BlogPostPage';
import { ContactPage } from './pages/public/ContactPage';
import { PrivacyPage, TermsPage } from './pages/public/PrivacyPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// App Pages (Protected Map-First)
import { AppMapPage } from './pages/app/AppMapPage';
import { ReportsPage } from './pages/app/ReportsPage';
import { AlertsPage } from './pages/app/AlertsPage';
import { SettingsPage } from './pages/app/SettingsPage';

// Admin Page
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

export const App: React.FC = () => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/what-is-ndvi" element={<WhatIsNdviPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* App (Map-First Protected Routes) */}
      <Route path="/app" element={<AppMapPage />} />
      <Route path="/app/fields/:id" element={<AppMapPage />} />
      <Route path="/app/reports" element={<ReportsPage />} />
      <Route path="/app/alerts" element={<AlertsPage />} />
      <Route path="/app/settings" element={<SettingsPage />} />

      {/* Admin Route */}
      <Route path="/admin" element={<AdminDashboardPage />} />

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
