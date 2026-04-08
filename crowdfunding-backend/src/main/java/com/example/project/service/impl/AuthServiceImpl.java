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

import java.security.SecureRandom;
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
        createWalletForUser(utilisateur);

        // Envoi de l'email de bienvenue (Premium)
        try {
            emailService.sendHtmlMessage(
                utilisateur.getEmail(),
                "Bienvenue sur notre plateforme !",
                com.example.project.util.EmailTemplateUtil.getWelcomeTemplate(utilisateur.getPrenom())
            );
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'email de bienvenue pour {}", utilisateur.getEmail(), e);
        }

        return generateAuthResponse(utilisateur);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow();

        return generateAuthResponse(utilisateur);
    }

    @Override
    public AuthResponse generateAuthResponse(Utilisateur utilisateur) {
        UserDetails userDetails = User.builder()
                .username(utilisateur.getEmail())
                .password(utilisateur.getMotsDePasse() != null ? utilisateur.getMotsDePasse() : "")
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
                .kycStatus(utilisateur.getKycStatus())
                .build();
    }

    private void createWalletForUser(Utilisateur utilisateur) {
        if (!walletRepository.existsByUtilisateur(utilisateur)) {
            Wallet wallet = new Wallet();
            wallet.setUtilisateur(utilisateur);
            walletRepository.save(wallet);
            log.info("WALLET_CREATED: Portefeuille créé pour {}", utilisateur.getEmail());
        }
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "email", request.getEmail()));

        // Générer un code à 6 chiffres
        SecureRandom random = new SecureRandom();
        String code = String.format("%06d", random.nextInt(1000000));
        
        // Chercher un token existant ou en créer un nouveau pour éviter les violations de contrainte
        PasswordResetToken resetToken = tokenRepository.findByUtilisateur(utilisateur)
                .orElse(new PasswordResetToken());
        
        resetToken.setToken(code);
        resetToken.setUtilisateur(utilisateur);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        
        tokenRepository.save(resetToken);

        // Envoi du code stylisé (Premium)
        emailService.sendHtmlMessage(
                utilisateur.getEmail(),
                "Code de réinitialisation de mot de passe",
                com.example.project.util.EmailTemplateUtil.getPasswordResetTemplate(code)
        );
        log.info("FORGOT_PASSWORD: Code généré pour {}", utilisateur.getEmail());
    }

    @Override
    public void verifyResetCode(VerifyCodeRequest request) {
        PasswordResetToken token = tokenRepository.findByTokenAndUtilisateur_Email(request.getCode(), request.getEmail())
                .orElseThrow(() -> new BadRequestException("Code invalide pour cet email"));

        if (token.isExpired()) {
            tokenRepository.delete(token);
            throw new BadRequestException("Le code a expiré");
        }
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        // Dans ce flux, le frontend doit renvoyer l'email en plus du token/code pour plus de sécurité
        // On suppose que le ResetPasswordRequest peut être adapté ou qu'on utilise le token tel quel
        PasswordResetToken token = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Code invalide"));

        if (token.isExpired()) {
            tokenRepository.delete(token);
            throw new BadRequestException("Le code a expiré");
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

    @Override
    public AuthResponse getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "email", email));
        return generateAuthResponse(utilisateur);
    }
}
