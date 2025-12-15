
import React, { useState, useEffect } from 'react';
import styles from './Contact.module.css'; 
import { contactService } from '../../../services/contactService'; 


const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

function Contacts() {
    
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null); 

    
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await contactService.getAllMessages();
                setMessages(data);
            } catch (err) {
                console.error(err);
                setError('Không thể tải tin nhắn.');
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []); 

    
    const handleViewDetails = (message) => {
        setSelectedMessage(message);
        
    };

    const handleCloseModal = () => {
        setSelectedMessage(null);
    };

    
    return (
        <div className={styles.contactsPage}>
            {}
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Hộp thư Liên hệ</h1>
                <p className={styles.pageSubtitle}>Quản lý tin nhắn từ khách hàng</p>
            </div>

            {}
            {loading && <p>Đang tải tin nhắn...</p>}
            {error && <p className={styles.errorText}>{error}</p>}

            {}
            {!loading && !error && (
                <div className={styles.tableContainer}>
                    <table className={styles.contactTable}>
                        <thead>
                            <tr>
                                <th>Trạng thái</th>
                                <th>Ngày gửi</th>
                                <th>Người gửi</th>
                                <th>Email</th>
                                <th>Chủ đề</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className={styles.noDataText}>Không có tin nhắn nào.</td>
                                </tr>
                            ) : (
                                messages.map(msg => (
                                    <tr key={msg.messageId} className={msg.status === 'NEW' ? styles.newRow : ''}>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles[msg.status.toLowerCase()]}`}>
                                                {msg.status}
                                            </span>
                                        </td>
                                        <td>{formatDate(msg.createdAt)}</td>
                                        <td>{msg.userName ? msg.userName : msg.senderName}</td>

                                        <td>{msg.senderEmail}</td>
                                        <td>{msg.subject}</td>
                                        <td>
                                            <button
                                                className={styles.viewBtn}
                                                onClick={() => handleViewDetails(msg)}
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {}
            {selectedMessage && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Chi tiết tin nhắn</h3>
                            <button onClick={handleCloseModal} className={styles.closeBtn}>✕</button>
                        </div>
                        <div className={styles.modalContent}>
                            <p><strong>Từ:</strong> {selectedMessage.senderName}</p>
                            <p><strong>Email:</strong> {selectedMessage.senderEmail}</p>
                            <p><strong>SĐT:</strong> {selectedMessage.senderPhone || 'N/A'}</p>
                            <p><strong>Chủ đề:</strong> {selectedMessage.subject}</p>
                            <hr />
                            <p><strong>Nội dung:</strong></p>
                            <div className={styles.messageBody}>
                                {selectedMessage.messageBody}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Contacts;