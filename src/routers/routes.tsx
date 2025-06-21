import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spinner, Container } from 'react-bootstrap';
import Login from '../pages/Login';
import AdminHome from '../pages/admin/Home';
import UserHome from '../pages/user/Home';
import AdminLayout from '../layouts/AdminLayout';
import UserLayout from '../layouts/UserLayout';
import { useAuth } from '../hooks/useAuth';
import '../configs/i18n';

const AppRoutes: React.FC = () => {
  const { state } = useAuth();

  console.log("[AppRoutes] Current auth state:", state);

  // Show loading spinner while checking authentication
  if (state.isLoading) {
    console.log("[AppRoutes] Showing loading spinner");
    return (
      <Container 
        fluid 
        className="d-flex justify-content-center align-items-center" 
        style={{ minHeight: '100vh' }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <div className="mt-3 text-muted">Đang tải...</div>
        </div>
      </Container>
    );
  }

  console.log("[AppRoutes] Rendering routes, isAuthenticated:", state.isAuthenticated);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin/*" element={<AdminLayout><AdminHome /></AdminLayout>} />
      <Route path="/user/*" element={<UserLayout><UserHome /></UserLayout>} />
      <Route
        path="/"
        element={
          state.isAuthenticated
            ? state.account?.role === 'admin'
              ? <Navigate to="/admin/home" replace />
              : <Navigate to="/user/home" replace />
            : <Navigate to="/login" replace />
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
