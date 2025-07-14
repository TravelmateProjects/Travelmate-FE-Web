// PartnerSidebar.tsx
import React, { useState } from "react";
import {
  Button,
  Stack,
  Card,
} from "react-bootstrap";
import {
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiUser,
  FiSettings,
  FiLogOut,
  FiEdit3,
  FiKey,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../hooks/useLanguage";
import authService from "../../services/authService";
import SidebarItem from "./SidebarItem";
import { FiChevronDown, FiChevronUp, } from "react-icons/fi";
import { FiImage } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";




const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 64;

const PartnerSidebar: React.FC = () => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      console.log("[PartnerSidebar] Logout API called successfully");
    } catch (error) {
      console.error("[PartnerSidebar] Logout API failed:", error);
    }
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <Card
      style={{
        width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        transition: "all 0.3s ease",
        background: collapsed
          ? "#0d47a1"
          : "linear-gradient(180deg, #0d47a1 0%, #2196f3 100%)",
        color: "#fff",
        position: "fixed",
        height: "100vh",
        zIndex: 1000,
        borderRadius: 0,
        boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <Card.Body className="d-flex flex-column p-0">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom border-white-25">
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>👋 {t("welcome")}</div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>
                {state.account?.username || "Partner"}
              </div>
            </div>
          )}
          <Button
            variant="outline-light"
            size="sm"
            className="d-flex align-items-center justify-content-center"
            style={{ border: "none", boxShadow: "none", width: 32, height: 32 }}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          </Button>
        </div>

        {/* Navigation */}
        <Stack className="px-2 py-3" gap={2}>
          <SidebarItem
            collapsed={collapsed}
            icon={<FiHome size={18} />}
            label={t("partner_home")}
            onClick={() => navigate("/partner/home")}
          />
          <SidebarItem
            collapsed={collapsed}
            icon={<FiUser size={18} />}
            label={t("profile")}
            onClick={() =>
              window.location.pathname === "/partner/profile"
                ? window.location.reload()
                : navigate("/partner/profile")
            }
          />
          <SidebarItem
            collapsed={collapsed}
            icon={<FiSettings size={18} />}
            label={t("settings")}
            onClick={() => setSettingsOpen(!settingsOpen)}
            rightIcon={
              !collapsed &&
              (settingsOpen ? (
                <FiChevronUp size={16} />
              ) : (
                <FiChevronDown size={16} />)
              )
            }
          />


<AnimatePresence initial={false}>
  {settingsOpen && !collapsed && (
    <motion.div
      className="ms-2"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <SidebarItem
        collapsed={false}
        icon={<FiKey size={16} />}
        label={t("change_password")}
        onClick={() => navigate("/partner/change-password")}
        style={{
          background: "rgba(255,255,255,0.1)",
          color: "#fff",
          fontWeight: 500,
          paddingLeft: 32,
          borderRadius: 6,
        }}
      />
    </motion.div>
  )}
</AnimatePresence>


          <SidebarItem
            collapsed={collapsed}
            icon={<FiEdit3 size={18} />}
            label="Blog"
            onClick={() => navigate("/partner/blog")}
          />
          <SidebarItem
            collapsed={collapsed}
            icon={<FiImage size={18} />}
            label="Albums"
            onClick={() => navigate("/partner/albums")}
          />
        </Stack>

        {/* Language Switch */}
        {!collapsed && (
          <div className="px-3 pb-2 d-flex align-items-center justify-content-between mt-auto">
            <small>{t("language")}:</small>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="langSwitch"
                checked={language === "en"}
                onChange={() => setLanguage(language === "vi" ? "en" : "vi")}
              />
              <label className="form-check-label ms-2" htmlFor="langSwitch">
                {language.toUpperCase()}
              </label>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="px-3 pb-3">
          <Button
            onClick={handleLogout}
            className="w-100 d-flex align-items-center justify-content-center fw-bold"
            style={{
              background: "#fff",
              color: "#1976d2",
              border: "none",
              borderRadius: 8,
              padding: collapsed ? "8px" : "8px 16px",
              fontSize: 14,
              transition: "all 0.2s ease-in-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e3f2fd")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            title={t("logout")}
          >
            <FiLogOut size={18} style={{ marginRight: collapsed ? 0 : 8 }} />
            {!collapsed && t("logout")}
          </Button>

        </div>
      </Card.Body>
    </Card>
  );
};

export default PartnerSidebar;
