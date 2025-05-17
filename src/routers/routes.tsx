import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import AdminHome from '../pages/admin/Home';
import UserHome from '../pages/user/Home';
import AdminLayout from '../layouts/AdminLayout';
import UserLayout from '../layouts/UserLayout';
import { useAuth } from '../contexts/AuthContext';
import '../configs/i18n';

const AppRoutes: React.FC = () => {
  const { state } = useAuth();
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
