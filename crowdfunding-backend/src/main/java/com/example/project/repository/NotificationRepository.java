package com.example.project.repository;

import com.example.project.entity.Notification;
import com.example.project.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUtilisateur(Utilisateur utilisateur);

    @Query("SELECT n FROM Notification n WHERE n.utilisateur = :utilisateur AND n.estLu = false")
    List<Notification> findUnreadNotificationsByUser(@Param("utilisateur") Utilisateur utilisateur);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.utilisateur = :utilisateur AND n.estLu = false")
    long countUnreadNotifications(@Param("utilisateur") Utilisateur utilisateur);
}
