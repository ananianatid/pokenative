const pokemons = [
     {nom: "Bulbizare",type: "plante"},
     {nom: "pikachu",type: "electrique"},
     {nom: "salameche",type: "feu"}
]

const team =[pokemons[0],pokemons[1],pokemons[2]]
//console.log(team)
const afficheEquipe = (tableau) =>{
    for (i=0; i < 3; i++){
        console.log(tableau[i].nom)
    }
}

const filtrerParType = (type, tableau) => {
    for (i=0; i < 3; i++){
        if (tableau[i].type === type){
            console.log(tableau[i].nom)
        }
    }
}

//afficheEquipe(team)
filtrerParType('feu',team)