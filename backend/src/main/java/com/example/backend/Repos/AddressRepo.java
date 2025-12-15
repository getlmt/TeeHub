// backend/src/main/java/com/example/backend/Repos/AddressRepo.java
package com.example.backend.Repos;

import com.example.backend.Entity.Address;
import com.example.backend.Entity.SiteUser;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepo extends JpaRepository<Address, Integer> {

    @Query("""
        select a from Address a
        where (:q is null or :q = '')
           or lower(coalesce(a.addressLine,  '')) like lower(concat('%', :q, '%'))
           or lower(coalesce(a.unitNumber,   '')) like lower(concat('%', :q, '%'))
           or lower(coalesce(a.streetNumber, '')) like lower(concat('%', :q, '%'))
        order by a.id desc
    """)
    List<Address> search(@Param("q") String q);

    @Query("""
        select a from Address a
        join a.user u
        where u.id = :userId
        order by a.id desc
    """)
    List<Address> findByUserId(@Param("userId") Integer userId);

    @Query("""
        select a from Address a
        join a.user u
        where a.id = :addressId and u.id = :userId
    """)
    Optional<Address> findOneForUser(@Param("userId") Integer userId,
                                     @Param("addressId") Integer addressId);

    Address findByUser(SiteUser user);
}