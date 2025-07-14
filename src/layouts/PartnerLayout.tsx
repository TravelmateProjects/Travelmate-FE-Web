import React from 'react';
import { Outlet } from 'react-router-dom';
import PartnerSidebar from '../components/partner/PartnerSidebar';

const PartnerLayout: React.FC = () => {
  const SIDEBAR_WIDTH = 240;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      <PartnerSidebar />
      <div
        style={{
          marginLeft: SIDEBAR_WIDTH,
          padding: '24px',
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          backgroundColor: '#f5f5f5', // màu nền giống Facebook
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default PartnerLayout;
