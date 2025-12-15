package com.example.backend.Sercurity;

import com.example.backend.Repos.SiteUserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component("ownershipService")
@RequiredArgsConstructor
public class OwnershipService {
    private final SiteUserRepo repo;

    public boolean isMyId(Integer userId) {
        var email = SecurityContextHolder.getContext().getAuthentication().getName();
        return repo.findByEmailAddress(email).map(u -> u.getId().equals(userId)).orElse(false);
    }
}
