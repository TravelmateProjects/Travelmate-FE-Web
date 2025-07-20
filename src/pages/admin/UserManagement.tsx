import React, { useEffect, useState } from 'react';
import { Table, Button, Form, InputGroup, Modal, Spinner } from 'react-bootstrap';
import { getAllUsers, searchUsers, lockUser, unlockUser } from '../../services/userService';
import { User } from '../../types/User';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const UserManagement: React.FC = () => {
  const { t } = useTranslation();
  const { state } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchStatus, setSearchStatus] = useState(''); // '' | 'active' | 'locked'
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [lockLoading, setLockLoading] = useState(false);

  const fetchUsers = async (criteria = {}) => {
    setLoading(true);
    try {
      let res;
      if (Object.keys(criteria).length > 0) {
        res = await searchUsers(criteria);
      } else {
        res = await getAllUsers();
      }
      setUsers(res.data.data || []);
    } catch (e) {
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const criteria: any = {};
    if (search) criteria.fullName = search;
    if (searchEmail) criteria.email = searchEmail;
    if (searchStatus === 'active') criteria.accountStatus = true;
    else if (searchStatus === 'locked') criteria.accountStatus = false;
    fetchUsers(criteria);
  };

  const handleLockToggle = async (user: User, isCurrentlyActive: boolean) => {
    setLockLoading(true);
    try {
      if (isCurrentlyActive) {
        await lockUser(user._id);
      } else {
        await unlockUser(user._id);
      }
      // Refresh with current search
      fetchUsers(search ? { username: search } : {});
    } catch {}
    setLockLoading(false);
  };

  const handleViewDetail = (user: User) => {
    setSelectedUser(user);
    setShowDetail(true);
  };

  return (
    <div className="container py-4">
      <h2>{t('manage_users')}</h2>
      <Form onSubmit={handleSearch} className="mb-3">
        <InputGroup className="mb-2">
          <Form.Control
            placeholder={t('search_by_username') || 'Search by username'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Form.Control
            placeholder={t('search_by_email') || 'Search by email'}
            value={searchEmail}
            onChange={e => setSearchEmail(e.target.value)}
          />
          <Form.Select
            value={searchStatus}
            onChange={e => setSearchStatus(e.target.value)}
            style={{ maxWidth: 120 }}
          >
            <option value="">{t('all_status') || 'All Status'}</option>
            <option value="active">{t('active') || 'Active'}</option>
            <option value="locked">{t('locked') || 'Locked'}</option>
          </Form.Select>
          <Button type="submit" variant="primary">{t('search')}</Button>
        </InputGroup>
      </Form>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>{t('username')}</th>
              <th>{t('email')}</th>
              <th>{t('role')}</th>
              <th>{t('status')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user._id}>
                <td>{idx + 1}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.role || t('not_available') || '-'}</td>
                <td>{user.accountStatus ? t('active') : t('locked')}</td>
                <td>
                  <Button
                    size="sm"
                    variant="info"
                    className="me-2"
                    onClick={() => handleViewDetail(user)}
                  >
                    {t('view_detail')}
                  </Button>
                  <Button
                    size="sm"
                    variant={user.accountStatus ? 'danger' : 'success'}
                    disabled={lockLoading}
                    onClick={() => handleLockToggle(user, !!user.accountStatus)}
                  >
                    {user.accountStatus ? t('lock') : t('unlock')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal show={showDetail} onHide={() => setShowDetail(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('user_detail')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p><b>{t('username')}:</b> {selectedUser.fullName}</p>
              <p><b>{t('email')}:</b> {selectedUser.email}</p>
              <p><b>{t('role')}:</b> {selectedUser.role || t('not_available') || '-'}</p>
              <p><b>{t('status')}:</b> {selectedUser.accountStatus ? t('active') : t('locked')}</p>
              {/* Add more fields as needed */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetail(false)}>
            {t('close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
