// orderHistory.js
import api from "./httpClient.js";
import { getUserId } from "../utils/auth.js";

/**
 * OrderHistoryService — quản lý các thao tác lấy và xử lý lịch sử đơn hàng
 */
const OrderHistoryService = {
  // ✅ Lấy tất cả đơn hàng của user hiện tại
  async getOrdersByUser() {
    const userId = getUserId();
    if (!userId) throw new Error("User chưa đăng nhập!");

    const res = await api.get(`/api/orders/user/${userId}`);
    return res.data;
  },

  // ✅ Lấy tất cả đơn hàng (chỉ admin dùng)
  async getAllOrders() {
    const res = await api.get("/api/orders/all");
    return res.data;
  },

  // ✅ Lấy chi tiết đơn hàng theo ID (nếu backend có endpoint này)
  async getOrderById(orderId) {
    const res = await api.get(`/api/orders/${orderId}`);
    return res.data;
  },

  // ✅ Cập nhật trạng thái đơn hàng (admin hoặc hệ thống)
  async updateOrderStatus(orderId, status) {
    const res = await api.put(`/api/orders/update-status/${orderId}?status=${status}`);
    return res.data;
  },

  // ✅ Tạo mới đơn hàng (dự phòng)
  async createOrder(orderRequest) {
    const res = await api.post("/api/orders/add", orderRequest);
    return res.data;
  },
};

export default OrderHistoryService;
