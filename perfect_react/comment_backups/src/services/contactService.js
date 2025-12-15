import api from './api'; // (File axios instance của bạn)


export const contactService = {
    sendContactMessage: async (formData) => {
        try {
            // formData = { name, email, phone, subject, message }
            // (api.js của bạn sẽ tự động đính kèm Token nếu có)
            const response = await api.post('/api/contact', formData);
            return response.data; // Trả về "Tin nhắn của bạn đã được gửi thành công."
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn liên hệ:", error);
            throw error.response?.data || error;
        }
    },
    getAllMessages: async () => {
        try {
            // (Đảm bảo '/api/contact' khớp với Controller)
            const response = await api.get('/api/contact');
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tải tin nhắn liên hệ:", error);
            throw error.response?.data || error;
        }
    }
}
