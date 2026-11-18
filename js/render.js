export function renderFilms(films) {
    const filmsContainer = document.querySelector("#filmsContainer");
    filmsContainer.innerHTML = "";
    
    films.forEach(film=> {
        const filmContainer = document.createElement("div");
        filmContainer.className = "film-info"
        filmContainer.id = film.id;

        filmContainer.innerHTML = `
        <div class="film-header">
            <img class="film-poster" src="${film.picture}"
            alt="${film.title}">
            <a href="#" data-action="addFavorite" data-id="${film.id}">&hearts;</a>
        </div>    
            <h3 class="film-title">${film.title}</h3>
            <span class="film-genre">${film.gener}</span>
            <p class="film-description" id="filmDescription">${film.description}</p>
            <div class="film-footer">
                <span class="film-review">Оценка: <strong>${film.review}/10</strong></span>
                <button data-action="delete" data-id="${film.id}">Удалить</button>
                <button data-action="update" data-id="${film.id}">Редактировать</button>
            </div>`;

        filmsContainer.append(filmContainer);
    });
}   

export function renderCategory(films) {
    let categories = [];
    const filterSelect = document.querySelector("#filterSelect");
    films.forEach(film=>{
        if (!categories.includes(film.gener)) {
            categories.push(film.gener)
        }
    });
    categories.forEach(category=>{
        const option = document.createElement("option");
        option.value = category;
        option.textContent= category;
        filterSelect.append(option);
    })
}

export function renderFavorites(films) {
    const favoritesList = document.querySelector("#favoritesList");
    favoritesList.innerHTML = "";
    if (films.length === 0) {
        favoritesList.innerHTML = "Пока пусто...";
    }

    films.forEach(film=> {
       const filmContainer = document.createElement("div");
        filmContainer.className = "favorite-film";
        filmContainer.id = film.id;

        filmContainer.innerHTML = `
        <img src="${film.picture}" alt="${film.title}">
        <h3>${film.title}</h3>
        <p>${film.gener}</p>
        <p>${film.review}/10</p>
        <button data-action="removeFavorite" data-id="${film.id}">Удалить</button>
        `;
        favoritesList.append(filmContainer);
    });
}