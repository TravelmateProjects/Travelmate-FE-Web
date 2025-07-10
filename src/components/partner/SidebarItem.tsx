// SidebarItem.tsx
import React from "react";
import { Nav } from "react-bootstrap";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  collapsed: boolean;
  rightIcon?: React.ReactNode;
  style?: React.CSSProperties;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  onClick,
  collapsed,
  rightIcon,
  style,
}) => {
  return (
    <OverlayTrigger
      placement="right"
      overlay={collapsed ? <Tooltip>{label}</Tooltip> : <></>}
    >
      <Nav.Link
        onClick={onClick}
        className="rounded-3 py-2 px-2 w-100 d-flex align-items-center justify-content-start"
        style={{
          background: "rgba(255,255,255,0.1)",
          color: "#fff",
          fontWeight: 500,
          transition: "background 0.2s",
          ...style,
        }}
      >
        {icon}
        {!collapsed && <span className="ms-2">{label}</span>}
        {!collapsed && rightIcon && <span className="ms-auto">{rightIcon}</span>}
      </Nav.Link>
    </OverlayTrigger>
  );
};

export default SidebarItem;
