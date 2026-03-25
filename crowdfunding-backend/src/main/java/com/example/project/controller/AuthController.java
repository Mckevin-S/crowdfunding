package com.example.project.controller;

import com.example.project.dto.*;
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
    private final com.example.project.service.GoogleAuthService googleAuthService;

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

    /**
     * Authenticates a user via Google ID Token.
     *
     * @param idToken the Google ID token string.
     * @return the authentication response containing the JWT token.
     */
    @PostMapping("/google")
    @Operation(summary = "Connecter via Google", description = "Vérifie le token Google et retourne un token JWT local.")
    @ApiResponse(responseCode = "200", description = "Connexion Google réussie")
    @ApiResponse(responseCode = "401", description = "Token Google invalide")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody String idToken) {
        log.info("GOOGLE_LOGIN: Tentative de connexion via Google");
        return googleAuthService.verifyGoogleToken(idToken)
                .map(user -> ResponseEntity.ok(authService.generateAuthResponse(user)))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    /**
     * Initiates the password reset flow.
     *
     * @param request the forgot password details.
     * @return 200 OK.
     */
    @PostMapping("/forgot-password")
    @Operation(summary = "Mot de passe oublié", description = "Envoie un email de réinitialisation si l'utilisateur existe.")
    @ApiResponse(responseCode = "200", description = "Email envoyé si le compte existe")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok().build();
    }

    /**
     * Resets the password using a token.
     *
     * @param request the reset password details.
     * @return 200 OK.
     */
    @PostMapping("/reset-password")
    @Operation(summary = "Réinitialiser le mot de passe", description = "Réinitialise le mot de passe via un token valide.")
    @ApiResponse(responseCode = "200", description = "Mot de passe modifié avec succès")
    @ApiResponse(responseCode = "400", description = "Token invalide ou expiré")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok().build();
    }

    /**
     * Changes the password for an authenticated user.
     *
     * @param request the change password details.
     * @return 200 OK.
     */
    @PostMapping("/change-password")
    @Operation(summary = "Changer le mot de passe", description = "Modifie le mot de passe d'un utilisateur connecté.")
    @ApiResponse(responseCode = "200", description = "Mot de passe mis à jour")
    @ApiResponse(responseCode = "401", description = "Non authentifié")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(request);
        return ResponseEntity.ok().build();
    }

    /**
     * Gets the current authenticated user.
     *
     * @return the authenticated user details.
     */
    @GetMapping("/me")
    @Operation(summary = "Obtenir l'utilisateur courant", description = "Retourne les détails de l'utilisateur actuellement authentifié.")
    @ApiResponse(responseCode = "200", description = "Utilisateur trouvé")
    @ApiResponse(responseCode = "401", description = "Non authentifié")
    public ResponseEntity<AuthResponse> getCurrentUser() {
        log.info("GET_CURRENT_USER: Récupération de l'utilisateur conecté");
        return ResponseEntity.ok(authService.getCurrentUser());
    }

    /**
     * Logs out the user.
     *
     * @return 200 OK.
     */
    @PostMapping("/logout")
    @Operation(summary = "Déconnecter l'utilisateur", description = "Invalide la session (principalement côté client, mais fournit un point de terminaison).")
    @ApiResponse(responseCode = "200", description = "Déconnexion réussie")
    public ResponseEntity<Void> logout() {
        log.info("USER_LOGOUT: Déconnexion demandée");
        return ResponseEntity.ok().build();
    }
}
