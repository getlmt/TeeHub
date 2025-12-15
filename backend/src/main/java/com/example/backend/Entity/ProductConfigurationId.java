package com.example.backend.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class ProductConfigurationId implements Serializable {
    private static final long serialVersionUID = -7626978832277809070L;
    @Column(name = "product_item_id", nullable = false)
    private Integer productItemId;

    @Column(name = "variation_option_id", nullable = false)
    private Integer variationOptionId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ProductConfigurationId entity = (ProductConfigurationId) o;
        return Objects.equals(this.productItemId, entity.productItemId) &&
                Objects.equals(this.variationOptionId, entity.variationOptionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(productItemId, variationOptionId);
    }
}