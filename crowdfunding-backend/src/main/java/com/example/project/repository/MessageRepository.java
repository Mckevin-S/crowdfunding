package com.example.project.repository;

import com.example.project.entity.Message;
import com.example.project.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    /**
     * Retrieve conversation between two users, ordered by date.
     */
    @Query("SELECT m FROM Message m WHERE (m.expediteur = :user1 AND m.destinataire = :user2) OR (m.expediteur = :user2 AND m.destinataire = :user1) ORDER BY m.dateEnvoi ASC")
    List<Message> findConversation(@Param("user1") Utilisateur user1, @Param("user2") Utilisateur user2);

    /**
     * Count unread messages for a specific user.
     */
    long countByDestinataireAndLuFalse(Utilisateur destinataire);

    /**
     * Find recent messages (distinct conversations preview) by user.
     */
    @Query("SELECT m FROM Message m WHERE m.id IN (SELECT MAX(m1.id) FROM Message m1 WHERE m1.expediteur = :user OR m1.destinataire = :user GROUP BY (CASE WHEN m1.expediteur = :user THEN m1.destinataire.id ELSE m1.expediteur.id END)) ORDER BY m.dateEnvoi DESC")
    List<Message> findRecentConversationsByUser(@Param("user") Utilisateur user);
}
