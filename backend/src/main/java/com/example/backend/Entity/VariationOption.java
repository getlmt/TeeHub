package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "variation_option", schema = "ecommerce")
public class VariationOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variation_option_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "variation_id", nullable = false)
    private Variation variation;

    @Column(name = "value", nullable = false, length = 100)
    private String value;
    @ManyToMany(mappedBy = "selectedOptions", fetch = FetchType.LAZY)
    private List<ShoppingCartItem> cartItems;
}
