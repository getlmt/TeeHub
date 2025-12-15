package com.example.backend.Entity;

import com.example.backend.Entity.Address;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "shop_order", schema = "ecommerce")
public class ShopOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id", nullable = false)
    private Integer id;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "payment_type_name", length = 50)
    private String paymentTypeName;

    @Column(name = "payment_provider", length = 100)
    private String paymentProvider;

    @Column(name = "payment_account_number", length = 100)
    private String paymentAccountNumber;

    @Column(name = "payment_status", length = 50)
    private String paymentStatus;

    @Column(name = "payment_date")
    private Instant paymentDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "shipping_address_id")
    private Address shippingAddress;

    @Column(name = "shipping_method_name", length = 100)
    private String shippingMethodName;

    @Column(name = "shipping_price", precision = 10, scale = 2)
    private BigDecimal shippingPrice;

    @Column(name = "order_status", length = 50)
    private String orderStatus;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "order_date")
    private Instant orderDate;

    @Column(name = "order_total", precision = 10, scale = 2)
    private BigDecimal orderTotal;

    @OneToMany(mappedBy = "shopOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderLine> items;
}
