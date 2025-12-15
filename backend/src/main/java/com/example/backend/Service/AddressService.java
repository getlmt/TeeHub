package com.example.backend.Service;

import com.example.backend.DTO.Request.AddressRequest;
import com.example.backend.DTO.Response.AddressResponse;
import com.example.backend.Entity.Address;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Repos.AddressRepo;
import com.example.backend.Repos.SiteUserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressService {

    private final AddressRepo addressRepo;
    private final SiteUserRepo siteUserRepo;

    private AddressResponse toResponse(Address a) {
        return AddressResponse.builder()
                .id(a.getId())
                .unit_number(a.getUnitNumber())
                .street_number(a.getStreetNumber())
                .address_line(a.getAddressLine())
                .is_default(Boolean.TRUE.equals(a.getIsDefault()))
                .build();
    }


    public List<AddressResponse> getAllAddresses() {
        return addressRepo.findAll().stream().map(this::toResponse).toList();
    }

    public List<AddressResponse> searchAddresses(String q) {
        return addressRepo.search(q).stream().map(this::toResponse).toList();
    }

    public AddressResponse getAddressById(Integer id) {
        var a = addressRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Address không tồn tại: " + id));
        return toResponse(a);
    }

    public AddressResponse createAddress(AddressRequest req) {
        Address a = new Address();
        a.setUnitNumber(req.getUnit_number());
        a.setStreetNumber(req.getStreet_number());
        a.setAddressLine(req.getAddress_line());
        a.setIsDefault(req.getIs_default() != null ? req.getIs_default() : Boolean.FALSE);
        a = addressRepo.save(a);
        return toResponse(a);
    }

    public AddressResponse updateAddress(Integer id, AddressRequest req) {
        var a = addressRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Address không tồn tại: " + id));

        if (req.getUnit_number() != null)   a.setUnitNumber(req.getUnit_number());
        if (req.getStreet_number() != null) a.setStreetNumber(req.getStreet_number());
        if (req.getAddress_line() != null)  a.setAddressLine(req.getAddress_line());
        if (req.getIs_default() != null)    a.setIsDefault(req.getIs_default());

        a = addressRepo.save(a);
        return toResponse(a);
    }

    public void deleteAddress(Integer id) {
        if (!addressRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Address không tồn tại: " + id);
        }
        addressRepo.deleteById(id);
    }


    public List<AddressResponse> getAddressesOfUser(Integer userId) {
        return addressRepo.findByUserId(userId).stream().map(this::toResponse).toList();
    }

    public AddressResponse getAddressByIdForUser(Integer userId, Integer addressId) {
        var a = addressRepo.findOneForUser(userId, addressId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Địa chỉ không thuộc user hoặc không tồn tại"));
        return toResponse(a);
    }

    public AddressResponse createAddressForUser(Integer userId, AddressRequest req) {
        SiteUser user = siteUserRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại: " + userId));

        Address a = new Address();
        a.setUser(user); // gắn chủ sở hữu
        a.setUnitNumber(req.getUnit_number());
        a.setStreetNumber(req.getStreet_number());
        a.setAddressLine(req.getAddress_line());
        a.setIsDefault(req.getIs_default() != null ? req.getIs_default() : Boolean.FALSE);

        a = addressRepo.save(a);
        return toResponse(a);
    }

    public AddressResponse updateAddressForUser(Integer userId, Integer addressId, AddressRequest req) {
        Address a = addressRepo.findOneForUser(userId, addressId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Địa chỉ không thuộc user hoặc không tồn tại"));

        if (req.getUnit_number() != null)   a.setUnitNumber(req.getUnit_number());
        if (req.getStreet_number() != null) a.setStreetNumber(req.getStreet_number());
        if (req.getAddress_line() != null)  a.setAddressLine(req.getAddress_line());
        if (req.getIs_default() != null)    a.setIsDefault(req.getIs_default());

        a = addressRepo.save(a);
        return toResponse(a);
    }

    public void deleteAddressForUser(Integer userId, Integer addressId) {
        Address a = addressRepo.findOneForUser(userId, addressId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Địa chỉ không thuộc user hoặc không tồn tại"));
        addressRepo.delete(a);
    }

    public Address findByUser(SiteUser user) {
        return addressRepo.findByUser(user);
    }
}