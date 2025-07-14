import React, { useState } from 'react';
import { Form, Button, Spinner, Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import bgImage from '../../images/background.jpg';
import ModernAlert from '../../components/ModernAlert';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      setMessage('Đã gửi mã OTP về email. Vui lòng kiểm tra hộp thư.');
      setTimeout(() => {
        navigate('/verify-otp', { state: { email } });
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
                <h2 className="fw-bold mb-3" style={{ color: '#fff', fontSize: 32, textAlign: 'center', textShadow: '0 2px 8px #0006' }}>Quên mật khẩu</h2>
                {message && <ModernAlert type="success">{message}</ModernAlert>}
                {error && <ModernAlert type="danger">{error}</ModernAlert>}
                <Form onSubmit={handleSubmit} autoComplete="off">
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#fff' }}>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="Nhập email đã đăng ký"
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
                    {loading ? <Spinner animation="border" size="sm" /> : 'Gửi mã OTP'}
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

export default ForgotPassword; 