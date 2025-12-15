import api from "./httpClient.js";
import { getUserId } from "../utils/auth.js";

const CartService = {
  // 🔹 Lấy giỏ hàng hiện tại của user
  async getCart(userIdInput) {
    // Ưu tiên userId truyền vào, nếu không có thì lấy từ auth
    const userId = userIdInput || getUserId();
    
    // Nếu chưa đăng nhập, trả về null hoặc object rỗng để UI không lỗi
    if (!userId) return null; 

    try {
      const res = await api.get(`/api/cart/users/${userId}`);
      return res.data;
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
      // Trả về items rỗng để tránh crash map() ở frontend
      return { items: [] };
    }
  },

  // 🔹 Thêm sản phẩm vào giỏ hàng
  // Hàm này giờ linh hoạt: nhận (userId, payload) hoặc ({payload})
  async addToCart(userId, itemData) {
    // LOGIC HỖ TRỢ CŨ & MỚI:
    // Nếu gọi hàm chỉ với 1 tham số là object (cách gọi cũ), ta tự lấy userId
    if (typeof userId === 'object' && !itemData) {
        itemData = userId;
        userId = getUserId();
    }

    if (!userId) throw new Error("User chưa đăng nhập!");

    // Log để kiểm tra dữ liệu trước khi gửi
    console.log("🚀 Service sending to Backend:", itemData);

    try {
      // ✅ Gửi thẳng payload lên Backend.
      // Không tự ý destructure (như code cũ) để tránh mất field custom_product_id/is_customed
      const res = await api.post(`/api/cart/users/${userId}/add`, itemData);
      return res.data;
    } catch (err) {
      console.error("❌ Add to cart error:", err.response?.data || err.message);
      throw err;
    }
  },

  // 🔹 Cập nhật số lượng của 1 item trong giỏ
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

  // 🔹 Xóa 1 item khỏi giỏ
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