import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const CreatePartner: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await authService.createPartner({ fullName, email, phone, username });
      setSuccess('Tạo partner thành công! Đã gửi mail cho partner.');
      setFullName('');
      setEmail('');
      setPhone('');
      setUsername('');
      setTimeout(() => navigate('/admin/home'), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: 'rgb(245, 245, 245)' }}>
      <Card style={{ minWidth: 400, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <Card.Body>
          <h3 className="mb-4">Tạo Partner mới</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="fullName">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                placeholder="Nhập họ tên partner"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Nhập email partner"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                placeholder="Nhập số điện thoại partner"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="Nhập username cho partner"
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Tạo Partner'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreatePartner; 