package com.example.market_place.repository;

import com.example.market_place.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {

    List<Card> findByCategory(String category);

    List<Card> findAllByAuthorId(Long id);
}
