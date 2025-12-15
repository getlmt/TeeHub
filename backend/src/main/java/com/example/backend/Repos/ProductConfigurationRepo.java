package com.example.backend.Repos;

import com.example.backend.Entity.ProductConfiguration;
import com.example.backend.Entity.ProductConfigurationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductConfigurationRepo extends JpaRepository<ProductConfiguration, ProductConfigurationId> {
    List<ProductConfiguration> findByProductItemId(Integer productItemId);
}
