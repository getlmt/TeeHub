
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminHeader.module.css";
import logoImg from "../../../assets/t1.png";


import { logout as apiLogout } from "@/services/authService";
import { clearAuth } from "@/utils/auth";

export default function AdminHeader() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleUserMenu = () => setIsUserMenuOpen((v) => !v);

  
  const handleGoHome = () => {
    navigate("/"); 
  };

  const handleLogout = async () => {
    try {
      if (apiLogout) {
        await apiLogout();
      } else {
        clearAuth();
      }
    } catch (_) {
      clearAuth();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className={styles.adminHeader}>
      <div className={styles.headerContent}>
        {}
        <div className={styles.headerLeft}>
          <div className={styles.logo} onClick={() => navigate("/admin")} role="button">
            <span className={styles.logoIcon}><img src={logoImg} alt="TeeHub Logo" /></span>
            <span className={styles.logoText}>TeeHub Admin</span>
          </div>
        </div>

        {}
        <div className={styles.headerRight}>
          
          {}
          <div 
            className={styles.actionIcon} 
            onClick={handleGoHome} 
            title="Về trang chủ website"
          >
            <svg 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          {}

      
          <div className={styles.userMenu}>
            <button className={styles.userButton} onClick={toggleUserMenu}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>Admin User</span>
                <span className={styles.userRole}>Administrator</span>
              </div>
              <span className={styles.dropdownIcon}>
                {isUserMenuOpen ? "▲" : "▼"}
              </span>
            </button>

            {isUserMenuOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownItem} onClick={handleLogout}>
                  <span className={styles.itemIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>Đăng xuất</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}