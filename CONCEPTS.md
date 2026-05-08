# Concepts React & React Native - Pokenative

## 🎣 React Hooks

### State Management
- **`useState`** — Gestion d'état local (search, sortkey, isModalVisible)
  - Exemple: `const [search, setSearch] = useState('')`
- **`useRef`** — Référence à un élément DOM/View (`useRef<View>(null)`)
- **`useColorScheme`** (React Native) — Détection du thème clair/sombre du système

### Custom Hooks (Créés dans le projet)
- **`useFetchQuery`** — Hook React Query personnalisé pour requêtes simples
  - Intègre un délai artificiel de 1s pour simuler la latence réseau
  - Utilise les génériques TypeScript: `<T extends keyof API>`
- **`useInfiniteFetchQuery`** — Hook React Query pour pagination infinie
  - Utilise `useInfiniteQuery` de Tanstack
  - Gère `getNextPageParam` pour charger la page suivante
- **`useThemeColors`** — Hook pour accéder aux couleurs du thème actif
  - Retourne `Colors[theme]` basé sur le thème détecté

---

## 🗂️ File-Based Routing (Expo Router)

### Concepts
- **`expo-router`** — Système de routing basé sur la structure des fichiers
- **Navigation par fichiers** — Structure `app/` = routes
  - `app/index.tsx` → `/` (écran d'accueil)
  - `app/about.tsx` → `/about`
  - `app/pokemon/[id].tsx` → `/pokemon/:id` (route dynamique)
- **Dynamic Routes** — `[id]` = paramètre URL dynamique
- **`useLocalSearchParams()`** — Récupérer les paramètres d'URL
  - Exemple: `const params = useLocalSearchParams()` → `params.id`
- **`Link` component** — Navigation entre écrans avec `href`
  - Format: `href={{ pathname: "/pokemon/[id]", params: { id: id } }}`
  - `asChild` prop pour wrapper d'autres composants

### Stack Navigation
- **`<Stack>`** — Composant de navigation par pile (Expo Router)
- **`screenOptions`** — Configuration des écrans
  - `headerShown: false` — Masquer le header par défaut

---

## 📊 Data Fetching & State Server

### React Query / Tanstack Query
- **`useQuery`** — Requête simple avec mise en cache
  - Options: `queryKey`, `queryFn`
- **`useInfiniteQuery`** — Pagination infinie
  - Options: `initialPageParam`, `getNextPageParam`, `queryFn`
- **`QueryClient`** — Gestionnaire de cache des requêtes
- **`QueryClientProvider`** — Provider pour mettre en place React Query globalement
  - Wrapping la app dans `app/_layout.tsx`
- **Fetch API** — `fetch()` natif pour les requêtes HTTP
- **`as Promise<T>`** — Casting TypeScript du JSON retourné

### Patterns
- **Pagination** — Charger plus d'éléments avec `onEndReached()`
- **Lazy Loading** — Chargement à la demande quand l'utilisateur fait défiler

---

## 🎨 Styling & Layout

### StyleSheet & Layout System
- **`StyleSheet.create()`** — Créer des styles optimisés (React Native)
  - Meilleure performance que les styles inline
- **`satisfies ViewStyle / TextStyle`** — Vérification de type TypeScript pour les styles
- **Flexbox Layout**
  - `flex`, `flexDirection`, `justifyContent`, `alignItems`
  - `gap` — Espacement entre éléments en flexbox
  - `padding`, `margin`, `paddingHorizontal`, `paddingVertical`
- **`View`** — Conteneur générique (comme `<div>`)
- **`SafeAreaView`** — Éviter les zones non-utilisables (notch, barre de navigation)
  - Import depuis `react-native-safe-area-context` (pas `react-native`)

### Style Composition Pattern
- **Array de styles** — `[baseStyle, customStyle, dynamicStyle]`
  - Permet l'héritage et l'override de styles

### Theme System
- **`useThemeColors()`** — Hook personnalisé pour les couleurs du thème
- **`Colors` object** — Objets de couleurs par thème (light/dark)
- **Type-specific colors** — Couleurs spécifiques aux types Pokemon (fire, water, electric, etc.)

---

## 📱 React Native Components

### Core Components
- **`View`** — Conteneur de base (pas de `<div>` en React Native)
- **`Text`** — Texte (pas de `<span>`)
- **`TextInput`** — Champ de texte
  - Props: `value`, `onChangeText`, `placeholder`, `placeholderTextColor`
- **`Image`** — Affichage d'images
  - Props: `source`, `width`, `height`
  - Sources: `require()`, `uri: string`, `expo-image` pour le caching
- **`Pressable`** — Détecteur de pression (bouton cliquable)
  - Props: `onPress`, `android_ripple` (effet ripple Android)
- **`FlatList`** — Liste virtuelle optimisée
  - Props: `data`, `renderItem`, `keyExtractor`, `onEndReached`, `numColumns`, `columnWrapperStyle`, `ListFooterComponent`, `contentContainerStyle`
- **`Modal`** — Fenêtre modale
  - Props: `visible`, `transparent`, `animationType`, `onRequestClose`
- **`ActivityIndicator`** — Indicateur de chargement (spinner)

### Specialized Components
- **`SafeAreaView`** — Zone sécurisée (évite notch/barre)
- **`Stack` (Expo Router)** — Navigation par pile

---

## 🧩 Component Architecture

### Patterns d'Architecture
- **Composition sur héritage** — Créer des composants en combinant d'autres composants
- **Prop Spreading** — `{style, ...rest}` pattern
  - Récupérer `style` spécifiquement, passer le reste aux enfants
- **Component Customization** — Props `style` pour permettre l'override
- **Reusable Components** — Components génériques (Card, Row, SearchBar, Radio, ThemedText)
- **Domain-Specific Components** — Components spécifiques au domaine (PokemonCard)

### Composants du Projet
- **`<Card>`** — Wrapper avec ombre et couleur de fond
- **`<Row>`** — Layout flexbox horizontal avec `gap` optionnel
- **`<ThemedText>`** — Text wrapper avec variantes (headline, body3, caption, etc.)
- **`<SearchBar>`** — TextInput filtrée
- **`<SortButton>`** — Bouton avec Modal pour le tri
- **`<Radio>`** — Composant de sélection
- **`<PokemonCard>`** — Carte Pokemon avec image et overlay

---

## 🔤 TypeScript

### Concepts TypeScript Utilisés
- **Generics** — `<T extends keyof API>`
  - Rendre une fonction générique avec contraintes de type
- **Type Unions** — `"id" | "name"` pour les valeurs possibles
- **Type Inference** — TypeScript déduit les types automatiquement
- **`as` / Type Casting** — `as Promise<API[T]>`
- **`keyof`** — Extraire les clés d'un objet (`keyof API`)
- **`satisfies`** — Vérifier qu'une valeur satisfait un type
- **Type Annotations** — `: Props`, `: string`, `: number`

### API Type System
```typescript
type API = {
    '/pokemon?limit=21': {
        count: number,
        next: string | null,
        results: { name: string, url: string }[]  
    }
}
```
- Registre manuel des endpoints API
- Utilisé pour typage strict des réponses fetch

---

## 🎯 Fonctionnalités Core de l'App

### Home Screen (`app/index.tsx`)
- **State Lifting** — État (search, sort) à niveau du parent
- **Conditional Rendering** — `{isFetching ? <ActivityIndicator /> : null}`
- **List Filtering** — Filtrer les résultats côté client
  - `pokemons.filter(p => p.name.includes(search))`
- **List Sorting** — Trier par clé dynamique
  - `sort((a, b) => (a[sortkey] > b[sortkey]) ? 1 : -1)`
- **Array Flattening** — `data?.pages.flatMap(page => page.results)`
- **Optional Chaining** — `data?.pages` — accéder sans erreur si `null`
- **Nullish Coalescing** — `?? []` — valeur par défaut si `null/undefined`
- **Infinite Scroll** — `onEndReached={() => fetchNextPage()}`

### Detail Page (`app/pokemon/[id].tsx`)
- **Route Parameters** — `useLocalSearchParams()` pour récupérer l'ID
- **Page actuellement un stub** — À développer avec stats/abilities

### Modal Pattern (`components/SortButton.tsx`)
- **`useState` pour contrôler la visibilité**
- **Transparent Modal** avec backdrop
- **Pressable backdrop** pour fermer le modal
- **Options avec Radio buttons**

---

## 🚀 Expo Framework

### Expo Concepts
- **Expo CLI** — `npm start` pour lancer l'app
- **Development Client** — Choisir iOS/Android/Web au runtime
- **TypedRoutes** — Génération automatique des types de route
- **Experiments** — Features expérimentales activées
  - `typedRoutes`, `reactCompiler`
- **Platform-Specific Code** — `.ios.ts`, `.web.ts`, `.android.ts`

### Assets & Images
- **`require('@/assets/images/...')`** — Images locales
- **`uri: string`** — Images distantes
- **`expo-image`** — Composant Image avec caching automatique

---

## 🔄 API Patterns

### Fetch & API Calls
- **REST API** — PokéAPI (`https://pokeapi.co/api/v2`)
- **Pagination** — `?limit=21` query param, `next` URL dans réponse
- **Query Keys** — Clés pour identifier les requêtes en cache
  - Format: `[path]` ou `[path, params]`
- **Error Handling** — Pas encore implémenté (à améliorer)

### Artificial Delay
- **`wait(ms)`** — Promesse qui attend X ms
  - Utilisée pour simuler la latence réseau en développement

---

## 🔌 Libraries & Dépendances Clés

- **`react-native`** — Framework mobile
- **`expo`** — Plateforme par-dessus React Native
- **`expo-router`** — File-based routing
- **`@tanstack/react-query`** — Data fetching & caching
- **`@react-navigation/*`** — Navigation primitives
- **`react-native-safe-area-context`** — Gestion des zones sécurisées
- **`expo-image`** — Image avec caching
- **`react-native-reanimated`** — Animations
- **`@expo/vector-icons`** — Icônes vectorielles

---

## 📝 Patterns de Code

### String URL Parameters
- URL params doivent être **strings** → `String(value)` si nécessaire

### Component Props Pattern
```tsx
type Props = {
    style?: ViewStyle,
    value: string,
    onChange: (v: string) => void
}

export function MyComponent({ style, ...rest }: Props) {
    return <View style={[Styles.base, style]} {...rest} />
}
```

### Custom Hook Pattern
```tsx
export function useCustom<T extends keyof API>(path: T) {
    return useQuery({
        queryKey: [path],
        queryFn: async () => { /* ... */ }
    })
}
```

### Conditional Style Application
```tsx
<View style={[
    Styles.container,
    style,
    gap ? { gap } : undefined
]} />
```

---

## 🎓 Topics de Recherche Supplémentaires

### Si tu veux approfondir:
1. **Expo Router** — File-based routing (vs React Navigation)
2. **React Query / Tanstack Query** — Data fetching patterns
3. **TypeScript Generics** — Type-safe API calls
4. **FlatList vs ScrollView** — Performance optimization
5. **SafeAreaView** — Gestion des notches/barres
6. **Custom Hooks** — Extraction de logique réutilisable
7. **Modal Pattern** — UI/UX patterns pour les modals
8. **StyleSheet.create()** — Optimisation des styles
9. **Array Methods** — `flatMap`, `filter`, `sort` (JavaScript ES6)
10. **Optional Chaining & Nullish Coalescing** — Gestion des valeurs nullables (JavaScript)
11. **Platform-Specific Imports** — Code spécifique à iOS/Android/Web
12. **Expo Experiments** — Features expérimentales (typedRoutes, reactCompiler)
