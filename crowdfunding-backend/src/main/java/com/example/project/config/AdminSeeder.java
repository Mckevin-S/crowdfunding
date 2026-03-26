package com.example.project.config;

import com.example.project.entity.Utilisateur;
import com.example.project.enums.UserRole;
import com.example.project.enums.UserStatus;
import com.example.project.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Seeds the database with a default administrator account if none exists.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder {

    @Bean
    public CommandLineRunner initAdmin(UtilisateurRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@crowdfund.cm";
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                log.info("Creating default admin account: {}", adminEmail);

                Utilisateur admin = new Utilisateur();
                admin.setEmail(adminEmail);
                admin.setMotsDePasse(passwordEncoder.encode("admin123")); // Default password, change in production
                admin.setPrenom("Super");
                admin.setNom("Admin");
                admin.setRole(UserRole.ADMIN);
                admin.setStatut(UserStatus.ACTIVE);
                admin.setKycStatus("APPROVED"); // Admin doesn't need KYC

                userRepository.save(admin);
                log.info("Default admin account created successfully.");
            }
        };
    }
}
