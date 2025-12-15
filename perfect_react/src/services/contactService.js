import api from './api'; 


export const contactService = {
    sendContactMessage: async (formData) => {
        try {
            
            
            const response = await api.post('/api/contact', formData);
            return response.data; 
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn liên hệ:", error);
            throw error.response?.data || error;
        }
    },
    getAllMessages: async () => {
        try {
            
            const response = await api.get('/api/contact');
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tải tin nhắn liên hệ:", error);
            throw error.response?.data || error;
        }
    }
}
