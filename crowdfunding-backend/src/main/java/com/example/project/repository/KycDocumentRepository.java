package com.example.project.repository;

import com.example.project.entity.KycDocument;
import com.example.project.entity.Utilisateur;
import com.example.project.enums.TypeDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface KycDocumentRepository extends JpaRepository<KycDocument, Long> {
    
    List<KycDocument> findByUtilisateur(Utilisateur utilisateur);
    
    Optional<KycDocument> findByUtilisateurAndTypeDocument(Utilisateur utilisateur, TypeDocument typeDocument);
    
    @Query("SELECT k FROM KycDocument k WHERE k.utilisateur = :utilisateur AND k.estVerifie = true")
    List<KycDocument> findVerifiedDocumentsByUser(@Param("utilisateur") Utilisateur utilisateur);
    
    boolean existsByUtilisateurAndTypeDocumentAndEstVerifieTrue(Utilisateur utilisateur, TypeDocument typeDocument);
}
