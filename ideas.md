# Project Ideas - React Native Learning Projects

Voici 3 idées de projets similaires à **pokenative** pour consolider vos compétences en React Native.

---

## 1. MovieApp (Recommended 🎬)

**Concept**: App de films avec découverte, détails et recherche

**Similarités avec pokenative:**
- ✅ Infinite scroll sur liste de films (pagination)
- ✅ Détails complexes (synopsis, casting, notes, genres)
- ✅ Recherche + filtrage (par genre, année, note)
- ✅ Images dynamiques (affiches, posters)

**API**: [The Movie Database (TMDb)](https://www.themoviedb.org/settings/api)

**Points d'apprentissage supplémentaires:**
- Gestion des genres avec multi-select
- Évaluation par stars + likes
- Filtres temporels (films récents vs classiques)
- Watchlist persistante (AsyncStorage)

### Structure type

```
movieapp/
├── app/
│   ├── _layout.tsx          # Root + QueryClientProvider
│   ├── index.tsx            # Liste (infinite scroll)
│   ├── movie/[id].tsx       # Détail avec casting + critiques
│   └── about.tsx
├── components/
│   ├── MovieCard.tsx        # Card avec poster
│   ├── SearchBar.tsx        # Recherche films
│   ├── GenreFilter.tsx      # Multi-select genres
│   └── movie/
│       ├── MovieRating.tsx  # Stars display
│       ├── CastList.tsx     # Casting du film
│       └── Reviews.tsx      # Critiques utilisateurs
├── hooks/
│   └── useFetchQuery.tsx    # Réutiliser de pokenative!
├── constants/
│   ├── colors.ts
│   └── shadows.ts
└── functions/
    └── movie.ts             # Utilitaires (formatDate, etc.)
```

---

## 2. RecipeApp (Plus accessible 🍳)

**Concept**: App de recettes avec recherche, détails et favoris

**Similarités avec pokenative:**
- ✅ Recherche puissante (ingrédients, cuisine, régime)
- ✅ Détails enrichis (ingrédients, instructions, nutrition)
- ✅ Filtres multiples (vegan, sans gluten, rapide)
- ✅ Grid layout pour les visuels

**API**: [Spoonacular API](https://spoonacular.com/food-api) ou [TheMealDB](https://www.themealdb.com/api)

**Points d'apprentissage supplémentaires:**
- Calcul nutritionnel (macros, calories)
- Partage de recettes
- Timer pour étapes de cuisson
- Mode hors ligne (cache des favoris)

### Structure type

```
recipeapp/
├── app/
│   ├── _layout.tsx          # Root + QueryClientProvider
│   ├── index.tsx            # Liste de recettes (infinite scroll)
│   ├── recipe/[id].tsx      # Détail avec ingrédients + instructions
│   └── favorites.tsx
├── components/
│   ├── RecipeCard.tsx       # Card avec image + rating
│   ├── SearchBar.tsx        # Recherche recettes
│   ├── DietFilter.tsx       # Filtres (vegan, gluten-free, etc.)
│   └── recipe/
│       ├── IngredientList.tsx
│       ├── Instructions.tsx
│       ├── NutritionInfo.tsx
│       └── CookingTimer.tsx
├── hooks/
│   └── useFetchQuery.tsx
├── constants/
│   ├── colors.ts
│   └── diet-types.ts        # Vegan, gluten-free, etc.
└── functions/
    └── recipe.ts
```

---

## 3. GameLibrary (Plus challengeant 🎮)

**Concept**: Catalogue de jeux vidéo avec détails et critiques

**Similarités avec pokenative:**
- ✅ Infinite scroll + pagination
- ✅ Détails complexes (screenshots, trailers, critiques)
- ✅ Filtres par plateforme, genre, année
- ✅ Recherche avancée

**API**: [RAWG Video Games API](https://rawg.io/api)

**Points d'apprentissage supplémentaires:**
- Intégration vidéo (trailers YouTube)
- Évaluation métacritic vs utilisateur
- Tri avancé (tendances, best-sellers)
- Support multi-plateforme UI

### Structure type

```
gamelibrary/
├── app/
│   ├── _layout.tsx          # Root + QueryClientProvider
│   ├── index.tsx            # Catalogue (infinite scroll)
│   ├── game/[id].tsx        # Détail avec screenshots + trailers
│   └── platforms.tsx        # Filter by console
├── components/
│   ├── GameCard.tsx         # Card avec cover art
│   ├── SearchBar.tsx        # Recherche jeux
│   ├── PlatformFilter.tsx   # Multi-select (PS5, Xbox, PC, etc.)
│   └── game/
│       ├── ScreenshotGallery.tsx
│       ├── TrailerPlayer.tsx
│       ├── RatingComparison.tsx  # Metacritic vs users
│       └── GenreTagslist.tsx
├── hooks/
│   └── useFetchQuery.tsx
├── constants/
│   ├── colors.ts
│   └── platforms.ts         # PS5, Xbox, PC, Nintendo, etc.
└── functions/
    └── game.ts
```

---

## Défis progressifs à implémenter

### Level 1 (Basique)
- [ ] Infinite scroll sur liste principale
- [ ] Recherche simple
- [ ] Page de détails avec données de base

### Level 2 (Intermédiaire)
- [ ] Filtres multi-sélection
- [ ] Données enrichies sur détails (casting, ingrédients, screenshots)
- [ ] Système de rating

### Level 3 (Avancé)
- [ ] Favoris persistants (AsyncStorage)
- [ ] Cache local intelligent
- [ ] Mode dark complet (light/dark theme values différents)

### Level 4 (Expert)
- [ ] Pagination côté API sophistiquée
- [ ] Offline-first architecture
- [ ] Intégration de partage (share API)
- [ ] Animations + transitions

---

## 4. PSNTracker (Expert 🎮⭐)

**Concept**: App pour tracker ta librairie PSN, checklist de jeux, temps de jeu et stats

**Pourquoi c'est intéressant:**
- ✅ **Package npm** (`psn-api`) au lieu d'API REST = intégration plus riche et complexe
- ✅ Authentification PSN (session management)
- ✅ State management avancé (utilisateur authentifié)
- ✅ Persistence de données personnalisées (AsyncStorage)
- ✅ Analytics et visualisations (graphiques de temps de jeu)

**API**: [psn-api](https://www.npmjs.com/package/psn-api) - Package npm officieux pour PSN

**Points d'apprentissage supplémentaires:**
- Authentification OAuth-like (token PSN)
- Gestion d'état utilisateur complexe (Redux/Zustand?)
- Graphiques (chartjs, recharts adaptés RN)
- Export de données (CSV, screenshot)
- Notifications push pour achievements
- Sync en background (à intervalles réguliers)

### Challenges techniques

```
- Installation psn-api + compatibilité React Native
- Gestion des tokens PSN (sécurité, expiration)
- Cache intelligent (PSN limit API calls)
- Calcul de stats (% complétion, heures moyennes, etc.)
- Synchronisation locale vs serveur
```

### Structure type

```
psntracker/
├── app/
│   ├── _layout.tsx              # Root + QueryClientProvider + AuthProvider
│   ├── index.tsx                # Dashboard (stats + librairie)
│   ├── auth/
│   │   └── login.tsx            # PSN login
│   ├── game/[id].tsx            # Détail jeu (stats, trophées, temps)
│   ├── library.tsx              # Checklist complète
│   └── stats.tsx                # Analytics (graphiques temps de jeu)
├── components/
│   ├── GameCard.tsx             # Card avec cover + temps de jeu
│   ├── StatCard.tsx             # Stats display
│   ├── TimelineChart.tsx        # Graphique temps de jeu
│   └── game/
│       ├── TrophyList.tsx       # Trophées débloqués
│       ├── PlaytimeStats.tsx    # Heures jouées
│       └── ChecklistToggle.tsx  # Checkbox "finished"
├── hooks/
│   ├── useFetchQuery.tsx
│   ├── usePSNAuth.tsx           # Auth PSN
│   └── usePSNLibrary.tsx        # Fetch librairie + cache
├── constants/
│   ├── colors.ts
│   └── shadows.ts
├── functions/
│   ├── psn.ts                   # Utilitaires PSN
│   └── stats.ts                 # Calculs stats
├── store/
│   └── auth.ts                  # Auth state (Zustand/Redux)
└── services/
    └── psnService.ts            # Wrapper psn-api
```

### Points de complexité additionnels

1. **Authentification PSN**
   ```tsx
   // psn-api nécessite username PSN
   const { getProfile, getUsersProfile } = require('psn-api');
   
   // Récupérer profil utilisateur
   const profile = await getProfile(psn);
   ```

2. **Gestion du cache (rate limiting)**
   ```tsx
   // PSN API a des limits, besoin de smart caching
   // + stockage local des données utilisateur
   ```

3. **State management**
   ```tsx
   // État complexe: user auth + librairie + checklist perso
   // Zustand ou Redux Context recommandé
   ```

4. **Visualisations**
   ```tsx
   // Graphiques temps de jeu par mois/année
   // Stats globales (% complétion, moyennes)
   // Besoin de library graphiques RN-compatible
   ```

### Features progressives

**MVP (Level 1)**
- [ ] Login PSN
- [ ] Afficher librairie des jeux
- [ ] Afficher détails 1 jeu

**Level 2**
- [ ] Checklist personnalisée (AsyncStorage)
- [ ] Temps de jeu par jeu
- [ ] Sort/filter par temps de jeu

**Level 3**
- [ ] Analytics: temps total, moyenne, jeu le plus joué
- [ ] Graphiques simples (bar chart temps de jeu)
- [ ] Sync automatique en background

**Level 4 (Expert)**
- [ ] Tracking des achievements débloqués
- [ ] Comparaison avec amis PSN
- [ ] Export statistiques (CSV/PDF)
- [ ] Notifications pour nouveaux jeux
- [ ] Mode offline avec sync

---

## Recommandation

**MovieApp pour débuter**, PSNTracker pour progresser:

### Par ordre de difficulté croissant:

1. **RecipeApp** (Facile) - API REST simple, parfait pour débuter
2. **MovieApp** (Intermédiaire) - Recommended pour 80% des cas, équilibre parfait
3. **GameLibrary** (Intermédiaire+) - Plus de complexité UI (vidéos, galeries)
4. **PSNTracker** (Expert) - **À privilégier si:** vous êtes passionné PS, envie d'apprendre package npm + auth + state management avancé

### PSNTracker vs autres projets

**Avantages:**
- ✅ Package npm (plus riche qu'une API REST)
- ✅ Authentification (nouveau skill)
- ✅ State management complexe (Zustand/Redux)
- ✅ Cas d'usage réaliste et personnel
- ✅ Visualisations (graphiques)
- ✅ Persistence complexe (librairie + checklist)

**Inconvénients:**
- ❌ Plus difficile à déboguer (PSN API limits)
- ❌ Authentification PSN peut être instable
- ❌ Nécessite connaisances avancées RN
- ❌ Moins de ressources online que MovieDB/RAWG
- ❌ Librairie moins mainstream

**Verdict:** PSNTracker = **projet de consolidation après MovieApp/GameLibrary**, pas point de départ.


---

## Réutilisable de Pokenative

Ces fichiers/patterns peuvent être copiés directement à tous les projets:

- ✅ `hooks/useFetchQuery.tsx` (adapter les types API)
- ✅ `components/Card.tsx`
- ✅ `components/Row.tsx`
- ✅ `components/ThemedText.tsx`
- ✅ `components/SearchBar.tsx`
- ✅ `constants/colors.ts` (adapter palette si besoin)
- ✅ `constants/shadows.ts`
- ✅ `app/_layout.tsx` (QueryClientProvider setup)
- ✅ `.claude/skills/` (tous les skills restent valides!)
- ✅ `AGENTS.md` + `rules.md` (guidelines génériques)

### PSNTracker: Patterns additionnels à réutiliser

- ✅ Styling patterns (`satisfies ViewStyle`)
- ✅ Theme system (`useThemeColors()`)
- ✅ Component architecture (reusable + domain-specific)
- ✅ Query hooks pattern (adapter pour psn-api)
- ✅ Infinite scroll + pagination (si PSN library l'a)

**Gain de temps estimé:**
- MovieApp: **2-3 heures** d'architecture/boilerplate économisées
- PSNTracker: **4-5 heures** (patterns + styling réutilisés)
