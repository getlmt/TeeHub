src/
├── components/
│   ├── common/
│   │   ├── Header/
│   │   └── Footer/
│   └── ui/
│       ├── Button/
│       ├── Input/
│       ├── Modal/
│       ├── ImageUploader/
│       ├── ColorPicker/
│       └── Canvas/
├── pages/
│   ├── Home/
│   ├── Products/
│   ├── AITryOn/
│   ├── Design/
│   ├── Cart/
│   └── Checkout/
├── hooks/
│   ├── useAuth.js
│   ├── useCart.js
│   ├── useLocalStorage.js
│   └── useApi.js
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── productService.js
│   ├── aiService.js
│   ├── designService.js
│   └── httpClient.js
├── store/
│   ├── slices/
│   │   ├── authSlice.js
│   │   ├── cartSlice.js
│   │   ├── productSlice.js
│   │   ├── aiTryOnSlice.js
│   │   ├── designSlice.js
│   │   └── uiSlice.js
│   └── store.js
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   └── validators.js
├── styles/
│   ├── globals.css
│   ├── variables.css
│   └── mixins.css
└── assets/
    ├── images/
    ├── icons/
    └── fonts/
npm test
# TeeHub

TeeHub là một nền tảng quản lý và bán áo thun, hỗ trợ cả giao diện người dùng (client) và quản trị viên (admin).

## Cấu trúc thư mục chính

```
src/
├── App.css
├── App.jsx
├── index.css
├── main.jsx
├── assets/
│   ├── react.svg
│   ├── fonts/
│   ├── icons/
│   └── images/
├── components/
│   ├── admin/
│   │   ├── AdminHeader/
│   │   │   ├── AdminHeader.jsx
│   │   │   ├── AdminHeader.module.css
│   │   │   └── index.js
│   │   ├── AdminLayout/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminLayout.module.css
│   │   │   └── index.js
│   │   └── AdminSidebar/
│   │       ├── AdminSidebar.jsx
│   │       ├── AdminSidebar.module.css
│   │       └── index.js
│   ├── common/
│   │   ├── Footer/
│   │   │   ├── Footer.jsx
│   │   │   ├── Footer.module.css
│   │   │   └── index.js
│   │   └── Header/
│   │       ├── Header.jsx
│   │       ├── Header.module.css
│   │       └── index.js
│   ├── dev/
│   │   ├── CartMockHelper.jsx
│   │   └── index.js
│   └── ui/
│       ├── Button/
│       │   ├── Button.jsx
│       │   ├── Button.module.css
│       │   └── index.js
│       ├── Canvas/
│       ├── ColorPicker/
│       ├── ImageUploader/
│       ├── Input/
│       │   ├── Input.jsx
│       │   ├── Input.module.css
│       │   └── index.js
│       └── Modal/
│           ├── Modal.jsx
│           ├── Modal.module.css
│           └── index.js
├── hooks/
│   ├── useApi.js
│   ├── useAuth.js
│   ├── useCart.js
│   └── useLocalStorage.js
├── pages/
│   ├── admin/
│   │   ├── Dashboard/
│   │   ├── Orders/
│   │   ├── Products/
│   │   └── Users/
│   └── client/
│       ├── About/
│       ├── AITryOn/
│       ├── Cart/
│       ├── Checkout/
│       ├── Contact/
│       ├── Design/
│       ├── Home/
│       ├── Login/
│       ├── Products/
│       └── UserProfile/
├── routes/
│   ├── adminRoutes.jsx
│   ├── index.jsx
│   ├── PrivateRoute.jsx
│   ├── PublicRoute.jsx
│   ├── routeConfig.jsx
│   └── guards/
│       ├── AuthGuard.jsx
│       ├── GuestGuard.jsx
│       └── RoleGuard.jsx
├── services/
│   ├── aiService.js
│   ├── api.js
│   ├── authService.js
│   ├── cartMockData.js
│   ├── designService.js
│   ├── httpClient.js
│   ├── mockProducts.js
│   └── productService.js
├── store/
│   ├── store.js
│   └── slices/
│       ├── aiTryOnSlice.js
│       ├── authSlice.js
│       ├── cartSlice.js
│       ├── designSlice.js
│       ├── productSlice.js
│       └── uiSlice.js
├── styles/
│   ├── globals.css
│   └── variables.css
└── utils/
    ├── constants.js
    ├── helpers.js
    └── validators.js
```

## Hướng dẫn chạy dự án

1. Cài đặt dependencies:
    ```bash
    npm install
    ```
2. Tạo file `.env` từ mẫu `env.example` và cấu hình các biến môi trường cần thiết.
3. Chạy dự án:
    ```bash
    npm run dev
    ```
4. Truy cập giao diện client tại: `http://localhost:5173/`

## Các thư mục chính
- `components/`: Các thành phần UI dùng chung và riêng cho admin/client.
- `pages/`: Các trang chính của client và admin.
- `routes/`: Định nghĩa các route, guard, cấu hình điều hướng.
- `services/`: Giao tiếp API, xử lý dữ liệu.
- `store/`: Redux store và các slice quản lý state.
- `styles/`: Các file CSS toàn cục và biến màu.
- `utils/`: Hằng số, hàm tiện ích, validator.

## Ghi chú
- Để phát triển tính năng mới, tạo component/page trong thư mục tương ứng.
- Đảm bảo cập nhật route nếu thêm trang mới.
- Đọc kỹ comment trong code để hiểu luồng xử lý.

---

Mọi góp ý, báo lỗi xin gửi về nhóm phát triển TeeHub.