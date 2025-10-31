package com.example.market_place.service;

import com.example.market_place.dto.ReviewDTO;
import com.example.market_place.model.Card;
import com.example.market_place.model.Reviews;
import com.example.market_place.model.User;
import com.example.market_place.repository.CardRepository;
import com.example.market_place.repository.ReviewsRepository;
import com.example.market_place.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewsService {

    private final ReviewsRepository reviewsRepository;
    private final UserRepository userRepository;
    private final CardRepository cardRepository;

    private final JWTService jwtService;

    public Reviews createReview(
            ReviewDTO reviewDTO,
            Long cardId,
            String token
    ) {
        String username = jwtService.extractUsername(token);

        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        Reviews review = new Reviews();
        review.setContent(reviewDTO.getContent());
        review.setRating(reviewDTO.getRating());
        review.setAuthor(author);
        review.setCard(card);

        reviewsRepository.save(review);
        return review;
    }

    public List<Reviews> getAllReviewsByCardId(Long cardId) {
        return reviewsRepository.findAllByCardId(cardId);
    }
}
