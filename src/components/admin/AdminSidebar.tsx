import React, { useState } from 'react';
import { Nav, Button, Stack, Card } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks/useLanguage';
import authService from '../../services/authService';
import {
  FiBarChart2,
  FiUsers,
  FiUserPlus,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 64;

const AdminSidebar: React.FC = () => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      console.log('[AdminSidebar] Logout API called successfully');
    } catch (error) {
      console.error('[AdminSidebar] Logout API failed:', error);
    }
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
          ? '#343a40'
          : 'linear-gradient(180deg, #343a40 0%, #6c757d 100%)',
        color: '#fff',
        width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        transition: 'width 0.2s, background 0.2s',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1030,
        boxShadow: '2px 0 8px 0 rgba(0,0,0,0.04)'
      }}
    >
      <Card.Body className="d-flex flex-column p-0" style={{ height: '100%' }}>
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-white-25">
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>👋 {t('welcome')}</div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>
                {state.account?.username || 'Admin'}
              </div>
            </div>
          )}
          <Button
            variant="outline-light"
            size="sm"
            className="d-flex align-items-center justify-content-center"
            style={{ border: 'none', boxShadow: 'none', width: 32, height: 32 }}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          </Button>
        </div>

        {/* Navigation */}
        <Stack className="px-2 py-3" gap={2}>
          <Nav.Link
            onClick={() => navigate('/admin/home')}
            className="text-white rounded-3 py-2 px-2 w-100 d-flex align-items-center"
            style={{ background: 'rgba(255,255,255,0.1)', fontWeight: 500 }}
          >
            <FiBarChart2 size={18} />
            {!collapsed && <span className="ms-2">{t('admin_home')}</span>}
          </Nav.Link>

          <Nav.Link
            onClick={() => navigate('/admin/users')}
            className="text-white rounded-3 py-2 px-2 w-100 d-flex align-items-center"
            style={{ background: 'rgba(255,255,255,0.1)', fontWeight: 500 }}
          >
            <FiUsers size={18} />
            {!collapsed && <span className="ms-2">{t('manage_users')}</span>}
          </Nav.Link>

          <Nav.Link
            onClick={() => navigate('/admin/create-partner')}
            className="text-white rounded-3 py-2 px-2 w-100 d-flex align-items-center"
            style={{ background: 'rgba(255,255,255,0.1)', fontWeight: 500 }}
          >
            <FiUserPlus size={18} />
            {!collapsed && <span className="ms-2">{t('create_partner')}</span>}
          </Nav.Link>

          <Nav.Link
            onClick={() => navigate('/admin/settings')}
            className="text-white rounded-3 py-2 px-2 w-100 d-flex align-items-center"
            style={{ background: 'rgba(255,255,255,0.1)', fontWeight: 500 }}
          >
            <FiSettings size={18} />
            {!collapsed && <span className="ms-2">{t('settings')}</span>}
          </Nav.Link>
        </Stack>

        {/* Language Switch */}
        {!collapsed && (
          <div className="px-3 pb-2 d-flex align-items-center justify-content-between">
            <div style={{ fontSize: 13, color: '#ccc', marginBottom: 4 }}>
              {t('language')}:
            </div>
            <div style={{ minWidth: 48 }}>
              <div className="form-check form-switch m-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="langSwitchAdmin"
                  checked={language === 'en'}
                  onChange={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
                  style={{ cursor: 'pointer' }}
                />
                <label
                  className="form-check-label"
                  htmlFor="langSwitchAdmin"
                  style={{ fontSize: 13, marginLeft: 8 }}
                >
                  {language === 'vi' ? 'VI' : 'EN'}
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="mt-auto p-3 d-flex justify-content-center">
          <Button
            onClick={handleLogout}
            className="w-100 d-flex align-items-center justify-content-center fw-bold"
            style={{
              background: '#fff',
              color: '#343a40',
              border: 'none',
              borderRadius: 8,
              padding: collapsed ? '8px' : '8px 16px',
              fontSize: 14,
              transition: 'all 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#dee2e6')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
            title={t('logout')}
          >
            <FiLogOut size={18} style={{ marginRight: collapsed ? 0 : 8 }} />
            {!collapsed && t('logout')}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AdminSidebar;
