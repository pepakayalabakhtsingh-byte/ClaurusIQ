import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Pages - Lazy Loaded
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));
const LandingPage = lazy(() => import('../pages/LandingPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ResearchPage = lazy(() => import('../pages/ResearchPage'));
const ReportsPage = lazy(() => import('../pages/ReportsPage'));
const HistoryPage = lazy(() => import('../pages/HistoryPage'));
const BookmarksPage = lazy(() => import('../pages/BookmarksPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('../pages/UnauthorizedPage'));
const VerificationPage = lazy(() => import('../pages/VerificationPage'));
const CitationDashboard = lazy(() => import('../pages/CitationDashboard'));
const ReliabilityDashboard = lazy(() => import('../pages/ReliabilityDashboard'));
const Workspace = lazy(() => import('../pages/Workspace'));
const ChatPage = lazy(() => import('../pages/ChatPage'));
const DocumentWorkspace = lazy(() => import('../pages/DocumentWorkspace'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>}>
          <LandingPage />
        </Suspense>
      } />
      <Route path="/login" element={
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>}>
          <LoginPage />
        </Suspense>
      } />
      <Route path="/register" element={
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>}>
          <RegisterPage />
        </Suspense>
      } />
      <Route path="/unauthorized" element={
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>}>
          <UnauthorizedPage />
        </Suspense>
      } />

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>}>
            <DashboardLayout />
          </Suspense>
        </ProtectedRoute>
      }>
        <Route index element={
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <DashboardPage />
          </Suspense>
        } />
        <Route path="workspace" element={
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <Workspace />
          </Suspense>
        } />
        <Route path="research" element={
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <ResearchPage />
          </Suspense>
        } />
        <Route path="verification" element={
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <VerificationPage />
          </Suspense>
        } />
        <Route path="citations" element={
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <CitationDashboard />
          </Suspense>
        } />
        <Route path="reliability" element={
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <ReliabilityDashboard />
          </Suspense>
        } />
        <Route path="reports" element={
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <ReportsPage />
          </Suspense>
        } />
        <Route path="assistant" element={
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <ChatPage />
          </Suspense>
        } />
        <Route path="documents" element={
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <DocumentWorkspace />
          </Suspense>
        } />
        <Route path="admin" element={
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <AdminDashboard />
          </Suspense>
        } />
        <Route path="history" element={
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <HistoryPage />
          </Suspense>
        } />
        <Route path="bookmarks" element={
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <BookmarksPage />
          </Suspense>
        } />
        <Route path="settings" element={
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <SettingsPage />
          </Suspense>
        } />
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>}>
          <NotFoundPage />
        </Suspense>
      } />
    </Routes>
  );
};

export default AppRouter;
