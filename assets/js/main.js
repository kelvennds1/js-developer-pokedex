const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const pokemonsDetails = {}
const maxRecords = 151
const limit = 10
let offset = 0;



function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-id ="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}
function fillModalWithPokemonDetails(pokemonDetails) {
    const modalBody = document.querySelector('.modal-body'); // Elemento que exibe o corpo do modal

    if (modalBody) {
        const html = `
        <div class="top_content">
            <div class="header">
                <button type="button" class="modal-close-button" data-bs-dismiss="modal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg>
                </button>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                </svg>
            </div>
            <div class="top">
                <div class="left-side-top">
                    <span class="modal-name">${pokemonDetails.name}</span>
                    <div class="detail">
                        <ol class="types">
                            ${pokemonDetails.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>
                    </div>
                </div>
                <div class="rightt-side-top">
                    <span class="number">#${pokemonDetails.number}</span>
                </div>
            </div>
            <img src="${pokemonDetails.photo}" alt="${pokemonDetails.name}"> 

        </div>
        <div class="footer_content">
            <div class="content-stats">
                <h3>Base Stats</h3>
                <div class="list-stats">
                    <ol class="stats">
                        ${pokemonDetails.stats.map((stat) => `<li class="">${stat[0]}</li>`).join('')}  
                    </ol>
                    <ol class="base-stats">
                        ${pokemonDetails.stats.map((stat) => `<li class="">${stat[1]}</li>`).join('')}  
                    </ol>
                </div>
            </div>
        </div>
        `;
        modalBody.innerHTML = html; // Preenche o corpo do modal com o HTML gerado

        const modal = new bootstrap.Modal(document.getElementById('modalExemplo'));
        modal.show();
    }
}



pokemonList.addEventListener('click', (event) => {
    const clickedPokemon = event.target.closest('.pokemon'); // Encontre o elemento pai <li> clicado
    if (clickedPokemon) {
        const pokemonID = clickedPokemon.dataset.id; // Obtenha o índice do Pokémon a partir do atributo data-
        const pokemonDetails = pokemonsDetails[pokemonID];
        console.log(pokemonDetails.stats)
        fillModalWithPokemonDetails(pokemonDetails); // Abra a modal com os detalhes do Pokémon
    }
});


function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
        pokemons.forEach((pokemon) => {
            const id = pokemon.number;
            const data = pokemon;
            pokemonsDetails[id] = data;
          });
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})