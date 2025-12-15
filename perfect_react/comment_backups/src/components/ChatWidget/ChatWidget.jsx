import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './ChatWidget.module.css';
import { webSocketService } from '../../services/webSocketService';
import { chatService } from '../../services/chatService';
import { getUserId, getUserRole } from '../../utils/auth';
import { X, Send, MessageCircle } from 'lucide-react';

const ChatWidget = () => {
    // Chuyển sang state để component re-render khi thay đổi
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMsg, setInputMsg] = useState('');
    const [room, setRoom] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef(null);
    const location = useLocation();

    // Effect để theo dõi thay đổi auth
    useEffect(() => {
        const checkAuth = () => {
            const id = getUserId();
            const role = getUserRole();
            setUserId(id);
            setUserRole(role);
        };

        // Check ngay khi mount
        checkAuth();

        // Lắng nghe sự kiện storage (khi localStorage thay đổi từ tab khác)
        window.addEventListener('storage', checkAuth);

        // Lắng nghe custom event (trigger từ login/logout)
        window.addEventListener('authChange', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('authChange', checkAuth);
        };
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setUnreadCount(0);
        }
    }, [isOpen]);

    // Khởi tạo Chat khi có userId
    useEffect(() => {
        if (!userId) {
            // Cleanup khi logout
            setMessages([]);
            setRoom(null);
            setIsOpen(false);
            webSocketService.disconnect();
            return;
        }

        const initChat = async () => {
            try {
                const roomData = await chatService.getRoomByUser(userId);
                setRoom(roomData);

                const history = await chatService.getHistory(roomData.roomId);
                setMessages(history);

                webSocketService.connect(roomData.roomId, (newMessage) => {
                    setMessages((prev) => [...prev, newMessage]);

                    const senderId = newMessage.sender?.id || newMessage.sender?.userId || newMessage.senderId;
                    if (!isOpen && String(senderId) !== String(userId)) {
                        setUnreadCount(prev => prev + 1);
                    }
                });

            } catch (error) {
                console.error("Failed to init chat", error);
            }
        };

        initChat();

        return () => {
            webSocketService.disconnect();
        };
    }, [userId]); // Dependency: userId

    const handleSend = () => {
        if (inputMsg.trim() && room && userId) {
            const payload = {
                content: inputMsg,
                senderId: userId
            };

            webSocketService.sendMessage(room.roomId, payload);
            setInputMsg('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    // Ẩn widget khi chưa login hoặc ở trang admin
    if (!userId) return null;
    if (location.pathname.startsWith('/admin')) return null;
    if (userRole === 'ADMIN') return null;

    return (
        <div className={styles.chatWidgetContainer}>
            {isOpen && (
                <div className={styles.chatWindow}>
                    <div className={styles.header}>
                        <span>Hỗ trợ khách hàng</span>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '4px'
                            }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className={styles.messagesArea}>
                        {messages.map((msg, index) => {
                            const senderId = msg.sender?.id || msg.sender?.userId || msg.senderId;
                            const isMe = String(senderId) === String(userId);

                            return (
                                <div
                                    key={index}
                                    className={`${styles.messageBubble} ${isMe ? styles.myMessage : styles.otherMessage}`}
                                >
                                    {!isMe && <div className={styles.senderName}>Admin</div>}
                                    {msg.content}
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className={styles.inputArea}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Nhập tin nhắn..."
                            value={inputMsg}
                            onChange={(e) => setInputMsg(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button className={styles.sendBtn} onClick={handleSend}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}

            <button
                className={styles.toggleBtn}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}
            >
                <MessageCircle size={24} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: 'red',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;