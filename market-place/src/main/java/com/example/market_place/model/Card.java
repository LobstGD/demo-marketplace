package com.example.market_place.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brand;
    private String title;
    private String content;
    private String category;

    private String price;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "author_id")
    @JsonBackReference(value = "user_cards")
    private User author;

    @OneToMany(mappedBy = "card", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "card_images")
    private List<CardImage> images;

    @OneToMany(mappedBy = "card")
    @JsonManagedReference(value = "card_reviews")
    private List<Reviews> reviews;
}
