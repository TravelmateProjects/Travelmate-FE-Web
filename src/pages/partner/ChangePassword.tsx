import React, { useState } from "react";
import { Form, Button, Card, Alert, Spinner, InputGroup } from "react-bootstrap";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";

const ChangePassword: React.FC = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới và xác nhận không khớp.");
            return;
        }
        setLoading(true);
        try {
            await authService.changePassword({ oldPassword, newPassword, confirmPassword });
            setSuccess("Đổi mật khẩu thành công!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => navigate("/partner/home"), 1500);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Đổi mật khẩu thất bại.");
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (
        label: string,
        value: string,
        setValue: (v: string) => void,
        show: boolean,
        setShow: (v: boolean) => void,
        controlId: string
    ) => (
        <Form.Group className="mb-3" controlId={controlId}>
            <Form.Label className="fw-semibold">{label}</Form.Label>
            <InputGroup>
                <InputGroup.Text
                    style={{
                        background: "#f1f3f5",
                        borderRight: 0,
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                    }}
                >
                    <FiLock />
                </InputGroup.Text>

                <Form.Control
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    required
                    style={{
                        borderLeft: 0,
                        borderRight: 0,
                        borderRadius: 0,
                    }}
                />

                <InputGroup.Text
                    onClick={() => setShow(!show)}
                    style={{
                        background: "#f1f3f5",
                        cursor: "pointer",
                        borderLeft: 0,
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </InputGroup.Text>
            </InputGroup>

        </Form.Group>
    );

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(to bottom right, #ffffff)",
            }}
        >
            <Card
                style={{
                    width: "100%",
                    maxWidth: 440,
                    border: "none",
                    borderRadius: 16,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                }}
            >
                <Card.Body className="p-4">
                    <h4 className="mb-4 text-center fw-bold text-primary">Đổi mật khẩu</h4>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        {renderInput("Mật khẩu cũ", oldPassword, setOldPassword, showOld, setShowOld, "oldPassword")}
                        {renderInput("Mật khẩu mới", newPassword, setNewPassword, showNew, setShowNew, "newPassword")}
                        {renderInput("Xác nhận mật khẩu mới", confirmPassword, setConfirmPassword, showConfirm, setShowConfirm, "confirmPassword")}

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-100 mt-2 fw-semibold"
                            style={{ borderRadius: 10 }}
                            disabled={loading}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : "Đổi mật khẩu"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ChangePassword;
