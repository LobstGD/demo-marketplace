package com.example.market_place.service;

import com.example.market_place.dto.CardRequest;
import com.example.market_place.model.Card;
import com.example.market_place.model.CardImage;
import com.example.market_place.model.User;
import com.example.market_place.repository.CardRepository;
import com.example.market_place.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardService {

    private final JWTService jwtService;

    private final CardRepository cardRepository;
    private final UserRepository userRepository;

    public Card createCard(String brand, String title, String content, String price, String category,
                           List<MultipartFile> images, String token) {
        String username = jwtService.extractUsername(token);

        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found exception"));

        Card card = new Card();
        card.setBrand(brand);
        card.setTitle(title);
        card.setContent(content);
        card.setPrice(price);
        card.setCategory(category);
        card.setAuthor(author);
        card.setCreatedAt(LocalDateTime.now());

        if (images != null && !images.isEmpty()) {
            List<CardImage> cardImages = new ArrayList<>();
            for (MultipartFile file : images) {
                try {
                    // Сохраняем файл и получаем URL
                    String imageUrl = saveImageToFileSystem(file);
                    CardImage cardImage = new CardImage();
                    cardImage.setImageUrl(imageUrl);
                    cardImage.setCard(card);
                    cardImages.add(cardImage);
                } catch (IOException e) {
                    throw new RuntimeException("Ошибка при сохранении файла: " + e.getMessage());
                }
            }
            card.setImages(cardImages);
        }

        cardRepository.save(card);

        // Чтобы клиент сразу получил массив URL
        card.setImages(card.getImages().stream()
                .peek(img -> img.setCard(null)) // убираем рекурсию при JSON
                .collect(Collectors.toList()));

        return card;
    }

    private String saveImageToFileSystem(MultipartFile file) throws IOException {
        String folder = "uploads/";
        File dir = new File(folder);
        if (!dir.exists()) dir.mkdirs();

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path path = Paths.get(folder + fileName);
        Files.write(path, file.getBytes());

        // Возвращаем путь для доступа с фронтенда
        return "/uploads/" + fileName;
    }



    public Card updateCard(Long cardId, CardRequest cardRequest, String token) {
        String username = jwtService.extractUsername(token);

        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Card newCardData = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not fount"));

        if(!newCardData.getAuthor().getUsername().equals(author.getUsername())) {
            throw new RuntimeException("You can change only your own cards");
        }

        newCardData.setBrand(cardRequest.getBrand());
        newCardData.setTitle(cardRequest.getTitle());
        newCardData.setContent(cardRequest.getContent());
        newCardData.setPrice(cardRequest.getPrice());

        cardRepository.save(newCardData);

        return newCardData;
    }

    public List<Card> getCardsByUserToken(String token) {
        // получаем username из токена
        String username = jwtService.extractUsername(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cardRepository.findAllByAuthorId(user.getId());
    }

    public List<Card> getAllCardsByCategory(String category) {
        return cardRepository.findByCategory(category);
    }

    public Optional<Card> getCardById(Long cardId) {
        return cardRepository.findById(cardId);
    }

    public List<Card> getAllCards() {
        return cardRepository.findAll();
    }
}
