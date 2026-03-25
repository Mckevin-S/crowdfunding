# 📋 RAPPORT D'AUDIT: Communication Backend-Frontend
**Date:** 25 Mars 2026  
**Projet:** Crowdfunding Platform  
**Statut:** ⚠️ PLUSIEURS INCOMPATIBILITÉS DÉTECTÉES

---

## 1️⃣ ENDPOINTS BACKEND DOCUMENTÉS

### 🔐 Authentification (`/api/v1/auth`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Inscription utilisateur | ❌ Non |
| POST | `/api/v1/auth/login` | Connexion utilisateur | ❌ Non |
| POST | `/api/v1/auth/google` | Connexion Google | ❌ Non |
| POST | `/api/v1/auth/forgot-password` | Mot de passe oublié | ❌ Non |
| POST | `/api/v1/auth/reset-password` | Réinitialisation MDP | ❌ Non |
| POST | `/api/v1/auth/change-password` | Changement MDP | ✅ Oui |
| POST | `/api/v1/auth/logout` | Déconnexion | ✅ Oui |

### 📁 Projets (`/api/v1/projets`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/v1/projets` | Lister tous les projets | ❌ Non |
| GET | `/api/v1/projets/{id}` | Détail d'un projet | ❌ Non |
| GET | `/api/v1/projets/active` | Projets actifs | ❌ Non |
| GET | `/api/v1/projets/porteur/{porteurId}` | Projets d'un porteur | ❌ Non |
| POST | `/api/v1/projets` | Créer un projet | ✅ Oui |
| PUT | `/api/v1/projets/{id}` | Modifier un projet | ✅ Oui |
| DELETE | `/api/v1/projets/{id}` | Supprimer un projet | ✅ Oui |
| PATCH | `/api/v1/projets/{id}/statut` | Change statut (Admin) | ✅ Admin |

### 👥 Utilisateurs (`/api/v1/utilisateurs`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/v1/utilisateurs/{id}` | Profil utilisateur | ❌ Non |
| PUT | `/api/v1/utilisateurs/{id}` | Modifier profil | ✅ Oui |
| GET | `/api/v1/utilisateurs` | Lister (Admin) | ✅ Admin |
| PUT | `/api/v1/utilisateurs/{id}/ban` | Bannir utilisateur | ✅ Admin |
| PUT | `/api/v1/utilisateurs/{id}/activate` | Réactiver utilisateur | ✅ Admin |

### 💳 Contributions (`/api/v1/contributions`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/v1/contributions/{id}` | Détail contribution | ❌ Non |
| GET | `/api/v1/contributions` | Lister toutes | ✅ Oui |
| GET | `/api/v1/contributions/projet/{projetId}` | Par projet | ❌ Non |
| GET | `/api/v1/contributions/utilisateur/{utilisateurId}` | Par utilisateur | ❌ Non |
| GET | `/api/v1/contributions/projet/{projetId}/total` | Total récolté | ❌ Non |
| POST | `/api/v1/contributions` | Créer manuelle | ✅ Oui |
| POST | `/api/v1/contributions/initiate` | Initier paiement | ✅ Oui |
| POST | `/api/v1/contributions/{id}/confirm` | Confirmer (SIM) | ✅ Oui |

### 💬 Messages (`/api/v1/messages`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/v1/messages` | Envoyer message | ✅ Oui |
| GET | `/api/v1/messages/conversation` | Conversation (params) | ✅ Oui |
| GET | `/api/v1/messages/recent/{userId}` | Conversations récentes | ✅ Oui |
| PATCH | `/api/v1/messages/{id}/read` | Marquer lu (params) | ✅ Oui |
| GET | `/api/v1/messages/unread/{userId}` | Compteur non-lus | ✅ Oui |

### 📄 Documents KYC (`/api/v1/kyc-documents`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/v1/kyc-documents` | Soumettre document | ✅ Oui |
| GET | `/api/v1/kyc-documents/{id}` | Détail (Admin) | ✅ Admin |
| GET | `/api/v1/kyc-documents/utilisateur/{utilisateurId}` | Documents utilisateur | ✅ Oui (*) |
| PATCH | `/api/v1/kyc-documents/{id}/status` | Valider/Rejeter | ✅ Admin |

### 💰 Portefeuilles (`/api/v1/wallets`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/v1/wallets/utilisateur/{utilisateurId}` | Solde portefeuille | ✅ Oui (*) |
| POST | `/api/v1/wallets/utilisateur/{utilisateurId}/add-funds` | Approvisionner | ✅ Oui (*) |
| POST | `/api/v1/wallets/utilisateur/{utilisateurId}/withdraw` | Retrait | ✅ Oui (*) |

### 🎁 Récompenses (`/api/v1/rewards`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/v1/rewards/{id}` | Détail récompense | ❌ Non |
| GET | `/api/v1/rewards/projet/{projetId}` | Récompenses projet | ❌ Non |
| POST | `/api/v1/rewards` | Créer récompense | ✅ Oui |
| PUT | `/api/v1/rewards/{id}` | Modifier | ✅ Oui |
| DELETE | `/api/v1/rewards/{id}` | Supprimer | ✅ Oui |
| POST | `/api/v1/rewards/{rewardId}/claim/{contributionId}` | Réclamer | ✅ Oui |
| PATCH | `/api/v1/rewards/{rewardId}/delivery` | Livraison | ✅ Oui |

### 📬 Notifications (`/api/v1/notifications`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/v1/notifications` | Créer (Admin) | ✅ Admin |
| GET | `/api/v1/notifications/utilisateur/{utilisateurId}` | Notifications utlisateur | ✅ Oui (*) |
| PATCH | `/api/v1/notifications/{id}/read` | Marquer lu | ✅ Oui |

### 💳 Paiements Stripe (`/api/v1/stripe`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/v1/stripe/create-intent` | Créer intention paiement | ✅ Oui |
| POST | `/api/v1/stripe/webhook` | Webhook Stripe | ❌ Non |

### 📁 Fichiers (`/api/v1/files`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/v1/files/upload/image` | Upload image projet | ✅ Oui (Porteur/Admin) |

### Autres Contrôleurs
| Route | Endpoints |
|-------|-----------|
| `/api/v1/transactions` | GET /utilisateur/{id}, GET /{id} |
| `/api/v1/etapes` | POST, GET /{id}, GET /projet/{id}, PUT /{id}, DELETE /{id} |
| `/api/v1/loans` | POST /projects/{id}/initialize, generate-schedule, GET /schedule, PUT /schedule/{id}/pay |
| `/api/v1/equity` | POST /projects/{id}/initialize, GET /projects/{id}/share-price, calculate-shares, distribute |
| `/api/v1/analyses-ia` | POST, GET /{id}, GET /projet/{id} |
| `/api/v1/recommendations` | POST, GET /utilisateur/{id}, POST /utilisateur/{id}/generate |

---

## 2️⃣ SERVICES FRONTEND DOCUMENTÉS

### Services Disponibles
```
✅ authService.js
✅ projectService.js
✅ contributionService.js
✅ messageService.js
✅ kycService.js
✅ uploadService.js
✅ fileService.js
✅ userService.js
✅ paymentService.js
❌ MANQUANTS: walletService, rewardService, notificationService, etapesService
```

### URLs Appelées par Frontend
```js
// authService.js
POST   /auth/login
POST   /auth/register
POST   /auth/logout
GET    /auth/me                    ⚠️ PAS IMPLÉMENTÉ
POST   /auth/google

// projectService.js
GET    /projets
GET    /projets/active
GET    /projets/{id}
POST   /projets
GET    /projets/porteur/{porteurId}
PUT    /projets/{id}
DELETE /projets/{id}

// contributionService.js
POST   /contributions/initiate
POST   /contributions/{id}/confirm
GET    /contributions/projet/{projectId}/total
GET    /contributions/utilisateur/{userId}

// messageService.js
POST   /messages
GET    /messages/conversation
GET    /messages/recent/{userId}
PATCH  /messages/{messageId}/read
GET    /messages/unread/{userId}

// kycService.js
POST   /kyc                        ⚠️ MISMATCH avec /kyc-documents
GET    /kyc/status                 ⚠️ N'EXISTE PAS

// uploadService.js
POST   /files/upload/image         ✅ CORRECT

// fileService.js
POST   /files/upload               ⚠️ DEVRAIT ÊTRE /files/upload/image

// userService.js
GET    /users/profile              ⚠️ DEVRAIT ÊTRE /utilisateurs/{id}
PUT    /users/profile              ⚠️ DEVRAIT ÊTRE /utilisateurs/{id}

// paymentService.js
POST   /payments                   ⚠️ N'EXISTE PAS (Devrait être /stripe/create-intent)
```

---

## 3️⃣ CONFIGURATION RÉSEAU

### Vite Proxy (vite.config.js)
```js
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
  },
}
```
✅ Correctement configuré pour rediriger `/api` vers `http://localhost:8080`

### Variable d'Environnement Frontend
```env
# .env
VITE_API_URL=/api/v1              ✅ CORRECT

# .env.example  
VITE_API_BASE_URL=http://localhost:8080/api  ⚠️ CONFLIT

# .env.local
VITE_API_BASE_URL=http://localhost:8080/api  ⚠️ CONFLIT
```

**⚠️ PROBLÈME:** Mismatch entre les noms et valeurs de variables:
- `.env` utilise `VITE_API_URL=/api/v1`
- `.env.example` et `.env.local` utilisent `VITE_API_BASE_URL=http://localhost:8080/api`
- **api.js utilise:** `import.meta.env.VITE_API_URL || '/api'` (SANS /v1)

### Configuration API Frontend (api.js)
```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajoute le token JWT automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gère les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```
✅ Gestion correcte du JWT  
✅ Redirection login en cas d'erreur 401

---

## 4️⃣ AUTHENTIFICATION ET SÉCURITÉ

### Headers
```js
// ✅ Headers correctement configurés dans api.js
Authorization: `Bearer ${token}`
Content-Type: application/json
```

### CORS (Backend - CorsConfig.java)
```java
allowedOrigins: [
  "http://localhost:3000",
  "http://localhost:4200",
  "http://localhost:5173"  // ✅ Frontend Vite
]

allowedMethods: [GET, POST, PUT, PATCH, DELETE, OPTIONS]

allowedHeaders: [
  Authorization,
  Content-Type,
  X-Requested-With,
  Accept,
  Origin,
  Access-Control-Request-Method,
  Access-Control-Request-Headers
]

credentials: true                // ✅ Autorise les cookies
```
✅ CORS correctement configuré

### Security Configuration (SecurityConfig.java)
```java
Public endpoints:
  - /api/v1/auth/register
  - /api/v1/auth/login
  - /api/v1/auth/forgot-password
  - /api/v1/auth/reset-password
  - /api/v1/auth/google
  - GET /api/v1/projets/**
  - /api/v1/stripe/webhook
  - /api/v1/cinetpay/notify
  - /files/images/**
  - Swagger/API Docs

Protected endpoints:
  - /api/v1/auth/change-password
  - /api/v1/auth/logout
  - All others: REQUIRED authenticated JWT
```

---

## 5️⃣ INCOMPATIBILITÉS ET PROBLÈMES DÉTECTÉS

### 🔴 CRITIQUE - Routes Non Existantes

#### 1. **Endpoint `/auth/me` manquant**
- **Frontend appelle:** `authService.getCurrentUser()` → `GET /auth/me`
- **Backend a:** Rien
- **Fichier:** [authService.js](crowdfunding-frontend/src/services/authService.js#L7)
- **Impact:** Impossible de récupérer l'utilisateur courant
- **Solution:** Implémenter endpoint dans AuthController ou utiliser `/utilisateurs/{id}`

#### 2. **KYC Routes mal mappées**
- **Frontend (service):** `POST /kyc`, `GET /kyc/status`
- **Frontend (composant):** `POST /kyc-documents` 
- **Backend:** `POST /api/v1/kyc-documents`, `GET /api/v1/kyc-documents/utilisateur/{id}`
- **Fichiers:** 
  - [kycService.js](crowdfunding-frontend/src/services/kycService.js#L4-L5)
  - [KYCVerification.jsx](crowdfunding-frontend/src/pages/KYC/KYCVerification.jsx#L40)
- **Impact:** KYC cassé
- **Solution:** Standardiser sur `/api/v1/kyc-documents`

#### 3. **User Profile Routes mal mappées**
- **Frontend appelle:** `GET /users/profile`, `PUT /users/profile`
- **Backend a:** `GET /api/v1/utilisateurs/{id}`, `PUT /api/v1/utilisateurs/{id}`
- **Fichier:** [userService.js](crowdfunding-frontend/src/services/userService.js#L4-L5)
- **Impact:** Profil utilisateur cassé
- **Solution:** Redéfinir les routes ou créer alias dans le frontend

#### 4. **Payment Service Route Incorrecte**
- **Frontend appelle:** `POST /payments`
- **Backend a:** `POST /api/v1/stripe/create-intent`
- **Fichier:** [paymentService.js](crowdfunding-frontend/src/services/paymentService.js#L4)
- **Impact:** Paiements cassés
- **Solution:** Modifier ou créer endpoint Stripe correct

#### 5. **Files Upload Routes Incohérentes**
- **fileService.js appelle:** `POST /files/upload`
- **uploadService.js appelle:** `POST /files/upload/image` ✅
- **Backend a:** `POST /api/v1/files/upload/image`
- **Fichiers:** 
  - [fileService.js](crowdfunding-frontend/src/services/fileService.js#L7)
  - [uploadService.js](crowdfunding-frontend/src/services/uploadService.js#L8)
- **Impact:** Uploads via fileService cassés
- **Solution:** Supprimer fileService ou rediriger vers uploadService

### 🟡 IMPORTANT - Endpoints Manquants du Frontend

Les contrôleurs backend suivants n'ont **PAS** de services frontend:

| Contrôleur Backend | Routes | Service Frontend |
|-------------------|--------|-----------------|
| WalletController | 3 endpoints | ❌ walletService.js |
| RewardController | 7 endpoints | ❌ rewardService.js |
| NotificationController | 3 endpoints | ❌ notificationService.js |
| TransactionController | 2 endpoints | ❌ transactionService.js |
| EtapesController | 5 endpoints | ❌ etapesService.js |
| LoanController | 4 endpoints | ❌ loanService.js |
| EquityController | 4 endpoints | ❌ equityService.js |
| AnalyseIAController | 3 endpoints | ❌ analyseService.js |
| RecommendationController | 3 endpoints | ❌ recommendationService.js |
| StripePaymentController | 2 endpoints | ⚠️ paymentService.js (incorrect) |

**Impact:** Ces fonctionnalités frontend ne peuvent pas accéder à leur backend

### 🟡 IMPORTANT - Incohérences de Configuration

#### 1. **Variables d'environnement en conflit**
- **.env:** `VITE_API_URL=/api/v1`
- **.env.example:** `VITE_API_BASE_URL=http://localhost:8080/api` (sans /v1!)
- **api.js utilise:** `VITE_API_URL || '/api'`

**Résultat:** 
- En dev avec .env: Appels à `/api/v1/...` ✅
- En prod potentiellement: `/api/...` sans /v1 ❌
- VITE_API_BASE_URL **jamais utilisé**

#### 2. **Base URL du proxy vs API version**
- **vite.config.js proxy:** `/api` → `http://localhost:8080`
- **Appels réels:** `/api/v1/...`
- **Résultat:** Correct car `/api/v1/...` est en-dessous de `/api`

---

## 6️⃣ MISMATCH DTOs-DONNÉES

### AuthResponse DTO
```java
// Backend envoie:
{
  token: "jwt_token",
  user: { id, email, prenom, nom, ... }
  // ou potentiellement toute la structure d'utilisateur
}
```
```js
// Frontend attend (authSlice.js):
action.payload = {
  token,
  user, // stocké correctement
  ... // autres champs
}
```
✅ Semble compatible

### UtilisateurResponseDTO
```java
{
  id, email, prenom, nom, telephone, bio, address, role, statut
}
```
✅ Structure claire

**MAIS:** Frontend stocke dans state avec `/utilisateurs/{id}` qui retourne ce DTO, mais userSlice n'a que `profile` seul, pas une structure complète

---

## 7️⃣ RÉSUMÉ DES PROBLÈMES

| Sévérité | Problème | Fichiers affectés | Ligne |
|----------|----------|-------------------|-------|
| 🔴 CRITIQUE | `/auth/me` n'existe pas | authService.js | 7 |
| 🔴 CRITIQUE | `/kyc` vs `/kyc-documents` mismatch | kycService.js, KYCVerification.jsx | 4-5, 40 |
| 🔴 CRITIQUE | `/users/profile` n'existe pas | userService.js | 4-5 |
| 🔴 CRITIQUE | `/payments` n'existe pas | paymentService.js | 4 |
| 🔴 CRITIQUE | `/files/upload` vs `/files/upload/image` | fileService.js vs uploadService.js | 7 vs 8 |
| 🟡 IMPORTANT | Wallets non accessible | ❌ walletService.js | N/A |
| 🟡 IMPORTANT | Rewards non accessible | ❌ rewardService.js | N/A |
| 🟡 IMPORTANT | Notifications non accessible | ❌ notificationService.js | N/A |
| 🟡 IMPORTANT | 6 autres contrôleurs sans service | ❌ Various | N/A |
| 🟡 IMPORTANT | Config .env conflit | .env, .env.example, .env.local | N/A |
| 🟠 MOYEN | `/auth/me` appelé au démarrage | useAuth hook | N/A |

---

## 8️⃣ RECOMMANDATIONS PRIORITAIRES

### Phase 1: CRITIQUE (Corriger immédiatement)

```bash
1. Créer endpoint /api/v1/auth/me dans AuthController
   Location: crowdfunding-backend/src/main/java/com/example/project/controller/AuthController.java
   
2. Corriger kycService.js:
   - Changer POST /kyc → POST /kyc-documents
   - Supprimer GET /kyc/status (non utilisé)
   Location: crowdfunding-frontend/src/services/kycService.js
   
3. Corriger userService.js:
   - Changer GET/PUT /users/profile → /utilisateurs/{id}
   - Adapter pour passer l'ID utilisateur
   Location: crowdfunding-frontend/src/services/userService.js
   
4. Corriger paymentService.js:
   - Changer POST /payments → POST /stripe/create-intent
   Location: crowdfunding-frontend/src/services/paymentService.js
   
5. Corriger fileService.js:
   - Changer POST /files/upload → POST /files/upload/image
   Location: crowdfunding-frontend/src/services/fileService.js
   
6. Harmoniser variables .env:
   - Utiliser VITE_API_URL partout
   - Éviter VITE_API_BASE_URL
   Location: .env, .env.example, .env.local
```

### Phase 2: IMPORTANT (Créer services manquants)

```bash
1. Créer walletService.js
2. Créer rewardService.js
3. Créer notificationService.js
4. Créer transactionService.js
5. Créer etapesService.js
6. Créer loanService.js
7. Créer equityService.js
8. Créer analyseService.js
9. Créer recommendationService.js

Locations: crowdfunding-frontend/src/services/{serviceName}.js
```

### Phase 3: MOYEN (Optimisations)

```bash
1. Ajouter tests d'intégration pour vérifier l'alignement
2. Documenter les DTOs frontend vs backend
3. Mettre en place une convention de naming
4. Créer API documentation centralisée
5. Implémenter des stubs API pour le développement
```

---

## 9️⃣ CHECKLIST DE VÉRIFICATION

### Backend Checks
- [x] 17 contrôleurs implémentés
- [x] CORS configuré correctement
- [x] JWT authentication en place
- [x] Swagger documenté
- [ ] `/auth/me` endpoint manquant
- [ ] Tous les DTOs bien structurés
- [x] `/api/v1` versioning cohérent

### Frontend Checks
- [x] 10 services implémentés
- [x] JWT stocké et utilisé
- [x] Proxy Vite configuré
- [ ] 5 routes critiques incorrectes
- [ ] 9 services manquants
- [ ] Variables .env en conflit
- [ ] useAuth hook ne peut pas récupérer l'utilisateur

---

## 🔟 GRAPHIQUE DE MAPPING

```
Backend Endpoints vs Frontend Services

CORRECT ✅
│
├─ Auth (7 endpoints) ──→ authService.js (quasi-complet)
│                          └─ ❌ /auth/me missing
│
├─ Projects (8 endpoints) ──→ projectService.js ✅
│
├─ Contributions (8 endpoints) ──→ contributionService.js ✅
│
├─ Messages (5 endpoints) ──→ messageService.js ✅
│
└─ Files (1 endpoint)
   ├─ uploadService.js ✅
   └─ fileService.js ❌

INCOMPLET ⚠️
│
├─ KYC-Documents (4 endpoints) ──→ kycService.js ❌
│   (service utilise /kyc vs backend /kyc-documents)
│
├─ Users (5 endpoints) ──→ userService.js ❌
│   (service utilise /users/profile vs backend /utilisateurs/{id})
│
├─ Payments (Stripe) (2 endpoints) ──→ paymentService.js ❌
│   (service utilise /payments vs backend /stripe/create-intent)
│
├─ Wallets (3 endpoints) ──→ ❌ AUCUN SERVICE
│
├─ Rewards (7 endpoints) ──→ ❌ AUCUN SERVICE
│
├─ Notifications (3 endpoints) ──→ ❌ AUCUN SERVICE
│
├─ Transactions (2 endpoints) ──→ ❌ AUCUN SERVICE
│
├─ Etapes (5 endpoints) ──→ ❌ AUCUN SERVICE
│
├─ Loans (4 endpoints) ──→ ❌ AUCUN SERVICE
│
├─ Equity (4 endpoints) ──→ ❌ AUCUN SERVICE
│
├─ AI Analysis (3 endpoints) ──→ ❌ AUCUN SERVICE
│
└─ Recommendations (3 endpoints) ──→ ❌ AUCUN SERVICE
```

---

## 📊 STATISTIQUES

- **Total Endpoints Backend:** 72+
- **Total Services Frontend:** 10
- **Services Corrects:** 4 (auth, projects, contributions, messages)
- **Services Incorrects:** 5 (kyc, user, payment, file)
- **Services Manquants:** 9
- **Taux de Couverture:** ~72%
- **Routes Correctes:** ~67%

---

**Rapport généré le: 25 Mars 2026**  
**Auteur: Audit Automatisé**  
**Version: 1.0**
