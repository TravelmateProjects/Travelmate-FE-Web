import React, { useState } from 'react';
import { Nav, Button, Stack, Card } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import authService from '../services/authService';

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 64;

const UserSidebar: React.FC = () => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);const handleLogout = async () => {
    try {
      // Call logout API to remove httpOnly cookies on the server
      await authService.logout();
      console.log('[UserSidebar] Logout API called successfully');
    } catch (error) {
      console.error('[UserSidebar] Logout API failed:', error);
      // Still proceed to logout even if API fails
    }
    
    // Clear local state
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('auth');
    navigate('/login');
  };

  return (
    <Card
      style={{
        minHeight: '100vh',
        border: 'none',
        borderRadius: 0,
        background: collapsed
          ? '#1976d2'
          : 'linear-gradient(180deg, #1976d2 0%, #42a5f5 100%)',
        color: '#fff',
        width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        transition: 'width 0.2s, background 0.2s',
        position: 'fixed', // fix sidebar to the left
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1030,
        boxShadow: '2px 0 8px 0 rgba(0,0,0,0.04)'
      }}
    >
      <Card.Body className="d-flex flex-column p-0" style={{ height: '100%' }}>
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-white-50 mb-3" style={{ minHeight: 72 }}>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>👋 {t('welcome')}</div>
              <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>{state.account?.username || 'User'}</div>
            </div>
          )}
            <Button
            variant="outline-light"
            size="sm"
            style={{ border: 'none', boxShadow: 'none', minWidth: 32, minHeight: 32, padding: 0 }}
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
            {collapsed ? <span style={{ fontSize: 20 }}>»</span> : <span style={{ fontSize: 20 }}>«</span>}
          </Button>
        </div>
        <Stack gap={2} className="px-2 flex-grow-1 align-items-center" style={{ minHeight: 0 }}>
          <Nav.Link
            href="/user/home"
            className="text-white rounded-3 py-2 px-2 w-100 d-flex align-items-center justify-content-start"
            style={{ background: 'rgba(255,255,255,0.10)', fontWeight: 500 }}
          >
            <span role="img" aria-label="home" style={{ fontSize: 20, marginRight: collapsed ? 0 : 8 }}>🏠</span>
            {!collapsed && t('user_home')}
          </Nav.Link>
          <Nav.Link
            href="/user/profile"
            className="text-white rounded-3 py-2 px-2 w-100 d-flex align-items-center justify-content-start"
            style={{ background: 'rgba(255,255,255,0.10)', fontWeight: 500 }}
          >
            <span role="img" aria-label="profile" style={{ fontSize: 20, marginRight: collapsed ? 0 : 8 }}>👤</span>
            {!collapsed && t('profile')}
          </Nav.Link>
          <Nav.Link
            href="/user/settings"
            className="text-white rounded-3 py-2 px-2 w-100 d-flex align-items-center justify-content-start"
            style={{ background: 'rgba(255,255,255,0.10)', fontWeight: 500 }}
          >
            <span role="img" aria-label="settings" style={{ fontSize: 20, marginRight: collapsed ? 0 : 8 }}>⚙️</span>
            {!collapsed && t('settings')}
          </Nav.Link>
        </Stack>
        { !collapsed && (
          <div className="px-3 pb-2 d-flex align-items-center justify-content-between">
            <div style={{ fontSize: 13, color: '#ccc', marginBottom: 4 }}>
              {t('language')}:
            </div>
            <div style={{ minWidth: 48 }}>
              <div className="form-check form-switch m-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="langSwitchUser"
                  checked={language === 'en'}
                  onChange={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
                  style={{ cursor: 'pointer' }}
                />
                <label className="form-check-label" htmlFor="langSwitchUser" style={{ fontSize: 13, marginLeft: 8 }}>
                  {language === 'vi' ? 'VI' : 'EN'}
                </label>
              </div>
            </div>
          </div>
        )}
        <div className="mt-auto p-3 d-flex justify-content-center">
          <Button
            variant="light"
            size="sm"
            className="w-100 fw-bold"
            onClick={handleLogout}
            style={{ fontSize: 14, padding: collapsed ? '0.5rem' : undefined }}
            title={t('logout')}
          >
            {collapsed ? <span role="img" aria-label="logout">🚪</span> : t('logout')}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserSidebar;
