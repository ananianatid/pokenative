# Architecture Guide — Pokenative

## 1. Philosophy

Ce projet suit une architecture par **séparation des responsabilités** en couches :

```
Routes (app/) → Composants (components/) → Data (hooks/) → API externe
                                ↕
                       Design System (constants/)
                                ↕
                       Utilitaires (functions/)
```

Chaque couche ne dépend que des couches en dessous d'elle. Les routes ne contiennent quasiment pas de logique — elles orchestrent des composants.

---

## 2. Arborescence

```
app/                    ← Routes Expo Router (file-based)
├── _layout.tsx         ← Layout racine (QueryClientProvider + Stack)
├── index.tsx           ← Écran d'accueil (liste infinie + recherche)
├── about.tsx           ← Page "À propos"
└── pokemon/
    └── [id].tsx        ← Détail d'un Pokémon (route dynamique)

components/             ← Composants UI réutilisables
├── Card.tsx            ← Wrapper avec ombre, bord arrondi, fond thème
├── Row.tsx             ← Layout flex horizontal avec gap optionnel
├── ThemedText.tsx      ← Texte typé avec variants (headline, body3…)
├── SearchBar.tsx       ← Champ de recherche
├── SortButton.tsx      ← Bouton tri + Modal popup
├── Radio.tsx           ← Bouton radio
├── RootView.tsx        ← SafeAreaView + fond animé
└── pokemon/            ← Composants domaine Pokémon
    ├── PokemonCard.tsx  ← Carte dans la liste
    ├── PokemonSpec.tsx  ← Ligne spécification (poids, taille…)
    ├── PokemonStat.tsx  ← Barre de stat animée (HP, ATK…)
    └── PokemonType.tsx  ← Badge de type (Feu, Eau…)

hooks/                  ← Custom hooks (data + theming)
├── useFetchQuery.tsx   ← React Query : useFetchQuery + useInfiniteFetchQuery
└── useThemeColors.tsx  ← Couleurs du thème courant

constants/              ← Tokens du design system
├── colors.ts           ← Palette light/dark + couleurs de types
└── shadows.ts          ← Ombres (dp2)

functions/              ← Fonctions pures utilitaires
└── pokemon.ts          ← getPokemonId, getPokemonArtwork, formatWeight, formatHeight

app.json                ← Config Expo (experiments, plugins, splash)
tsconfig.json           ← Path alias @/ → ./
package.json            ← Entry: expo-router/entry
```

---

## 3. Routing (Expo Router)

Le routage est **file-based** : chaque fichier dans `app/` est une route.

| Fichier | Route | Rôle |
|---------|-------|------|
| `app/_layout.tsx` | — | Layout racine. Wrappe l'app dans `<QueryClientProvider>` et `<Stack screenOptions={{headerShown: false}}>` |
| `app/index.tsx` | `/` | Accueil : liste infinie avec FlatList, recherche, tri |
| `app/pokemon/[id].tsx` | `/pokemon/:id` | Détail d'un Pokémon (stats, type, cri, navigation prev/next) |

### Navigation

```tsx
// Programmee (router.replace pour prev/next dans la page détail)
import { router } from "expo-router";
router.push("/pokemon/25");
router.replace(`/pokemon/${nextId}`);

// Déclarative (Link)
import { Link } from "expo-router";
<Link href={{ pathname: "/pokemon/[id]", params: { id: pokemon.id } }} />

// Récupération des paramètres
import { useLocalSearchParams } from "expo-router";
const { id } = useLocalSearchParams(); // string — toujours casté
```

---

## 4. Data Layer

### 4.1 Architecture React Query

Le projet utilise **TanStack React Query** avec deux hooks génériques typés :

```
QueryClientProvider (app/_layout.tsx)
       ↓
useFetchQuery<T>(path, params?)     useInfiniteFetchQuery<T>(path)
       ↓                                     ↓
  useQuery({ queryKey, queryFn })    useInfiniteQuery({ queryKey, queryFn, getNextPageParam })
```

### 4.2 Registre de types API

Tous les endpoints PokéAPI sont déclarés manuellement dans une union type `API` dans `hooks/useFetchQuery.tsx` :

```tsx
type API = {
    "/pokemon?limit=21": { count: number; next: string | null; results: { name: string; url: string }[] };
    "/pokemon/[id]": { id: number; name: string; weight: number; stats: {...}[]; types: {...}[]; ... };
    "/pokemon-species/[id]": { flavor_text_entries: {...}[] };
};

type PaginatedAPI = Pick<API, "/pokemon?limit=21">;
```

- **Ajout d'un endpoint** : étendre `API` puis optionnellement `PaginatedAPI` pour le support infini.
- **Requête simple** : `useFetchQuery("/pokemon/[id]", { id: "25" })` — les params remplacent les tokens `[key]` dans le path.
- **Requête paginée** : `useInfiniteFetchQuery("/pokemon?limit=21")` — `getNextPageParam` retourne l'URL complète depuis `response.next`.

### 4.3 Points clés

- Base URL : `https://pokeapi.co/api/v2` (constante `endpoint` dans le hook)
- Les clés de cache React Query sont les URLs complètes
- Pas de gestion d'erreur explicite (à implémenter si besoin)
- Fonction `wait(ms)` disponible pour simuler la latence en dev

---

## 5. Design System

### 5.1 Couleurs (`constants/colors.ts`)

```tsx
Colors = {
    light: { tint, grayDark, grayMedium, grayLight, grayBackground, grayWhite },
    dark:  { tint, grayDark, grayMedium, grayLight, grayBackground, grayWhite },  // identiques pour l'instant
    type:  { bug, dark, dragon, electric, fairy, fighting, fire, flying, ghost,
             normal, grass, ground, ice, poison, psychic, rock, steel, water }
}
```

- **Accès thème** : `useThemeColors()` retourne `Colors[theme]` (détection via `useColorScheme()`)
- **Couleurs de type** : `Colors.type["fire"]` — utilisées pour les badges, fonds de page détail, barres de stats
- **Propriété `color` de ThemedText** : accepte les clés de `Colors['light']` (tint, grayDark, grayMedium, grayLight, grayBackground, grayWhite)

### 5.2 Ombres (`constants/shadows.ts`)

```tsx
Shadows = { dp2: { shadowOpacity, shadowColor, shadowOffset, shadowRadius, elevation } }
```

- Un seul niveau défini (`dp2`). Étendre avec `dp4`, `dp8` selon besoin Material Design.
- Utilisé par le composant `<Card>`.

### 5.3 Typographie

Gérée exclusivement par `<ThemedText>` avec le prop `variant` :

| Variant | Taille | Line Height | Poids | Usage |
|---------|--------|-------------|-------|-------|
| `body3` (defaut) | 10 | 16 | normal | Corps de texte |
| `headline` | 24 | 32 | bold | Titres principaux |
| `caption` | 8 | 12 | normal | Métadonnées fines |
| `subtitle1` | 14 | 16 | bold | Sous-titres, "About", "Base stats" |
| `subtitle2` | 12 | 16 | bold | En-têtes de cartes |
| `subtitle3` | 10 | 16 | bold | Stats, badges |

---

## 6. Architecture des Composants

### 6.1 Principe : Générique vs Domain-specific

```
components/
├── Card.tsx           ← Générique (pas de dépendance métier)
├── Row.tsx            ← Générique
├── ThemedText.tsx     ← Générique
├── SearchBar.tsx      ← Semi-générique (texte, icône)
└── pokemon/           ← Domain-specific
    ├── PokemonCard.tsx  ← Dépend de pokemon.ts (getPokemonArtwork)
    ├── PokemonType.tsx  ← Dépend de Colors.type
    └── PokemonStat.tsx  ← Dépend de Colors.type, react-native-reanimated
```

### 6.2 Pattern de Props

Tous les composants suivent le pattern `{style, ...rest}` :

```tsx
type Props = ViewProps & { /* props specifiques */ };

export function MonComposant({ style, ...rest }: Props) {
    return <View style={[Styles.base, style]} {...rest} />;
}
```

### 6.3 Rôle de chaque composant générique

| Composant | Rôle |
|-----------|------|
| `<RootView>` | Wrapper d'écran : `SafeAreaView` + padding + fond (avec transition animée optionnelle via `backgroundColor`). Remplace `<SafeAreaView>` brut en racine de page. |
| `<Card>` | Conteneur avec `Shadows.dp2`, `borderRadius: 12`, fond `Colors[theme].grayWhite`. Point d'entrée unique pour l'élévation. |
| `<Row>` | `flexDirection: "row"`, `alignItems: "center"`, `gap` optionnel. Remplace les flex rows bruts. |
| `<ThemedText>` | Centralise la typographie : variant + couleur thème. Ne jamais utiliser `<Text>` nu. |
| `<SearchBar>` | `TextInput` avec placeholder, icône, fond thème. |
| `<SortButton>` | Bouton + `Modal` transparent avec options de tri par Radio. |
| `<Radio>` | Cercle vide/plein (check/uncheck). |

### 6.4 Écran de détail — Orchestration

`app/pokemon/[id].tsx` montre comment les composants sont orchestrés :

```
RootView (fond = couleur du type)
  ├── Image (Pokeball décorative)
  ├── Header (nom + numéro)
  ├── Navigation (prev/next Image)
  ├── Image artwork (pressable = joue le cri)
  ├── Card
  │   ├── PokemonType × N
  │   ├── "About"
  │   ├── Row
  │   │   ├── PokemonSpec (poids)
  │   │   ├── PokemonSpec (taille)
  │   │   └── PokemonSpec (moves)
  │   ├── Bio (flavor text)
  │   ├── "Base Stats"
  │   └── PokemonStat × 6
```

---

## 7. Conventions de Style

### 7.1 Règles strictes

1. **`StyleSheet.create()`** obligatoire — jamais de styles inline.
2. **`satisfies ViewStyle`** sur chaque propriété de style (ou `TextStyle` pour les textes).
3. **Constante `Styles`** — toujours ce nom, pas de `styles`, `s`, `myStyles`.
4. **Composition en tableau** : `[Styles.base, customPropStyle, props.style]`.
5. **`@/`** pour tous les imports — pas de `../../`.
6. **PascalCase** pour les fichiers de composants (sauf `[id].tsx` pour les routes).

### 7.2 Accès aux couleurs

```tsx
// Couleurs du thème actif (light/dark)
const colors = useThemeColors();
<View style={{ backgroundColor: colors.tint }} />

// Couleurs de type Pokémon (statiques, pas de thème)
import { Colors } from "@/constants/colors";
<View style={{ backgroundColor: Colors.type["fire"] }} />

// Texte avec couleur thème
<ThemedText color="grayLight">Contenu</ThemedText>
```

### 7.3 Pattern Modal

```tsx
const [visible, setVisible] = useState(false);

<Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
    <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }} onPress={() => setVisible(false)} />
    {/* Contenu */}
</Modal>
```

---

## 8. Fonctions Utilitaires (`functions/`)

Les fonctions pures sont regroupées par domaine dans `functions/`. Elles :

- Ne dépendent d'aucun hook, thème ou contexte React
- Sont testables unitairement (pas de tests setup pour l'instant)
- Sont importées là où le besoin se présente (composants, routes)

```tsx
getPokemonId(url: string): number              // Extrait l'ID depuis une URL PokéAPI
getPokemonArtwork(id: number|string): string   // URL de l'image officielle
formatWeight(weight: number): string           // "6,9 kg"
formatHeight(height: number): string           // "0,7 m"
basePokemonStats                               // Template stat pour l'état vide
```

---

## 9. Hooks

### useThemeColors

```tsx
function useThemeColors(): typeof Colors.light
// Détecte le thème via useColorScheme(), retourne Colors[theme]
// Fallback "light" si useColorScheme() retourne null
```

### useFetchQuery / useInfiniteFetchQuery

```tsx
// Simple
function useFetchQuery<T extends keyof API>(
    path: T,
    params?: Record<string, string | number>
): UseQueryResult<API[T]>

// Paginée (infini)
function useInfiniteFetchQuery<T extends keyof PaginatedAPI>(
    path: T
): UseInfiniteQueryResult<PaginatedAPI[T]>
```

`UseQueryResult` et `UseInfiniteQueryResult` sont les types de TanStack React Query :
- `data`, `isFetching`, `isLoading`, `error`, `refetch`
- Pour l'infini : `fetchNextPage`, `hasNextPage`, `data.pages[]`

---

## 10. Dépendances Clés

| Package | Rôle |
|---------|------|
| `expo` ~54 | Plateforme |
| `expo-router` ~6 | Routage file-based |
| `@tanstack/react-query` ^5 | Data fetching + cache |
| `react-native-reanimated` ~4 | Animations (barres de stats, transitions de fond) |
| `react-native-safe-area-context` ~5 | SafeAreaView (notch, barre système) |
| `expo-image` ~3 | Image avec cache natif |
| `expo-av` ~16 | Audio (cris Pokémon) |
| `expo-haptics` ~15 | Retour haptique |
| `expo-splash-screen` ~31 | Écran de démarrage |
| `@expo/vector-icons` ^15 | Icônes vectorielles |

---

## 11. Configuration

| Fichier | Rôle |
|---------|------|
| `app.json` | Experiments (`typedRoutes`, `reactCompiler`), plugins, splash screen, schéma de lien profond `pokenative://` |
| `tsconfig.json` | Path alias `@/*` → `./*`, `strict: true`, extension de `expo/tsconfig.base` |
| `eslint.config.js` | Flat config via `eslint-config-expo`, ignore `dist/` |
| `.gitignore` | AGENTS.md exclu du versioning |

---

## 12. Flux de Développement

```
1. Identifier le besoin (nouvel écran, nouveau composant, nouvel endpoint)
2. Si nouvel endpoint → étendre le type API dans hooks/useFetchQuery.tsx
3. Si nouveau composant UI → l'ajouter dans components/ ou components/pokemon/
4. Styler avec StyleSheet.create() + satisfies + @/ imports
5. Intégrer dans la route correspondante (app/)
6. Linter : npm run lint
7. Tester manuellement sur simulateur (npm run ios/android/web)
```

---

## 13. Patterns Réutilisables

Ce guide d'architecture peut servir de template pour d'autres projets React Native / Expo avec :

- Le même système de hooks typés (adapter le type `API`)
- Les mêmes composants génériques (`Card`, `Row`, `ThemedText`)
- La même structure constants/functions/hooks/components/app
- Le même design system tokenisé (couleurs, ombres, typographie)
- Les mêmes skills OpenCode (add-api-endpoint, create-pokemon-component, style-component)
