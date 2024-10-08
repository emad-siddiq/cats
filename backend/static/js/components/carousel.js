var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Cat } from "./cat.js";
import { Description } from "./description.js";
class Carousel {
    constructor() {
        this.id = "carousel";
        this.page = 1;
        this.per_page = 10;
        this.getNewBatch();
        this.cat_cache = {};
        this.div = this.createCarouselDiv();
        this.curr_cat_id = 0;
    }
    getCurrentCat() {
        console.log(this.cat_cache, this.curr_cat_id);
        return this.cat_cache[(this.curr_cat_id % 10)];
    }
    createCarouselDiv() {
        let div = document.createElement("div");
        div.setAttribute("id", this.id.toString());
        div.setAttribute("class", this.id.toString());
        div.style.boxSizing = "border-box";
        div.style.gridColumn = "1/2";
        let next_div = this.createNextArrowDiv();
        let prev_div = this.createPreviousArrowDiv();
        this.description = new Description().div;
        div.appendChild(next_div);
        div.appendChild(prev_div);
        div.appendChild(this.description);
        return div;
    }
    createNextArrowDiv() {
        let div = document.createElement("div");
        div.setAttribute("id", "next-cat-arrow");
        div.setAttribute("class", "next-cat-arrow");
        div.style.position = "absolute";
        div.style.top = "10vh";
        div.style.left = "52vw";
        div.style.width = "20vw";
        div.style.height = "80vh";
        div.style.zIndex = "10";
        div.style.boxSizing = "border-box";
        div.style.backgroundColor = "rgb(255, 255, 255, 0.6)";
        div.style.opacity = "0";
        div.addEventListener("mouseenter", () => {
            div.style.opacity = "1";
        });
        div.addEventListener("mouseleave", () => {
            div.style.opacity = "0";
        });
        div.addEventListener("click", this.loadNext.bind(this));
        let arrow = new Image(100, 100);
        arrow.src = "./img/next-arrow.svg";
        arrow.style.position = "relative";
        arrow.style.top = "45%";
        arrow.style.left = "50%";
        div.appendChild(arrow);
        return div;
    }
    createPreviousArrowDiv() {
        let div = document.createElement("div");
        div.setAttribute("id", "next-cat-arrow");
        div.setAttribute("class", "next-cat-arrow");
        div.style.position = "absolute";
        div.style.top = "5vh";
        div.style.left = "2vw";
        div.style.width = "20vw";
        div.style.height = "90vh";
        div.style.zIndex = "10";
        div.style.opacity = "0";
        div.style.backgroundColor = "rgb(255, 255, 255, 0.6)";
        div.addEventListener("mouseenter", () => {
            div.style.opacity = "1";
        });
        div.addEventListener("mouseleave", () => {
            div.style.opacity = "0";
        });
        div.addEventListener("click", this.loadPrev.bind(this));
        let arrow = new Image(100, 100);
        arrow.src = "./img/next-arrow.svg";
        arrow.style.position = "relative";
        arrow.style.top = "45%";
        arrow.style.transform = "scale(-1,1)";
        arrow.style.left = "30%";
        div.appendChild(arrow);
        return div;
    }
    loadNext() {
        var _a;
        if (this.curr_cat_id % this.per_page === Object.keys(this.cat_cache).length - 1) {
            this.getNewBatch();
            return;
        }
        // Remove current cat
        var elem = document.getElementById(this.curr_cat_id.toString());
        (_a = elem === null || elem === void 0 ? void 0 : elem.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(elem);
        // Add new cat
        this.curr_cat_id += 1;
        console.log(this.curr_cat_id);
        let cat = this.cat_cache[this.curr_cat_id % 10];
        if (cat) {
            console.log(cat);
            this.description.innerText = cat.description;
            this.div.appendChild(cat.div);
        }
        else {
            this.getNewBatch();
        }
    }
    loadPrev() {
        var _a;
        if (this.curr_cat_id % this.per_page === Object.keys(this.cat_cache).length - 1) {
            this.page -= 1;
            this.getNewBatch();
            return;
        }
        // Remove current cat
        var elem = document.getElementById(this.curr_cat_id.toString());
        (_a = elem === null || elem === void 0 ? void 0 : elem.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(elem);
        // Add new cat
        this.curr_cat_id -= 1;
        if (this.curr_cat_id < 1) {
            this.curr_cat_id = 1;
        }
        else {
            let cat = this.cat_cache[this.curr_cat_id % 10];
            this.description.innerText = cat.description;
            this.div.appendChild(cat.div);
        }
    }
    getNewBatch() {
        // Fetch 10 images and load them into the cache.
        // Display one
        fetchImages(this.page.toString(), this.per_page.toString()).then(data => {
            if (data) {
                console.log(data.keys);
                let cats = data["cats"];
                for (let i = 1; i < cats.length + 1; i++) {
                    let cat = new Cat(cats[i-1]["id"], cats[i - 1]["data"], cats[i - 1]["breed_id"], cats[i - 1]["breed_name"], cats[i - 1]["other_details"]);
                    this.cat_cache[i] = cat;
                }
                // Set first cat from call as default cat
                this.div.appendChild(this.cat_cache[1].div);
                this.curr_cat_id += 1;
                this.description.innerText = this.cat_cache[1].description;
                this.page += 1;
                if (this.page > 10) {
                    this.page = 1;
                }
            }
        });
    }
}
//"""Fetches paginated cats from postgres db""" 
function fetchImages(page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'http://localhost:8000/cats?' + 'page=' + page + "&" + "per_page=" + limit;
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
export { Carousel };
