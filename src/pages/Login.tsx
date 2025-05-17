import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner, Card } from 'react-bootstrap';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
      const res = await API.post(
        '/auth/login',
        { username, password },
        { withCredentials: true }
      );
    //   const { accessToken, account, user } = res.data;
      const { account, user } = res.data; // Không lấy accessToken từ response nữa
      dispatch({
        type: 'LOGIN',
        payload: {
          account: {
            id: account.id,
            username: account.username,
            role: account.role,
            userId: account.userId,
            // add more if needed
          },
          accessToken: '', // Không lưu accessToken ở client, chỉ để trống
        },
      });
      if (account.role === 'admin') {
        navigate('/admin/home');
      } else {
        navigate('/user/home');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #1976d2 0%, #42a5f5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container>
        <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <Col xs={12} sm={10} md={7} lg={5} xl={4}>
            <Card className="shadow-lg border-0" style={{ borderRadius: 18, margin: '0 auto', maxWidth: 400 }}>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <img src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png" alt="login" width={64} height={64} style={{ marginBottom: 8 }} />
                  <h2 className="fw-bold mb-2" style={{ color: '#1976d2', letterSpacing: 1 }}>Đăng nhập</h2>
                  <div className="text-muted mb-2" style={{ fontSize: 15 }}>Chào mừng bạn đến với Travelmate!</div>
                </div>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit} autoComplete="off">
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label className="fw-semibold">Tên đăng nhập</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                      placeholder="Nhập tên đăng nhập"
                      size="lg"
                      autoFocus
                      style={{ fontSize: 16, borderRadius: 10 }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label className="fw-semibold">Mật khẩu</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="Nhập mật khẩu"
                      size="lg"
                      style={{ fontSize: 16, borderRadius: 10 }}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" disabled={loading} className="w-100 py-2 fw-bold" size="lg" style={{ borderRadius: 10, fontSize: 18, letterSpacing: 1 }}>
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
