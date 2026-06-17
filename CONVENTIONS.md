# Conventions du projet Pokenative

## Vue d'ensemble

- **Framework** : React Native 0.81.5 avec Expo SDK 54 (managed workflow)
- **Langage** : TypeScript 5.9 en mode strict (`tsconfig.json` → `"strict": true`)
- **Routing** : Expo Router (file-based, `app/` → routes)
- **Data fetching** : TanStack React Query v5 avec `fetch` natif (pas d'Axios)
- **Animations** : React Native Reanimated 4
- **State management** : Aucune librairie dédiée — état local (`useState`) + cache serveur (React Query)
- **Backend** : PokéAPI (`https://pokeapi.co/api/v2`)
- **CI/CD** : Aucun
- **Tests** : Aucun framework de test
- **Build/Packaging** : Géré par Expo (pas de babel.config.js ni metro.config.js personnalisés)
- **Entry point** : `"main": "expo-router/entry"` dans `package.json`

---

## Structure du projet

```
app/                  → Routes (Expo Router)
  _layout.tsx         → Layout racine (Stack + QueryClientProvider)
  index.tsx           → Écran d'accueil (liste paginée des Pokémon)
  about.tsx           → Page About (stub minimal)
  pokemon/[id].tsx    → Détail d'un Pokémon (route dynamique)

components/           → Composants UI réutilisables
  Card.tsx            → Enveloppe avec ombre et border radius
  Row.tsx             → Layout horizontal avec gap optionnel
  ThemedText.tsx      → Texte typographié (6 variantes)
  SearchBar.tsx       → Barre de recherche
  SortButton.tsx      → Bouton de tri avec modal popup
  Radio.tsx           → Bouton radio
  RootView.tsx        → Wrapper d'écran (SafeAreaView + animation fond)
  pokemon/            → Composants métier Pokémon
    pokemonCard.tsx   → Carte Pokémon (fichier en minuscules, seul cas)
    PokemonSpec.tsx   → Ligne de spécification (poids, taille, capacités)
    PokemonStat.tsx   → Barre de stats animée
    PokemonType.tsx   → Badge de type Pokémon

hooks/                → Hooks custom
  useFetchQuery.tsx   → Requêtes simples + paginées (React Query)
  useThemeColors.tsx  → Accès aux couleurs du thème

constants/            → Constantes de design
  colors.ts           → Palette thème (light/dark) + couleurs des types Pokémon
  shadows.ts          → Ombres (dp2 uniquement)

functions/            → Utilitaires (pas nommé `utils/`)
  pokemon.ts          → Extraction ID, artwork, formatage, stats fallback

assets/images/        → Images statiques (21 fichiers)
```

Les fichiers `ARCHITECTURE.md`, `CONCEPTS.md`, `ideas.md` et `rules.md` sont de la documentation complémentaire (en français). `AGENTS.md` contient des instructions pour les agents IA.

---

## Couleurs et thème

### Fichier de référence : `constants/colors.ts`

Toutes les couleurs sont définies dans un unique objet `Colors` :

```ts
export const Colors = {
    light: {
        tint: "#DC0A2D",
        grayDark: "#212121",
        grayMedium: "#666666",
        grayLight: "#E0E0E0",
        grayBackground: "#EFEFEF",
        grayWhite: "#FFFFFF",
    },
    dark: { /* valeurs identiques à light */ },
    type: {
        bug: "#A7B723", dark: "#75574C", dragon: "#7037FF", /* ... 18 types */
    }
}
```

### Accès aux couleurs

Le hook `useThemeColors()` retourne `Colors[theme]` où `theme` vaut `"light"` ou `"dark"` (via `useColorScheme()` avec fallback `"light"`).

Les couleurs sont utilisées de deux façons dans les composants :

**Via le hook (dans les styles) :**

```tsx
const colors = useThemeColors()
// Puis :
style={{ backgroundColor: colors.grayWhite }}
style={{ borderColor: colors.grayLight }}
style={{ color: colors.tint }}
```

**Via la prop `color` de `<ThemedText>` (noms de tokens) :**

```tsx
<ThemedText color="grayMedium">Texte</ThemedText>
<ThemedText color="grayDark">Titre</ThemedText>
```

### Couleurs des types Pokémon

Accès direct via `Colors.type[name]` où `name` est typé `keyof typeof Colors.type` :

```tsx
const colorType = mainType ? Colors.type[mainType] : colors.grayWhite
// Dans PokemonType.tsx :
style={[rootStyle, { backgroundColor: Colors.type[name] }]}
```

### Tokens de couleur disponibles

Uniquement 6 tokens dans `light`/`dark` : `tint`, `grayDark`, `grayMedium`, `grayLight`, `grayBackground`, `grayWhite`. Pas de tokens sémantiques (primary, background, text, etc.).

### Points notables

- **Thème sombre non implémenté** : `Colors.light` et `Colors.dark` ont exactement les mêmes valeurs.
- **Pas de propagation via Context** : chaque composant appelle `useThemeColors()` indépendamment.
- **Couleurs inline** : `placeholderTextColor="#999999"` est codé en dur dans `SearchBar.tsx` — ne référence pas le thème.
- **Transparence** : `"rgba(255,255,255,0.5)"` pour le fond semi-transparent de la carte détail, `"rgba(0,0,0,0.3)"` pour le backdrop modal. Ces valeurs sont inline et ne passent pas par `Colors`.
- **`RootView`** fait une transition de couleur animée (700ms, easing quad) quand le `backgroundColor` change (passe de `colors.tint` à la couleur du type Pokémon).

---

## Composants

### Structure type d'un composant

```
1. Imports (React Native → @/ alias → relatifs)
2. Définition des Props (type alias)
3. Fonction composant (export nommé)
4. Constante de styles (camelCase dans components/, PascalCase dans app/)
```

### Typage des props

Toujours via `type` (jamais `interface`). Trois patterns :

```tsx
// Pattern A : extension de props natives
type Props = ViewProps & {
    gap?: number,
}

// Pattern B : props autonomes
type Props = {
    value: string,
    onChange: (s: string) => void
}

// Pattern C : extension + props métier
type Props = ViewProps & {
    title?: string,
    description?: string,
    image?: ImageSourcePropType
}
```

Pas de préfixes (`I`), pas de suffixes (`Type`). Les types de props sont définis localement dans chaque fichier — pas de dossier `types/` partagé.

### Convention de nommage des fichiers

Majoritairement `PascalCase.tsx` : `Card.tsx`, `Row.tsx`, `ThemedText.tsx`, `SearchBar.tsx`, `SortButton.tsx`, `Radio.tsx`, `RootView.tsx`, `PokemonSpec.tsx`, `PokemonStat.tsx`, `PokemonType.tsx`.

**Exception** : `pokemonCard.tsx` est en minuscules. L'import doit impérativement correspondre : `@/components/pokemon/pokemonCard`.

Pas de pattern `index.tsx` dans un dossier.

### Exports

Toujours des **exports nommés** (jamais `export default`) sauf pour les routes (`app/`) qui utilisent `export default function`.

### StyleSheet et styles

**Deux patterns coexistent :**

Pattern A — `StyleSheet.create()` avec camelCase (composants réutilisables) :

```tsx
// Radio.tsx, ThemedText.tsx, SearchBar.tsx, etc.
const styles = StyleSheet.create({
    radio: {
        width: 14,
        height: 14,
        borderRadius: 14,
    },
})
```

Pattern B — Objet littéral avec `satisfies ViewStyle` (composants réutilisables) :

```tsx
// Card.tsx, Row.tsx, PokemonType.tsx, RootView.tsx
const rowStyle = {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center'
} satisfies ViewStyle;
```

Pattern C — `StyleSheet.create()` avec `const Styles` (PascalCase, écrans) :

```tsx
// app/index.tsx, app/pokemon/[id].tsx
const Styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 4,
    },
})
```

Aucune annotation `satisfies ViewStyle` n'est appliquée aux objets créés par `StyleSheet.create()` dans les écrans — l'inférence de TypeScript est jugée suffisante.

### Pattern de props `{style, ...rest}`

Appliqué sur les composants wrapper View. Le style custom est passé en 2e position (après le style de base) :

```tsx
export function MonComposant({style, ...rest}: Props) {
    return <View style={[styles.base, style]} {...rest} />
}
```

**Exception — bug connu** : `Card.tsx` applique `[style, styles, ...]` — le style custom vient avant les styles de base et peut donc être écrasé.

### Composants de base et leur API

| Composant | Rôle | Props clés | Fichier |
|-----------|------|------------|---------|
| `Card` | Enveloppe avec ombre dp2, borderRadius 12, fond blanc | `ViewProps` | `Card.tsx` |
| `Row` | Layout flexbox horizontal, `flex:0` | `ViewProps` + `gap?: number` | `Row.tsx` |
| `ThemedText` | Texte typographié | `TextProps` + `variant?` + `color?` | `ThemedText.tsx` |
| `RootView` | Wrapper d'écran (SafeAreaView, fond animable) | `ViewProps` + `backgroundColor?` | `RootView.tsx` |
| `SearchBar` | Input de recherche contrôlé | `value: string` + `onChange` | `SearchBar.tsx` |
| `SortButton` | Bouton + Modal popup positionné | `value: "id" \| "name"` + `onChange` | `SortButton.tsx` |
| `Radio` | Bouton radio (14px, inner 6px) | `checked: boolean` | `Radio.tsx` |

### Variantes typographiques (`ThemedText`)

```tsx
const styles = StyleSheet.create({
  body3:     { fontSize: 10, lineHeight: 16 },                       // défaut
  headline:  { fontSize: 24, lineHeight: 32, fontWeight: "bold" },
  caption:   { fontSize: 8,  lineHeight: 12 },
  subtitle1: { fontSize: 14, lineHeight: 16, fontWeight: "bold" },
  subtitle2: { fontSize: 12, lineHeight: 16, fontWeight: "bold" },
  subtitle3: { fontSize: 10, lineHeight: 16, fontWeight: "bold" },
});
```

Les tailles de police sont volontairement très petites (8–10px pour body/caption). La prop `color` accepte les clés de `Colors['light']`.

### Composants métier Pokémon

| Composant | Rôle | Fichier |
|-----------|------|---------|
| `PokemonCard` | Carte cliquable → détail via `Link asChild` + `Pressable` | `pokemonCard.tsx` |
| `PokemonType` | Badge pilule coloré (`Colors.type[name]`) | `PokemonType.tsx` |
| `PokemonSpec` | Ligne spécification (poids/taille/capacités) avec icône optionnelle | `PokemonSpec.tsx` |
| `PokemonStat` | Barre de stat animée (spring, 0–255) avec abréviation | `PokemonStat.tsx` |

### Patterns de composition récurrents

- **Pas de render props ni de slots** : tout passe par des props simples.
- **Pas de composition via `children`** : les composants sont auto-suffisants.
- **`Link asChild`** : utilisé dans `PokemonCard` pour rendre un `Pressable` comme lien de navigation.
- **State local + contrôlé** : `SearchBar` et `SortButton` sont contrôlés par le parent (value/onChange). `Radio` est purement contrôlé. `PokemonCard` gère son propre markup.
- **`android_ripple`** : utilisé sur le `Pressable` de `PokemonCard`.

---

## Hooks

### `useFetchQuery` (`hooks/useFetchQuery.tsx`)

```ts
function useFetchQuery<T extends keyof API>(
    path: T,
    params?: Record<string, string | number>
): UseQueryResult<API[T]>
```

- Remplace les placeholders `[key]` dans le path par les valeurs de `params`
- Construit une URL locale (`endpoint + path résolu`)
- Utilise `useQuery` avec `queryKey: [localUrl]` et `fetch` natif
- Retourne le résultat brut de React Query (pas de transformation)
- **Pas de gestion d'erreur** dans la query function

### `useInfiniteFetchQuery` (`hooks/useFetchQuery.tsx`)

```ts
function useInfiniteFetchQuery<T extends keyof PaginatedAPI>(
    path: T
): UseInfiniteQueryResult<PaginatedAPI[T]>
```

- `initialPageParam` = URL complète (`endpoint + path`)
- `getNextPageParam` = `lastPage.next ?? null`
- Utilisé uniquement pour la liste paginée `/pokemon?limit=21`
- `PaginatedAPI` est un sous-ensemble de `API` : `Pick<API, '/pokemon?limit=21'>`

### `useThemeColors` (`hooks/useThemeColors.tsx`)

```ts
function useThemeColors(): typeof Colors.light
```

- Appelle `useColorScheme()` de React Native
- Fallback à `"light"` si le scheme est `null`
- Retourne `Colors[theme]` directement

### Convention de nommage des hooks

Préfixe `use` + domaine : `useFetchQuery`, `useThemeColors`. Pas de suffixe d'action.

### Hooks disponibles

Seulement 2 hooks customs. Aucun hook de navigation, d'authentification, ou de logique métier.

---

## Fonctions utilitaires

### Fichier unique : `functions/pokemon.ts`

Toutes les fonctions sont dans un seul fichier, exportées individuellement (named exports, pas de namespace/objet).

```ts
// Extraction d'ID depuis une URL PokéAPI
export function getPokemonId(url: string): number {
    return parseInt(url.split('/').at(-2)!, 10);
}

// Construction URL artwork officiel
export function getPokemonArtwork(id: number | string): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

// Hectogrammes → kg, séparateur décimal français (,)
export function formatWeight(weight: number): string {
    if (!weight) return "--";
    return (weight / 10).toString().replace('.', ',') + ' kg';
}

// Décimètres → m, séparateur décimal français (,)
export function formatHeight(height: number): string {
    if (!height) return "-- ";
    return (height / 10).toString().replace('.', ',') + ' m';
}
```

### Convention de nommage

- `camelCase`
- Verbes d'action en préfixe : `get`, `format`
- Pas de préfixe `compute`, `parse`, `fetch`

### Donnée statique : `basePokemonStats`

```ts
export const basePokemonStats = [
    { base_stat: 1, stat: { name: "hp" } },
    { base_stat: 1, stat: { name: "attack" } },
    // ... 6 stats au total, toutes à 1
]
```

Template de fallback utilisé dans `pokemon/[id].tsx` quand l'API retourne des stats nulles.

### Fonctions pures vs effets de bord

Toutes les fonctions dans `functions/pokemon.ts` sont pures (pas d'effets de bord, pas d'appels réseau).

---

## Routing et navigation

### Expo Router — File-based routing

```
app/
├── _layout.tsx          → Racine : Stack navigator
├── index.tsx            → Route "/"
├── about.tsx            → Route "/about"
└── pokemon/[id].tsx     → Route "/pokemon/:id"
```

### Layout racine (`app/_layout.tsx`)

```tsx
export default function RootLayout() {
  return <QueryClientProvider client={queryClient}>
    <Stack screenOptions={{ headerShown: false }} />
  </QueryClientProvider>;
}
```

- `headerShown: false` : pas de barre de navigation native
- Pas de Tab Navigator, pas de Drawer
- `QueryClient` instancié hors composant (module scope)

### Navigation déclarative

```tsx
// Depuis PokemonCard
<Link href={{ pathname: "/pokemon/[id]", params: { id: id } }} asChild>
    <Pressable>...</Pressable>
</Link>
```

### Navigation impérative

```tsx
// Retour arrière
router.back()

// Remplacement de route (utilisé pour prev/next dans le détail)
router.replace(`/pokemon/${previousId}`)
```

### Paramètres de route

```tsx
// Récupération (toujours des strings)
const params = useLocalSearchParams() as { id: string }

// Dans un Link, conversion explicite
params: { id: id }  // id est un number, converti implicitement
params: { id: String(value) }  // conversion explicite recommandée
```

### Navigation prev/next

Dans `pokemon/[id].tsx`, navigation par `router.replace()` (pas `push`) entre Pokémon précédent/suivant. Désactivée aux bornes (id=1 et id=151).

---

## Appels réseau et données

### Client HTTP

`fetch` natif, pas de wrapper. Pas d'Axios, pas d'intercepteurs, pas de configuration centralisée.

```ts
// Dans useFetchQuery
return fetch(localUrl).then(res => res.json() as Promise<API[T]>)

// Dans useInfiniteFetchQuery
return fetch(pageParam, {
    headers: { 'Accept': 'application/json' }
}).then(res => res.json() as Promise<PaginatedAPI[T]>)
```

### React Query

- Version 5 (`@tanstack/react-query`)
- `QueryClient` instancié au niveau module dans `_layout.tsx`
- `staleTime`, `gcTime`, `retry` : valeurs par défaut de React Query (non configurées)
- Pas de `Suspense`, pas de `useMutation`
- Pas de hooks de mutation (l'app est en lecture seule)

### Types API

Les types de réponse sont **déclarés manuellement** dans le type union `API` (pas générés depuis l'API, pas de Zod/validation) :

```ts
type API = {
    '/pokemon?limit=21': { count: number; next: string | null; results: { name: string; url: string }[] },
    "/pokemon/[id]": { /* type Pokemon complet */ },
    "/pokemon-species/[id]": { /* type Species */ },
}
```

Les clés sont des chaînes littérales représentant le path. Les placeholders sont notés `[key]`.

### Pagination

```ts
type PaginatedAPI = Pick<API, '/pokemon?limit=21'>
```

Seule l'endpoint `/pokemon?limit=21` est paginée. `getNextPageParam` extrait l'URL complète de `lastPage.next` (qui est une URL absolue PokéAPI). La première page utilise `endpoint + path`.

### Pattern de requête dans les écrans

```tsx
// Requête simple
const { data: pokemon } = useFetchQuery("/pokemon/[id]", { id: params.id })

// Requête paginée
const { data, isFetching, fetchNextPage } = useInfiniteFetchQuery('/pokemon?limit=21')

// Données flatMap pour la FlatList
const pokemons = data?.pages.flatMap(page =>
    page.results.map(r => ({ name: r.name, id: getPokemonId(r.url) }))
) ?? []
```

### Gestion d'état local sur les données

Les données de React Query sont enrichies/filtrées localement :

```tsx
// Filtrage par recherche
const filteredPokemons = [...pokemons]
    .filter(p => p.name.includes(search.toLowerCase()) || p.id.toString() === search)
    .sort((a, b) => (a[sortkey] > b[sortkey]) ? 1 : -1)
```

Le state local (`useState`) est utilisé pour `search` et `sortkey`. Aucune bibliothèque de state management.

---

## TypeScript

### Configuration

- `strict: true` dans `tsconfig.json`
- `tsconfig.json` étend `expo/tsconfig.base`
- Path alias : `"@/*": ["./*"]`
- Inclut `.expo/types/**/*.ts` et `expo-env.d.ts`

### Convention de nommage des types

- **Types/aliases** : `PascalCase` (`Props`, `API`, `PaginatedAPI`)
- **Pas de préfixe `I`**, pas de suffixe `Type`
- **`interface` n'est jamais utilisé** — uniquement `type`

### Où vivent les types

- Types de props : **définis localement** dans chaque fichier de composant
- Types API : dans `hooks/useFetchQuery.tsx` (type union `API`)
- Types de design : dans `constants/colors.ts` (inférés)
- **Pas de dossier `types/`** centralisé

### Patterns TypeScript récurrents

```ts
// keyof typeof pour référencer les clés d'un objet constant
color?: keyof typeof Colors['light']           // ThemedText
name: keyof typeof Colors.type                 // PokemonType
variant?: keyof typeof styles                  // ThemedText

// satisfies pour valider la forme sans élargir le type
const rowStyle = { flex: 0 } satisfies ViewStyle
const Shadows = { dp2: {...} } satisfies Record<string, ViewStyle>

// as pour les assertions (pas de validation runtime)
const params = useLocalSearchParams() as { id: string }
.then(res => res.json() as Promise<API[T]>)

// Pick pour créer des sous-types
type PaginatedAPI = Pick<API, '/pokemon?limit=21'>

// Record pour les paramètres
params?: Record<string, string | number>

// Génériques contraints
function useFetchQuery<T extends keyof API>(path: T, ...)
```

---

## Points d'attention

### Incohérences

1. **Nommage des constantes de style** : `Styles` (PascalCase, `StyleSheet.create`) dans les écrans, `styles`/`rowStyle`/`rootStyle` (camelCase) dans les composants. Pas de règle uniforme appliquée.

2. **Méthode de création des styles** : `StyleSheet.create()` dans certains composants, objet littéral avec `satisfies ViewStyle` dans d'autres. Les deux coexistent sans raison apparente.

3. **`Card.tsx` — ordre des styles** : `[style, styles, ...]` place le style personnalisé avant les styles de base, ce qui signifie que les styles de base écrasent les styles customs. Tous les autres composants font `[styles.base, style]`.

4. **Imports** : Mélange de `@/` (dans `app/`) et de `../` relatifs (dans `components/` et `components/pokemon/`). PokemonCard utilise `"../Card"` tandis que d'autres fichiers utilisent `@/components/Card`.

5. **Fichier `pokemonCard.tsx`** : seul fichier en minuscules dans tout le projet. Importe d'autres composants en relatif (`"../Card"`, `"../ThemedText"`).

6. **Thème sombre** : `Colors.dark` a les mêmes valeurs que `Colors.light`. Le thème sombre est déclaré mais non implémenté.

### Code mort et imports inutilisés

7. **`shadows.ts`** : importe `View` depuis `react-native-reanimated/lib/typescript/Animated` mais ne l'utilise pas.

8. **`PokemonSpec.tsx`** : importe `Text` depuis `react-native` mais ne l'utilise pas (utilise `<ThemedText>`).

9. **`SortButton.tsx`** : importe `ActivityIndicator` et `Text` mais ne les utilise pas. Fonction `onButtonPress` déclarée à la ligne 16 puis redéclarée (shadowed) à la ligne 28.

10. **`RootView.tsx`** : importe `ViewStyle` depuis `react-native` mais ne l'utilise pas.

11. **`useFetchQuery.tsx`** : fonction `wait()` définie (lignes 77-79) mais jamais appelée. Conservée pour simuler de la latence pendant le développement.

12. **`index.tsx`** : importe `SafeAreaView` et `View` depuis `react-native` mais ne les utilise pas directement (utilise `RootView` et `FlatList`).

### Typos probables

13. **`PokemonSpec.tsx`** : `color="graymedium"` — la casse exacte dans `Colors` est `grayMedium` (capital M). Ce token n'existe pas, donc la couleur tombe sur le fallback `grayDark`.

14. **`PokemonType.tsx`** : `variant="subtitle3  "` — espaces trailing dans la valeur de la prop.

### Fragilité du typage

15. **Assertions `as`** : les réponses API sont typées via `as Promise<API[T]>` sans validation runtime. Une divergence entre le type déclaré et la réponse réelle ne sera pas détectée.

16. **Paramètres de route** : `useLocalSearchParams() as { id: string }` — assertion sans vérification que la clé `id` existe bien.

17. **`keyof typeof Colors.type`** : le type `name` de `PokemonType` est correctement restreint, mais dans `pokemon/[id].tsx` la valeur `mainType` vient de l'API (`pokemon?.types[0].type.name`) dont le type est aussi `keyof typeof Colors.type` — cohérent mais repose sur la correspondance manuelle entre l'API et la palette.

### Absences notables

18. **Pas de gestion d'erreur** : aucune boundary d'erreur, pas de `error` dans React Query, pas de fallback UI en cas d'échec réseau.

19. **Pas de composant de chargement partagé** : `ActivityIndicator` est utilisé directement dans `index.tsx` avec la couleur `colors.tint`.

20. **Pas de responsive design** : le layout 3 colonnes sur la grille d'accueil est fixe, pas de breakpoints, pas d'adaptation tablette/mobile.

21. **Pas de constantes partagées pour les dimensions** : les tailles (32, 24, 14, 200, etc.) sont codées en dur dans chaque composant.
