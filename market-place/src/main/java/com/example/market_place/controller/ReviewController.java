package com.example.market_place.controller;

import com.example.market_place.dto.ReviewDTO;
import com.example.market_place.model.Reviews;
import com.example.market_place.service.ReviewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.web.headers.HeadersSecurityMarker;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewsService reviewsService;

    @PostMapping("/create/{card_id}/review")
    public ResponseEntity<Reviews> createReview(
            @RequestBody ReviewDTO reviewDTO,
            @PathVariable Long card_id,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        Reviews review = reviewsService.createReview(reviewDTO, card_id, token);

        return ResponseEntity.ok(review);
    }

    @GetMapping("/reviews/{card_id}")
    public ResponseEntity<List<Reviews>> getAllReviewsByCardId(@PathVariable Long card_id) {
        return ResponseEntity.ok(reviewsService.getAllReviewsByCardId(card_id));
    }
}
