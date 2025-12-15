import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { API_BASE_URL } from '../../../utils/constants'; 
import { normalizeRole } from '../../../utils/auth'; 

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            console.log("1. OAuth2 Success! Token received.");
            
            
            localStorage.setItem('accessToken', token);

            
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

                
                
                
                
                if (userData.emailAddress) localStorage.setItem('email', userData.emailAddress);
                
                
                if (userData.id) localStorage.setItem('userId', userData.id);
                
                
                if (userData.role) {
                    const roleName = normalizeRole(userData.role);
                    localStorage.setItem('role', roleName);
                }

                
                window.location.href = '/';
            })
            .catch(err => {
                console.error("Lỗi khi lấy thông tin user:", err);
                
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
            {}
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