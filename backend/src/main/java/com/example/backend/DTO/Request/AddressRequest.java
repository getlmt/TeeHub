package com.example.backend.DTO.Request;

//import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressRequest {

    public interface Create {}
    public interface Update {}

//    @Size(max = 50, groups = {Create.class, Update.class})
    private String unit_number;

//    @Size(max = 50, groups = {Create.class, Update.class})
    private String street_number;

//    @Size(max = 255, groups = {Create.class, Update.class})
//    @NotBlank(groups = {Create.class})
    private String address_line;

    // create: optional (mặc định false); update: optional
    private Boolean is_default;
}
