---
name: Add API Endpoint
description: This skill should be used when the user wants to "add a new api endpoint", "register an endpoint", "extend the api type system", "add poke-api endpoint", "create a new data query", or needs to register and integrate new PokéAPI endpoints with proper TypeScript types.
version: 0.1.0
---

# Add API Endpoint Skill

This skill guides adding new PokéAPI endpoints with proper TypeScript type registration and integration.

## Current Architecture

The project uses a **manual API type registry** in [hooks/useFetchQuery.tsx](hooks/useFetchQuery.tsx):

```tsx
type API = {
  '/pokemon?limit=21': { count: number; next: string | null; results: ... },
  "/pokemon/[id]": { id: number; name: string; ... },
  "/pokemon-species/[id]": { flavor_text_entries: ... }
}

type PaginatedAPI = Pick<API, '/pokemon?limit=21'>
```

This approach is **intentionally explicit** (not auto-scalable) to maintain type safety while new endpoints are added.

## Limitations & Design Notes

- **Manual registration**: Each new endpoint must be added to the `API` type union
- **Limited scalability**: Not designed for hundreds of endpoints; works well for targeted use cases
- **Type safety trade-off**: Explicit typing provides IDE autocomplete and compile-time validation
- **Pagination support**: Only endpoints in `PaginatedAPI` support infinite scroll via `useInfiniteQuery`

## Workflow to Add an Endpoint

### Step 1: Identify the Endpoint

From [PokéAPI documentation](https://pokeapi.co/docs/v2):

```
GET /pokemon/{id}              # Single Pokemon
GET /pokemon/{id}/encounters   # Pokemon encounters
GET /ability/{id}               # Pokemon ability
GET /item/{id}                  # Battle items
GET /move/{id}                  # Move details
```

### Step 2: Fetch and Document the Response Schema

Decide if it will be:
- **Single query**: Add to `API` type
- **Paginated query**: Add to both `API` and `PaginatedAPI` type

Example for `/move/[id]`:
```tsx
GET /move/1
Response:
{
  id: 1,
  name: "pound",
  power: 40,
  accuracy: 100,
  type: {
    name: "normal",
    url: "https://pokeapi.co/api/v2/type/1/"
  },
  effect_entries: [
    { effect: "...", language: { name: "en" } }
  ]
}
```

### Step 3: Add Type Definition to API Registry

Open [hooks/useFetchQuery.tsx](hooks/useFetchQuery.tsx) and add the endpoint to the `API` type:

```tsx
type API = {
  // existing endpoints...
  "/move/[id]": {
    id: number;
    name: string;
    power: number | null;
    accuracy: number | null;
    type: {
      name: string;
      url: string;
    };
    effect_entries: {
      effect: string;
      language: {
        name: string;
      };
    }[];
  }
}
```

**Type Safety Rules:**
- Use exact property names from API response
- Mark nullable fields with `| null` (e.g., `power: number | null`)
- For types that reference other endpoints, use union of string literals when the endpoint is registered:
  ```tsx
  type: {
    name: keyof typeof Colors.type;  // ← Already validated by Colors.type keys
    url: string;
  }
  ```
- Avoid `any`; be explicit about optional properties

### Step 4: Add to Paginated Type (if applicable)

If the endpoint supports pagination (has `next`, `previous`, `results`), add it to `PaginatedAPI`:

```tsx
type PaginatedAPI = Pick<API, '/pokemon?limit=21' | '/move?limit=20'>
```

This enables use with `useInfiniteQuery` hook.

### Step 5: Create Query Hook (Optional)

For frequently-used endpoints, create a wrapper hook in [hooks/useFetchQuery.tsx](hooks/useFetchQuery.tsx):

```tsx
// Simple query
export function useFetchMove(id: number) {
  return useFetchQuery("/move/[id]", { id: String(id) });
}

// Paginated query
export function useFetchMoves(limit: number = 20) {
  return useInfiniteQuery({
    queryKey: [`/move?limit=${limit}`],
    initialPageParam: `${endpoint}/move?limit=${limit}`,
    queryFn: async ({ pageParam }) => {
      await wait(1000);
      return fetch(pageParam, {
        headers: { 'Accept': 'application/json' }
      }).then(res => res.json() as Promise<API["/move?limit=20"]>);
    },
    getNextPageParam: (lastPage) => lastPage.next ?? null,
  });
}
```

**Critical:** `getNextPageParam` MUST return the full API URL string from the response, not a relative path.

### Step 6: Use in Components

Once registered, use the hook safely with full TypeScript support:

```tsx
import { useFetchMove } from '@/hooks/useFetchQuery';

export function MoveDetail({ moveId }: { moveId: number }) {
  const { data: move, isFetching } = useFetchMove(moveId);
  
  return (
    <Card>
      <ThemedText>{move?.name}</ThemedText>
      <ThemedText>Power: {move?.power ?? '-'}</ThemedText>
    </Card>
  );
}
```

## Common Endpoints to Add

| Endpoint | Purpose | Paginated? | Key Type |
|----------|---------|-----------|----------|
| `/move/[id]` | Move details | Yes | `name` |
| `/ability/[id]` | Ability effects | Yes | `name` |
| `/item/[id]` | Item descriptions | Yes | `name` |
| `/type/[id]` | Type details | Yes | `name` |
| `/stat/[id]` | Stat information | No | `name` |
| `/region/[id]` | Region data | No | `name` |
| `/generation/[id]` | Generation data | No | `name` |

## Type System Considerations

### Re-usable Type Patterns

```tsx
// Language entries (appears in move, ability, species descriptions)
LanguageEntry<T> = {
  [field: string]: string;
  language: {
    name: string;
  };
}

// Named references (Pokemon types link to other resources)
NamedReference = {
  name: string;
  url: string;
}

// Versioned entries (different by game generation)
VersionedEntry<T> = {
  ...T;
  version: NamedReference;
}
```

### Validation Patterns

- Always mark `| null` for fields that PokéAPI returns as `null` in some cases (e.g., `move.power`)
- Use union types for constrained string values: `"normal" | "fire" | "water"` (or `keyof typeof Colors.type` if the value is Pokemon type)
- Avoid `Record<string, any>` patterns; prefer explicit object shapes

## Gotchas & Pitfalls

1. **Pagination URLs**: `getNextPageParam` must return the string from `response.next`, not reconstruct the URL
2. **Language filtering**: Most descriptive fields have language variants; always filter for `"en"` or implement language selection
3. **Version variants**: Some Pokemon have multiple entries by game version; decide which version to prioritize
4. **Nested resources**: Don't fetch entire nested resources; use references and fetch separately when needed for performance
5. **Type conflicts**: `Colors.type` has specific type names; validate against this when typing Pokemon types from API

## Performance Considerations

- **Artificial delay**: Current hooks use `await wait(1000)` for dev testing; remove before production
- **Query caching**: React Query caches by `queryKey`; ensure keys are unique per endpoint + params
- **Error handling**: Currently not implemented; consider adding error state exposure for new endpoints
- **Request batching**: Avoid fetching the same endpoint multiple times; use React Query's automatic deduplication
