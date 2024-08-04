import { Carousel } from "./components/carousel.js";
import { Favorites } from "./components/favorites.js";
let carousel = new Carousel();
let favorites = new Favorites();
document.getElementById("cats").appendChild(carousel.div);
document.getElementById("cats").appendChild(favorites.div);
document.getElementById("add-to-favs").addEventListener("click", () => {
    favorites.addToFavorites(carousel.getCurrentCat());
});
document.getElementById("remove-from-favs").addEventListener("click", () => {
    favorites.removeFromFavorites(carousel.getCurrentCat());
});
// let next_cat = document.getElementById("next-cat");
// console.log(next_cat);
// next_cat.addEventListener("click", (e) => {
//     if (carousel.curr_cat_id === Object.keys(carousel.cat_cache).length - 1) {
//         carousel.getNewBatch();
//         return;
//     }
//     console.log("OK");
//     document.getElementById("cats").removeChild(cat_cache[curr_cat_cache_id].div);
//     curr_cat_cache_id += 1;
//     document.getElementById("cats").appendChild(cat_cache[curr_cat_cache_id].div);
// })
