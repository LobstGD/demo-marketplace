package com.example.market_place.controller;

import com.example.market_place.dto.CardRequest;
import com.example.market_place.model.Card;
import com.example.market_place.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
public class CardController {

    private final CardService cardService;

    @PostMapping("/create")
    public Card createCard(
            @RequestBody @RequestParam String brand,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam String price,
            @RequestParam String category,
            @RequestParam(required = false) List<MultipartFile> images,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        return cardService.createCard(brand, title, content, price, category, images, token);
    }

    @PutMapping("/update/{cardId}")
    public Card updateCard(
            @RequestParam("cardId") Long cardId,
            @RequestBody CardRequest cardRequest,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        return cardService.updateCard(cardId, cardRequest, token);
    }

    @GetMapping("/my-cards")
    public List<Card> getMyCards(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return cardService.getCardsByUserToken(token);
    }


    @GetMapping ("/card/{card_id}")
    public Optional<Card> getCardById(@PathVariable("card_id") Long card_id){
        return cardService.getCardById(card_id);
    }

    @GetMapping("/category/{category}")
    public List<Card> getAllCardsByCategory(@PathVariable String category) {
        return cardService.getAllCardsByCategory(category);
    }

    @GetMapping ("/cards")
    public List<Card> getAllCards() {
        return cardService.getAllCards();
    }
}
