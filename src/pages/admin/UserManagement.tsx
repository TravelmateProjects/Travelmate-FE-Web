import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllUsers, lockUser, unlockUser } from '../../services/userService';
import { User as BaseUser } from '../../types/User';

interface User extends BaseUser {
  account?: {
    username: string;
    role: string;
    accountStatus: boolean;
  };
}

const UserManagement: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState({ fullName: '', email: '', status: '' });
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Map fullName to username for API compatibility if needed
      const apiSearch: any = { ...search };
      if (apiSearch.fullName) {
        apiSearch.username = apiSearch.fullName;
        delete apiSearch.fullName;
      }
      const res = await getAllUsers(apiSearch);
      setUsers(res.data.data || []);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleLock = async (user: User) => {
    if (!user._id) return;
    await lockUser(user._id);
    fetchUsers();
  };
  const handleUnlock = async (user: User) => {
    if (!user._id) return;
    await unlockUser(user._id);
    fetchUsers();
  };

  return (
    <div style={{ padding: 32, background: '#f7f9fb', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32 }}>
        <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 24, color: '#2F80ED' }}>{t('userManagement.title')}</h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 28, alignItems: 'center' }}>
          <input
            placeholder={t('userManagement.searchFullName')}
            value={search.fullName}
            onChange={e => setSearch(s => ({ ...s, fullName: e.target.value }))}
            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', minWidth: 180, fontSize: 15 }}
          />
          <input
            placeholder={t('userManagement.searchEmail')}
            value={search.email}
            onChange={e => setSearch(s => ({ ...s, email: e.target.value }))}
            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', minWidth: 180, fontSize: 15 }}
          />
          <select
            value={search.status}
            onChange={e => setSearch(s => ({ ...s, status: e.target.value }))}
            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', minWidth: 160, fontSize: 15 }}
          >
            <option value="">{t('userManagement.allStatus')}</option>
            <option value="active">{t('userManagement.active')}</option>
            <option value="inactive">{t('userManagement.inactive')}</option>
          </select>
          <button type="submit" style={{ padding: '10px 24px', borderRadius: 8, background: '#2F80ED', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'background 0.2s' }}>
            {t('userManagement.search')}
          </button>
        </form>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#888', fontSize: 18 }}>{t('userManagement.loading')}</p>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', background: '#fff', borderRadius: 12, overflow: 'hidden', minWidth: 700 }}>
              <thead>
                <tr style={{ background: '#f3f6ff', color: '#2F80ED', fontWeight: 600 }}>
                  <th style={{ padding: 12, border: '1px solid #e0e7ef' }}>{t('userManagement.username')}</th>
                  <th style={{ padding: 12, border: '1px solid #e0e7ef' }}>{t('userManagement.fullName')}</th>
                  <th style={{ padding: 12, border: '1px solid #e0e7ef' }}>{t('userManagement.email')}</th>
                  <th style={{ padding: 12, border: '1px solid #e0e7ef' }}>{t('userManagement.role')}</th>
                  <th style={{ padding: 12, border: '1px solid #e0e7ef' }}>{t('userManagement.status')}</th>
                  <th style={{ padding: 12, border: '1px solid #e0e7ef' }}>{t('userManagement.action')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} style={{ transition: 'background 0.15s', cursor: 'pointer' }} onMouseOver={e => (e.currentTarget.style.background = '#f7faff')} onMouseOut={e => (e.currentTarget.style.background = '#fff')}>
                    <td style={{ padding: 10, border: '1px solid #e0e7ef', color: '#2F80ED', fontWeight: 500 }} onClick={() => setSelectedUser(user)}>
                      {user.account?.username || ''}
                    </td>
                    <td style={{ padding: 10, border: '1px solid #e0e7ef' }}>{user.fullName}</td>
                    <td style={{ padding: 10, border: '1px solid #e0e7ef' }}>{user.email}</td>
                    <td style={{ padding: 10, border: '1px solid #e0e7ef', textTransform: 'capitalize' }}>{user.account?.role}</td>
                    <td style={{ padding: 10, border: '1px solid #e0e7ef' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: 12,
                        background: user.account?.accountStatus ? '#e6f7ec' : '#ffeaea',
                        color: user.account?.accountStatus ? '#219653' : '#eb5757',
                        fontWeight: 600,
                        fontSize: 14
                      }}>
                        {user.account?.accountStatus ? t('userManagement.active') : t('userManagement.inactive')}
                      </span>
                    </td>
                    <td style={{ padding: 10, border: '1px solid #e0e7ef' }}>
                      {user.account?.accountStatus ? (
                        <button onClick={() => handleLock(user)} style={{ padding: '6px 18px', borderRadius: 7, background: '#eb5757', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginRight: 6, transition: 'background 0.2s' }}>
                          {t('userManagement.lock')}
                        </button>
                      ) : (
                        <button onClick={() => handleUnlock(user)} style={{ padding: '6px 18px', borderRadius: 7, background: '#219653', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginRight: 6, transition: 'background 0.2s' }}>
                          {t('userManagement.unlock')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* User detail modal */}
        {selectedUser && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(44,62,80,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedUser(null)}>
            <div style={{ background: '#fff', padding: 32, borderRadius: 14, minWidth: 340, boxShadow: '0 8px 32px rgba(44,62,80,0.18)', position: 'relative' }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedUser(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>&times;</button>
              <h3 style={{ fontWeight: 700, color: '#2F80ED', marginBottom: 18 }}>{t('userManagement.detailTitle')}</h3>
              <div style={{ marginBottom: 10 }}><b>{t('userManagement.username')}:</b> {selectedUser.account?.username}</div>
              <div style={{ marginBottom: 10 }}><b>{t('userManagement.email')}:</b> {selectedUser.email}</div>
              <div style={{ marginBottom: 10 }}><b>{t('userManagement.role')}:</b> {selectedUser.account?.role}</div>
              <div style={{ marginBottom: 10 }}><b>{t('userManagement.status')}:</b> <span style={{ color: selectedUser.account?.accountStatus ? '#219653' : '#eb5757', fontWeight: 600 }}>{selectedUser.account?.accountStatus ? t('userManagement.active') : t('userManagement.inactive')}</span></div>
              <div style={{ marginBottom: 10 }}><b>{t('userManagement.fullName')}:</b> {selectedUser.fullName}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
