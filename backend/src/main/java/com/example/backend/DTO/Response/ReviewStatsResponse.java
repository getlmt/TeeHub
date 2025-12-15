package com.example.backend.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ReviewStatsResponse {
    private double averageRating;
    private long reviewCount;
}
