# Checklist: Validation Connexion Frontend-Backend

## ✅ Corrections Appliquées

- [x] **api.js** - `baseURL` corrigé vers `VITE_API_BASE_URL`
- [x] **.env** - Variable consolidée et simplifiée
- [x] **walletService.js** - Endpoint corrigé `/wallet/*` → `/wallets/*`

---

## 📋 Points de Vérification

### Phase 1: Configuration (À exécuter)

- [ ] Vérifier la variable `VITE_API_BASE_URL` est disponible
- [ ] Confirmer que le fichier `.env` est chargé par Vite
- [ ] Valider que `import.meta.env` dans le navigateur affiche `VITE_API_BASE_URL`

### Phase 2: Backend en ligne

- [ ] Démarrer Spring Boot: `mvn spring-boot:run` sur port 8080
- [ ] Vérifier que l'API répond: `curl http://localhost:8080/api/v1/auth`
- [ ] Tester CORS depuis le frontend

### Phase 3: Tests d'Intégration Frontend

```bash
# Terminal 1: Démarrer le backend
cd crowdfunding-backend
npm run start  # ou mvnw spring-boot:run

# Terminal 2: Démarrer le frontend
cd crowdfunding-frontend
npm run dev

# Terminal 3: Tester les endpoints
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Phase 4: Verification dans le Navigateur

1. Ouvrir DevTools (F12)
2. Aller dans l'onglet **Network**
3. Effectuer une action qui appelle l'API (login, créer projet, etc.)
4. Vérifier que:
   - ✅ L'URL commence par `http://localhost:8080/api/v1/*`
   - ✅ Le statut HTTP est 2xx ou 4xx (pas 5xx)
   - ✅ Le header `Authorization: Bearer <token>` est présent si authentifié

---

## 🔧 Fichiers Modifiés

| Fichier | Changement |
|---------|-----------|
| `src/services/api.js` | `VITE_API_URL` → `VITE_API_BASE_URL` |
| `.env` | Consolidé: suppression duplication |
| `src/services/walletService.js` | `/wallet/*` → `/wallets/*` |

---

## 🚀 Prochaines Étapes

1. **Redémarrer le frontend** après les modifications
2. **Tester chaque service** (auth, projects, wallet, etc.)
3. **Valider les réponses** dans la console du navigateur
4. **Documenter tout problème** restant

---

## Notes

- Les changements ne nécessitent **pas** de recompilation du backend
- Le frontend doit être **redémarré** pour recharger les variables `.env`
- Les fichiers tests unitaires peuvent nécessiter une mise à jour si hardcodés

