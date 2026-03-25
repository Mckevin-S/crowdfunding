# 📊 TABLEAU DE CORRESPONDANCE COMPLÈTE

## Backend Controllers ↔ Frontend Services

### Alignement Actuel vs Idéal

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION & AUTHORIZATION                               │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Backend Endpoint                  │ Current Frontend    │ Status    │ Ideal Frontend │
├──────────────────────────────────┼────────────────────┼───────────┼────────────────┤
│ POST /api/v1/auth/register        │ authService        │ ✅ OK     │ authService    │
│ POST /api/v1/auth/login           │ authService        │ ✅ OK     │ authService    │
│ POST /api/v1/auth/logout          │ authService        │ ✅ OK     │ authService    │
│ POST /api/v1/auth/google          │ authService        │ ✅ OK     │ authService    │
│ POST /api/v1/auth/forgot-password │ authService        │ ✅ OK     │ authService    │
│ POST /api/v1/auth/reset-password  │ authService        │ ✅ OK     │ authService    │
│ POST /api/v1/auth/change-password │ authService        │ ✅ OK     │ authService    │
│ GET  /api/v1/auth/me              │ ❌ MANQUANT        │ 🔴 CRIT   │ **CRÉER**      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           PROJECTS MANAGEMENT                                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Backend Endpoint                      │ Current Frontend    │ Status │ Service      │
├───────────────────────────────────────┼────────────────────┼────────┼──────────────┤
│ GET    /api/v1/projets                │ projectService     │ ✅ OK  │ projectSvc   │
│ GET    /api/v1/projets/{id}           │ projectService     │ ✅ OK  │ projectSvc   │
│ GET    /api/v1/projets/active         │ projectService     │ ✅ OK  │ projectSvc   │
│ GET    /api/v1/projets/porteur/{id}   │ projectService     │ ✅ OK  │ projectSvc   │
│ POST   /api/v1/projets                │ projectService     │ ✅ OK  │ projectSvc   │
│ PUT    /api/v1/projets/{id}           │ projectService     │ ✅ OK  │ projectSvc   │
│ DELETE /api/v1/projets/{id}           │ projectService     │ ✅ OK  │ projectSvc   │
│ PATCH  /api/v1/projets/{id}/statut    │ projectService     │ ✅ OK  │ projectSvc   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           USER PROFILE MANAGEMENT                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Backend Endpoint                      │ Current Frontend    │ Status │ Correction   │
├───────────────────────────────────────┼────────────────────┼────────┼──────────────┤
│ GET    /api/v1/utilisateurs/{id}      │ /users/profile ❌  │ 🔴 BAD │ FIX IT       │
│ PUT    /api/v1/utilisateurs/{id}      │ /users/profile ❌  │ 🔴 BAD │ FIX IT       │
│ GET    /api/v1/utilisateurs           │ ❌ MANQUANT        │ 🔴 CRIT│ userService  │
│ PUT    /api/v1/utilisateurs/{id}/ban  │ ❌ MANQUANT        │ 🟡 IMP │ userService  │
│ PUT    /api/v1/utilisateurs/{id}/ban  │ ❌ MANQUANT        │ 🟡 IMP │ userService  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          FINANCIAL CONTRIBUTIONS                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Backend Endpoint                            │ Current Frontend │ Status │ Service  │
├─────────────────────────────────────────────┼──────────────────┼────────┼──────────┤
│ POST   /api/v1/contributions                │ contributionSvc  │ ✅ OK  │ contrib  │
│ GET    /api/v1/contributions/{id}           │ ❌ MANQUANT      │ 🟡 IMP │ contrib  │
│ GET    /api/v1/contributions                │ ❌ MANQUANT      │ 🟡 IMP │ contrib  │
│ GET    /api/v1/contributions/projet/{id}    │ ❌ MANQUANT      │ 🟡 IMP │ contrib  │
│ GET    /api/v1/contributions/utilisateur/{id}│ contributionSvc  │ ✅ OK  │ contrib  │
│ GET    /api/v1/contributions/projet/{id}/total│ contributionSvc │ ✅ OK  │ contrib  │
│ POST   /api/v1/contributions/initiate       │ contributionSvc  │ ✅ OK  │ contrib  │
│ POST   /api/v1/contributions/{id}/confirm   │ contributionSvc  │ ✅ OK  │ contrib  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              MESSAGING SYSTEM                                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Backend Endpoint                         │ Current Frontend   │ Status │ Service │
├──────────────────────────────────────────┼────────────────────┼────────┼─────────┤
│ POST   /api/v1/messages                  │ messageService     │ ✅ OK  │ msgSvc  │
│ GET    /api/v1/messages/conversation     │ messageService     │ ✅ OK  │ msgSvc  │
│ GET    /api/v1/messages/recent/{userId}  │ messageService     │ ✅ OK  │ msgSvc  │
│ PATCH  /api/v1/messages/{id}/read        │ messageService     │ ✅ OK  │ msgSvc  │
│ GET    /api/v1/messages/unread/{userId}  │ messageService     │ ✅ OK  │ msgSvc  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          KYC DOCUMENTS VERIFICATION                                 │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Backend Endpoint                            │ Current Frontend  │ Status │ Fix     │
├─────────────────────────────────────────────┼───────────────────┼────────┼─────────┤
│ POST   /api/v1/kyc-documents                │ /kyc ❌           │ 🔴 BAD │ FIX IT  │
│ GET    /api/v1/kyc-documents/{id}           │ ❌ MANQUANT       │ 🟡 IMP │ kycSvc  │
│ GET    /api/v1/kyc-documents/utilisateur/{id}│ ❌ MANQUANT      │ 🟡 IMP │ kycSvc  │
│ PATCH  /api/v1/kyc-documents/{id}/status    │ ❌ MANQUANT       │ 🟡 IMP │ kycSvc  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          PAYMENT PROCESSING (STRIPE)                                │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Backend Endpoint                      │ Current Frontend        │ Status │ Fix     │
├───────────────────────────────────────┼─────────────────────────┼────────┼─────────┤
│ POST /api/v1/stripe/create-intent     │ /payments ❌            │ 🔴 BAD │ FIX IT  │
│ POST /api/v1/stripe/webhook           │ ❌ MANQUANT (external)  │ ✅ OK  │ N/A     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          FILE UPLOAD MANAGEMENT                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Backend Endpoint                  │ Current Frontend              │ Status │ Fix   │
├───────────────────────────────────┼───────────────────────────────┼────────┼───────┤
│ POST /api/v1/files/upload/image   │ uploadService ✅              │ ✅ OK  │ OK    │
│                                   │ fileService /files/upload ❌   │ 🔴 BAD │ FIX   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          DIGITAL WALLETS (PORTEFEUILLES)                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Backend Endpoint                              │ Current Frontend │ Status │ Fix    │
├───────────────────────────────────────────────┼──────────────────┼────────┼────────┤
│ GET    /api/v1/wallets/utilisateur/{id}      │ ❌ MANQUANT      │ 🔴 CRIT│ CREATE │
│ POST   /api/v1/wallets/utilisateur/{id}/add  │ ❌ MANQUANT      │ 🔴 CRIT│ CREATE │
│ POST   /api/v1/wallets/utilisateur/{id}/wd   │ ❌ MANQUANT      │ 🔴 CRIT│ CREATE │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          PROJECT REWARDS (CONTREPARTIES)                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Backend Endpoint                              │ Current Frontend │ Status │ Fix    │
├───────────────────────────────────────────────┼──────────────────┼────────┼────────┤
│ POST   /api/v1/rewards                        │ ❌ MANQUANT      │ 🔴 CRIT│ CREATE │
│ GET    /api/v1/rewards/{id}                   │ ❌ MANQUANT      │ 🟡 IMP │ CREATE │
│ GET    /api/v1/rewards/projet/{id}            │ ❌ MANQUANT      │ 🟡 IMP │ CREATE │
│ PUT    /api/v1/rewards/{id}                   │ ❌ MANQUANT      │ 🟡 IMP │ CREATE │
│ DELETE /api/v1/rewards/{id}                   │ ❌ MANQUANT      │ 🟡 IMP │ CREATE │
│ POST   /api/v1/rewards/{id}/claim/{cid}       │ ❌ MANQUANT      │ 🟡 IMP │ CREATE │
│ PATCH  /api/v1/rewards/{id}/delivery          │ ❌ MANQUANT      │ 🟡 IMP │ CREATE │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          NOTIFICATIONS SYSTEM                                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Backend Endpoint                              │ Current Frontend │ Status │ Fix    │
├───────────────────────────────────────────────┼──────────────────┼────────┼────────┤
│ POST   /api/v1/notifications                  │ ❌ MANQUANT      │ 🔴 CRIT│ CREATE │
│ GET    /api/v1/notifications/utilisateur/{id} │ ❌ MANQUANT      │ 🔴 CRIT│ CREATE │
│ PATCH  /api/v1/notifications/{id}/read        │ ❌ MANQUANT      │ 🟡 IMP │ CREATE │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          FINANCIAL TRANSACTIONS                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Backend Endpoint                              │ Current Frontend │ Status │ Fix    │
├───────────────────────────────────────────────┼──────────────────┼────────┼────────┤
│ GET    /api/v1/transactions/utilisateur/{id}  │ ❌ MANQUANT      │ 🟡 IMP │ CREATE │
│ GET    /api/v1/transactions/{id}              │ ❌ MANQUANT      │ 🟡 IMP │ CREATE │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          PROJECT MILESTONES (ÉTAPES)                                │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Backend Endpoint                              │ Current Frontend │ Status │ Fix    │
├───────────────────────────────────────────────┼──────────────────┼────────┼────────┤
│ POST   /api/v1/etapes                         │ ❌ MANQUANT      │ 🟡 IMP │ CREATE │
│ GET    /api/v1/etapes/{id}                    │ ❌ MANQUANT      │ 🟡 IMP │ CREATE │
│ GET    /api/v1/etapes/projet/{id}             │ ❌ MANQUANT      │ 🟡 IMP │ CREATE │
│ PUT    /api/v1/etapes/{id}                    │ ❌ MANQUANT      │ 🟡 IMP │ CREATE │
│ DELETE /api/v1/etapes/{id}                    │ ❌ MANQUANT      │ 🟡 IMP │ CREATE │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          LOAN FINANCING (PRÊTS)                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Backend Endpoint                                   │ Current │ Status │ Fix        │
├────────────────────────────────────────────────────┼─────────┼────────┼────────────┤
│ POST   /api/v1/loans/projects/{id}/initialize    │ ❌      │ 🟡 IMP │ CREATE     │
│ POST   /api/v1/loans/projects/{id}/generate-sch  │ ❌      │ 🟡 IMP │ CREATE     │
│ GET    /api/v1/loans/projects/{id}/schedule      │ ❌      │ 🟡 IMP │ CREATE     │
│ PUT    /api/v1/loans/schedule/{id}/pay           │ ❌      │ 🟡 IMP │ CREATE     │
└────────────────────────────────────────────────────┴─────────┴────────┴────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          EQUITY CROWDFUNDING (ACTIONS)                              │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Backend Endpoint                                   │ Current │ Status │ Fix        │
├────────────────────────────────────────────────────┼─────────┼────────┼────────────┤
│ POST   /api/v1/equity/projects/{id}/initialize    │ ❌      │ 🟡 IMP │ CREATE     │
│ GET    /api/v1/equity/projects/{id}/share-price   │ ❌      │ 🟡 IMP │ CREATE     │
│ GET    /api/v1/equity/projects/{id}/calc-shares   │ ❌      │ 🟡 IMP │ CREATE     │
│ POST   /api/v1/equity/projects/{id}/distribute    │ ❌      │ 🟡 IMP │ CREATE     │
└────────────────────────────────────────────────────┴─────────┴────────┴────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          AI ANALYSIS (ANALYSE-IA)                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Backend Endpoint                              │ Current Frontend │ Status │ Fix    │
├───────────────────────────────────────────────┼──────────────────┼────────┼────────┤
│ POST   /api/v1/analyses-ia                    │ ❌ MANQUANT      │ 🟡 IMP │ CREATE │
│ GET    /api/v1/analyses-ia/{id}               │ ❌ MANQUANT      │ 🟡 IMP │ CREATE │
│ GET    /api/v1/analyses-ia/projet/{id}        │ ❌ MANQUANT      │ 🟡 IMP │ CREATE │
└───────────────────────────────────────────────┴──────────────────┴────────┴────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          RECOMMENDATIONS (AI)                                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Backend Endpoint                               │ Current Frontend │ Status │ Fix   │
├────────────────────────────────────────────────┼──────────────────┼────────┼───────┤
│ POST   /api/v1/recommendations                 │ ❌ MANQUANT      │ 🟡 IMP │ CREATE│
│ GET    /api/v1/recommendations/util/{id}       │ ❌ MANQUANT      │ 🟡 IMP │ CREATE│
│ POST   /api/v1/recommendations/util/{id}/gen   │ ❌ MANQUANT      │ 🟡 IMP │ CREATE│
└────────────────────────────────────────────────┴──────────────────┴────────┴───────┘
```

---

## 📊 RÉSUMÉ DES MAPPINGS

### ✅ CORRECTEMENT MAPPÉS (4 Services)
- `authService.js` → AuthController (Sauf /auth/me)
- `projectService.js` → ProjetController
- `contributionService.js` → ContributionController
- `messageService.js` → MessageController

### 🔴 MAL MAPPÉS (5 Services)
- `kycService.js` → Routes incorrectes
- `userService.js` → Routes incorrectes
- `paymentService.js` → Routes incorrectes
- `fileService.js` → Routes incorrectes
- `uploadService.js` → Correct mais fileService le duplique

### ❌ MANQUANTS (9 Services)
- `walletService.js`
- `rewardService.js`
- `notificationService.js`
- `transactionService.js`
- `etapesService.js`
- `loanService.js`
- `equityService.js`
- `analyseService.js`
- `recommendationService.js`

### 🔄 TOTAL BACKEND vs FRONTEND
- **Backend:** 17 contrôleurs, 72+ endpoints
- **Frontend:** 10 services (dont 5 incorrects)
- **Couverture:** 45%
- **Correctitude:** 40%

---

## 🎯 PLAN D'ACTION RÉSUMÉ

| Priorité | Tâche | Durée | Statut |
|----------|-------|-------|--------|
| 🔴 CRIT | Fixer 5 services mal mappés | 3-4h | ⏳ À faire |
| 🔴 CRIT | Créer endpoint `/auth/me` | 30min | ⏳ À faire |
| 🟡 IMP | Créer 9 services manquants | 4-6h | ⏳ À faire |
| 🟢 TEST | Tests d'intégration complets | 2-3h | ⏳ À faire |

**Total estimé:** 10-14 heures de travail

---

**Document généré:** 25 Mars 2026
