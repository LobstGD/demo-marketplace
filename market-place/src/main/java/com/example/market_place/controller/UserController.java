package com.example.market_place.controller;

import com.example.market_place.dto.UserDTO;
import com.example.market_place.model.User;
import com.example.market_place.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService service;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(){
        return ResponseEntity.ok(service.getAllUsers());
    }

    @PostMapping("/register")
    public User register(@RequestBody User users){
        return service.register(users);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user){
        return service.verify(user);
    }

    @GetMapping("/admin")
    public String adminPanel(){
        return "This is admin page";
    }

    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable Long id,
                            @RequestBody User updatedUsers){
        return service.updateUser(id, updatedUsers);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable Long id){
        service.deleteUser(id);
    }
}
