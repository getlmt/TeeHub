package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "custom_product", schema = "ecommerce")
public class CustomProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "custom_product_id", nullable = false)
    private Integer id;

    @Column(name = "custom_name")
    private String customName;

    @Column(name ="product_item_id")
    private Integer productId;

    @Column(name = "custom_image_url")
    private String customImageUrl;

    @Column(name = "user_id")
    private Integer userId;




}