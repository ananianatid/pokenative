import { Colors } from "@/constants/colors";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
const endpoint = 'https://pokeapi.co/api/v2'

type API = {
    '/pokemon?limit=21': {
        count: number,
        next: string | null,
        results:{name: string, url: string}[]  
    },
    "/pokemon/[id]": {
  id: number;
  name: string;
  url: string;
  weight: number;
  height: number;
  moves: {
    move: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  cries: {
    latest: string;
  };
  types: {
    type: {
      name: keyof typeof Colors.type;
    };
  }[];
}
}

type PaginatedAPI = Pick<API, '/pokemon?limit=21'>

export function useFetchQuery<T extends keyof API>(path: T, params?: Record<string, string | number>){
    const localUrl = endpoint + Object.entries(params ?? {}).reduce<string>((acc, [key, value]) => {
        return acc.replaceAll(`[${key}]`, value.toString())
    }, path)
    return useQuery({
        queryKey: [localUrl],
        queryFn: async () => {
           await wait(1000);
           return fetch(localUrl).then(res => res.json() as Promise<API[T]> )
        }
    })
}

export function useInfiniteFetchQuery<T extends keyof PaginatedAPI>(path: T){
    return useInfiniteQuery({
        queryKey: [path],
        initialPageParam: endpoint + path,
        queryFn: async ({pageParam}) => {
           await wait(1000);
           return fetch(pageParam, {
            headers: {
                'Accept': 'application/json'
            }
           }).then(res => res.json() as Promise<PaginatedAPI[T]>  )
        },
        getNextPageParam: (lastPage) => {
            return lastPage.next ?? null
        }
    })
}
function wait(ms: number) { 
    return new Promise(resolve => setTimeout(resolve, ms));
}