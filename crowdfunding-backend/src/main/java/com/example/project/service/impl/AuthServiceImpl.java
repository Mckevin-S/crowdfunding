package com.example.project.service.impl;

import com.example.project.dto.AuthResponse;
import com.example.project.dto.LoginRequest;
import com.example.project.dto.RegisterRequest;
import com.example.project.entity.Utilisateur;
import com.example.project.entity.Wallet;
import com.example.project.enums.UserRole;
import com.example.project.enums.UserStatus;
import com.example.project.exception.BadRequestException;
import com.example.project.exception.ConflictException;
import com.example.project.repository.UtilisateurRepository;
import com.example.project.repository.WalletRepository;
import com.example.project.service.interfaces.AuthService;
import com.example.project.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of {@link AuthService}.
 * Handles secure registration using BCrypt password encoding and JWT-based login.
 * Automatically initializes a virtual wallet for every new user.
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final WalletRepository walletRepository;
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
}
