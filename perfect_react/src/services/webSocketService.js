import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const BASE_URL = 'http://localhost:8080';
let stompClient = null;
let subscriptions = {}; 

export const webSocketService = {
    
    ensureConnection: () => {
        return new Promise((resolve, reject) => {
            
            if (stompClient && stompClient.connected) {
                resolve();
                return;
            }

            
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

    
    subscribe: async (roomId, onMessageReceived) => {
        
        await webSocketService.ensureConnection();

        
        if (subscriptions[roomId]) {
            subscriptions[roomId].unsubscribe();
        }

        
        subscriptions[roomId] = stompClient.subscribe(
            `/topic/room/${roomId}`,
            (messageOutput) => {
                onMessageReceived(JSON.parse(messageOutput.body));
            }
        );

        console.log(`Subscribed to room ${roomId}`);
    },

    
    unsubscribe: (roomId) => {
        if (subscriptions[roomId]) {
            subscriptions[roomId].unsubscribe();
            delete subscriptions[roomId];
            console.log(`Unsubscribed from room ${roomId}`);
        }
    },

    
    connect: async (roomId, onMessageReceived) => {
        await webSocketService.subscribe(roomId, onMessageReceived);
    },

    
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

    
    disconnect: () => {
        
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