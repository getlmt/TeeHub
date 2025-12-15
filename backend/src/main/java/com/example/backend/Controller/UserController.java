// backend/src/main/java/com/example/backend/Controller/UserController.java
package com.example.backend.Controller;

import com.example.backend.DTO.Request.SiteUserRequest;
import com.example.backend.DTO.Request.AddressRequest;
import com.example.backend.DTO.Request.ChangeRoleRequest;
import com.example.backend.DTO.Response.SiteUserResponse;
import com.example.backend.DTO.Response.AddressResponse;
import com.example.backend.Sercurity.MyUserDetails;
import com.example.backend.Service.SiteUserService;
import com.example.backend.Service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final SiteUserService siteUserService;
    private final AddressService addressService;

    // Dùng để re-auth admin khi đổi role
    private final AuthenticationManager authenticationManager;

    /* ===== Users ===== */

    @GetMapping
    public ResponseEntity<List<SiteUserResponse>> getUsers() {
        return ResponseEntity.ok(siteUserService.getAllUsers()); // trả [] khi rỗng
    }

    @GetMapping("/{userId}")
    public ResponseEntity<SiteUserResponse> getUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(siteUserService.getUserById(userId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<SiteUserResponse>> searchUsers(@RequestParam("kw") String kw) {
        return ResponseEntity.ok(siteUserService.searchUsers(kw)); // trả [] khi không match
    }

    @PutMapping("/{userId}/password")
    public ResponseEntity<String> changePassword(
            @PathVariable Integer userId,
            @RequestBody SiteUserRequest req) {

        if (req.getPassword() == null || req.getNew_password() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cần cung cấp mật khẩu cũ và mới");
        }

        siteUserService.changePassword(userId, req.getPassword(), req.getNew_password());
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }

    @PostMapping
    public ResponseEntity<SiteUserResponse> createUser(
            @Validated(SiteUserRequest.Create.class) @RequestBody SiteUserRequest req) {
        var created = siteUserService.createUser(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<SiteUserResponse> updateUser(
            @PathVariable Integer userId,
            @Validated(SiteUserRequest.Update.class) @RequestBody SiteUserRequest req) {
        return ResponseEntity.ok(siteUserService.updateUser(userId, req));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer userId) {
        siteUserService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    // ADMIN đổi vai trò (có re-auth mật khẩu admin đang thao tác)
    @PutMapping("/{userId}/role")
    public ResponseEntity<SiteUserResponse> changeUserRole(
            @PathVariable Integer userId,
            @RequestBody ChangeRoleRequest req,
            @AuthenticationPrincipal MyUserDetails me
    ) {
        if (me == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ");
        }
        if (req == null || req.getRole() == null || req.getRole().isBlank() || req.getAdmin_password() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu role hoặc admin_password");
        }

        // Re-auth: xác thực lại admin đang thao tác bằng mật khẩu họ nhập
        var token = new UsernamePasswordAuthenticationToken(me.getUsername(), req.getAdmin_password());
        try {
            authenticationManager.authenticate(token); // ném BadCredentials nếu sai
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Mật khẩu xác nhận không đúng");
        }

        var updated = siteUserService.changeUserRole(userId, req.getRole()); // "ADMIN"|"USER"|"MODERATOR"
        return ResponseEntity.ok(updated);
    }


    @GetMapping("/{userId}/addresses")
    public ResponseEntity<List<AddressResponse>> getAddresses(@PathVariable Integer userId) {
        return ResponseEntity.ok(addressService.getAddressesOfUser(userId)); // trả [] khi rỗng
    }

    @GetMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<AddressResponse> getAddress(
            @PathVariable Integer userId,
            @PathVariable Integer addressId) {
        return ResponseEntity.ok(addressService.getAddressByIdForUser(userId, addressId));
    }

    @PostMapping("/{userId}/addresses")
    public ResponseEntity<AddressResponse> addAddress(
            @PathVariable Integer userId,
            @Validated(AddressRequest.Create.class) @RequestBody AddressRequest req) {
        var created = addressService.createAddressForUser(userId, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Integer userId,
            @PathVariable Integer addressId,
            @Validated(AddressRequest.Update.class) @RequestBody AddressRequest req) {
        return ResponseEntity.ok(addressService.updateAddressForUser(userId, addressId, req));
    }

    @DeleteMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Integer userId,
            @PathVariable Integer addressId) {
        addressService.deleteAddressForUser(userId, addressId);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/me")
    public ResponseEntity<SiteUserResponse> getMyProfile(@AuthenticationPrincipal MyUserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Không tìm thấy thông tin xác thực");
        }
        Integer currentUserId = userDetails.getUserId();
        return ResponseEntity.ok(siteUserService.getUserById(currentUserId));
    }

    @PutMapping("/me")
    public ResponseEntity<SiteUserResponse> updateMyProfile(
            @AuthenticationPrincipal MyUserDetails userDetails,
            @Validated(SiteUserRequest.Update.class) @RequestBody SiteUserRequest req) {

        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ");
        }
        Integer currentUserId = userDetails.getUserId();
        return ResponseEntity.ok(siteUserService.updateUser(currentUserId, req));
    }

    @GetMapping("/me/addresses")
    public ResponseEntity<List<AddressResponse>> getMyAddresses(@AuthenticationPrincipal MyUserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ hoặc đã hết hạn");
        }
        Integer currentUserId = userDetails.getUserId();
        return ResponseEntity.ok(addressService.getAddressesOfUser(currentUserId));
    }

    @PostMapping("/me/addresses")
    public ResponseEntity<AddressResponse> createMyAddress(
            @AuthenticationPrincipal MyUserDetails userDetails,
            @Validated(AddressRequest.Create.class) @RequestBody AddressRequest req) {

        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ");
        }
        Integer currentUserId = userDetails.getUserId();
        var created = addressService.createAddressForUser(currentUserId, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/me/addresses/{addressId}")
    public ResponseEntity<AddressResponse> updateMyAddress(
            @AuthenticationPrincipal MyUserDetails userDetails,
            @PathVariable Integer addressId,
            @Validated @RequestBody AddressRequest req) {

        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ");
        }
        Integer currentUserId = userDetails.getUserId();
        return ResponseEntity.ok(addressService.updateAddressForUser(currentUserId, addressId, req));
    }

    @DeleteMapping("/me/addresses/{addressId}")
    public ResponseEntity<Void> deleteMyAddress(
            @AuthenticationPrincipal MyUserDetails userDetails,
            @PathVariable Integer addressId) {

        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ");
        }
        Integer currentUserId = userDetails.getUserId();
        addressService.deleteAddressForUser(currentUserId, addressId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/me/password")
    public ResponseEntity<String> changeMyPassword(
            @AuthenticationPrincipal MyUserDetails userDetails,
            @RequestBody SiteUserRequest req) {

        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ");
        }
        if (req.getPassword() == null || req.getNew_password() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cần cung cấp mật khẩu cũ và mới");
        }
        Integer currentUserId = userDetails.getUserId();
        siteUserService.changePassword(currentUserId, req.getPassword(), req.getNew_password());
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadMyAvatar(
            @AuthenticationPrincipal MyUserDetails userDetails,
            @RequestParam("avatarFile") MultipartFile file) {
        try {
            if (userDetails == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ");
            }

            Integer userId = userDetails.getUserId();
            String avatarUrl = siteUserService.uploadAvatar(userId, file);
            return ResponseEntity.ok().body(
                    java.util.Map.of("avatarUrl", avatarUrl)
            );
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi lưu file", e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }


    @PostMapping("/{userId}/avatar")
    public ResponseEntity<?> uploadAvatarForUser(
            @PathVariable Integer userId,
            @RequestParam("avatarFile") MultipartFile file) {
        try {
            String avatarUrl = siteUserService.uploadAvatar(userId, file);
            return ResponseEntity.ok(java.util.Map.of("avatarUrl", avatarUrl));
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi lưu file", e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }
}
