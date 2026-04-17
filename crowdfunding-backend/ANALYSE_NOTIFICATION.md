---
### 5. Synthèse et recommandations

**Points forts :**
- Architecture claire (services, contrôleur, entités, DTO, repository, mapper)
- Séparation backend/frontend nette
- API REST bien définie et sécurisée (roles, bearerAuth)
- Affichage dynamique et UX moderne côté frontend

**Axes d'amélioration possibles :**
- Ajouter la gestion temps réel (WebSocket) pour éviter le polling
- Ajouter des tests automatisés sur le flux de notification
- Permettre la suppression de notifications côté utilisateur
- Ajouter des catégories/types de notifications
### 4. Flux complet (création, envoi, réception, affichage)

**Création/Envoi** :
- Un administrateur crée une notification via l'API `POST /api/v1/notifications` (backend).
- La notification est persistée (NotificationService, NotificationRepository, Notification.java).

**Réception** :
- Le frontend appelle `notificationService.getNotificationsByUser(userId)` qui interroge l'API `GET /api/v1/notifications/user/{utilisateurId}`.
- Les notifications sont récupérées et affichées dans le composant `NotificationDropdown.jsx`.

**Affichage** :
- Les notifications sont listées, triées par date, avec un badge pour les non lues.
- L'utilisateur peut marquer une notification comme lue (`markAsRead` → API PATCH), ou tout marquer comme lu.

**Résumé** :
Le système permet à un admin d'envoyer des notifications ciblées, qui sont ensuite affichées dynamiquement côté utilisateur, avec gestion du statut lu/non lu.
### 3. Endpoints API exposés (NotificationController)

- `POST /api/v1/notifications` : Créer/Envoyer une notification à un utilisateur (ADMIN)
- `GET /api/v1/notifications/user/{utilisateurId}` : Lister les notifications d'un utilisateur (ADMIN ou utilisateur concerné)
- `PATCH /api/v1/notifications/{id}/read` : Marquer une notification comme lue
### 1. Fichiers/services backend trouvés

- [service] src/main/java/com/example/project/service/interfaces/NotificationService.java
- [impl] src/main/java/com/example/project/service/impl/NotificationServiceImpl.java
- [repository] src/main/java/com/example/project/repository/NotificationRepository.java
- [mapper] src/main/java/com/example/project/mapper/NotificationMapper.java
- [entité] src/main/java/com/example/project/entity/Notification.java
- [DTO] src/main/java/com/example/project/dto/NotificationRequestDTO.java
- [DTO] src/main/java/com/example/project/dto/NotificationResponseDTO.java
- [controller] src/main/java/com/example/project/controller/NotificationController.java

### 2. Fichiers/services frontend trouvés

- [service] crowdfunding-frontend/src/services/notificationService.js
- [composant] crowdfunding-frontend/src/components/common/NotificationDropdown.jsx
### 1. Fichiers/services backend potentiels

- NotificationService (service principal de gestion des notifications)
- NotificationController (contrôleur d'API pour les notifications)
- Notification.java (entité/modèle de notification)
- NotificationRepository (accès base de données)
- NotificationMapper (mapping DTO/entité)

### 2. Fichiers/services frontend potentiels

- notificationService.js (service d'appel API pour notifications)
- Notification.jsx (composant d'affichage)
- notification.js (modèle ou utilitaire)
- Hooks personnalisés liés aux notifications

Prochaine étape : explorer le code pour confirmer la présence de ces fichiers/services et détailler leur rôle.
## Analyse du système de notification

Cette note servira à organiser l'audit du système de notification de l'application (backend et frontend).

### Étapes prévues :
1. Identifier les services, entités et endpoints liés aux notifications côté backend.
2. Identifier les modules, hooks ou composants liés aux notifications côté frontend.
3. Décrire le flux d'envoi, de réception et d'affichage des notifications.
4. Relever les points forts, faiblesses et axes d'amélioration.