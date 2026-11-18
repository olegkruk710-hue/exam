export function filterCategory(films, category) {
    if (category === "Все") {
        return films
    }
    let filtered = films.filter(film=>film.gener === category);
    return filtered;
}

export function filterSearch(films, text, category) {
    let filtered
    if (category === "Все") {
        return filtered = films.filter(film=>film.title.toLowerCase().includes(text.trim().toLowerCase()));
    }
    filtered = films.filter(film=>film.title.toLowerCase().includes(text.trim().toLowerCase()) && film.gener === category);
    return filtered;
}