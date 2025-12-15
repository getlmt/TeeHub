package com.example.backend.Service;

import com.example.backend.DTO.Response.UserAddressDTO;
import com.example.backend.Entity.Address;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Repos.SiteUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserAddressService {

    @Autowired
    private SiteUserRepo siteUserRepo;
    @Autowired
    private AddressService addressService;
    @Autowired
    private SiteUserService siteUserService;


    public UserAddressDTO getUserWithAddressesById(Integer userId) {

        SiteUser user = siteUserRepo.findById(userId).orElse(null);
        Address address = addressService.findByUser(user);

        UserAddressDTO dto = new UserAddressDTO();
        dto.setUser_id(user.getId());

        return dto;
    }

    public SiteUser toSiteUser(UserAddressDTO dto) {
        if (dto == null) return null;

        SiteUser user = new SiteUser();
        user.setId(dto.getUser_id());


        SiteUser U = siteUserService.findById(user.getId());


        // Không có password và role trong DTO -> có thể để null hoặc mặc định
        user.setPassword(U.getPassword());
        user.setRole(U.getRole());

        return user;
    }

    public Address toAddress(UserAddressDTO dto) {
        if (dto == null) return null;

        Address address = new Address();


        return address;
    }


}


