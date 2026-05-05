import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const endpoint = 'https://pokeapi.co/api/v2'
export function useFetchQuery(path: string){
    return useQuery({
        queryKey: [path],
        queryFn: async () => {
           await wait(1 );
           return fetch(endpoint + path).then(res => res.json())
        }
    })
}

export function useInfiniteFetchQuery(path: string){
    return useInfiniteQuery({
        queryKey: [path],
        initialPageParam: endpoint + path,
        queryFn: async ({pageParam}) => {
           await wait(1000);
           return fetch(pageParam, {
            headers: {
                'Accept': 'application/json'
            }
           }).then(res => res.json())
        },
        getNextPageParam: (lastPage) => {
            return lastPage.next ?? null
        }
    })
}
function wait(ms: number) { 
    return new Promise(resolve => setTimeout(resolve, ms));
}