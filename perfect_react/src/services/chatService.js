import api from './api';

export const chatService = {
    
    getRoomByUser: async (userId) => {
        try {
            const response = await api.get(`/api/chat/room?userId=${userId}`);
            return response.data; 
        } catch (error) {
            console.error("Error getting chat room:", error);
            throw error;
        }
    },

    
    getHistory: async (roomId) => {
        try {
            const response = await api.get(`/api/chat/history/${roomId}`);
            return response.data; 
        } catch (error) {
            console.error("Error getting chat history:", error);
            throw error;
        }
    },
    getAllRooms: async () => {
        try {
            const response = await api.get('/api/chat/rooms');
            return response.data;
        } catch (error) {
            console.error("Error getting all rooms:", error);
            throw error;
        }
    },
    markAsRead: async (roomId) => {
        return api.put(`/api/chat/read/${roomId}`);
    },
    deleteRoom: async (roomId) => {
        return api.delete(`/api/chat/room/${roomId}`);
    }
};