
import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { User } from "lucide-react";
import logoImg from "../../../assets/t1.png";
import {
  isAuthenticated,
  getRole,
  getEmail,
  clearAuth,
} from "@/utils/auth";

import styles from "./Header.module.css";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  
  const authed = isAuthenticated();
  const role = getRole();
  const email = getEmail();

  
  const {
    items = [],
    total,
    itemCount,
    totalQty,
    refreshCart,
    isLoading,
  } = useCart();

  
  useEffect(() => {
    if (authed && typeof refreshCart === "function") {
      refreshCart().catch(() => { });
    }
    
  }, [authed]);

  
  useEffect(() => {
    const handler = () => {  };
    window.addEventListener("cartUpdated", handler);
    return () => window.removeEventListener("cartUpdated", handler);
  }, []);

  const totalItems = useMemo(() => {
    if (Number.isFinite(totalQty)) return Math.max(0, Math.floor(totalQty));
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, it) => {
      const q = Number(it.quantity ?? it.qty ?? it.count ?? 0);
      return sum + (Number.isFinite(q) ? Math.floor(q) : 0);
    }, 0);
  }, [totalQty, items]);

  const username = useMemo(() => {
    if (!email) return "";
    const at = email.indexOf("@");
    return at > 0 ? email.slice(0, at) : email;
  }, [email]);

  const handleLogout = async () => {
    clearAuth();
    setIsMobileMenuOpen(false);
    if (pathname.startsWith("/admin")) navigate("/");
    else navigate("/login");
  };

  const navigationItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Sản phẩm", path: "/products" },
    { label: "Thử đồ ", path: "/virtual-try-on" },
    { label: "Thiết kế", path: "/design" },
    { label: "Liên hệ", path: "/contact" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {}
        <Link to="/" className={styles.logo} onClick={() => setIsMobileMenuOpen(false)}>
          <div className={styles.logoIcon}>
            <img src={logoImg} alt="TeeHub" />
          </div>
          <span className={styles.logoText}>TeeHub</span>
        </Link>

        {}
        <nav className={styles.nav}>
          {navigationItems.map((item) => (
            <Link key={item.path} to={item.path} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
          {authed && role === "ROLE_ADMIN" && (
            <Link to="/admin" className={styles.navLink}>
              Admin
            </Link>
          )}
        </nav>

        {}
        <div className={styles.userActions}>
          <div>
            {!authed ? (
              <button
                type="button"
                className={styles.cartLink}
                onClick={() => {
                  alert("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem giỏ hàng.");
                  navigate("/login");
                }}
                style={{ background: "transparent", border: "none", cursor: "pointer" }}
                aria-label="Xem giỏ hàng"
              >
                <img src="../public/Img/bag.png" alt="Giỏ hàng" style={{ width: "24px", height: "24px" }} />
              </button>
            ) : (
              <Link to="/cart" className={styles.cartLink} title="Xem giỏ hàng" aria-label="Xem giỏ hàng">
                <img src="../public/Img/bag.png" alt="Giỏ hàng" style={{ width: "24px", height: "24px" }} />
                {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
              </Link>
            )}
          </div>

          {!authed ? (
            <div className={styles.authButtons}>
              <button type="button" className={styles.authButton} onClick={() => navigate("/login")} aria-label="Đăng nhập">
                <User className={styles.userIcon} strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <button type="button" className={styles.authButtonPrimary} onClick={() => navigate("/me/profile")} title={email}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" strokeLinecap="round" />
                </svg>
                <span>{username || "Tài khoản"}</span>
              </button>
              <button type="button" className={styles.authButton} onClick={handleLogout} title="Đăng xuất" aria-label="Đăng xuất">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}

          <button type="button" className={styles.mobileMenuToggle} onClick={() => setIsMobileMenuOpen(v => !v)} aria-label="Toggle mobile menu">
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            {navigationItems.map((item) => (
              <Link key={item.path} to={item.path} className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
                {item.label}
              </Link>
            ))}

            {authed && role === "ROLE_ADMIN" && (
              <Link to="/admin" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
                Admin
              </Link>
            )}
          </nav>

          <div className={styles.mobileAuthButtons}>
            {!authed ? (
              <button type="button" className={styles.mobileAuthButton} onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }}>
                Đăng nhập
              </button>
            ) : (
              <>
                <button type="button" className={styles.mobileAuthButtonPrimary} onClick={() => { navigate("/me/profile"); setIsMobileMenuOpen(false); }}>
                  {username || email}
                </button>
                <button type="button" className={styles.mobileAuthButton} onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
