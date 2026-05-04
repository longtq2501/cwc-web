import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppProviders from './components/providers/AppProviders';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MainLayout from './layouts/dashboard/MainLayout';
import DashboardPage from './pages/DashboardPage';
import CreateReportPage from './pages/CreateReportPage';
import ReportHistoryPage from './pages/ReportHistoryPage';
import RewardsPage from './pages/RewardsPage';
import EnterpriseDashboardPage from './pages/enterprise/EnterpriseDashboardPage';
import RequestsDashboardPage from './pages/enterprise/RequestsDashboardPage';
import AssignmentPage from './pages/enterprise/AssignmentPage';
import ReportsPage from './pages/enterprise/ReportsPage';
import EnterpriseProfilePage from './pages/enterprise/EnterpriseProfilePage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Private Dashboard Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="report/create" element={<CreateReportPage />} />
        <Route path="reports" element={<ReportHistoryPage />} />
        <Route path="rewards" element={<RewardsPage />} />
        <Route path="leaderboard" element={<RewardsPage />} />
        
        {/* Enterprise Routes */}
        <Route path="requests" element={<RequestsDashboardPage />} />
        <Route path="collectors" element={<AssignmentPage />} />
        <Route path="analytics" element={<ReportsPage />} />
        
        <Route path="settings" element={<EnterpriseProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
