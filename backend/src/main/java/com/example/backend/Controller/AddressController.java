package com.example.backend.Controller;

import com.example.backend.DTO.Request.AddressRequest;
import com.example.backend.DTO.Response.AddressResponse;
import com.example.backend.Service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService service;

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getAll(@RequestParam(value = "q", required = false) String q) {
        var list = (q == null || q.isBlank()) ? service.getAllAddresses() : service.searchAddresses(q);
        return list.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getAddressById(id));
    }

    @PostMapping
    public ResponseEntity<AddressResponse> create(
            @RequestBody @Validated(AddressRequest.Create.class) AddressRequest req) {
        var created = service.createAddress(req);
        return ResponseEntity.created(URI.create("/api/addresses/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> update(
            @PathVariable Integer id,
            @RequestBody @Validated(AddressRequest.Update.class) AddressRequest req) {
        return ResponseEntity.ok(service.updateAddress(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }
}
