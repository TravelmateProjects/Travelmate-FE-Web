import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';
import bgImage from '../../images/background.jpg';
import logo from '../../images/logo.png';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authService.login({
        username,
        password,
        platform: 'web',
      });

      const { account, user } = response;

      dispatch({
        type: 'LOGIN',
        payload: {
          account: {
            id: account.id,
            username: account.username,
            role: account.role,
            userId: account.userId,
          },
          user: user,
        },
      });

      if (account.role === 'admin') {
        navigate('/admin/home');
      } else if (account.role === 'partner') {
        navigate('/partner/home');
      } else {
        setError('Bạn không có quyền truy cập vào hệ thống này.');
        return;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Login failed');
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
                <div className="text-center mb-4">
                  <img
                    src={logo}
                    alt="login"
                    style={{
                      marginBottom: 8,
                      maxWidth: 180,
                      height: 'auto',
                      display: 'block',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 2px 12px #fff) brightness(1.25) contrast(1.15)',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                  />
                  <h2 className="fw-bold mb-1" style={{ color: '#fff', letterSpacing: 1, fontSize: 36, textShadow: '0 2px 8px #0006' }}>
                    Đăng nhập
                  </h2>
                  <div className="mb-3" style={{ fontSize: 16, color: '#fff', opacity: 0.85 }}>
                    Chào mừng bạn đến với Travelmate!
                  </div>
                </div>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit} autoComplete="off">
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label className="fw-semibold" style={{ color: '#fff' }}>Tên đăng nhập</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                      placeholder="Nhập tên đăng nhập"
                      size="lg"
                      autoFocus
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
                  <Form.Group className="mb-1" controlId="formPassword">
                    <Form.Label className="fw-semibold" style={{ color: '#fff' }}>Mật khẩu</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="Nhập mật khẩu"
                      size="lg"
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
                  <div className="d-flex justify-content-end mb-3">
                    <Button
                      variant="link"
                      className="p-0"
                      style={{ fontSize: 15, color: '#fff', textDecoration: 'underline', opacity: 0.9 }}
                      onClick={() => navigate('/forgot-password')}
                    >
                      Quên mật khẩu?
                    </Button>
                  </div>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="w-100 py-2 fw-bold"
                    size="lg"
                    style={{
                      borderRadius: 18,
                      fontSize: 22,
                      letterSpacing: 1,
                      background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                      border: 'none',
                      boxShadow: '0 4px 16px #1976d255',
                    }}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : 'Đăng nhập'}
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

export default Login;
