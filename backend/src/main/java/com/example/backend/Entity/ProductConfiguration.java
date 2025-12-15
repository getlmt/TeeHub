package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "product_configuration", schema = "ecommerce")
public class ProductConfiguration {
    @EmbeddedId
    private ProductConfigurationId id;

    @MapsId("productItemId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "product_item_id", nullable = false)
    private ProductItem productItem;

    @MapsId("variationOptionId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "variation_option_id", nullable = false)
    private VariationOption variationOption;
}