import {createData, updateData, deleteData, getDATA} from "./api.js";
import { renderFilms, renderCategory, renderFavorites } from "./render.js";
import { filterCategory, filterSearch} from "./filter.js";
import { loadFavorites, saveFavorites } from "./favorites.js";
import { uploadImage } from "./upload_img.js";

const message = document.querySelector("#message");
const filmsContainer = document.querySelector("#filmsContainer");
const editModal = document.querySelector("#editModal");
const changeDescriptor = document.querySelector("#changeDescriptor");
const selectSection = document.querySelector("#selectSection");
const filterSelect = document.querySelector("#filterSelect");
const searchInput = document.querySelector("#searchInput");
const header = document.querySelector("header");
const favoritesWindow = document.querySelector("#favoritesWindow");
const addFilmModal = document.querySelector("#addFilmModal");
const addFilmForm = document.querySelector("#addFilmForm")

let films = [];
let favorites = loadFavorites();

function changeFavoriteIcon () {
    let films_id = [];
    let temp = Array.from(filmsContainer.children);
    favorites.forEach(film=>{films_id.push(film.id)})
    let targets = temp.filter(film=> films_id.includes(film.id));
    targets.forEach(el=> el.querySelector(".film-header > a").style = "color: red;")
}

async function start() {
    try {
        message.textContent = "Загрузка..."
        let data = await getDATA("post_data");
        message.textContent = ""
        films = data;
        renderFilms(films);
        changeFavoriteIcon();
        renderCategory(films);

    } catch(error) {
        message.textContent = `Ошибка ${error.message}`;
    }
}

start();


filmsContainer.addEventListener("click", async function(event) {
    const id = event.target.dataset.id;
    let target_film = films.find(film=>film.id === id);
    if (event.target.tagName === "BUTTON") {
        
        switch(event.target.dataset.action) {
            case "delete":
                try {
                    await deleteData("post_data", target_film.id);
                    films = films.filter(film=>film.id !== id);
                    renderFilms(films);
                } catch(error) {
                    message.textContent = `Ошибка ${error.message}`;
                };
                return;
            case "update":
                editModal.classList.remove("hidden");
                changeDescriptor.value = target_film.description
                editModal.id = id;
                return;
        }
    }
    else if (event.target.dataset.action === "addFavorite") {
                event.preventDefault();
                let target_element = Array.from(event.target.parentElement.children).find(el=> el.tagName === "A");
                let flag = favorites.find(film=>film.id === target_film.id);
                if(flag) {
                    return;
                }
                target_element.style = "color: red;"
                favorites.push(target_film);
                saveFavorites(favorites);
    }

});

editModal.addEventListener("click", async function(event){
    if (event.target.tagName === "BUTTON") {
        const id = event.currentTarget.id

        switch(event.target.dataset.action) {
            case "closeModal":
                editModal.classList.add("hidden");
                return;
            case "saveDescription":
                let target_film = films.find(film=>film.id === id);
                if (!changeDescriptor.value.trim()) {
                    return;
                }

                target_film.description = changeDescriptor.value.trim();             
                
                try {
                    await updateData("post_data", id, target_film);
                    let data = await getDATA("post_data");
                    films = data;
                    editModal.classList.add("hidden");
                    renderFilms(films);

                } catch(error) {
                    message.textContent = `Ошибка ${error.message}`;
                }
                return;
        }
    }
});

selectSection.addEventListener("change", function(){
    renderFilms(filterCategory(films, filterSelect.value));
    changeFavoriteIcon();
    searchInput.value = ""
});

selectSection.addEventListener("input", function(){
    renderFilms(filterSearch(films, searchInput.value, filterSelect.value));
    changeFavoriteIcon();
});

selectSection.addEventListener("click", function(event) {
    if (event.target.dataset.action === "reset") {
        filterSelect.value = "Все";
        searchInput.value = "";
        renderFilms(films);
        changeFavoriteIcon();
    }
}
);

header.addEventListener("click", event=>{
    const favoritesWindow = document.querySelector("#favoritesWindow");
    switch(event.target.dataset.action) {
        case "showFavorites":
            favoritesWindow.classList.remove("hidden");
            renderFavorites(favorites);
            return;
        case "addNewFilm":
            addFilmModal.classList.remove("hidden");

    }
});

favoritesWindow.addEventListener("click", event=>{
    const id = event.target.dataset.id;
    switch(event.target.dataset.action) {
        case "closeModal":
            favoritesWindow.classList.add("hidden");
            return;
        case "removeFavorite":
            favorites = favorites.filter(film => film.id !== id);
            saveFavorites(favorites);
            renderFavorites(favorites);
            renderFilms(filterSearch(films, searchInput.value, filterSelect.value));
            changeFavoriteIcon();
            return;    
    }
});

addFilmModal.addEventListener("click", event=>{
    if (event.target.dataset.action === "closeModal") {
        addFilmModal.classList.add("hidden");
        return;
    }
});

addFilmForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    if (event.submitter.daisabled) return;
    event.submitter.disabled = true;
    const fields = new FormData(addFilmForm);
    const file = fields.get("picture");

    try {
        let imageUrl = "";

        if (file instanceof File && file.size > 0) {
        imageUrl = await uploadImage(file);
        }

        const data = await createData("post_data", {
            title: fields.get("title").trim(),
            description: fields.get("description").trim(),
            gener: fields.get("gener").trim(),
            review: fields.get("review"),
            picture: imageUrl
        });
        addFilmForm.reset();                                                        
        addFilmModal.classList.add("hidden");
        films.push(data);
        renderFilms(films);
        changeFavoriteIcon();

    } catch(error) {
        console.log(error.message);
    } finally {
        event.submitter.disabled = false;
        return;
    }
})




