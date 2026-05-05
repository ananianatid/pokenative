import { useQuery } from "@tanstack/react-query";

const endpoint = 'https://pokeapi.co/api/v2'
export function useFetchQuery(path: string){
    return useQuery({
        queryKey: [path],
        queryFn: async () => {
           await wait(1000);
           return fetch(endpoint + path).then(res => res.json())
        }
    })
}

function wait(ms: number) { 
    return new Promise(resolve => setTimeout(resolve, ms));
}