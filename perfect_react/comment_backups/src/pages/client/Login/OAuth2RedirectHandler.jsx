import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Import URL Backend và hàm xử lý Role
import { API_BASE_URL } from '../../../utils/constants'; 
import { normalizeRole } from '../../../utils/auth'; // Đảm bảo bạn import đúng đường dẫn file auth.js

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            console.log("1. OAuth2 Success! Token received.");
            
            // B1: Lưu Token trước
            localStorage.setItem('accessToken', token);

            // B2: Gọi API lấy thông tin User ngay lập tức
            fetch(`${API_BASE_URL}/api/users/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) throw new Error("Không lấy được thông tin user");
                return response.json();
            })
            .then(userData => {
                console.log("2. User Info received:", userData);

                // B3: Lưu các thông tin còn thiếu vào Local Storage 
                // (Map đúng trường từ API response sang key mà bạn muốn)
                
                // Lưu Email (API trả về emailAddress -> lưu vào key 'email')
                if (userData.emailAddress) localStorage.setItem('email', userData.emailAddress);
                
                // Lưu UserID (API trả về id -> lưu vào key 'userId')
                if (userData.id) localStorage.setItem('userId', userData.id);
                
                // Lưu Role (API trả về role -> chuẩn hóa -> lưu vào key 'role')
                if (userData.role) {
                    const roleName = normalizeRole(userData.role);
                    localStorage.setItem('role', roleName);
                }

                // B4: Xong xuôi thì reload về trang chủ
                window.location.href = '/';
            })
            .catch(err => {
                console.error("Lỗi khi lấy thông tin user:", err);
                // Dù lỗi lấy info nhưng có token thì cứ cho vào, hoặc đá về login tùy bạn
                window.location.href = '/'; 
            });

        } else {
            console.error("Không tìm thấy token");
            navigate('/login', { replace: true });
        }
    }, [location, navigate]);

    return (
        <div style={{ 
            height: '60vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            flexDirection: 'column',
            gap: '15px'
        }}>
            <h3>Đang đồng bộ dữ liệu...</h3>
            {/* Loading Spinner đẹp hơn */}
            <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default OAuth2RedirectHandler;