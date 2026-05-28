# 🎓 Leçon 5 : React — Les bases

## 1. Le concept : tout est composant

Un **composant React** = **une fonction qui renvoie du JSX**.

```jsx
// C'EST TOUT. Un composant, c'est juste ça :
function MonComposant() {
    return <View><Text>Salut</Text></View>
}
```

## 2. Le JSX — du HTML dans du JS

```jsx
// JSX = JavaScript + XML (du HTML-like)
const element = <Text>Bonjour</Text>

// On peut mettre du JS dans les {}
const nom = "Pikachu"
const element = <Text>Bonjour {nom}</Text>  // Affiche "Bonjour Pikachu"
```

**Règles :**
- `{variable}` → insère une variable
- `{fonction()}` → insère le résultat d'une fonction
- Les attributs JSX : `className` au lieu de `class`, `style={{}}` (objet)

## 3. Les Props — passer des infos à un composant

```jsx
// Les props = les paramètres d'entrée du composant
function PokemonCard({ nom, type }) {
    return (
        <View>
            <Text>{nom}</Text>
            <Text>{type}</Text>
        </View>
    )
}

// Utilisation :
<PokemonCard nom="Pikachu" type="Électrik" />
//            👆 Les props qu'on passe
```

**Analogie :** une carte de visite. Le composant `PokemonCard` est le moule, les props sont les infos qu'on imprime dessus.

## 4. Le State (état) — ce qui rend React magique

```jsx
import { useState } from "react"

function Compteur() {
    const [compte, setCompte] = useState(0)
    //    👆 valeur    👆 fonction pour changer la valeur
    
    return (
        <View>
            <Text>{compte}</Text>
            <Pressable onPress={() => setCompte(compte + 1)}>
                <Text>+1</Text>
            </Pressable>
        </View>
    )
}
```

**Ce qui se passe :**
1. `useState(0)` → crée une variable `compte` qui commence à 0
2. L'utilisateur appuie sur le bouton → `setCompte(compte + 1)`
3. **React re-affiche automatiquement** le composant avec la nouvelle valeur
4. `compte` est maintenant 1 → l'écran montre 1

**Sans `useState`**, si tu changes une variable normale, l'écran ne se met pas à jour.

## 5. La règle des hooks

Tous les hooks React commencent par `use` :
- `useState` → état
- `useEffect` → effets de bord
- Dans le projet : `useThemeColors`, `useFetchQuery`

On ne peut les appeler qu'**au début** d'un composant, pas dans des conditions ou des boucles.

## 6. Mini schéma mental

```
Données (props/state)
        │
        ▼
   [Composant React]  ← fonction qui renvoie du JSX
        │
        ▼
   Interface affichée  ← l'écran que tu vois
        │
        ▼
   Interaction utilisateur (click, scroll...)
        │
        ▼
   setState(nouvelleValeur)
        │
        ▼
   Le composant se re-affiche ← tout repart du début
```

## 7. Ton code vs le projet

```js
// Ton exo3.js :
const getPokemon = async (id) => {
    const response = await fetch(...)
    const data = await response.json()
    console.log(data.name)
}
getPokemon(25)
```

```tsx
// Dans le projet (useFetchQuery.tsx) :
export function useFetchQuery(path, params) {
    return useQuery({
        queryKey: [localUrl],
        queryFn: async () => {
            return fetch(localUrl).then(res => res.json())
        }
    })
}

// Dans index.tsx :
const { data, isFetching } = useFetchQuery("/pokemon/25")
// data = ce que ton getPokemon renvoyait
// isFetching = true/false selon si les données sont arrivées
```

**La seule différence :** React Query gère le cache et le statut de chargement à ta place. Toi t'écrivais `console.log(data.name)` — ici React le met dans le JSX à la place.
