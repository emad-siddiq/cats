var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Cat } from "./components/cat.js";
let cat_cache = {};
let page = 1;
let limit = 10;
let curr_cat_cache_id = NaN;
function fetchImages(page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'http://localhost:8000/images?' + 'page=' + page + "&" + "per_page=" + limit;
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            console.log('Fetched images:', data);
            return data;
        }
        catch (error) {
            console.error('Error fetching images:', error);
        }
    });
}
function getNewBatch() {
    // Fetch 10 images and load them into the cache.
    // Display one
    console.log("Page", page);
    fetchImages(page.toString(), limit.toString()).then(data => {
        document.getElementById("cats").innerHTML = "";
        if (data) {
            let images = data["images"];
            for (let i = 0; i < images.length; i++) {
                let cat = new Cat(i.toString(), images[i]["data"]);
                cat_cache[i] = cat;
            }
            curr_cat_cache_id = 0;
            document.getElementById("cats").appendChild(cat_cache[0].div);
        }
    });
    page += 1;
    if (page > 10) {
        page = 1;
    }
}
getNewBatch();
//Clicking next gets next image from cache
let next_cat = document.getElementById("next-cat");
console.log(next_cat);
next_cat.addEventListener("click", (e) => {
    if (curr_cat_cache_id === Object.keys(cat_cache).length - 1) {
        getNewBatch();
        return;
    }
    console.log("OK");
    document.getElementById("cats").removeChild(cat_cache[curr_cat_cache_id].div);
    curr_cat_cache_id += 1;
    document.getElementById("cats").appendChild(cat_cache[curr_cat_cache_id].div);
});
