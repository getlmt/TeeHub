package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "shopping_cart_item", schema = "ecommerce")
public class ShoppingCartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_item_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private ShoppingCart cart;

    @Column(name = "product_item_id")
    private Integer productItemId;

    @Column(nullable = false)
    private Integer qty;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
    @JoinTable(
            name = "cart_item_variation_option",
            schema = "ecommerce",
            joinColumns = @JoinColumn(name = "cart_item_id"),
            inverseJoinColumns = @JoinColumn(name = "variation_option_id")
    )
    private List<VariationOption> selectedOptions;
    @Column(name = "is_customed")
    private Boolean isCustomed = false;

    @Column(name = "custom_product_id")
    private Integer customProductId;


}
