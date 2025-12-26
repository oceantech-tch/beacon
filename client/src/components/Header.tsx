import React from "react";
import { FiChevronLeft, FiLogOut } from "react-icons/fi";
import "./fontIcons/header.css";

interface Props {
  title?: string;
  onBack?: () => void;
  onLogout?: () => void;
}

const Header: React.FC<Props> = ({ onBack, onLogout }) => {
  return (
    <header className="header">
      {/* Back button (optional) */}
      <div className="header-left">
        {onBack ? (
          <button className="header-icon-btn" onClick={onBack}>
            <FiChevronLeft size={22} />
          </button>
        ) : (
          <div className="header-placeholder"></div>
        )}
      </div>

      {/* Logo */}
      <div className="header-center">
        <span className="header-logo">G-Shock</span>
      </div>

      {/* Logout button (optional) */}
      <div className="header-right">
        {onLogout ? (
          <button className="header-icon-btn" onClick={onLogout}>
            <FiLogOut size={20} />
          </button>
        ) : (
          <div className="header-placeholder"></div>
        )}
      </div>
    </header>
  );
};

export default Header;