import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const BASE_URL = 'http://localhost:8080';
let stompClient = null;
let subscriptions = {}; // Lưu các subscription theo roomId

export const webSocketService = {
    /**
     * Đảm bảo kết nối WebSocket được thiết lập
     */
    ensureConnection: () => {
        return new Promise((resolve, reject) => {
            // Nếu đã connected rồi thì resolve luôn
            if (stompClient && stompClient.connected) {
                resolve();
                return;
            }

            // Chưa connect thì connect mới
            const socket = new SockJS(`${BASE_URL}/ws`);
            stompClient = Stomp.over(socket);

            stompClient.connect({}, (frame) => {
                console.log('Connected: ' + frame);
                resolve();
            }, (error) => {
                console.error('WebSocket error:', error);
                reject(error);
            });
        });
    },

    /**
     * Subscribe vào 1 phòng chat
     * @param {number} roomId 
     * @param {function} onMessageReceived 
     */
    subscribe: async (roomId, onMessageReceived) => {
        // Đảm bảo đã kết nối
        await webSocketService.ensureConnection();

        // Nếu đã subscribe phòng này rồi thì unsubscribe trước
        if (subscriptions[roomId]) {
            subscriptions[roomId].unsubscribe();
        }

        // Subscribe mới
        subscriptions[roomId] = stompClient.subscribe(
            `/topic/room/${roomId}`,
            (messageOutput) => {
                onMessageReceived(JSON.parse(messageOutput.body));
            }
        );

        console.log(`Subscribed to room ${roomId}`);
    },

    /**
     * Unsubscribe khỏi 1 phòng
     */
    unsubscribe: (roomId) => {
        if (subscriptions[roomId]) {
            subscriptions[roomId].unsubscribe();
            delete subscriptions[roomId];
            console.log(`Unsubscribed from room ${roomId}`);
        }
    },

    /**
     * Legacy method để tương thích code cũ
     */
    connect: async (roomId, onMessageReceived) => {
        await webSocketService.subscribe(roomId, onMessageReceived);
    },

    /**
     * Gửi tin nhắn
     */
    sendMessage: (roomId, messagePayload) => {
        if (stompClient && stompClient.connected) {
            stompClient.send(
                `/app/chat.sendMessage/${roomId}`,
                {},
                JSON.stringify(messagePayload)
            );
        } else {
            console.error("Stomp client is not connected");
        }
    },

    /**
     * Disconnect hoàn toàn
     */
    disconnect: () => {
        // Unsubscribe tất cả
        Object.keys(subscriptions).forEach(roomId => {
            subscriptions[roomId].unsubscribe();
        });
        subscriptions = {};

        if (stompClient !== null) {
            stompClient.disconnect();
            stompClient = null;
        }
        console.log("Disconnected");
    }
};