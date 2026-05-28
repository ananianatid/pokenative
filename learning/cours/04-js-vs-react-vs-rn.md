# 🎓 Leçon 4 : JS vs React vs React Native (les différences)

## 1. JavaScript tout court

C'est le **langage de base**. Ce qui s'exécute dans Node.js (le terminal).

```js
// Fichier .js standard
const double = (n) => n * 2
console.log(double(5)) // 10
```

- Pas d'interface graphique
- On utilise `console.log()` pour voir le résultat
- On exécute avec `node monfichier.js`

## 2. React (pour le web)

React = **JavaScript + la capacité de créer des interfaces web**

```jsx
// Fichier .jsx
function Bouton() {
    return <button onClick={() => alert("Cliqué !")}>
        Clique-moi
    </button>
}
```

**Ce que React ajoute :**
- Le **JSX** : du HTML écrit dans du JavaScript (`<div>...</div>`)
- Les **composants** : des fonctions qui renvoient du JSX
- Les **props** : des paramètres passés à un composant
- L'**état (state)** : des données qui, quand elles changent, mettent à jour l'écran

```jsx
// Exemple complet React
function PokemonCard({ nom, type }) {  // ← Props (paramètres)
    const [like, setLike] = useState(0) // ← State (état)
    return (
        <div>
            <h2>{nom}</h2>
            <p>Type : {type}</p>
            <button onClick={() => setLike(like + 1)}>
                ❤️ {like}
            </button>
        </div>
    )
}
```

## 3. React Native

React Native = **React... mais pour mobile (iOS/Android)**

```jsx
// Fichier .tsx dans React Native
function PokemonCard({ nom, type }) {
    return (
        <View>               {/* ← <div> n'existe pas sur mobile */}
            <Text>{nom}</Text>   {/* ← <p> n'existe pas sur mobile */}
            <Image source={...} />
        </View>
    )
}
```

**Différences clés :**

| Concept | React (web) | React Native (mobile) |
|---|---|---|
| Conteneur | `<div>` | `<View>` |
| Texte | `<p>`, `<h1>` | `<Text>` |
| Images | `<img>` | `<Image>` |
| Bouton | `<button>` | `<Pressable>`, `<TouchableOpacity>` |
| Style | `className="maClasse"` | `style={{ flex: 1, color: "red" }}` |
| Scroll | CSS `overflow` | `<ScrollView>`, `<FlatList>` |

**Mais tout le reste est identique :**
- Les fonctions fléchées
- Les hooks (`useState`, `useEffect`)
- Les props
- Les tableaux et objets
- `async/await`

## 4. Et Expo dans tout ça ?

**Expo** = une boîte à outils qui rend React Native plus facile à utiliser.

- **Expo SDK 54** = la version d'Expo
- **Expo Router** = la navigation (chaque fichier `app/*.tsx` devient un écran)
- `expo start` = lance l'app

## 5. Visualisons les couches

```
┌─────────────────────────────────────┐
│         Ton code (index.tsx)         │  ← Toi ici
├─────────────────────────────────────┤
│           Expo / Expo Router         │  ← Navigation, builds
├─────────────────────────────────────┤
│           React Native               │  ← <View>, <Text>, <Image>
├─────────────────────────────────────┤
│              React                   │  ← Composants, hooks, JSX
├─────────────────────────────────────┤
│            JavaScript                │  ← Fonctions, tableaux, async
└─────────────────────────────────────┘
```

Chaque couche repose sur celle du dessous.

## 6. Pourquoi tout est en .tsx dans le projet ?

`.tsx` = **TypeScript** + JSX

TypeScript ajoute des **types** (comme une check-list que ton code doit respecter) :

```tsx
// 👇 cette fonction attend un nombre, pas du texte
function double(n: number): number {
    return n * 2
}

double("pikachu") // ❌ TypeScript t'arrête avant même d'exécuter
```

**Dans le projet :**
```tsx
// Le type dit "cette fonction reçoit id (nombre) et name (texte)"
function PokemonCard({ id, name }: { id: number, name: string }) {
    ...
}
```

---

## Résumé en une phrase

> **JavaScript** c'est la langue. **React** c'est la façon de faire des interfaces. **React Native** c'est la même chose mais pour téléphone. **Expo** c'est l'outil qui fait tourner le tout.

## Pour le projet Pokémon

Quand tu vois `app/index.tsx` :
- `.tsx` → TypeScript + JSX
- `app/` → c'est Expo Router (fichier = écran)
- dedans t'as du **JSX** (`<View>`, `<Text>`) = React Native
- avec des **fonctions fléchées** et `async/await` = JavaScript
- et des **types** (`: string`, `: number`) = TypeScript
