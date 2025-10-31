package com.example.market_place.yoomoney;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class YooMoneyController {

    private final YooMoneyService yooMoneyService;

    @PostMapping("/create-payment")
    public ResponseEntity<?> createPayment(@RequestParam double amount, @RequestParam String description) {
        try {
            String confirmationUrl = yooMoneyService.createPayment(amount, description);
            if (confirmationUrl != null) {
                log.info("Создан платёж на сумму {} руб. Описание: {}", amount, description);
                return ResponseEntity.ok(Map.of("url", confirmationUrl));
            } else {
                log.error("Не удалось получить ссылку подтверждения от YooMoney");
                return ResponseEntity.status(500).body(Map.of("error", "Ошибка при создании платежа"));
            }
        } catch (Exception e) {
            log.error("Ошибка при создании платежа: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Ошибка сервера: " + e.getMessage()));
        }
    }

    @GetMapping("/payment/success")
    public String success() {
        return "paymentSuccess";
    }

    @GetMapping("/payment/error")
    public String error() {
        return "paymentError";
    }
}
