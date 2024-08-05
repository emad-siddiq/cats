var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Carousel } from "./components/carousel.js";
import { Favorites } from "./components/favorites.js";
let carousel = new Carousel();
let favorites = new Favorites();
let catbreeds = document.getElementById("catbreeds");
fetchBreeds().then((data) => {
    let breeds = data["breeds"];
    for (let i = 0; i < breeds.length; i++) {
        catbreeds.innerHTML += "<option value=" + breeds[i][0] + ">" + breeds[i][1] + "</option>";
    }
});
catbreeds.addEventListener("change", (e) => {
    let value = e.target.value;
    const breed = { value: value };
    postBreed("http://127.0.0.1:8000/set_breed/", breed);
});
document.getElementById("cats").appendChild(carousel.div);
document.getElementById("cats").appendChild(favorites.div);
document.getElementById("add-to-favs").addEventListener("click", () => {
    console.log(carousel.getCurrentCat());
    favorites.addToFavorites(carousel.getCurrentCat());
    carousel.loadNext();
});
document.getElementById("remove-from-favs").addEventListener("click", () => {
    favorites.removeFromFavorites(carousel.getCurrentCat());
});
function fetchBreeds() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'http://localhost:8000/breeds';
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            console.log('Fetched breeds:', data);
            return data;
        }
        catch (error) {
            console.error('Error fetching breeds:', error);
        }
    });
}
function postBreed(url, breed) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(breed)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            console.log('Response data:', data);
            if (data["done"] === "ok") {
                carousel.getNewBatch();
            }
        }
        catch (error) {
            console.error('Error posting item:', error);
        }
    });
}
