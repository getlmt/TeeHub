package com.example.backend.DTO.Response.Order;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class OrderResponse {
    private Integer id;
    private Integer userId;
    private String paymentTypeName;
    private String paymentProvider;
    private String paymentAccountNumber;
    private String paymentStatus;
    private Instant paymentDate;
    private String shippingMethodName;
    private BigDecimal shippingPrice;
    private String orderStatus;
    private Instant orderDate;
    private BigDecimal orderTotal;

    private List<OrderItemDTO> items;
}
