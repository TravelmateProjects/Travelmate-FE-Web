import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllUsers, lockUser, unlockUser } from '../../services/userService';
import { User as BaseUser } from '../../types/User';
import avatarDefault from '../../images/avatar_default.png';
import PaginationComponent from '../../components/admin/PaginationComponent';

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
  const [search, setSearch] = useState({ searchTerm: '', status: '' });
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const normalizeGender = (gender?: string): 'male' | 'female' | 'other' => {
    const lower = typeof gender === 'string' ? gender.toLowerCase().trim() : '';

    if (['male', 'nam'].includes(lower)) return 'male';
    if (['female', 'nữ', 'nu'].includes(lower)) return 'female';
    return 'other';
  };



  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers(search);
      setUsers(res.data.data || []);
      setCurrentPage(1); // Reset về trang đầu sau mỗi lần tìm kiếm
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout);
    const timeout = setTimeout(() => {
      fetchUsers();
    }, 800);
    setTypingTimeout(timeout);
  }, [search.searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [search.status]);

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

  // Pagination logic
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentUsers = users.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(users.length / rowsPerPage);

  return (
    <div style={{ padding: 32, background: 'rgb(245, 245, 245)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32 }}>
        <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 24, color: '#2F80ED' }}>{t('userManagement.title')}</h2>

        <form style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 28, alignItems: 'center' }}>
          <input
            placeholder={t('userManagement.searchTerm')}
            value={search.searchTerm}
            onChange={e => setSearch(s => ({ ...s, searchTerm: e.target.value }))}
            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', minWidth: 220, fontSize: 15 }}
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
                {currentUsers
                  .filter(user => user.account?.role !== 'admin')
                  .map(user => (
                    <tr
                      key={user._id}
                      style={{ transition: 'background 0.15s', cursor: 'pointer' }}
                      onMouseOver={e => (e.currentTarget.style.background = '#f7faff')}
                      onMouseOut={e => (e.currentTarget.style.background = '#fff')}
                    >
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
                          <button onClick={() => handleLock(user)} style={{ padding: '6px 18px', borderRadius: 7, background: '#eb5757', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginRight: 6 }}>
                            {t('userManagement.lock')}
                          </button>
                        ) : (
                          <button onClick={() => handleUnlock(user)} style={{ padding: '6px 18px', borderRadius: 7, background: '#219653', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginRight: 6 }}>
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

        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />

        {/* Detail modal giữ nguyên */}
        {selectedUser && (
          <div
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(44,62,80,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
            onClick={() => setSelectedUser(null)}
          >
            <div
              style={{ background: '#fff', padding: 32, borderRadius: 14, minWidth: 340, maxWidth: 500, boxShadow: '0 8px 32px rgba(44,62,80,0.18)', position: 'relative' }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedUser(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>
                &times;
              </button>
              <h3 style={{ fontWeight: 700, color: '#2F80ED', marginBottom: 18 }}>{t('userManagement.detailTitle')}</h3>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                <img
                  src={typeof selectedUser.avatar === 'string' ? selectedUser.avatar : selectedUser.avatar?.url || avatarDefault}
                  alt="Avatar"
                  style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', marginRight: 16, background: '#eee', border: '1px solid #e0e7ef' }}
                />
                <span style={{ fontWeight: 600, fontSize: 18 }}>{selectedUser.fullName}</span>
              </div>
              <div style={{ marginBottom: 10 }}><b>{t('userManagement.username')}:</b> {selectedUser.account?.username}</div>
              <div style={{ marginBottom: 10 }}><b>{t('userManagement.email')}:</b> {selectedUser.email}</div>
              <div style={{ marginBottom: 10 }}><b>{t('userManagement.role')}:</b> {selectedUser.account?.role}</div>
              <div style={{ marginBottom: 10 }}><b>{t('userManagement.status')}:</b> <span style={{ color: selectedUser.account?.accountStatus ? '#219653' : '#eb5757', fontWeight: 600 }}>{selectedUser.account?.accountStatus ? t('userManagement.active') : t('userManagement.inactive')}</span></div>
              <div style={{ marginBottom: 10 }}><b>{t('userManagement.fullName')}:</b> {selectedUser.fullName}</div>
              <div style={{ marginBottom: 10 }}><b>{t('userManagement.dob', { defaultValue: 'Ngày sinh' })}:</b> {selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : ''}</div>
              <div style={{ marginBottom: 10 }}><b>{t('userManagement.phone')}:</b> {selectedUser.phone}</div>
              <div style={{ marginBottom: 10 }}><b>{t('userManagement.address')}:</b> {selectedUser.address}</div>
              <div style={{ marginBottom: 10 }}><b>{t('userManagement.hometown')}:</b> {selectedUser.hometown}</div>
              <div style={{ marginBottom: 10 }}>
                <b>{t('userManagement.gender')}:</b>{' '}
                {t(`userManagement.gender_${normalizeGender(selectedUser.gender)}`)}
              </div>

              <div style={{ marginBottom: 10 }}><b>{t('userManagement.cccd')}:</b> {selectedUser.cccd}</div>
              <div style={{ marginBottom: 10 }}><b>{t('userManagement.hobbies')}:</b> {selectedUser.hobbies?.join(', ')}</div>
              <div style={{ marginBottom: 10 }}><b>{t('userManagement.description')}:</b> {selectedUser.description}</div>
              <div style={{ marginBottom: 10 }}><b>{t('userManagement.job')}:</b> {selectedUser.job}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
