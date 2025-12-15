package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "order_line", schema = "ecommerce")
public class OrderLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_line_id", nullable = false)
    private Integer id;

    @Column(name = "qty", nullable = false)
    private Integer qty;

    @Column(name = "price", precision = 10, scale = 2)
    private Integer price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private ShopOrder shopOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "custom_product_id")
    private CustomProduct customProduct;

    @Column(name = "product_item_id")
    private Integer productItemId;

}