# 🎓 Leçon 3 : async/await et fetch

## 1. Le problème : le temps d'attente

Quand ton app va chercher des données sur Internet :

```js
const resultat = fetch("https://pokeapi.co/api/v2/pokemon/25")
// ❌ À cette ligne, les données ne sont PAS encore arrivées !
```

JavaScript ne veut pas **bloquer** tout le programme en attendant. Donc il continue et revient plus tard.

## 2. La solution moderne : async/await

```js
async function getPikachu() {
    const reponse = await fetch("https://pokeapi.co/api/v2/pokemon/25")
    const data = await reponse.json()
    console.log(data.name) // "pikachu" ✅ Cette fois c'est bon
}
```

- `async` → "cette fonction contient des opérations qui prennent du temps"
- `await` → "attends que ce soit fini avant de passer à la ligne suivante"

## 3. fetch — aller chercher des données

```js
const reponse = await fetch("https://pokeapi.co/api/v2/pokemon/25")
// reponse = la réponse HTTP (status, headers...)

const data = await reponse.json()
// data = les données converties en objet JS utilisable
```

### Exemple concret comme dans le projet

```js
// Ce qu'il se passe dans useFetchQuery.tsx :
queryFn: async () => {
    const reponse = await fetch("https://pokeapi.co/api/v2/pokemon/25")
    const data = await reponse.json()
    return data // ← React Query garde ces données en cache
}
```

## 4. Sans async/await : les Promesses (.then)

```js
fetch("https://pokeapi.co/api/v2/pokemon/25")
    .then(reponse => reponse.json())
    .then(data => console.log(data.name))
```

**C'est la même chose qu'async/await**, juste écrit différemment. Le `.then()` dit "quand ce sera prêt, fais ça".

## 5. Pourquoi React Query ?

Dans le projet, on n'appelle pas `fetch()` directement. On utilise **TanStack React Query** :

```js
const { data, isFetching } = useFetchQuery("/pokemon/[id]", { id: 25 })
```

React Query s'occupe de :
- Lancer le fetch au bon moment
- Garder les données en cache (pas besoin de recharger)
- Gérer le chargement (`isFetching`)
- Gérer les erreurs

## Le flux complet dans le projet

```
1. L'utilisateur arrive sur l'écran
2. useInfiniteFetchQuery appelle fetch() vers PokéAPI
3. Pendant le chargement → isFetching = true → on voit un spinner
4. Les données arrivent → isFetching = false → la liste s'affiche
5. L'utilisateur scroll → fetchNextPage() → nouvelles données
```

---

## Résumé visuel

```
Sans await :   fetch(...) → [JS continue son chemin] → ⏰ plus tard → données arrivées
Avec await :   await fetch(...) → [JS attend] → données arrivées → on continue
```
