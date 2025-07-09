import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner, Card, Container, Row, Col } from 'react-bootstrap';
import authService from '../../services/authService';
import bgImage from '../../images/background.jpg';
import ModernAlert from '../../components/ModernAlert';

const VerifyOtp: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email: string })?.email || '';
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (e: React.ChangeEvent<any>, idx: number) => {
    const val = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '');
    if (!val) return;
    const newOtp = [...otpDigits];
    newOtp[idx] = val.slice(-1);
    setOtpDigits(newOtp);
    // focus next
    if (val && idx < 5) {
      const next = document.getElementById(`otp-input-${idx + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<any>, idx: number) => {
    if (e.key === 'Backspace') {
      if (otpDigits[idx]) {
        const newOtp = [...otpDigits];
        newOtp[idx] = '';
        setOtpDigits(newOtp);
      } else if (idx > 0) {
        const prev = document.getElementById(`otp-input-${idx - 1}`);
        if (prev) (prev as HTMLInputElement).focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const otp = otpDigits.join('');
    if (otp.length < 6) {
      setError('Vui lòng nhập đủ 6 số OTP.');
      return;
    }
    setLoading(true);
    try {
      await authService.verifyForgotOtp({ email, otp });
      setMessage('Xác thực OTP thành công!');
      setTimeout(() => {
        navigate('/reset-password', { state: { email, otp } });
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
                <h2 className="fw-bold mb-3" style={{ color: '#fff', fontSize: 32, textAlign: 'center', textShadow: '0 2px 8px #0006' }}>Nhập mã OTP</h2>
                {message && <ModernAlert type="success">{message}</ModernAlert>}
                {error && <ModernAlert type="danger">{error}</ModernAlert>}
                <Form onSubmit={handleSubmit} autoComplete="off">
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#fff' }}>Mã OTP</Form.Label>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <Form.Control
                          key={idx}
                          id={`otp-input-${idx}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={otpDigits[idx] || ''}
                          onChange={e => handleOtpChange(e, idx)}
                          onKeyDown={e => handleOtpKeyDown(e, idx)}
                          style={{
                            width: 40,
                            height: 48,
                            textAlign: 'center',
                            fontSize: 24,
                            borderRadius: 12,
                            background: 'rgba(255,255,255,0.12)',
                            color: '#fff',
                            border: '1.5px solid #fff3',
                            boxShadow: '0 2px 8px #0002',
                          }}
                          autoFocus={idx === 0}
                        />
                      ))}
                    </div>
                  </Form.Group>
                  <Button type="submit" disabled={loading} className="w-100 py-2 fw-bold" style={{
                    borderRadius: 18,
                    fontSize: 20,
                    background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                    border: 'none',
                    boxShadow: '0 4px 16px #1976d255',
                  }}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Xác nhận OTP'}
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

export default VerifyOtp; 