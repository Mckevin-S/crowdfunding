# 🔧 GUIDE DE CORRECTION - Fixes Recommandées

## PRIORITÉ 1 - FIXES CRITIQUES

---

## 1️⃣ Créer Endpoint `/auth/me`

**Fichier:** `crowdfunding-backend/src/main/java/com/example/project/controller/AuthController.java`

**À AJOUTER après la méthode `logout()`:**

```java
/**
 * Retrieves the authenticated user's information.
 *
 * @return the current user's profile data.
 */
@GetMapping("/me")
@Operation(summary = "Obtenir l'utilisateur courant", description = "Retourne les informations de l'utilisateur authentifié.")
@ApiResponse(responseCode = "200", description = "Utilisateur retourné")
@ApiResponse(responseCode = "401", description = "Non authentifié")
@SecurityRequirement(name = "bearerAuth")
public ResponseEntity<UtilisateurResponseDTO> getCurrentUser() {
    log.info("CURRENT_USER: Récupération de l'utilisateur authentifié");
    return ResponseEntity.ok(authService.getCurrentUser());
}
```

**Fichier:** `crowdfunding-backend/src/main/java/com/example/project/service/interfaces/AuthService.java`

**À AJOUTER:**

```java
/**
 * Retrieves the currently authenticated user's profile.
 * @return the authenticated user's data
 */
UtilisateurResponseDTO getCurrentUser();
```

**Fichier:** `crowdfunding-backend/src/main/java/com/example/project/service/impl/AuthServiceImpl.java`

**À AJOUTER:**

```java
@Override
public UtilisateurResponseDTO getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String email = authentication.getName();
    Utilisateur user = utilisateurRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", email));
    return utilisateurMapper.toResponseDTO(user);
}
```

---

## 2️⃣ Corriger KYC Routes

**Fichier:** `crowdfunding-frontend/src/services/kycService.js`

**AVANT:**
```javascript
import api from './api';

export const kycService = {
  submitKyc: (kycData) => api.post('/kyc', kycData),
  getKycStatus: () => api.get('/kyc/status'),
};
```

**APRÈS:**
```javascript
import api from './api';

export const kycService = {
  uploadDocument: (kycData) => api.post('/kyc-documents', kycData),
  
  getDocumentsByUser: (userId) => api.get(`/kyc-documents/utilisateur/${userId}`),
  
  getDocumentStatus: (documentId) => api.get(`/kyc-documents/${documentId}`),
  
  updateDocumentStatus: (documentId, status, reason) => 
    api.patch(`/kyc-documents/${documentId}/status`, null, {
      params: { status, reason }
    }),
};
```

---

## 3️⃣ Corriger User Profile Routes

**Fichier:** `crowdfunding-frontend/src/services/userService.js`

**AVANT:**
```javascript
import api from './api';

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profile) => api.put('/users/profile', profile),
};
```

**APRÈS:**
```javascript
import api from './api';

export const userService = {
  getProfile: (userId) => api.get(`/utilisateurs/${userId}`),
  
  updateProfile: (userId, profileData) => 
    api.put(`/utilisateurs/${userId}`, profileData),
  
  getAllUsers: () => api.get('/utilisateurs'), // Admin only
  
  banUser: (userId) => api.put(`/utilisateurs/${userId}/ban`),
  
  activateUser: (userId) => api.put(`/utilisateurs/${userId}/activate`),
};
```

---

## 4️⃣ Corriger Payment Routes

**Fichier:** `crowdfunding-frontend/src/services/paymentService.js`

**AVANT:**
```javascript
import api from './api';

export const paymentService = {
  processPayment: (paymentData) => api.post('/payments', paymentData),
};
```

**APRÈS:**
```javascript
import api from './api';

export const paymentService = {
  createPaymentIntent: (paymentData) => 
    api.post('/stripe/create-intent', paymentData),
  
  handleWebhook: (webhookData) => 
    api.post('/stripe/webhook', webhookData),
};
```

---

## 5️⃣ Corriger File Upload Routes

**Fichier:** `crowdfunding-frontend/src/services/fileService.js`

**AVANT:**
```javascript
import api from './api';

export const fileService = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/upload', formData);
  },
};
```

**APRÈS (Option A - Supprimer ce fichier):**
```javascript
// ❌ SUPPRIMER ce fichier
// Utiliser uploadService.js à la place
```

**OU (Option B - Rediriger vers uploadService):**
```javascript
import uploadService from './uploadService';

export const fileService = uploadService;
```

---

## 6️⃣ Harmoniser Variables d'Environnement

**Fichier:** `crowdfunding-frontend/.env`

```env
# API Configuration
VITE_API_URL=/api/v1
VITE_API_TIMEOUT=30000

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

# App Configuration
VITE_APP_NAME=CrowdFund Platform
VITE_APP_URL=http://localhost:5173

# Features Flags
VITE_ENABLE_MOBILE_MONEY=true
VITE_ENABLE_AI_FEATURES=true

# File Upload
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp

# Google
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Fichier:** `crowdfunding-frontend/.env.example`

```env
# API Configuration
VITE_API_URL=/api/v1
VITE_API_TIMEOUT=30000

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

# App Configuration
VITE_APP_NAME=CrowdFund Platform
VITE_APP_URL=http://localhost:5173

# Features Flags
VITE_ENABLE_MOBILE_MONEY=true
VITE_ENABLE_AI_FEATURES=true

# File Upload
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp

# Google
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Fichier:** `crowdfunding-frontend/.env.local`

```env
# Utilisé en développement local
VITE_API_URL=/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_reelle
VITE_GOOGLE_CLIENT_ID=your-local-test-id.apps.googleusercontent.com
```

---

---

## PRIORITÉ 2 - CRÉER SERVICES MANQUANTS

---

## 7️⃣ Créer `walletService.js`

**Fichier:** `crowdfunding-frontend/src/services/walletService.js`

```javascript
import api from './api';

export const walletService = {
  // Obtenir le portefeuille d'un utilisateur
  getWalletByUserId: (userId) => 
    api.get(`/wallets/utilisateur/${userId}`),
  
  // Ajouter des fonds au portefeuille
  addFunds: (userId, amount) => 
    api.post(`/wallets/utilisateur/${userId}/add-funds`, null, {
      params: { amount }
    }),
  
  // Retirer des fonds du portefeuille
  withdrawFunds: (userId, amount) => 
    api.post(`/wallets/utilisateur/${userId}/withdraw`, null, {
      params: { amount }
    }),
};

export default walletService;
```

---

## 8️⃣ Créer `rewardService.js`

**Fichier:** `crowdfunding-frontend/src/services/rewardService.js`

```javascript
import api from './api';

export const rewardService = {
  // Créer une récompense
  createReward: (rewardData) => 
    api.post('/rewards', rewardData),
  
  // Obtenir une récompense
  getReward: (rewardId) => 
    api.get(`/rewards/${rewardId}`),
  
  // Obtenir les récompenses d'un projet
  getRewardsByProject: (projectId) => 
    api.get(`/rewards/projet/${projectId}`),
  
  // Mettre à jour une récompense
  updateReward: (rewardId, rewardData) => 
    api.put(`/rewards/${rewardId}`, rewardData),
  
  // Supprimer une récompense
  deleteReward: (rewardId) => 
    api.delete(`/rewards/${rewardId}`),
  
  // Réclamer une récompense
  claimReward: (rewardId, contributionId) => 
    api.post(`/rewards/${rewardId}/claim/${contributionId}`),
  
  // Mettre à jour le statut de livraison
  updateDeliveryStatus: (rewardId, status, trackingNumber) => 
    api.patch(`/rewards/${rewardId}/delivery`, null, {
      params: { status, trackingNumber }
    }),
};

export default rewardService;
```

---

## 9️⃣ Créer `notificationService.js`

**Fichier:** `crowdfunding-frontend/src/services/notificationService.js`

```javascript
import api from './api';

export const notificationService = {
  // Créer une notification (Admin only)
  createNotification: (notificationData) => 
    api.post('/notifications', notificationData),
  
  // Obtenir les notifications d'un utilisateur
  getNotificationsByUser: (userId) => 
    api.get(`/notifications/utilisateur/${userId}`),
  
  // Marquer une notification comme lue
  markAsRead: (notificationId) => 
    api.patch(`/notifications/${notificationId}/read`),
};

export default notificationService;
```

---

## 🔟 Créer `transactionService.js`

**Fichier:** `crowdfunding-frontend/src/services/transactionService.js`

```javascript
import api from './api';

export const transactionService = {
  // Obtenir les transactions d'un utilisateur
  getTransactionsByUser: (userId) => 
    api.get(`/transactions/utilisateur/${userId}`),
  
  // Obtenir une transaction
  getTransaction: (transactionId) => 
    api.get(`/transactions/${transactionId}`),
};

export default transactionService;
```

---

## 1️⃣1️⃣ Créer `etapesService.js`

**Fichier:** `crowdfunding-frontend/src/services/etapesService.js`

```javascript
import api from './api';

export const etapesService = {
  // Créer une étape
  createEtape: (etapeData) => 
    api.post('/etapes', etapeData),
  
  // Obtenir une étape
  getEtape: (etapeId) => 
    api.get(`/etapes/${etapeId}`),
  
  // Obtenir les étapes d'un projet
  getEtapesByProject: (projectId) => 
    api.get(`/etapes/projet/${projectId}`),
  
  // Mettre à jour une étape
  updateEtape: (etapeId, etapeData) => 
    api.put(`/etapes/${etapeId}`, etapeData),
  
  // Supprimer une étape
  deleteEtape: (etapeId) => 
    api.delete(`/etapes/${etapeId}`),
};

export default etapesService;
```

---

## 1️⃣2️⃣ Créer `loanService.js`

**Fichier:** `crowdfunding-frontend/src/services/loanService.js`

```javascript
import api from './api';

export const loanService = {
  // Initialiser un prêt pour un projet
  initializeLoan: (projectId, loanData) => 
    api.post(`/loans/projects/${projectId}/initialize`, loanData),
  
  // Générer un calendrier de remboursement
  generateRepaymentSchedule: (projectId, scheduleData) => 
    api.post(`/loans/projects/${projectId}/generate-schedule`, scheduleData),
  
  // Obtenir le calendrier de remboursement d'un projet
  getRepaymentSchedule: (projectId) => 
    api.get(`/loans/projects/${projectId}/schedule`),
  
  // Effectuer un paiement de remboursement
  paySchedule: (scheduleId, paymentData) => 
    api.put(`/loans/schedule/${scheduleId}/pay`, paymentData),
};

export default loanService;
```

---

## 1️⃣3️⃣ Créer `equityService.js`

**Fichier:** `crowdfunding-frontend/src/services/equityService.js`

```javascript
import api from './api';

export const equityService = {
  // Initialiser le partage d'actions pour un projet
  initializeEquity: (projectId, equityData) => 
    api.post(`/equity/projects/${projectId}/initialize`, equityData),
  
  // Obtenir le prix des actions
  getSharePrice: (projectId) => 
    api.get(`/equity/projects/${projectId}/share-price`),
  
  // Calculer les actions
  calculateShares: (projectId, calculateData) => 
    api.get(`/equity/projects/${projectId}/calculate-shares`, {
      params: calculateData
    }),
  
  // Distribuer les actions
  distributeShares: (projectId, distributionData) => 
    api.post(`/equity/projects/${projectId}/distribute`, distributionData),
};

export default equityService;
```

---

## 1️⃣4️⃣ Créer `analyseService.js`

**Fichier:** `crowdfunding-frontend/src/services/analyseService.js`

```javascript
import api from './api';

export const analyseService = {
  // Analyser un projet (IA)
  analyzeProject: (analysisData) => 
    api.post('/analyses-ia', analysisData),
  
  // Obtenir une analyse
  getAnalysis: (analysisId) => 
    api.get(`/analyses-ia/${analysisId}`),
  
  // Obtenir les analyses d'un projet
  getAnalysesByProject: (projectId) => 
    api.get(`/analyses-ia/projet/${projectId}`),
};

export default analyseService;
```

---

## 1️⃣5️⃣ Créer `recommendationService.js`

**Fichier:** `crowdfunding-frontend/src/services/recommendationService.js`

```javascript
import api from './api';

export const recommendationService = {
  // Créer une recommandation
  createRecommendation: (recommendationData) => 
    api.post('/recommendations', recommendationData),
  
  // Obtenir les recommandations d'un utilisateur
  getRecommendationsByUser: (userId) => 
    api.get(`/recommendations/utilisateur/${userId}`),
  
  // Générer automatiquement les recommandations pour un utilisateur
  generateRecommendations: (userId, generateData) => 
    api.post(`/recommendations/utilisateur/${userId}/generate`, generateData),
};

export default recommendationService;
```

---

## 📝 CHECKLIST DE TEST

Après avoir appliqué les corrections:

- [ ] **Auth Service**
  - [ ] `/auth/me` retourne l'utilisateur courant
  - [ ] Login fonctionne
  - [ ] Logout fonctionne

- [ ] **KYC Service**
  - [ ] Soumettre document KYC fonctionne
  - [ ] Récupérer documents utilisateur fonctionne
  
- [ ] **User Service**
  - [ ] Récupérer profil utilisateur fonctionne
  - [ ] Modifier profil fonctionne

- [ ] **Payment Service**
  - [ ] Créer intention de paiement fonctionne
  - [ ] Webhook reçoit les notifications

- [ ] **File Service**
  - [ ] Upload image fonctionne
  - [ ] Image retournée avec URL

- [ ] **9 Nouveaux Services**
  - [ ] Chaque service peut faire des appels API
  - [ ] Les réponses sont correctement formatées

---

## ⏱️ ORDRE D'APPLICATION RECOMMANDÉ

**Jour 1:**
1. ✅ Fix 1: `/auth/me` endpoint
2. ✅ Fix 2-6: Corriger les 5 services
3. ✅ Test les fixes

**Jour 2:**
4. ✅ Créer 9 services manquants
5. ✅ Importer les services dans Redux slices
6. ✅ Test basique des nouveaux services

**Jour 3:**
7. ✅ Integration testing
8. ✅ E2E testing
9. ✅ Documentation

---

**Prochaine étape:** Appliquer ces corrections dans l'ordre recommandé
