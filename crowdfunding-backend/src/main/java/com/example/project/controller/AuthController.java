package com.example.project.controller;

import com.example.project.dto.AuthResponse;
import com.example.project.dto.LoginRequest;
import com.example.project.dto.RegisterRequest;
import com.example.project.service.interfaces.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for authentication operations.
 * Handles user registration and login to provide JWT tokens.
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentification", description = "Endpoints pour l'inscription et la connexion des utilisateurs")
public class AuthController {

    private final AuthService authService;

    /**
     * Registers a new user.
     *
     * @param request the registration details.
     * @return the authentication response containing the JWT token.
     */
    @PostMapping("/register")
    @Operation(summary = "Inscrire un nouvel utilisateur", description = "Crée un nouveau compte utilisateur et retourne un token JWT.")
    @ApiResponse(responseCode = "201", description = "Utilisateur créé avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides ou email déjà utilisé")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("USER_REGISTRATION: Tentative d'inscription pour l'email: {}", request.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    /**
     * Authenticates a user and returns a JWT token.
     *
     * @param request the login credentials.
     * @return the authentication response containing the JWT token.
     */
    @PostMapping("/login")
    @Operation(summary = "Connecter un utilisateur", description = "Authentifie l'utilisateur et retourne un token JWT.")
    @ApiResponse(responseCode = "200", description = "Connexion réussie")
    @ApiResponse(responseCode = "401", description = "Identifiants invalides")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("USER_LOGIN: Tentative de connexion pour l'email: {}", request.getEmail());
        return ResponseEntity.ok(authService.login(request));
    }
}
