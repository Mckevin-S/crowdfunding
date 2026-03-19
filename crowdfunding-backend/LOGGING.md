# Système de Logging Complet - Documentation

## Vue d'ensemble

Le système de logging a été implémenté avec plusieurs couches :
1. **Logback Configuration** - Configuration XML centralisée
2. **Logging Utilities** - Méthodes utilitaires pour logging structuré
3. **AOP Aspects** - Aspect-Oriented Programming pour logging automatique
4. **HTTP Interceptor** - Capture de toutes les requêtes/réponses HTTP
5. **Global Exception Handler** - Logging centralisé des erreurs

---

## 1. Configuration Logback (`logback-spring.xml`)

### Appenders Disponibles

#### Console Appender (CONSOLE)
```
Logs en temps réel vers la console avec couleurs
Format: [TIMESTAMP] [LEVEL] [Logger] - Message
```

#### File Appender (FILE)
```
Tous les logs de l'application
Chemin: logs/application.log
Rotation: 10MB ou quotidienne
Rétention: 30 jours
```

#### Error File Appender (ERROR_FILE)
```
Uniquement les erreurs et avertissements
Chemin: logs/error.log
Rotation: 10MB ou quotidienne
```

#### Service File Appender (SERVICE_FILE)
```
Logs métier spécifiques aux services
Chemin: logs/service.log
Rotation: 10MB ou quotidienne
```

#### Security File Appender (SECURITY_FILE)
```
Logs de sécurité et authentification
Chemin: logs/security.log
```

#### Database File Appender (DATABASE_FILE)
```
Logs des opérations de base de données
Chemin: logs/database.log
```

#### Payment File Appender (PAYMENT_FILE)
```
Logs des transactions de paiement Stripe
Chemin: logs/payment.log
```

### Profils Spring

**Profile DEV** (`-Dspring.profiles.active=dev`)
- Logs DEBUG et supérieurs
- Console et fichiers activés
- Plus de détails

**Profile PROD** (`-Dspring.profiles.active=prod`)
- Logs INFO et supérieurs
- Fichiers activés uniquement
- Moins de verbosité

---

## 2. Logging Utility (`LoggingUtil.java`)

Classe utilitaire avec des méthodes statiques pour logging structuré :

### Méthodes disponibles

```java
// 1. Événements métier
LoggingUtil.logBusinessEvent(String message, String category, Object... details);
// Exemple: LoggingUtil.logBusinessEvent("Contribution créée", "CONTRIBUTION", projectId, userId, amount);

// 2. Événements de sécurité
LoggingUtil.logSecurityEvent(String event, String user, String action, String result);
// Exemple: LoggingUtil.logSecurityEvent("LOGIN", user.getEmail(), "AUTH_ATTEMPT", "SUCCESS");

// 3. Événements de paiement
LoggingUtil.logPaymentEvent(String event, String paymentId, String status, Double amount);
// Exemple: LoggingUtil.logPaymentEvent("PAYMENT_INITIATED", intentId, "PROCESSING", 100.0);

// 4. Opérations de base de données
LoggingUtil.logDatabaseOperation(String operation, String entity, int recordCount, long duration);
// Exemple: LoggingUtil.logDatabaseOperation("INSERT", "Utilisateur", 1, 150);

// 5. Erreurs
LoggingUtil.logError(String errorType, String message, Exception ex);
// Exemple: LoggingUtil.logError("VALIDATION_ERROR", "Email invalide", ex);

// 6. Appels API
LoggingUtil.logApiCall(String endpoint, String method, String status, long duration);
// Exemple: LoggingUtil.logApiCall("/api/v1/contributions", "POST", "200", 250);

// 7. Erreurs de validation
LoggingUtil.logValidationError(String field, String rule, String value);
// Exemple: LoggingUtil.logValidationError("email", "EMAIL_FORMAT", userEmail);

// 8. Avertissements de performance
LoggingUtil.logPerformanceWarning(String context, long actualDuration, long threshold);
// Exemple: LoggingUtil.logPerformanceWarning("getContributions", 1200, 1000);

// 9. Violations de règles métier
LoggingUtil.logBusinessRuleViolation(String rule, String reason, String context);
// Exemple: LoggingUtil.logBusinessRuleViolation("MAX_CONTRIBUTION", "Limite dépassée", projectId);
```

---

## 3. AOP Aspects - Logging Automatique

### PerformanceLoggingAspect

Monitore automatiquement les performances de :
- **Services** (@Service) - Log DEBUG ou WARN si > 500ms
- **Contrôleurs** (@Controller) - Log INFO avec durée
- **Repositories** (@Repository) - Log WARN si > 100ms

**Exemple de sortie :**
```
DEBUG SERVICE_METHOD_START: ContributionServiceImpl.createContribution
DEBUG SERVICE_METHOD_END: ContributionServiceImpl.createContribution | Duration: 250ms

WARN SLOW_SERVICE_METHOD: ProjetServiceImpl.searchProject took 650ms (threshold: 500ms)

ERROR SERVICE_METHOD_EXCEPTION: PaymentServiceImpl.processPayment | Duration: 120ms | Exception: StripeException
```

### SecurityLoggingAspect

Monitore les événements de sécurité :
- Tentatives d'authentification
- Vérifications d'autorisation
- Opérations sensibles (avec annotation @RequiresSecurityCheck)

**Exemple de sortie :**
```
INFO AUTHENTICATION_ATTEMPT: IP=192.168.1.100, Endpoint=/api/v1/auth/login
INFO AUTHENTICATION_SUCCESS: IP=192.168.1.100

WARN AUTHORIZATION_DENIED: User=john@example.com, Method=deleteProject

INFO SENSITIVE_OPERATION_START: User=admin@example.com, Class=UtilisateurServiceImpl, Method=deleteUser
INFO SENSITIVE_OPERATION_SUCCESS: User=admin@example.com, Class=UtilisateurServiceImpl, Method=deleteUser
```

### DatabaseLoggingAspect

Monitore les opérations de base de données :
- Opérations SAVE
- Opérations BULK UPDATE
- Opérations DELETE
- Opérations QUERY

**Exemple de sortie :**
```
DEBUG DATABASE_SAVE_START: Entity=Utilisateur
INFO DATABASE_SAVE_SUCCESS: Entity=Utilisateur, Duration=150ms

DEBUG DATABASE_BULK_UPDATE_START: RecordCount=5
INFO DATABASE_BULK_UPDATE_SUCCESS: RecordCount=5, Duration=250ms

WARN SLOW_QUERY: Method=findByEmail, Duration=250ms (threshold: 100ms)
```

---

## 4. HTTP Logging Interceptor

Capture automatiquement toutes les requêtes/réponses HTTP :

### Informations capturées
- **Request ID** - UUID unique par requête
- **Méthode HTTP** - GET, POST, PUT, DELETE, etc.
- **Endpoint** - /api/v1/...
- **Query Params** - Paramètres de requête
- **User Agent** - Navigateur/Client
- **Client IP** - Adresse IP du client
- **Durée d'exécution** - Temps total en ms
- **Warnings** - Alertes si > 1000ms

**Exemple de sortie :**
```
INFO [REQUEST] ID=550e8400-e29b-41d4-a716-446655440000 | 
     Method=POST | 
     Endpoint=/api/v1/contributions | 
     User-Agent=Mozilla/5.0 | 
     Client-IP=192.168.1.100 | 
     Duration=250ms |
     QueryParams={projectId=123}

WARN [SLOW_REQUEST] ID=550e8400-e29b-41d4-a716-446655440000 | 
     Duration=1250ms | 
     Endpoint=/api/v1/projects/search
```

---

## 5. Global Exception Handler

Log centralisé de toutes les exceptions :

### Types d'erreurs loggées

| Exception | Niveau | Message |
|-----------|--------|---------|
| Validation Failed | WARN | "VALIDATION_ERROR: Multiple field validation failures" |
| Type Mismatch | ERROR | "TYPE_MISMATCH_ERROR: Invalid parameter type" |
| Access Denied | WARN | "ACCESS_DENIED: User does not have permission" |
| Resource Not Found | WARN | "RESOURCE_NOT_FOUND: Resource does not exist" |
| Business Exception | ERROR | "BUSINESS_RULE_VIOLATION: Business rule failed" |
| Duplicate Resource | WARN | "DUPLICATE_RESOURCE: Resource already exists" |
| Unexpected Error | ERROR | "UNEXPECTED_ERROR: Unknown server error" |

**Exemple de réponse HTTP:**
```json
{
  "timestamp": "2024-01-15T10:30:45",
  "status": 400,
  "error": "Validation Failed",
  "message": "One or more field validation errors occurred",
  "details": {
    "email": "Email must be valid",
    "password": "Password must be at least 8 characters"
  },
  "path": "/api/v1/auth/register"
}
```

---

## 6. Utilisation dans le Projet

### Dans les Services

```java
@Service
@Slf4j
public class ContributionServiceImpl implements IContributionService {
    
    @Override
    public ContributionResponseDTO createContribution(ContributionRequestDTO request) {
        // AOP PerformanceLoggingAspect log automatiquement le début/fin
        // Aucun code de logging nécessaire !
        
        // Ou logging personnalisé :
        LoggingUtil.logBusinessEvent("Contribution créée", "CONTRIBUTION", 
            request.getProjectId(), request.getUserId(), request.getAmount());
    }
}
```

### Dans les Contrôleurs

```java
@RestController
@RequestMapping("/api/v1/contributions")
public class ContributionController {
    
    @PostMapping
    public ResponseEntity<ContributionResponseDTO> create(@RequestBody ContributionRequestDTO request) {
        // AOP PerformanceLoggingAspect log automatiquement
        return ResponseEntity.ok(service.createContribution(request));
    }
}
```

### Avec l'annotation @RequiresSecurityCheck

```java
@Service
@Slf4j
public class UtilisateurServiceImpl implements IUtilisateurService {
    
    @RequiresSecurityCheck("Suppression d'utilisateur")
    @Override
    public void deleteUser(Long userId) {
        // SecurityLoggingAspect log automatiquement :
        // SENSITIVE_OPERATION_START, SENSITIVE_OPERATION_SUCCESS/FAILED
        userRepository.deleteById(userId);
    }
}
```

---

## 7. Configuration dans application.properties

Niveaux de log par package :

```properties
# Application
logging.level.com.example.project=DEBUG

# Services
logging.level.com.example.project.service=DEBUG

# Contrôleurs
logging.level.com.example.project.controller=INFO

# Sécurité
logging.level.com.example.project.security=INFO

# Framework Spring
logging.level.org.springframework=INFO
logging.level.org.springframework.security=INFO
logging.level.org.springframework.web=INFO

# Libraries externes
logging.level.org.hibernate=INFO
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.springframework.data.jpa=INFO
```

---

## 8. Monitoring des Logs en Production

### Via Elasticsearch/Kibana (recommandé)

1. Configurer Logback pour envoyer vers Logstash
2. Logstash → Elasticsearch → Kibana pour visualisation
3. Créer des tableaux de bord pour :
   - Erreurs en temps réel (error.log)
   - Transactions de paiement (payment.log)
   - Tentatives d'accès (security.log)
   - Performance des requêtes (application.log)

### Via Splunk

Indexes :
- `main_app` - Logs applicatifs
- `main_security` - Logs de sécurité
- `main_payment` - Logs de paiement
- `main_database` - Logs de base de données

### Alertes recommandées

```
alert: errors > 10 en 5 minutes
alert: slow queries > threshold pendant 10 minutes
alert: authentication failures > 5 en 1 minute
alert: payment failures > 3 en 5 minutes
alert: database operations > 2s en 5 minutes
```

---

## 9. Troubleshooting

### Les logs ne s'affichent pas

```bash
# Vérifier le profil Spring
java -Dspring.profiles.active=dev -jar app.jar

# Vérifier les permissions du répertoire logs/
ls -la logs/

# Vérifier le niveau de log dans application.properties
logging.level.com.example.project=DEBUG
```

### Les logs sont trop verbeux

```properties
# Réduire la verbosité en production
logging.level.com.example.project=INFO
logging.level.org.springframework=WARN
```

### Fichiers logs trop volumineux

Les fichiers sont automatiquement archivés tous les 10MB ou quotidiennement.
Vérifier la politique de conservation dans `logback-spring.xml` :
- `<maxHistory>30</maxHistory>` - 30 jours
- `<totalSizeCap>1GB</totalSizeCap>` - 1GB maximum

---

## 10. Métriques de Performance

### Services
- **Objectif** : < 500ms
- **Avertissement** : > 500ms

### Requêtes HTTP
- **Objectif** : < 1000ms
- **Avertissement** : > 1000ms

### Requêtes BD
- **Objectif** : < 100ms
- **Avertissement** : > 100ms

### Paiements (Stripe)
- **Objectif** : < 2000ms
- **Alerte** : Failures > 3 en 5 minutes

---

## 11. Exemple Complet - Flux de Contribution

```
1. Requête HTTP POST /api/v1/contributions
   → HttpLoggingInterceptor capture la requête

2. ContributionController.create() activé
   → PerformanceLoggingAspect start (DEBUG)

3. ContributionService.createContribution() activé
   → PerformanceLoggingAspect start (DEBUG)
   → LoggingUtil.logBusinessEvent() appelé

4. PaymentService.processPayment() activé
   → PerformanceLoggingAspect start (DEBUG)
   → StripePaymentService.createIntent() activé
   → DatabaseLoggingAspect capture save (DEBUG)
   → LoggingUtil.logPaymentEvent() appelé

5. Succès
   → PerformanceLoggingAspect end (DEBUG/WARN si lent)
   → HttpLoggingInterceptor capture réponse

Logs générés dans:
- application.log - Tous les logs
- service.log - Métier
- payment.log - Paiement
- error.log - Erreurs (si problème)
```

---

## Fichiers Impliqués

- **logback-spring.xml** - Configuration
- **LoggingUtil.java** - Méthodes utilitaires
- **HttpLoggingInterceptor.java** - Capture HTTP
- **PerformanceLoggingAspect.java** - Performance AOP
- **SecurityLoggingAspect.java** - Sécurité AOP
- **DatabaseLoggingAspect.java** - Base de données AOP
- **GlobalExceptionHandler.java** - Gestion centralised des erreurs
- **WebMvcConfig.java** - Enregistrement interceptor
- **RequiresSecurityCheck.java** - Annotation pour opérations sensibles
