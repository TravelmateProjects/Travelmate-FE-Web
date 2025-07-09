import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner, Card, Container, Row, Col } from 'react-bootstrap';
import authService from '../../services/authService';
import bgImage from '../../images/background.jpg';
import ModernAlert from '../../components/ModernAlert';

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email: string })?.email || '';
  const otp = (location.state as { otp: string })?.otp || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({ email, otp, newPassword });
      setMessage('Đặt lại mật khẩu thành công!');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        position: 'relative',
      }}
    >
      {/* Overlay mờ */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(30,41,59,0.45)',
        backdropFilter: 'blur(2.5px)',
        WebkitBackdropFilter: 'blur(2.5px)',
        zIndex: 1,
      }} />
      <Container style={{ position: 'relative', zIndex: 2 }}>
        <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <Col xs={12} sm={10} md={7} lg={5} xl={4}>
            <Card
              className="shadow-lg border-0"
              style={{
                borderRadius: 28,
                background: 'rgba(30, 41, 59, 0.55)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.18)',
              }}
            >
              <Card.Body className="p-4">
                <h2 className="fw-bold mb-3" style={{ color: '#fff', fontSize: 32, textAlign: 'center', textShadow: '0 2px 8px #0006' }}>Đặt lại mật khẩu</h2>
                {message && <ModernAlert type="success">{message}</ModernAlert>}
                {error && <ModernAlert type="danger">{error}</ModernAlert>}
                <Form onSubmit={handleSubmit} autoComplete="off">
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#fff' }}>Mật khẩu mới</Form.Label>
                    <Form.Control
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      placeholder="Nhập mật khẩu mới"
                      style={{
                        fontSize: 16,
                        borderRadius: 18,
                        background: 'rgba(255,255,255,0.12)',
                        color: '#fff',
                        border: '1.5px solid #fff3',
                        boxShadow: '0 2px 8px #0002',
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#fff' }}>Xác nhận mật khẩu mới</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Nhập lại mật khẩu mới"
                      style={{
                        fontSize: 16,
                        borderRadius: 18,
                        background: 'rgba(255,255,255,0.12)',
                        color: '#fff',
                        border: '1.5px solid #fff3',
                        boxShadow: '0 2px 8px #0002',
                      }}
                    />
                  </Form.Group>
                  <Button type="submit" disabled={loading} className="w-100 py-2 fw-bold" style={{
                    borderRadius: 18,
                    fontSize: 20,
                    background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                    border: 'none',
                    boxShadow: '0 4px 16px #1976d255',
                  }}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Đặt lại mật khẩu'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPassword; 