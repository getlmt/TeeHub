// backend/src/main/java/com/example/backend/Entity/Address.java
package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "address", schema = "ecommerce")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private SiteUser user;

    @Column(name = "unit_number", length = 50)
    private String unitNumber;

    @Column(name = "street_number", length = 50)
    private String streetNumber;

    @Column(name = "address_line")
    private String addressLine;

    @Column(name = "is_default")
    private Boolean isDefault;
}