export function loadFavorites() {
    let films = JSON.parse(localStorage.getItem("favorites")) ?? [];
    return films;
}

export function saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}