import api from "./httpClient.js";
import { getUserId } from "../utils/auth.js";


/**
 * OrderService — chứa các hàm thao tác với đơn hàng
 */
const OrderService = {
    // ✅ Lấy tất cả đơn hàng của user hiện tại
    async getOrdersByUser() {
        const userId = getUserId();
        if (!userId) throw new Error("User chưa đăng nhập!");
        const res = await api.get(`/api/orders/user/${userId}`);
        return res.data;
    },

    // ✅ Tạo đơn hàng mới
    async createOrder(orderRequest) {
        // orderRequest có thể chứa: userId, paymentTypeName, shippingMethodName, ...
        const res = await api.post("/api/orders/add", orderRequest);
        return res.data;
    },

    // ✅ Lấy toàn bộ đơn hàng (chỉ admin mới nên gọi)
    async getAllOrders() {
        const res = await api.get("/api/orders/all");
        return res.data;
    },

    // ✅ Cập nhật trạng thái đơn hàng
    async updateOrderStatus(orderId, status) {
        const res = await api.put(`/api/orders/update-status/${orderId}?status=${status}`);
        return res.data;
    },
};

export default OrderService;
