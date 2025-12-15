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
@Table(name = "variation", schema = "ecommerce")
public class Variation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variation_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "category_id")
    private ProductCategory category;

    @Column(name = "name", nullable = false, length = 100)
    private String name;


    @OneToMany(mappedBy = "variation", fetch = FetchType.LAZY)
    private List<VariationOption> options;

}