import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { loginUser, registerUser } from "../../../store/slices/authSlice.js";
import { normalizeRole } from "../../../utils/auth.js";
// 1. IMPORT HẰNG SỐ URL TỪ FILE CONSTANTS (Chú ý đường dẫn ../ cho đúng với thư mục của bạn)
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL} from "../../../utils/constants.js";


// Icon components using SVG
const Mail = () => (
  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Lock = () => (
  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const User = () => (
  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Eye = () => (
  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOff = () => (
  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const ShoppingBag = () => (
  <svg style={{ width: '48px', height: '48px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Register states
  const [fullName, setFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMessage("");

    if (!loginEmail || !loginPassword) {
      setErrorMsg("Vui lòng nhập email và mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      console.log("Dispatching loginUser thunk...");
      const resultAction = await dispatch(
        loginUser({
          email: loginEmail.trim(),
          password: loginPassword,
        })
      );

      const { accessToken, email, role, userId } = unwrapResult(resultAction);
      console.log("Login thunk successful! Payload received:", { accessToken: '...', email, role, userId });

      if (!accessToken) {
        console.error("Login successful but no accessToken received in payload.");
        throw new Error("Không nhận được thông tin xác thực.");
      }

      console.log("Raw role received:", role);
      const r = normalizeRole(role || "");
      console.log("Normalized role for redirect:", r);
      console.log("Checking condition (r === 'ROLE_ADMIN'):", r === "ROLE_ADMIN");

      const from = location.state?.from?.pathname;
      if (from) {
        console.log("Redirecting to previous location:", from);
        navigate(from, { replace: true });
        return;
      }

      const redirectTo = r === "ROLE_ADMIN" ? "/admin" : "/";
      console.log("Redirecting based on role to:", redirectTo);
      navigate(redirectTo, { replace: true });

    } catch (err) {
      console.error("Login failed:", err);
      const msg =
        err?.message ||
        err ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMessage("");

    if (!fullName || !regEmail || !regPassword || !regConfirm) {
      setErrorMsg("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (regPassword !== regConfirm) {
      setErrorMsg("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);
    try {
      console.log("Dispatching registerUser thunk...");
      const resultAction = await dispatch(
        registerUser({
          fullName: fullName.trim(),
          email: regEmail.trim(),
          password: regPassword,
        })
      );

      const { accessToken, email, role, userId } = unwrapResult(resultAction);
      console.log("Register thunk successful!", { accessToken: '...', email, role, userId });

      if (!accessToken) {
        throw new Error("Không nhận được thông tin xác thực sau khi đăng ký.");
      }

      // Chuyển hướng (giữ nguyên logic của bạn)
      const r = normalizeRole(role || "");
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
        return;
      }
      const redirectTo = r === "ROLE_ADMIN" ? "/admin" : "/";
      navigate(redirectTo, { replace: true });

    } catch (err) {
      console.error("Registration failed details:", err);
      
      // === SỬA ĐOẠN NÀY ĐỂ BẮT ĐÚNG MESSAGE TỪ BACKEND ===
      let msg = "Đăng ký thất bại. Vui lòng thử lại.";

      if (typeof err === 'string') {
        // Trường hợp 1: Lỗi trả về là một chuỗi text trực tiếp
        msg = err;
      } else if (err?.message) {
        // Trường hợp 2: Backend Spring Boot trả về JSON có key là 'message'
        msg = err.message;
      } else if (err?.error) {
        // Trường hợp 3: Backend trả về key 'error'
        msg = err.error;
      }
      
      setErrorMsg(msg);
      // ===================================================
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabName) => {
    setErrorMsg("");
    setSuccessMessage("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setActiveTab(tabName);
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    backgroundBlob: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.1)',
      animation: 'blob 7s infinite'
    },
    mainContainer: {
      display: 'flex',
      flexDirection: 'row',
      background: 'white',
      borderRadius: '24px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
      width: '100%',
      maxWidth: '1100px',
      minHeight: '650px',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 1
    },
    brandPanel: {
      flex: '1',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '60px 40px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    },
    brandContent: {
      position: 'relative',
      zIndex: 2,
      textAlign: 'center',
      width: '100%'
    },
    logoContainer: {
      width: '80px',
      height: '80px',
      background: 'white',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      color: '#667eea'
    },
    brandTitle: {
      fontSize: '42px',
      fontWeight: '800',
      marginBottom: '16px',
      textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    },
    brandSubtitle: {
      fontSize: '18px',
      marginBottom: '40px',
      opacity: '0.95'
    },
    featureList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px',
      fontSize: '16px',
      opacity: '0.9'
    },
    featureIcon: {
      width: '48px',
      height: '48px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '16px',
      fontSize: '24px'
    },
    authPanel: {
      flex: '1',
      padding: '50px 40px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    authHeader: {
      marginBottom: '32px'
    },
    authTitle: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '8px'
    },
    authSubtitle: {
      color: '#64748b',
      fontSize: '15px'
    },
    tabContainer: {
      display: 'flex',
      background: '#f1f5f9',
      borderRadius: '12px',
      padding: '4px',
      marginBottom: '32px',
      position: 'relative'
    },
    tabButton: {
      flex: 1,
      padding: '12px 24px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      position: 'relative',
      zIndex: 2
    },
    tabButtonActive: {
      color: 'white',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
    },
    tabButtonInactive: {
      color: '#64748b'
    },
    inputGroup: {
      marginBottom: '24px'
    },
    inputLabel: {
      display: 'block',
      marginBottom: '8px',
      color: '#374151',
      fontWeight: '500',
      fontSize: '14px'
    },
    inputWrapper: {
      position: 'relative'
    },
    inputField: {
      width: '100%',
      padding: '14px 16px 14px 48px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      outline: 'none',
      boxSizing: 'border-box'
    },
    inputIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'none'
    },
    passwordToggle: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#9ca3af',
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center'
    },
    errorBox: {
      background: '#fee',
      border: '1px solid #fcc',
      color: '#c33',
      padding: '12px 16px',
      borderRadius: '12px',
      fontSize: '14px',
      marginBottom: '16px'
    },
    successBox: {
      background: '#efe',
      border: '1px solid #cfc',
      color: '#3c3',
      padding: '12px 16px',
      borderRadius: '12px',
      fontSize: '14px',
      marginBottom: '16px'
    },
    submitButton: {
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '24px'
    },
    checkboxWrapper: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      marginBottom: '24px',
      fontSize: '14px',
      color: '#374151'
    },
    checkbox: {
      marginTop: '3px',
      width: '18px',
      height: '18px',
      cursor: 'pointer'
    },
    link: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: '500'
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '24px 0',
      color: '#9ca3af',
      fontSize: '14px'
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: '#e5e7eb'
    },
    dividerText: {
      padding: '0 16px'
    },
    socialGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '12px',
      marginTop: '24px'
    },
    socialButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    forgotLink: {
      textAlign: 'center',
      marginBottom: '20px'
    }
  };

  return (
    <div style={styles.pageContainer}>
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        input:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
        }
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
        }
        .social-btn:hover {
          border-color: #667eea;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .main-container { flex-direction: column !important; }
          .brand-panel { padding: 40px 20px !important; min-height: 250px; }
          .auth-panel { padding: 30px 20px !important; }
        }
      `}</style>

      {/* Background Blobs */}
      <div style={{...styles.backgroundBlob, width: '300px', height: '300px', top: '-100px', left: '-100px', animationDelay: '0s'}} />
      <div style={{...styles.backgroundBlob, width: '250px', height: '250px', top: '20%', right: '-80px', animationDelay: '2s'}} />
      <div style={{...styles.backgroundBlob, width: '200px', height: '200px', bottom: '10%', left: '10%', animationDelay: '4s'}} />

      {/* Main Container */}
      <div style={styles.mainContainer} className="main-container">
        {/* Brand Panel */}
        <div style={styles.brandPanel} className="brand-panel">
          <div style={styles.brandContent}>
            <div style={styles.logoContainer}>
              <ShoppingBag />
            </div>
            <h1 style={styles.brandTitle}>TeeHub</h1>
            <p style={styles.brandSubtitle}>Thời trang cho mọi phong cách</p>
            
            <ul style={styles.featureList}>
              <li style={styles.featureItem}>
                <div style={styles.featureIcon}>🎨</div>
                <span>Thiết kế độc đáo</span>
              </li>
              <li style={styles.featureItem}>
                <div style={styles.featureIcon}>✨</div>
                <span>Chất lượng cao cấp</span>
              </li>
              <li style={styles.featureItem}>
                <div style={styles.featureIcon}>🚀</div>
                <span>Giao hàng nhanh chóng</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Auth Panel */}
        <div style={styles.authPanel} className="auth-panel">
          <div style={styles.authHeader}>
            <h2 style={styles.authTitle}>
              {activeTab === "login" ? "Chào mừng trở lại!" : "Tạo tài khoản mới"}
            </h2>
            <p style={styles.authSubtitle}>
              {activeTab === "login" 
                ? "Đăng nhập để tiếp tục mua sắm" 
                : "Đăng ký để trải nghiệm đặc quyền"}
            </p>
          </div>

          {/* Tabs */}
          <div style={styles.tabContainer}>
            <button
              onClick={() => handleTabChange("login")}
              style={{
                ...styles.tabButton,
                ...(activeTab === "login" ? styles.tabButtonActive : styles.tabButtonInactive)
              }}
              type="button"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => handleTabChange("register")}
              style={{
                ...styles.tabButton,
                ...(activeTab === "register" ? styles.tabButtonActive : styles.tabButtonInactive)
              }}
              type="button"
            >
              Đăng ký
            </button>
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Email</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}><Mail /></span>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    style={styles.inputField}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Mật khẩu</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}><Lock /></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={styles.inputField}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {errorMsg && <div style={styles.errorBox}>{errorMsg}</div>}
              {successMessage && <div style={styles.successBox}>{successMessage}</div>}

              <div style={styles.forgotLink}>
                <a href="#" style={styles.link}>Quên mật khẩu?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{...styles.submitButton, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer'}}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Họ và tên</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}><User /></span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={styles.inputField}
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Email</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}><Mail /></span>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    style={styles.inputField}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Mật khẩu</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}><Lock /></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    style={styles.inputField}
                    placeholder="Ít nhất 6 ký tự"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Xác nhận mật khẩu</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}><Lock /></span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    style={styles.inputField}
                    placeholder="Nhập lại mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.passwordToggle}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {errorMsg && <div style={styles.errorBox}>{errorMsg}</div>}
              {successMessage && <div style={styles.successBox}>{successMessage}</div>}

              <div style={styles.checkboxWrapper}>
                <input type="checkbox" style={styles.checkbox} required />
                <span>
                  Tôi đồng ý với{" "}
                  <a href="#" style={styles.link}>Điều khoản sử dụng</a>
                  {" "}và{" "}
                  <a href="#" style={styles.link}>Chính sách bảo mật</a>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{...styles.submitButton, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer'}}
              >
                {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </button>
            </form>
          )}

          {/* Social Login */}
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>Hoặc tiếp tục với</span>
            <div style={styles.dividerLine} />
          </div>

          <div style={styles.socialGrid}>

            <button 
              type="button" 
              style={styles.socialButton} 
              className="social-btn"
              onClick={() => window.location.href = GOOGLE_AUTH_URL} // <-- GOOGLE
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" style={{width: '20px', height: '20px'}} />
            </button>
            
            <button 
              type="button" 
              style={styles.socialButton} 
              className="social-btn"
              onClick={() => window.location.href = FACEBOOK_AUTH_URL} // <-- FACEBOOK
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" style={{width: '20px', height: '20px'}} />
            </button>
            
            <button 
              type="button" 
              style={styles.socialButton} 
              className="social-btn"
              onClick={() => window.location.href = GITHUB_AUTH_URL} 
            >
              <img src="https://github.com/favicon.ico" alt="GitHub" style={{width: '20px', height: '20px'}} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}