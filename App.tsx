import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MenuPage from './pages/public/MenuPage';

import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerMenuManage from './pages/owner/OwnerMenuManage';
import OwnerSettings from './pages/owner/OwnerSettings';
import OwnerQRCode from './pages/owner/OwnerQRCode';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOwnersManage from './pages/admin/AdminOwnersManage';
import AdminAdsManage from './pages/admin/AdminAdsManage';

import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

const App: React.FC = () => {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === '=' || e.key === '-' || e.key === '0')) {
        e.preventDefault();
      }
    };
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // FIX: Cast style to 'any' to access non-standard properties without TypeScript errors.
    (document.documentElement.style as any).webkitTouchCallout = 'none';
    (document.documentElement.style as any).webkitUserSelect = 'none';
    document.documentElement.style.userSelect = 'none';

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <DataProvider>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <HashRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/menu/:id" element={<MenuPage />} />

                {/* Auth Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>
                
                {/* Owner Routes */}
                <Route 
                  path="/owner" 
                  element={
                    <ProtectedRoute role="owner">
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<OwnerDashboard />} />
                  <Route path="menu" element={<OwnerMenuManage />} />
                  <Route path="settings" element={<OwnerSettings />} />
                  <Route path="qr-code" element={<OwnerQRCode />} />
                </Route>

                {/* Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute role="admin">
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="owners" element={<AdminOwnersManage />} />
                  <Route path="ads" element={<AdminAdsManage />} />
                </Route>

                {/* Default Route */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </HashRouter>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </DataProvider>
  );
};

export default App;