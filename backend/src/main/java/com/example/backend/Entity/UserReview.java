package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "user_review", schema = "ecommerce")
public class UserReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id")
    private SiteUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "ordered_product_id")
    private ProductItem orderedProduct;

    @Column(name = "rating_value", nullable = false)
    private Integer ratingValue;

    @Column(name = "comment", length = Integer.MAX_VALUE)
    private String comment;
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false) // Map với cột DB
    private LocalDateTime createdAt;
}