# Rapport d'Analyse: Connexion Frontend-Backend
**Date:** 25 mars 2026  
**Version du rapport:** 1.0

---

## 🎯 Synthèse Exécutive

Le projet frontend **est correctement connecté** au backend. Les 10 services métier utilisent le client API axios. Cependant, **2 incohérences critiques** ont été identifiées dans la configuration des variables d'environnement qui pourraient causer des problèmes de communication.

---

## ✅ Résultats Positifs

### 1. Services Frontend Connectés (10/10)
Tous les services utilisent le client API axios configuré:

| Service | Endpoint Backend | Status |
|---------|-----------------|--------|
| **authService** | `/api/v1/auth` | ✅ Connecté |
| **projectService** | `/api/v1/projets` | ✅ Connecté |
| **paymentService** | `/api/v1/stripe` | ✅ Connecté |
| **kycService** | `/api/v1/kyc-documents` | ✅ Connecté |
| **userService** | `/api/v1/utilisateurs` | ✅ Connecté |
| **contributionService** | `/api/v1/contributions` | ✅ Connecté |
| **walletService** | `/api/v1/wallet` | ✅ Connecté |
| **messageService** | `/api/v1/messages` | ✅ Connecté |
| **notificationService** | `/api/v1/notifications` | ✅ Connecté |
| **loanService** | `/api/v1/loans` | ✅ Connecté |

### 2. Contrôleurs Backend Présents (10/10)
Tous les contrôleurs REST correspondants existent:

- `AuthController` → `/api/v1/auth`
- `ProjetController` → `/api/v1/projets`
- `StripePaymentController` → `/api/v1/stripe`
- `KycDocumentController` → `/api/v1/kyc-documents`
- `UtilisateurController` → `/api/v1/utilisateurs`
- `ContributionController` → `/api/v1/contributions`
- `WalletController` → `/api/v1/wallets`
- `MessageController` → `/api/v1/messages`
- `NotificationController` → `/api/v1/notifications`
- `LoanController` → `/api/v1/loans`
- `TransactionController` → `/api/v1/transactions`
- `RewardController` → `/api/v1/rewards`
- `RecommendationController` → `/api/v1/recommendations`

### 3. Intercepteurs de Sécurité
Le client API inclut:
- ✅ Intercepteur de requête: attache le JWT token depuis localStorage
- ✅ Intercepteur de réponse: gère les erreurs 401 (redirection vers login)

---

## ⚠️ Problèmes Identifiés

### CRITIQUE - Incohérence #1: Variables d'environnement multiples

**Fichier:** [crowdfunding-frontend/.env]

```env
VITE_API_URL=/api/v1                             # Chemin relatif
VITE_API_BASE_URL=http://localhost:8080          # URL complète
```

**Fichier:** [crowdfunding-frontend/src/services/api.js]

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',  // ❌ Utilise VITE_API_URL
});
```

**Impact:** 
- `api.js` lit `VITE_API_URL` qui vaut `/api/v1` (chemin relatif)
- Premier appel API sera vers `http://localhost:3000/api/v1` (frontend)
- Ce n'est pas l'URL du backend!

**Résultat lors de requête:** 
```
GET http://localhost:3000/api/v1/auth/login  ❌ (FAUX - port du frontend)
GET http://localhost:8080/api/v1/auth/login  ✅ (CORRECT - port du backend)
```

---

### CRITIQUE - Incohérence #2: Deux méthodes de configuration

**Fichier:** [crowdfunding-frontend/src/utils/constants.js]

```javascript
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
```

**Problème:**
- `constants.js` cherche `REACT_APP_API_BASE_URL` (convention React Create App)
- Le projet utilise Vite, qui utilise `VITE_` comme préfixe
- Cette constante n'est **jamais utilisée** dans le code
- Crée de la confusion et une source potentielle d'erreur future

---

### PROBLEME - Incohérence #3: URL de walletService

**Fichier:** [crowdfunding-frontend/src/services/walletService.js]

```javascript
export const walletService = {
  getWallet: (userId) => api.get(`/wallet/utilisateur/${userId}`),  // ❌ minuscule
};
```

**Fichier:** Backend controller

```java
@RequestMapping("/api/v1/wallets")  // ✅ pluriel
```

**Impact:** Les appels seront dirigés vers `/wallet/*` au lieu de `/wallets/*`

---

## 📋 Recommandations

### Priorité 1: CORRIGER IMMÉDIATEMENT

1. **Corriger le client API** pour utiliser la bonne URL du backend:
   ```javascript
   // crowdfunding-frontend/src/services/api.js
   baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
   ```

2. **Accorder le fichier .env**:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```

3. **Corriger walletService**:
   ```javascript
   export const walletService = {
     getWallet: (userId) => api.get(`/wallets/utilisateur/${userId}`),  // ✅ pluriel
   };
   ```

### Priorité 2: NETTOYER

1. **Supprimer la constante inutilisée** `API_BASE_URL` depuis `constants.js` ou l'utiliser partout pour la cohérence.

2. **Supprimer les fichiers .env dupliqués** (.env.example, .env.local) et ne garder qu'un seul .env.

---

## 🔍 Architecture de Communication

```
┌─────────────────────────────────────┐
│  Frontend (React + Vite)            │
│  Port: 3000                         │
│  ├─ 10 Services Métier              │
│  └─ Client API (axios)              │
│     └─ baseURL: ${VITE_API_BASE_URL}│
└─────────┬───────────────────────────┘
          │
    HTTP Requests (JWT Headers)
          │
          ▼
┌─────────────────────────────────────┐
│  Backend (Spring Boot)              │
│  Port: 8080                         │
│  ├─ /api/v1/auth                    │
│  ├─ /api/v1/projets                 │
│  ├─ /api/v1/utilisateurs            │
│  ├─ /api/v1/contributions           │
│  ├─ /api/v1/wallets                 │
│  ├─ /api/v1/loans                   │
│  ├─ /api/v1/messages                │
│  ├─ /api/v1/notifications           │
│  ├─ /api/v1/stripe                  │
│  └─ /api/v1/kyc-documents           │
└─────────────────────────────────────┘
```

---

## ✨ Conclusion

**Verdict Final:** 🟡 **FONCTIONNEL MAIS À CORRIGER**

- ✅ Tous les services sont présents et configurés
- ✅ Les contrôleurs backend existent
- ⚠️ **Les chemins API pourraient ne pas fonctionner correctement** en raison de la mauvaise configuration de `baseURL`
- ⚠️ **Les appels au wallet échoueront** (endpoint name mismatch)

**Action urgente:** Corriger les 3 fichiers mentionnés en Priorité 1 pour garantir la communication frontend-backend.

---

## Fichiers à Corriger

1. ❌ [crowdfunding-frontend/src/services/api.js](crowdfunding-frontend/src/services/api.js) - Ligne 4
2. ❌ [crowdfunding-frontend/.env](crowdfunding-frontend/.env) - Ligne 1
3. ❌ [crowdfunding-frontend/src/services/walletService.js](crowdfunding-frontend/src/services/walletService.js) - Ligne 3
4. 🧹 [crowdfunding-frontend/src/utils/constants.js](crowdfunding-frontend/src/utils/constants.js) - À nettoyer

