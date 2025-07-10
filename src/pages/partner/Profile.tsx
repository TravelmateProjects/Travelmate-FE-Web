import React, { useState, useRef, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import ModernAlert from '../../components/ModernAlert';
import * as userService from '../../services/userService';
import ViewBlog from './blog/ViewBlog';
import API from '../../services/api';
import { useLocation } from 'react-router-dom';
import locationVN from '../../constants/locationVN.json';

const coverHeight = 300;
const avatarSize = 160;

const PartnerProfile: React.FC = () => {
  const { state, dispatch } = useAuth();
  const user = state.user;
  const account = state.account;
  const location = useLocation();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    description: user?.description || '',
  });
  const [detailAddress, setDetailAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Tự động ẩn alert sau 3 giây
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [blogs, setBlogs] = useState<any[]>([]);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  useEffect(() => {
    if (account?.userId) {
      API.get('/blog').then((res) => {
        const userBlogs = (res.data.blogs || []).filter((blog: any) =>
          typeof blog.userId === 'object'
            ? blog.userId?._id === account.userId
            : blog.userId === account.userId
        );
        setBlogs(userBlogs);
      });
    }
  }, [account?.userId, location.key]);

  if (!account || account.role !== 'partner') {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Card className="p-4 text-center shadow-lg">
          <h3>Bạn không có quyền truy cập trang này.</h3>
        </Card>
      </Container>
    );
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setShowAvatarModal(true);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      setShowCoverModal(true);
    }
  };

  const handleConfirmAvatar = async () => {
    if (!avatarFile) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('image', avatarFile);
      await userService.updateAvatar(formData);
      const res = await userService.getUserById(account.userId as string);
      dispatch({ type: 'LOGIN', payload: { account, user: res.data.data } });
      setMessage('Cập nhật avatar thành công!');
      setShowAvatarModal(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch {
      setError('Cập nhật avatar thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCover = async () => {
    if (!coverFile) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('image', coverFile);
      await userService.updateCoverImage(formData);
      const res = await userService.getUserById(account.userId as string);
      dispatch({ type: 'LOGIN', payload: { account, user: res.data.data } });
      setMessage('Cập nhật ảnh bìa thành công!');
      setShowCoverModal(false);
      setCoverFile(null);
      setCoverPreview(null);
    } catch {
      setError('Cập nhật ảnh bìa thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setForm({
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      address: user?.address || '',
      description: user?.description || '',
    });
    // Tự động fill lại các dropdown nếu đã có địa chỉ
    if (user?.address) {
      const parts = user.address.split(',').map(s => s.trim());
      if (parts.length === 4) {
        setDetailAddress(parts[0]);
        const province = locationVN.find(p => p.Name === parts[3]);
        if (province) {
          setSelectedProvince(province.Code);
          const district = province.District.find(d => d.Name === parts[2]);
          if (district) {
            setSelectedDistrict(district.Code);
            if (district.Ward) {
              const ward = district.Ward.find(w => w.Name === parts[1]);
              if (ward) {
                setSelectedWard(ward.Code);
              }
            }
          }
        }
      } else {
        setDetailAddress('');
        setSelectedProvince('');
        setSelectedDistrict('');
        setSelectedWard('');
      }
    } else {
      setDetailAddress('');
      setSelectedProvince('');
      setSelectedDistrict('');
      setSelectedWard('');
    }
    setError('');
    setMessage('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setError('');
    setMessage('');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    // Nếu đang ở chế độ chỉnh sửa địa chỉ, tự động ghép lại address
    if (editMode && selectedProvince && selectedDistrict && selectedWard) {
      const province = locationVN.find(p => p.Code === selectedProvince);
      const district = province?.District.find(d => d.Code === selectedDistrict);
      const ward = district?.Ward ? district.Ward.find(w => w.Code === selectedWard) : undefined;
      if (province && district && ward) {
        form.address = `${detailAddress}, ${ward.Name}, ${district.Name}, ${province.Name}`;
      }
    }
    try {
      await userService.updateProfile(form);
      const res = await userService.getUserById(account.userId as string);
      dispatch({ type: 'LOGIN', payload: { account, user: res.data.data } });
      setMessage('Cập nhật thông tin thành công!');
      setEditMode(false);
    } catch {
      setError('Cập nhật thông tin thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: 900, marginTop: 24 }}>
      {/* COVER + AVATAR */}
      <div
        style={{
          position: 'relative',
          height: coverHeight,
          backgroundImage: `url(${coverPreview || user?.coverImage?.url || '/default-cover.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 12,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)' }} />
        <Button
          variant="light"
          size="sm"
          style={{ position: 'absolute', top: 12, right: 16, zIndex: 2, borderRadius: 6, fontWeight: 500 }}
          onClick={() => coverInputRef.current?.click()}
        >
          📷 Đổi ảnh bìa
          <input type="file" accept="image/*" ref={coverInputRef} style={{ display: 'none' }} onChange={handleCoverChange} />
        </Button>
      </div>

      {/* AVATAR + NAME ROW */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          position: 'relative',
          height: avatarSize,
          marginTop: -avatarSize / 2,
          marginLeft: 48,
          marginBottom: 32,
          zIndex: 2,
        }}
      >
        <div style={{ position: 'relative', width: avatarSize, height: avatarSize }}>
          <img
            src={avatarPreview || user?.avatar?.url || '/default-avatar.png'}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '6px solid white',
              background: '#eee',
              boxShadow: '0 2px 8px #0002',
            }}
            alt="avatar"
          />
          <Button
            variant="light"
            size="sm"
            onClick={() => avatarInputRef.current?.click()}
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              borderRadius: '50%',
              width: 36,
              height: 36,
              backgroundColor: '#444a',
              color: '#fff',
              border: 'none',
              boxShadow: '0 2px 6px #0002',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-camera" viewBox="0 0 16 16">
  <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/>
  <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
</svg>
            <input type="file" accept="image/*" ref={avatarInputRef} style={{ display: 'none' }} onChange={handleAvatarChange} />
          </Button>
        </div>
        <div style={{ marginLeft: 32, marginBottom: 12 }}>
          <h2 style={{ fontWeight: 700, color: '#222', marginBottom: 20}}>{user?.fullName || account?.username}</h2>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <Row>
        <Col md={4}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <h4>{editMode ? <Form.Control name="fullName" value={form.fullName} onChange={handleFormChange} /> : user?.fullName || account?.username}</h4>
              <p><strong>Email:</strong> {user?.email || '-'}</p>
              <p><strong>SĐT:</strong> {editMode ? <Form.Control name="phone" value={form.phone} onChange={handleFormChange} /> : user?.phone || '-'}</p>
              <p>
                <strong>Địa chỉ:</strong>
                {editMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                    <Form.Select
                      value={selectedProvince}
                      onChange={e => {
                        setSelectedProvince(e.target.value);
                        setSelectedDistrict('');
                        setSelectedWard('');
                        setForm({ ...form, address: '' });
                      }}
                      style={{ marginBottom: 8 }}
                    >
                      <option value="">Chọn Tỉnh/Thành phố</option>
                      {locationVN.map(province => (
                        <option key={province.Code} value={province.Code}>{province.Name}</option>
                      ))}
                    </Form.Select>
                    <Form.Select
                      value={selectedDistrict}
                      onChange={e => {
                        setSelectedDistrict(e.target.value);
                        setSelectedWard('');
                        setForm({ ...form, address: '' });
                      }}
                      disabled={!selectedProvince}
                      style={{ marginBottom: 8 }}
                    >
                      <option value="">Chọn Quận/Huyện</option>
                      {selectedProvince &&
                        locationVN.find(p => p.Code === selectedProvince)?.District.map(district => (
                          <option key={district.Code} value={district.Code}>{district.Name}</option>
                        ))}
                    </Form.Select>
                    <Form.Select
                      value={selectedWard}
                      onChange={e => {
                        setSelectedWard(e.target.value);
                        const province = locationVN.find(p => p.Code === selectedProvince);
                        const district = province?.District.find(d => d.Code === selectedDistrict);
                        const ward = district?.Ward ? district.Ward.find(w => w.Code === e.target.value) : undefined;
                        setForm({
                          ...form,
                          address: ward && district && province
                            ? `${detailAddress}, ${ward.Name}, ${district.Name}, ${province.Name}`
                            : ''
                        });
                      }}
                      disabled={!selectedDistrict}
                      style={{ marginBottom: 8 }}
                    >
                      <option value="">Chọn Phường/Xã</option>
                      {selectedProvince && selectedDistrict && (() => {
                        const province = locationVN.find(p => p.Code === selectedProvince);
                        const district = province?.District.find(d => d.Code === selectedDistrict);
                        if (district?.Ward) {
                          return district.Ward.map(ward => (
                            <option key={ward.Code} value={ward.Code}>{ward.Name}</option>
                          ));
                        }
                        return null;
                      })()}
                    </Form.Select>
                    <Form.Control
                      name="detailAddress"
                      placeholder="Số nhà, tên đường, tòa nhà..."
                      value={detailAddress}
                      onChange={e => setDetailAddress(e.target.value)}
                      style={{ marginBottom: 8 }}
                    />
                  </div>
                ) : (
                  <span>{user?.address || '-'}</span>
                )}
              </p>
              <p><strong>Giới thiệu:</strong><br />{editMode ? <Form.Control as="textarea" name="description" value={form.description} onChange={handleFormChange} rows={3} /> : <span style={{ whiteSpace: 'pre-line' }}>{user?.description || 'Chưa có mô tả.'}</span>}</p>
              {editMode ? (
                <div className="d-flex gap-2">
                  <Button variant="primary" onClick={handleSave} disabled={loading}>{loading ? <Spinner animation="border" size="sm" /> : 'Lưu'}</Button>
                  <Button variant="secondary" onClick={handleCancel} disabled={loading}>Hủy</Button>
                </div>
              ) : (
                <Button variant="outline-primary" onClick={handleEdit}>✏️ Chỉnh sửa</Button>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="mb-3" style={{ fontWeight: 600 }}>Bài viết đã đăng</h5>
              {blogs.length === 0 ? (
                <div style={{ color: '#888' }}>Chưa có bài viết nào.</div>
              ) : (
                <Row xs={1} sm={2} className="g-3">
                  {blogs.map(blog => (
                    <Col key={blog._id}>
                      <Card style={{ borderRadius: 12, cursor: 'pointer' }} onClick={() => { setSelectedBlogId(blog._id); setShowBlogModal(true); }}>
                        {blog.images?.[0] && <Card.Img variant="top" src={blog.images[0].url} style={{ height: 150, objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />}
                        <Card.Body>
                          <div style={{ fontWeight: 600 }}>{blog.content.slice(0, 80)}{blog.content.length > 80 ? '...' : ''}</div>
                          <div style={{ fontSize: 13, color: '#777' }}>{new Date(blog.createdAt).toLocaleString('vi-VN')}</div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* MODALS */}
      <Modal show={showAvatarModal} onHide={() => setShowAvatarModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Xác nhận đổi ảnh đại diện</Modal.Title></Modal.Header>
        <Modal.Body className="text-center">
          {avatarPreview && <img src={avatarPreview} alt="preview" style={{ width: 120, height: 120, borderRadius: '50%', border: '3px solid #1976d2', objectFit: 'cover' }} />}
          <p className="mt-3">Bạn có chắc muốn đổi ảnh đại diện?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAvatarModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleConfirmAvatar} disabled={loading}>{loading ? <Spinner animation="border" size="sm" /> : 'Xác nhận'}</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCoverModal} onHide={() => setShowCoverModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Xác nhận đổi ảnh bìa</Modal.Title></Modal.Header>
        <Modal.Body className="text-center">
          {coverPreview && <img src={coverPreview} alt="preview" style={{ width: '100%', borderRadius: 8, objectFit: 'cover' }} />}
          <p className="mt-3">Bạn có chắc muốn đổi ảnh bìa?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCoverModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleConfirmCover} disabled={loading}>{loading ? <Spinner animation="border" size="sm" /> : 'Xác nhận'}</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showBlogModal} onHide={() => setShowBlogModal(false)} size="lg" centered>
        <Modal.Body style={{ padding: 0 }}>
          {selectedBlogId && <ViewBlog id={selectedBlogId} isModal />}
        </Modal.Body>
      </Modal>

      {/* Toast Alert */}
      <div style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: 9999,
        minWidth: 300,
        maxWidth: 400
      }}>
        {message && <ModernAlert type="success">{message}</ModernAlert>}
        {error && <ModernAlert type="danger">{error}</ModernAlert>}
      </div>
    </Container>
  );
};

export default PartnerProfile;
