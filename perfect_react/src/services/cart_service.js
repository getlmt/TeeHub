import api from "./httpClient.js";
import { getUserId } from "../utils/auth.js";

const CartService = {
  
  async getCart(userIdInput) {
    
    const userId = userIdInput || getUserId();
    
    
    if (!userId) return null; 

    try {
      const res = await api.get(`/api/cart/users/${userId}`);
      return res.data;
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
      
      return { items: [] };
    }
  },

  
  
  async addToCart(userId, itemData) {
    
    
    if (typeof userId === 'object' && !itemData) {
        itemData = userId;
        userId = getUserId();
    }

    if (!userId) throw new Error("User chưa đăng nhập!");

    
    console.log("🚀 Service sending to Backend:", itemData);

    try {
      
      
      const res = await api.post(`/api/cart/users/${userId}/add`, itemData);
      return res.data;
    } catch (err) {
      console.error("❌ Add to cart error:", err.response?.data || err.message);
      throw err;
    }
  },

  
  async updateCartItem(cartItemId, qty) {
    try {
      const payload = { qty };
      const res = await api.put(`/api/cart/item/${cartItemId}`, payload);
      return res.data;
    } catch (err) {
      console.error("Lỗi update item:", err);
      throw err;
    }
  },

  
  async removeCartItem(cartItemId) {
    try {
      const res = await api.delete(`/api/cart/item/${cartItemId}`);
      return res.data;
    } catch (err) {
      console.error("Lỗi xóa item:", err);
      throw err;
    }
  },
};

export default CartService;