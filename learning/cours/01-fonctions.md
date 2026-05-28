# 🎓 Leçon 1 : Les fonctions en JavaScript

## 1. Les 3 écritures de fonction

### Écriture 1 : Déclaration classique

```js
function saluer(nom) {
    return "Bonjour " + nom
}
```

- **Caractéristique** : "hoistée" — tu peux l'appeler **avant** de la déclarer
- Utilisée pour : les fonctions principales, les utilitaires

```js
// Ça marche :
console.log(double(5)) // 10
function double(n) { return n * 2 }
```

### Écriture 2 : Expression de fonction

```js
const saluer = function(nom) {
    return "Bonjour " + nom
}
```

- On stocke une fonction **anonyme** (sans nom) dans une variable
- **Pas hoistée** — tu dois la déclarer avant de l'utiliser

### Écriture 3 : Fonction fléchée (arrow function) ⭐

```js
const saluer = (nom) => {
    return "Bonjour " + nom
}

// Version encore plus courte (1 seule instruction)
const saluer = (nom) => "Bonjour " + nom

// Sans paramètres
const direBonjour = () => "Bonjour"

// Un seul paramètre → on peut enlever les parenthèses
const double = n => n * 2
```

- **La plus utilisée dans React** — partout, tout le temps
- Plus courte, plus lisible
- Comportement spécial avec `this` (pas important pour l'instant)

---

## 2. Fonctions dans le projet Pokémon

### Dans le projet (useFetchQuery.tsx)

```js
// Fonction classique (exportée → utilisable ailleurs)
export function useFetchQuery(path, params) {
    return useQuery(...)
}

// Fonction fléchée passée en paramètre
queryFn: async () => {
    return fetch(url).then(res => res.json())
}

// Fonction fléchée dans .filter() et .map()
pokemons.filter(p => p.name.includes("pika"))
pokemons.map(p => p.name)
```

### Dans React (composants)

```jsx
// Un composant React = une fonction fléchée qui renvoie du JSX
const PokemonCard = ({ id, name }) => {
    return <View>
        <Text>{name}</Text>
    </View>
}

// Ou en classique (plus rare aujourd'hui)
function PokemonCard({ id, name }) {
    return <View>
        <Text>{name}</Text>
    </View>
}
```

**Les deux marchent.** Dans le projet, ils mélangent les deux styles. Pas de panique.

---

## 3. Fonctions passées en paramètre (callbacks)

C'est LE truc à comprendre pour React :

```js
// Une fonction qu'on passe à une autre fonction
// (comme un numéro de téléphone qu'on donne à quelqu'un)

function faireQuelqueChose(plusTard) {
    console.log("Je travaille...")
    plusTard() // J'appelle la fonction qu'on m'a donnée
}

// Appel avec une fonction anonyme directement
faireQuelqueChose(() => console.log("Terminé !"))

// C'est EXACTEMENT ce qui se passe ici :
<Pressable onPress={() => console.log("click")}>
//                    👆 on passe une fonction à onPress
```

---

## Résumé

| Syntaxe | Hoistée | Utilisation |
|---|---|---|
| `function toto() {}` | ✅ Oui | Fonctions nommées, utilitaires |
| `const toto = function() {}` | ❌ Non | (presque plus utilisée) |
| `const toto = () => {}` | ❌ Non | **React, callbacks, partout** |
| `(x) => x * 2` | ❌ Non | Version hyper-courte, 1 ligne |

### Règle d'or pour React : TOUJOURS la fléchée
