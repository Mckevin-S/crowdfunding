package com.example.project.service;

import com.example.project.entity.Utilisateur;
import com.example.project.entity.Wallet;
import com.example.project.enums.UserRole;
import com.example.project.enums.UserStatus;
import com.example.project.repository.UtilisateurRepository;
import com.example.project.repository.WalletRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleAuthService {

    @Value("${google.client.id}")
    private String clientId;

    private final UtilisateurRepository utilisateurRepository;
    private final WalletRepository walletRepository;

    public Optional<Utilisateur> verifyGoogleToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(clientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                String email = payload.getEmail();
                String googleId = payload.getSubject();
                String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");
                String familyName = (String) payload.get("family_name");
                String givenName = (String) payload.get("given_name");

                return Optional.of(processGoogleUser(email, googleId, name, pictureUrl, familyName, givenName));
            }
        } catch (Exception e) {
            log.error("GOOGLE_AUTH_ERROR: Erreur lors de la vérification du token Google", e);
        }
        return Optional.empty();
    }

    private Utilisateur processGoogleUser(String email, String googleId, String name, String pictureUrl, String familyName, String givenName) {
        return utilisateurRepository.findByEmail(email)
                .map(existingUser -> {
                    if (existingUser.getGoogleId() == null) {
                        existingUser.setGoogleId(googleId);
                        existingUser.setAvatarUrl(pictureUrl);
                        return utilisateurRepository.save(existingUser);
                    }
                    return existingUser;
                })
                .orElseGet(() -> {
                    Utilisateur newUser = new Utilisateur();
                    newUser.setEmail(email);
                    newUser.setGoogleId(googleId);
                    newUser.setAvatarUrl(pictureUrl);
                    newUser.setNom(familyName != null ? familyName : name);
                    newUser.setPrenom(givenName);
                    newUser.setRole(UserRole.CONTRIBUTEUR); // Rôle par défaut
                    newUser.setStatut(UserStatus.ACTIVE);
                    Utilisateur savedUser = utilisateurRepository.save(newUser);
                    
                    // Création du wallet
                    Wallet wallet = new Wallet();
                    wallet.setUtilisateur(savedUser);
                    walletRepository.save(wallet);
                    
                    return savedUser;
                });
    }
}
