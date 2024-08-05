

import {Carousel} from "./components/carousel.js";
import { Description } from "./components/description.js";
import { Favorites } from "./components/favorites.js";

let carousel = new Carousel();
let favorites = new Favorites();


let catbreeds = document.getElementById("catbreeds");

fetchBreeds().then((data) => {
    let breeds = data["breeds"];
    for (let i = 0; i < breeds.length; i++) {
        catbreeds.innerHTML += "<option value=" + breeds[i][0] + ">"+breeds[i][1]+"</option>";
    }
}
);

catbreeds.addEventListener("change", (e) => {
    let value = (<HTMLSelectElement>e.target).value;
    const breed: Breed = { value: value };

    postBreed("http://127.0.0.1:8000/set_breed/", breed);
    
})



document.getElementById("cats").appendChild(carousel.div);
document.getElementById("cats").appendChild(favorites.div);

document.getElementById("add-to-favs").addEventListener("click", () => {
    console.log(carousel.getCurrentCat())
    favorites.addToFavorites(carousel.getCurrentCat());

    carousel.loadNext();
})

document.getElementById("remove-from-favs").addEventListener("click", () => {

    favorites.removeFromFavorites(carousel.getCurrentCat());
})


async function fetchBreeds() {
    const url = 'http://localhost:8000/breeds';

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched breeds:', data);
        
        return data;
    } catch (error) {
        console.error('Error fetching breeds:', error);
    }
}

interface Breed {
    value: string;
}

async function postBreed(url: string, breed: Breed) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(breed)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        if (data["done"] === "ok") {
            carousel.getNewBatch();
        }
    } catch (error) {
        console.error('Error posting item:', error);
    }
}





