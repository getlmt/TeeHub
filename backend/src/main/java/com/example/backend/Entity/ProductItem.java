package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "product_item", schema = "ecommerce")
public class ProductItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_item_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "sku", nullable = false, length = 100)
    private String sku;

    @ColumnDefault("0")
    @Column(name = "qty_in_stock")
    private Integer qtyInStock;

    @Column(name = "product_image")
    private String productImage;

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

}