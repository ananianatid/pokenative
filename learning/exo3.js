const  getPokemon  = async (id) =>{
    const response  = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const data = await response.json()
    console.log("#"+id+" - "+data.name+" ("+ data.types[0].type.name+")")
    console.log()
}

getPokemon(25)
getPokemon(6)
getPokemon(150)