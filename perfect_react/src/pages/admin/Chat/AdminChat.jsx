import React, { useState, useEffect, useRef } from 'react';
import styles from './AdminChat.module.css';
import { chatService } from '../../../services/chatService';
import { webSocketService } from '../../../services/webSocketService';
import { getUserId } from '@/utils/auth';

const AdminChat = () => {
    const adminId = getUserId();
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMsg, setInputMsg] = useState('');
    const messagesEndRef = useRef(null);
    const [unreadCounts, setUnreadCounts] = useState({});
    const selectedRoomRef = useRef(selectedRoom);
    const connectionsRef = useRef(new Set()); 

    
    useEffect(() => {
        const loadRooms = async () => {
            try {
                const data = await chatService.getAllRooms();
                setRooms(data);

                const counts = {};
                data.forEach(room => {
                    counts[room.roomId] = room.unreadCount || 0;

                    
                    if (!connectionsRef.current.has(room.roomId)) {
                        connectionsRef.current.add(room.roomId);

                        webSocketService.connect(room.roomId, (newMessage) => {
                            const currentRoomId = room.roomId;
                            const senderId = newMessage.sender?.userId || newMessage.sender?.id || newMessage.senderId;

                            
                            if (selectedRoomRef.current?.roomId === currentRoomId) {
                                setMessages((prev) => [...prev, newMessage]);
                            }

                            
                            if (String(senderId) !== String(adminId) && selectedRoomRef.current?.roomId !== currentRoomId) {
                                setUnreadCounts(prev => ({
                                    ...prev,
                                    [currentRoomId]: (prev[currentRoomId] || 0) + 1
                                }));
                            }

                            
                            setRooms(prevRooms => {
                                return prevRooms.map(r => {
                                    if (r.roomId === currentRoomId) {
                                        return {
                                            ...r,
                                            lastMessage: newMessage.content,
                                            lastMessageTime: newMessage.timestamp || new Date().toISOString()
                                        };
                                    }
                                    return r;
                                }).sort((a, b) => {
                                    return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
                                });
                            });
                        });
                    }
                });

                setUnreadCounts(counts);
            } catch (error) {
                console.error("Lỗi tải danh sách phòng:", error);
            }
        };
        loadRooms();
    }, []);

    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    
    useEffect(() => {
        selectedRoomRef.current = selectedRoom;
    }, [selectedRoom]);
    
    const handleSelectRoom = async (room) => {
        setSelectedRoom(room);

        
        setUnreadCounts(prev => ({
            ...prev,
            [room.roomId]: 0
        }));

        try {
            if (unreadCounts[room.roomId] > 0) {
                await chatService.markAsRead(room.roomId);
            }

            
            const history = await chatService.getHistory(room.roomId);
            setMessages(history);

        } catch (error) {
            console.error("Lỗi kết nối phòng chat:", error);
        }
    };

    

    const handleSend = () => {
        if (!inputMsg.trim() || !selectedRoom) return;
        const payload = { content: inputMsg, senderId: adminId };
        webSocketService.sendMessage(selectedRoom.roomId, payload);
        setInputMsg('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    };
    
    const handleDeleteRoom = async (e, roomId) => {
        
        e.stopPropagation();

        
        if (!window.confirm("Bạn có chắc chắn muốn xóa cuộc hội thoại này? Hành động này không thể hoàn tác.")) {
            return;
        }

        try {
            
            await chatService.deleteRoom(roomId);

            
            setRooms(prev => prev.filter(room => room.roomId !== roomId));

            
            if (selectedRoom?.roomId === roomId) {
                setSelectedRoom(null);
                setMessages([]);
            }
        } catch (error) {
            console.error("Lỗi khi xóa phòng:", error);
            alert("Không thể xóa phòng này. Vui lòng thử lại.");
        }
    };
    return (
        <div className={styles.container}>
            {}
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>Danh sách hội thoại</div>
                <div className={styles.roomList}>
                    {rooms.map((room) => (
                        <div
                            key={room.roomId}
                            className={`${styles.roomItem} ${selectedRoom?.roomId === room.roomId ? styles.active : ''}`}
                            onClick={() => handleSelectRoom(room)}
                            style={{ position: 'relative' }}
                        >
                            <div className={styles.avatar}>
                                {room.user?.fullName?.charAt(0) || 'U'}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ fontWeight: '500', fontSize: '14px' }}>
                                        {room.user?.fullName || `User #${room.user?.userId}`}
                                    </div>

                                    {}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                        <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                                            {formatTime(room.lastMessageTime)}
                                        </div>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={(e) => handleDeleteRoom(e, room.roomId)}
                                            title="Xóa hội thoại"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>

                                <div style={{
                                    fontSize: '13px',
                                    color: '#6b7280',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {room.lastMessage}
                                </div>
                            </div>

                            {}
                            {unreadCounts[room.roomId] > 0 && (
                                <div style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    background: '#ef4444',
                                    color: 'white',
                                    borderRadius: '50%',
                                    minWidth: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    padding: '0 5px'
                                }}>
                                    {unreadCounts[room.roomId] > 99 ? '99+' : unreadCounts[room.roomId]}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.chatArea}>
                {selectedRoom ? (
                    <>
                        {}
                        <div className={styles.chatHeader}>
                            Chat với: {selectedRoom.user?.fullName}
                        </div>
                        <div className={styles.messages}>
                            {messages.map((msg, index) => {
                                const senderId = msg.sender?.userId || msg.sender?.id || msg.senderId;
                                const isMe = String(senderId) === String(adminId);
                                return (
                                    <div
                                        key={index}
                                        className={`${styles.message} ${isMe ? styles.myMessage : styles.userMessage}`}
                                    >
                                        {msg.content}
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className={styles.inputArea}>
                            <input
                                className={styles.input}
                                placeholder="Nhập tin nhắn..."
                                value={inputMsg}
                                onChange={(e) => setInputMsg(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button className={styles.sendBtn} onClick={handleSend}>Gửi</button>
                        </div>
                    </>
                ) : (
                    <div className={styles.emptyState}>Chọn một hội thoại để bắt đầu chat</div>
                )}
            </div>
        </div>
    );
};

export default AdminChat;