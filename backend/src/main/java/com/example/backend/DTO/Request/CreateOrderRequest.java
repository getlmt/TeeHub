package com.example.backend.DTO.Request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class CreateOrderRequest {
    private Integer userId;
    private Integer shippingAddressId;
    private String paymentTypeName;
    private String paymentProvider;
    private String paymentAccountNumber;
    private String paymentStatus;
    private String shippingMethodName;
    private BigDecimal shippingPrice;
    private BigDecimal orderTotal;
    private List<Integer> selectedItemIds;
}
