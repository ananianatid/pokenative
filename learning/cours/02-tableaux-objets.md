# 🎓 Leçon 2 : Tableaux, Objets et méthodes utiles

## 1. Les tableaux

Un tableau = une **liste** :

```js
const dresseurs = ["Sacha", "Ondine", "Pierre"]
console.log(dresseurs[0]) // "Sacha"
console.log(dresseurs.length) // 3
```

## 2. Les objets

Un objet = une **fiche d'identité** (clé → valeur) :

```js
const pikachu = {
    nom: "Pikachu",
    type: "Électrik",
    numero: 25
}
console.log(pikachu.nom)    // "Pikachu"
console.log(pikachu["nom"]) // "Pikachu" (autre manière)
```

## 3. Tableau d'objets (comme dans le projet)

```js
const equipe = [
    { nom: "Pikachu",  type: "Électrik" },
    { nom: "Bulbizarre", type: "Plante" },
    { nom: "Salamèche", type: "Feu" }
]
// Accéder : equipe[0].nom → "Pikachu"
//           equipe[1].type → "Plante"
```

---

## 4. ⭐ Les méthodes "magiques" du tableau

Ces méthodes sont **partout** dans le projet Pokémon.

### `.filter()` — Garder seulement certains éléments

```js
const equipe = [
    { nom: "Pikachu", type: "Électrik" },
    { nom: "Bulbizarre", type: "Plante" },
    { nom: "Raichu", type: "Électrik" }
]

const electrik = equipe.filter(pokemon => pokemon.type === "Électrik")
// Résultat : [{ nom: "Pikachu", type: "Électrik" }, { nom: "Raichu", type: "Électrik" }]
```

**Comment ça marche :**
- `.filter()` reçoit une fonction qui est appelée pour **chaque élément**
- Si la fonction renvoie `true` → l'élément est **gardé**
- Si `false` → l'élément est **jeté**
- `filter` crée un **nouveau tableau**, il ne modifie pas l'original

```js
// Équivalent avec une boucle for :
function filter(original, critere) {
    const resultat = []
    for (let i = 0; i < original.length; i++) {
        if (critere(original[i])) {
            resultat.push(original[i])
        }
    }
    return resultat
}
// 👆 C'est EXACTEMENT ce que fait .filter() ! Juste plus court.
```

### `.forEach()` — Exécuter quelque chose pour chaque élément

```js
equipe.forEach(pokemon => {
    console.log(pokemon.nom + " est de type " + pokemon.type)
})
// Affiche :
// Pikachu est de type Électrik
// Bulbizarre est de type Plante
// Salamèche est de type Feu
```

**Différence avec une boucle for :**
```js
// Boucle classique
for (let i = 0; i < equipe.length; i++) {
    console.log(equipe[i].nom)
}

// forEach (plus court, plus lisible)
equipe.forEach(p => console.log(p.nom))
```

### `.map()` — Transformer chaque élément

```js
const noms = equipe.map(p => p.nom)
// ["Pikachu", "Bulbizarre", "Salamèche"]

const descriptions = equipe.map(p => p.nom + " (" + p.type + ")")
// ["Pikachu (Électrik)", "Bulbizarre (Plante)", "Salamèche (Feu)"]
```

**C'est ce qui est utilisé dans le projet Pokémon :**
```js
// Dans index.tsx du projet :
const pokemons = data?.pages.flatMap(page =>
    page.results.map(r => ({name: r.name, id: getPokemonId(r.url)}))
) ?? []
```

### `.find()` — Trouver UN seul élément

```js
const pikachu = equipe.find(p => p.nom === "Pikachu")
// { nom: "Pikachu", type: "Électrik" }

const introuvable = equipe.find(p => p.nom === "Mewtwo")
// undefined (pas trouvé)
```

---

## Résumé

| Méthode | Ce qu'elle fait | Renvoie |
|---|---|---|
| `.filter(critere)` | Garde les éléments qui correspondent | Nouveau tableau |
| `.forEach(action)` | Exécute une action pour chaque élément | Rien (undefined) |
| `.map(transformation)` | Transforme chaque élément | Nouveau tableau |
| `.find(critere)` | Trouve le premier élément qui correspond | L'élément ou `undefined` |

**Toutes ces méthodes prennent une fonction en paramètre.** C'est pour ça qu'il fallait comprendre les fonctions d'abord ! 😄
