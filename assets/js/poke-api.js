const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon()
  pokemon.number = pokeDetail.id
  pokemon.name = pokeDetail.name

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
  const [type] = types

  pokemon.types = types
  pokemon.type = type
  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

  return pokemon
}
pokeApi.getPokemonsDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json()) // buscando uma lista de detalhes dos pokemons e convertendo em json
    .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

  return fetch(url) // buscando uma lista de pokemon que nos dá um http response
    .then((response) => response.json()) // pegando uma promise do body (http response) e convertendo em json
    .then((jsonBody) => jsonBody.results) // recebendo esse body convertido (json) e limitando aos results (lista de pokemons)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonsDetail)) // mapeando a lista em uma lista de requisições dos detalhes dos pokemons
    .then((detailsRequests) => Promise.all(detailsRequests)) // esperando que todas as requisições terminem
    .then((pokemonDetails) => pokemonDetails) // ao final das requisições, ele me retorna a própia lista de detalhes
}
