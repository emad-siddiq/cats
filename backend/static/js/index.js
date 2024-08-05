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
import { Cat } from "./components/cat.js";
import { Edit } from "./components/edit.js";
let carousel = new Carousel();
let favorites = new Favorites();
let catbreeds = document.getElementById("catbreeds");
fetchBreeds().then((data) => {
    for (let i = 0; i < data.length; i++) {
        let id = data[i][0];
        let name = data[i][1];
        catbreeds.innerHTML += "<option value=" + id + ">" + name + "</option>";
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
document.getElementById("carousel").addEventListener("dblclick", () => {
    console.log(carousel.getCurrentCat());
    favorites.addToFavorites(carousel.getCurrentCat());
    carousel.loadNext();
});
document.getElementById("edit-cat-data").addEventListener("click", () => {
    let curr_cat = carousel.getCurrentCat();
    let edit = new Edit(curr_cat);
    document.body.append(edit.div);
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
        var _a;
        try {
            const response = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(breed)
            });
            console.log(carousel.curr_cat_id);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            if (data["cats"]) {
                console.log('Response data:', data["cats"]);
                let cats = data["cats"];
                carousel.cat_cache = {};
                carousel.curr_cat_id = 0;
                for (let i = 1; i < cats.length + 1; i++) {
                    let cat = new Cat(cats[i - 1]["id"], cats[i - 1]["data"], cats[i - 1]["breed_id"], cats[i - 1]["breed_name"], cats[i - 1]["other_details"]);
                    carousel.cat_cache[i] = cat;
                }
                // Remove current cat and replace with first cat from selected breed
                var elem = document.getElementById(carousel.curr_cat_id.toString());
                (_a = elem === null || elem === void 0 ? void 0 : elem.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(elem);
                carousel.curr_cat_id += 1;
                let cat = carousel.cat_cache[carousel.curr_cat_id % 10];
                console.log(carousel.cat_cache, carousel.curr_cat_id, cat);
                carousel.description.innerText = cat.description;
                carousel.div.appendChild(cat.div);
                console.log(carousel.cat_cache);
            }
        }
        catch (error) {
            console.error('Error posting item:', error);
        }
    });
}
