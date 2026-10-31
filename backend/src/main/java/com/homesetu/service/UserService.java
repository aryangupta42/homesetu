package com.homesetu.service;

import com.homesetu.dto.AuthResponse;
import com.homesetu.dto.LoginRequest;
import com.homesetu.dto.RegisterRequest;
import com.homesetu.model.User;
import com.homesetu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public AuthResponse register(RegisterRequest req) {
        if ("ADMIN".equalsIgnoreCase(req.getRole()) && !"arshm2772@gmail.com".equalsIgnoreCase(req.getEmail())) {
            return new AuthResponse(false, "Registration of Admin accounts is restricted to arshm2772@gmail.com!", null, null);
        }

        if (userRepository.existsByEmail(req.getEmail())) {
            return new AuthResponse(false, "Email is already registered!", null, null);
        }

        User user = new User(
                req.getFullName(),
                req.getEmail(),
                req.getPassword(), // Standard hash/plain for collegiate demo
                req.getRole() != null ? req.getRole().toUpperCase() : "STUDENT",
                req.getPhone(),
                req.getCollege(),
                req.getStudentId(),
                req.getPropertyName(),
                req.getCity() != null ? req.getCity() : "Ghaziabad"
        );

        user = userRepository.save(user);
        String token = "TOKEN-" + UUID.randomUUID().toString();
        return new AuthResponse(true, "Registration successful!", token, user);
    }

    public AuthResponse login(LoginRequest req) {
        Optional<User> userOpt = userRepository.findByEmail(req.getEmail());
        if (userOpt.isEmpty()) {
            return new AuthResponse(false, "User not found with this email!", null, null);
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(req.getPassword())) {
            return new AuthResponse(false, "Invalid credentials / password!", null, null);
        }

        String token = "TOKEN-" + UUID.randomUUID().toString();
        return new AuthResponse(true, "Login successful!", token, user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
