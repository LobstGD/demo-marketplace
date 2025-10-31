package com.example.market_place.service;

import com.example.market_place.dto.UserDTO;
import com.example.market_place.dto.UserDTOMapper;
import com.example.market_place.model.User;
import com.example.market_place.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.ExpressionException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;


    @Autowired
    AuthenticationManager authManager;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private UserDTOMapper mapper;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public User register(User user){
        user.setPassword(encoder.encode(user.getPassword()));
        //mailService.sendEmail(user, MailType.REGISTRATION, new Properties());
        return repository.save(user);
    }

    public String verify(User user) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        if (authentication.isAuthenticated()){
            return jwtService.generateToken(user.getUsername());
        } else {
            return "fail";
        }
    }

    public List<UserDTO> getAllUsers(){
        return repository.findAll()
                .stream()
                .map(mapper).collect(Collectors.toList());
    }

    public User updateUser(Long id, User updatedUsers){
        User users = repository.findById(id).orElseThrow(() ->
                new ExpressionException("There is not such user with given id" + id));

        users.setUsername(updatedUsers.getUsername());
        users.setEmail(updatedUsers.getEmail());

        User updatedUsersObj = repository.save(users);
        return updatedUsersObj;
    }

    public void deleteUser(Long id) {
        repository.deleteById(id);
    }

}
