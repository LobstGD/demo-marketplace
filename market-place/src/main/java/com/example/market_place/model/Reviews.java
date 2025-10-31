package com.example.market_place.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Reviews {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;
    private int rating;

    @ManyToOne
    @JoinColumn(name = "author_id")
    @JsonBackReference(value = "user_reviews")
    private User author;

    @ManyToOne
    @JoinColumn(name = "card_id")
    @JsonBackReference(value = "card_reviews")
    private Card card;
}
