package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chat_room", schema = "ecommerce")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer roomId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private SiteUser user; // Khách hàng sở hữu phòng này
}