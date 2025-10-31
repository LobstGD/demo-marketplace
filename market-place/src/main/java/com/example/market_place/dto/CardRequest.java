package com.example.market_place.dto;

import lombok.Data;

@Data
public class CardRequest {
    private String brand;
    private String title;
    private String content;
    private String price;
    private String category;

}
