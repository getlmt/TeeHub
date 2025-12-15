import api from "./httpClient.js";
import { getUserId } from "../utils/auth.js";



const OrderService = {
    
    async getOrdersByUser() {
        const userId = getUserId();
        if (!userId) throw new Error("User chưa đăng nhập!");
        const res = await api.get(`/api/orders/user/${userId}`);
        return res.data;
    },

    
    async createOrder(orderRequest) {
        
        const res = await api.post("/api/orders/add", orderRequest);
        return res.data;
    },

    
    async getAllOrders() {
        const res = await api.get("/api/orders/all");
        return res.data;
    },

    
    async updateOrderStatus(orderId, status) {
        const res = await api.put(`/api/orders/update-status/${orderId}?status=${status}`);
        return res.data;
    },
};

export default OrderService;
