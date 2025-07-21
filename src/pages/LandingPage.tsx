import React, { useEffect, useState } from "react";
import logo from "../images/logo.png";
import qrApp from "../images/qr_code.png";
import background from "../images/background.jpg";
import { useNavigate } from "react-router-dom";
import { FiMail, FiPhone } from "react-icons/fi";

const fbUrl = "https://www.facebook.com/profile.php?id=61577574491711";

const FacebookIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="#1877f3">
    <circle cx="16" cy="16" r="16" fill="#fff" />
    <path
      d="M21.5 16h-3v9h-4v-9h-2v-3h2v-2c0-2.2 1.3-3.5 3.3-3.5.9 0 1.7.1 1.7.1v3h-1c-.8 0-1 .4-1 1v1.4h3l-.5 3z"
      fill="#1877f3"
    />
  </svg>
);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [qrVisible, setQrVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setQrVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "'Quicksand', sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        color: "#fff",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.6)",
          zIndex: 1,
        }}
      />

      {/* Navbar */}
      <div
        style={{
          zIndex: 2,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "20px 40px",
        }}
      >
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "10px 24px",
            background: "#ffd700",
            color: "#000",
            fontWeight: 700,
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 215, 0, 0.5)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Bắt đầu
        </button>
      </div>

      {/* Main Content */}
      <div
        style={{
          zIndex: 2,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 20,
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            width: 220,
            marginBottom: 24,
            background: "#fff",
            borderRadius: 20,
            padding: 10,
            boxShadow: "0 4px 20px rgba(255, 215, 0, 0.5)",
            transition: "transform 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        <h1 style={{ fontSize: 36, fontWeight: 700 }}>
          Chào mừng đến với{" "}
          <span style={{ color: "#ffd700" }}>Travelmate!</span>
        </h1>
        <p style={{ fontSize: 18, maxWidth: 600, marginTop: 12 }}>
          “Người bạn đồng hành trên mọi hành trình.” Kết nối, chia sẻ và khám phá
          những hành trình tuyệt vời.
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px",
          zIndex: 3,
        }}
      >
        {/* Contact Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FiMail style={{ marginRight: 8 }} /> travelmate.connect@gmail.com
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FiPhone style={{ marginRight: 8 }} /> 0123 456 789
          </div>
          <a
            href={fbUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              background: "#fff",
              borderRadius: 20,
              border: "1.5px solid #1877f3",
              color: "#1877f3",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: 14,
              transition: "all 0.2s ease",
              width: "fit-content",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#1877f3";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.color = "#1877f3";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <FacebookIcon size={18} /> Facebook
          </a>
          <a
            href="mailto:travelmate.connect@gmail.com?subject=Đăng%20k%C3%BD%20partner%20Travelmate&body=Ch%C3%A0o%20Travelmate%2C%20t%C3%B4i%20mu%E1%BB%91n%20tr%E1%BB%9F%20th%C3%A0nh%20partner..."
            style={{
              marginTop: 8,
              padding: "6px 16px",
              background: "#ffd700",
              color: "#000",
              fontWeight: 700,
              borderRadius: 20,
              textDecoration: "none",
              fontSize: 14,
              transition: "all 0.3s ease",
              width: "fit-content",
              display: "inline-block",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.color = "#000";
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 4px 8px rgba(255,215,0,0.5)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#ffd700";
              e.currentTarget.style.color = "#000";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            🤝 Liên hệ để trở thành partner
          </a>
        </div>

        {/* QR Code Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: qrVisible ? "translateY(0)" : "translateY(80px)",
            opacity: qrVisible ? 1 : 0,
            transition: "all 0.7s ease-out",
          }}
        >
          <div
            style={{
              fontSize: 13,
              background: "rgba(0,0,0,0.5)",
              padding: "4px 12px",
              borderRadius: 8,
              marginBottom: 8,
              color: "#fff",
            }}
          >
            Quét mã QR tải app
          </div>
          <img
            src={qrApp}
            alt="QR App"
            style={{
              width: 100,
              height: 100,
              borderRadius: 12,
              background: "#fff",
              border: "2px solid #fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
