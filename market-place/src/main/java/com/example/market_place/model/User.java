package com.example.market_place.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String email;

    @OneToMany(mappedBy = "author")
    @JsonManagedReference(value = "user_cards")
    private List<Card> cards;

    @OneToMany(mappedBy = "author")
    @JsonManagedReference(value = "user_reviews")
    private List<Reviews> reviews;
}
