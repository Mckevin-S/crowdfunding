package com.example.project.service.impl;

import com.example.project.dto.*;
import com.example.project.entity.PasswordResetToken;
import com.example.project.entity.Utilisateur;
import com.example.project.entity.Wallet;
import com.example.project.enums.UserRole;
import com.example.project.enums.UserStatus;
import com.example.project.exception.BadRequestException;
import com.example.project.exception.ConflictException;
import com.example.project.exception.ResourceNotFoundException;
import com.example.project.repository.PasswordResetTokenRepository;
import com.example.project.repository.UtilisateurRepository;
import com.example.project.repository.WalletRepository;
import com.example.project.service.interfaces.AuthService;
import com.example.project.service.interfaces.EmailService;
import com.example.project.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Implementation of {@link AuthService}.
 * Handles secure registration using BCrypt password encoding and JWT-based login.
 * Automatically initializes a virtual wallet for every new user.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final WalletRepository walletRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Cet email est déjà utilisé");
        }

        UserRole role;
        try {
            role = UserRole.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Rôle invalide. Utilisez PORTEUR_PROJET ou CONTRIBUTEUR");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setEmail(request.getEmail());
        utilisateur.setMotsDePasse(passwordEncoder.encode(request.getPassword()));
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setNom(request.getNom());
        utilisateur.setRole(role);
        utilisateur.setStatut(UserStatus.ACTIVE);

        utilisateur = utilisateurRepository.save(utilisateur);

        // Create a wallet for the new user automatically
        Wallet wallet = new Wallet();
        wallet.setUtilisateur(utilisateur);
        walletRepository.save(wallet);

        UserDetails userDetails = User.builder()
                .username(utilisateur.getEmail())
                .password(utilisateur.getMotsDePasse())
                .roles(utilisateur.getRole().name())
                .build();

        String jwtToken = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .id(utilisateur.getId())
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole().name())
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(); // AuthenticationManager ensures this exists implicitly

        UserDetails userDetails = User.builder()
                .username(utilisateur.getEmail())
                .password(utilisateur.getMotsDePasse())
                .roles(utilisateur.getRole().name())
                .build();

        String jwtToken = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .id(utilisateur.getId())
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole().name())
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .build();
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "email", request.getEmail()));

        // Invalid any previous tokens
        tokenRepository.deleteByUtilisateur(utilisateur);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .utilisateur(utilisateur)
                .expiryDate(LocalDateTime.now().plusHours(24))
                .build();

        tokenRepository.save(resetToken);

        String resetLink = "http://localhost:3000/reset-password?token=" + token; // Simplified for dev
        emailService.sendSimpleMessage(
                utilisateur.getEmail(),
                "Réinitialisation de votre mot de passe",
                "Cliquez sur ce lien pour réinitialiser votre mot de passe : " + resetLink
        );
        log.info("FORGOT_PASSWORD: Token généré pour {}", utilisateur.getEmail());
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Token invalide"));

        if (token.isExpired()) {
            tokenRepository.delete(token);
            throw new BadRequestException("Le token a expiré");
        }

        Utilisateur utilisateur = token.getUtilisateur();
        utilisateur.setMotsDePasse(passwordEncoder.encode(request.getNewPassword()));
        utilisateurRepository.save(utilisateur);

        tokenRepository.delete(token);
        log.info("RESET_PASSWORD: Mot de passe réinitialisé avec succès pour {}", utilisateur.getEmail());
    }

    @Override
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "email", email));

        if (!passwordEncoder.matches(request.getOldPassword(), utilisateur.getMotsDePasse())) {
            throw new BadRequestException("L'ancien mot de passe est incorrect");
        }

        utilisateur.setMotsDePasse(passwordEncoder.encode(request.getNewPassword()));
        utilisateurRepository.save(utilisateur);
        log.info("CHANGE_PASSWORD: Mot de passe modifié pour {}", email);
    }
}
