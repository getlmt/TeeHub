package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "chat_message", schema = "ecommerce")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer messageId;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private ChatRoom chatRoom;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private SiteUser sender; // Người gửi

    private String content;
    private Date timestamp = new Date();
    @Column(name = "is_read")
    private boolean isRead = false;
}