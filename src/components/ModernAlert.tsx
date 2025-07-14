import React from 'react';

interface ModernAlertProps {
  type: 'success' | 'danger' | 'info' | 'warning';
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const iconMap: Record<string, string> = {
  success: '✅',
  danger: '❌',
  info: 'ℹ️',
  warning: '⚠️',
};

const colorMap: Record<string, { bg: string; border: string; color: string }> = {
  success: {
    bg: 'rgba(76, 175, 80, 0.18)',
    border: '#43a04755',
    color: '#43a047',
  },
  danger: {
    bg: 'rgba(244, 67, 54, 0.18)',
    border: '#e5393555',
    color: '#e53935',
  },
  info: {
    bg: 'rgba(33, 150, 243, 0.18)',
    border: '#1976d255',
    color: '#1976d2',
  },
  warning: {
    bg: 'rgba(255, 193, 7, 0.18)',
    border: '#ffa00055',
    color: '#ffa000',
  },
};

const ModernAlert: React.FC<ModernAlertProps> = ({ type, children, style }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: colorMap[type].bg,
      color: colorMap[type].color,
      border: `1.5px solid ${colorMap[type].border}`,
      borderRadius: 14,
      padding: '10px 16px',
      marginBottom: 16,
      fontWeight: 500,
      fontSize: 16,
      boxShadow: '0 2px 12px #0001',
      backdropFilter: 'blur(2px)',
      ...style,
    }}
  >
    <span style={{ fontSize: 22 }}>
      {iconMap[type]}
    </span>
    <span>{children}</span>
  </div>
);

export default ModernAlert; 