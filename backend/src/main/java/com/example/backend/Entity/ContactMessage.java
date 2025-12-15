package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "contact_message")
@Getter
@Setter
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id", nullable = false)
    private Integer messageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private SiteUser user;

    @Column(name = "sender_name", nullable = false)
    private String senderName;

    @Column(name = "sender_email", nullable = false)
    private String senderEmail;

    @Column(name = "sender_phone")
    private String senderPhone;

    @Column(name = "subject", nullable = false)
    private String subject;

    @Column(name = "message_body", nullable = false, columnDefinition = "TEXT")
    private String messageBody;

    @Column(name = "status", nullable = false, length = 50)
    @ColumnDefault("'NEW'")
    private String status = "NEW"; // Đặt giá trị mặc định

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}