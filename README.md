
# TeeHub - Online T-Shirt Store

Nền tảng thương mại điện tử bán áo phông trực tuyến với tính năng thử đồ ảo (Virtual Try-On) sử dụng AI.

## Tính năng chính

- Mua sắm áo phông trực tuyến
- Thiết kế áo phông tùy chỉnh
- Thử đồ ảo bằng AI
- Chat trực tiếp với admin
- Quản lý đơn hàng
- Trang quản trị (Admin Dashboard)

## Công nghệ sử dụng

### Frontend
- React.js - UI Framework
- Vite - Build tool
- Redux - State management

### Backend
- Spring Boot - Java Framework
- PostgreSQL - Database
- WebSocket - Real-time chat

### AI Service
- Python - Virtual Try-On
- Flask - API Server

## Cấu trúc dự án
```
TeeHub/
├── backend/          # Spring Boot API
├── perfect_react/    # React Frontend
├── virtual-try-on/   # AI Try-On Service
└── data.sql         # Database Schema
```

## Cài đặt và chạy

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend
```bash
cd perfect_react
npm install
npm run dev
```

### Virtual Try-On
```bash
cd virtual-try-on
python app.py
```

