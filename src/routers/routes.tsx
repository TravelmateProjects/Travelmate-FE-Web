import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Spinner, Container } from "react-bootstrap";
import Login from "../pages/share/Login";
import ForgotPassword from "../pages/share/ForgotPassword";
import VerifyOtp from "../pages/share/VerifyOtp";
import ResetPassword from "../pages/share/ResetPassword";
import AdminHome from "../pages/admin/Home";
import PartnerHome from "../pages/partner/Home";
import AdminLayout from "../layouts/AdminLayout";
import PartnerLayout from "../layouts/PartnerLayout";
import { useAuth } from "../hooks/useAuth";
import "../configs/i18n";
import BlogManagement from "../pages/partner/blog/BlogManagement";
import AddBlog from "../pages/partner/blog/AddBlog";
import UpdateBlog from "../pages/partner/blog/UpdateBlog";
import ViewBlog from "../pages/partner/blog/ViewBlog";
import AlbumsManagement from "../pages/partner/albums/AlbumsManagement";
import PartnerProfile from '../pages/partner/Profile';
import CreatePartner from '../pages/admin/CreatePartner';
import ChangePassword from '../pages/partner/ChangePassword';
import LandingPage from "../pages/LandingPage";

// Protected Route Component
const ProtectedRoute: React.FC<{ allowedRole: string }> = ({ allowedRole }) => {
  const { state } = useAuth();

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (state.account?.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

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
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center">
          <Spinner
            animation="border"
            variant="primary"
            style={{ width: "3rem", height: "3rem" }}
          />
          <div className="mt-3 text-muted">Đang tải...</div>
        </div>
      </Container>
    );
  }

  console.log(
    "[AppRoutes] Rendering routes, isAuthenticated:",
    state.isAuthenticated
  );

  return (
    <Routes>
      {/* Root Route - Redirect based on authentication status */}
      <Route 
        path="/" 
        element={
          state.isAuthenticated ? (
            state.account?.role === "admin" ? (
              <Navigate to="/admin/home" replace />
            ) : (
              <Navigate to="/partner/home" replace />
            )
          ) : (
            <LandingPage />
          )
        } 
      />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="home" element={<AdminHome />} />
          <Route path="create-partner" element={<CreatePartner />} />
          <Route path="" element={<Navigate to="home" replace />} />
          {/* Add more admin routes here */}
        </Route>
      </Route>

      {/* Partner Routes */}
      <Route element={<ProtectedRoute allowedRole="partner" />}>
        <Route path="/partner/*" element={<PartnerLayout />}>
          <Route path="home" element={<PartnerHome />} />
          <Route path="profile" element={<PartnerProfile />} />
          <Route path="" element={<Navigate to="home" replace />} />
          {/* Add more partner routes here */}
          <Route path="blog" element={<BlogManagement />} />
          <Route path="blog/add" element={<AddBlog />} />
          <Route path="blog/edit/:id" element={<UpdateBlog />} />
          <Route path="blog/view/:id" element={<ViewBlog id={""} />} />
          <Route path="albums" element={<AlbumsManagement />} />
          <Route path="change-password" element={<ChangePassword />} />
          {/* Placeholder, cần modal */}
        </Route>
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
