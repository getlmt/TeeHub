package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "site_user", schema = "ecommerce", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email_address")
})
public class SiteUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Integer id;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "user_avatar")
    private String userAvatar;

    @Column(name = "email_address", nullable = false, unique = true)
    private String emailAddress;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "password", nullable = false)
    private String password;

    @ColumnDefault("'USER'")
    @Column(name = "role", nullable = false, length = 20)
    private String role;

    public Integer getUserId() {
        return id;
    }
}