import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout: React.FC = () => {
  const SIDEBAR_WIDTH = 240;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      <AdminSidebar />
      <div
        style={{
          marginLeft: SIDEBAR_WIDTH,
          padding: '24px',
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          backgroundColor: '#f5f5f5',
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;