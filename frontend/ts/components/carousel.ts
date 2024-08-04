import { Cat } from "./cat.js"
import { Description } from "./description.js";

class Carousel {
    id: string
    div: HTMLElement;
    curr_cat_id: number;
    page: number; // The current page in the db
    per_page: number;
    cat_cache: object;
    description: HTMLElement;

    constructor() {
        this.div = this.createCarouselDiv();
        this.page = 1;
        this.id = "carousel"
        this.per_page = 10;
        this.getNewBatch();
        this.cat_cache = {};
        this.curr_cat_id = 0;
    }  

    getCurrentCat() {
        console.log(this.cat_cache, this.curr_cat_id);
        return this.cat_cache[(this.curr_cat_id % 10)];
    }
    createCarouselDiv() {
        let div = document.createElement("div");
        div.setAttribute("id", this.id);
        div.setAttribute("class", this.id);
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

    

    createNextArrowDiv(): HTMLElement {
        let div = document.createElement("div");
        
        div.setAttribute("id", "next-cat-arrow");
        div.setAttribute("class", "next-cat-arrow");
        
        div.style.position = "absolute";
        div.style.top = "10vh";
        div.style.left = "55vw";
        div.style.width = "20vw";
        div.style.height = "80vh"
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

        div.addEventListener("click", this.loadNext.bind(this))

        let arrow = new Image(100, 100);
        arrow.src = "./img/next-arrow.svg";
        arrow.style.position = "relative";
        arrow.style.top = "45%";
        arrow.style.left = "50%";
    
        div.appendChild(arrow);
    
    
        return div;
    }

    createPreviousArrowDiv(): HTMLElement {
        let div = document.createElement("div");
    
        div.setAttribute("id", "next-cat-arrow");
        div.setAttribute("class", "next-cat-arrow");
        
        div.style.position = "absolute";
        div.style.top = "5vh";
        div.style.left = "2vw";
        div.style.width = "20vw";
        div.style.height = "90vh"
        div.style.zIndex = "10";
        div.style.opacity = "0";
        div.style.backgroundColor = "rgb(255, 255, 255, 0.6)";

        div.addEventListener("mouseenter", () => {
            div.style.opacity = "1";
        });
    
        div.addEventListener("mouseleave", () => {
            div.style.opacity = "0";
        });

        div.addEventListener("click", this.loadPrev.bind(this))

    
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

        if (this.curr_cat_id % this.per_page === Object.keys(this.cat_cache).length - 1) {
            this.getNewBatch();
            return;
        }
        // Remove current cat
        var elem = document.getElementById(this.curr_cat_id.toString());
        elem?.parentNode?.removeChild(elem);
        // Add new cat
        this.curr_cat_id += 1;
        console.log(this, this.curr_cat_id, this.cat_cache);
        this.div.appendChild(this.cat_cache[this.curr_cat_id % 10].div);
    }

    loadPrev() {

        if (this.curr_cat_id % this.per_page === Object.keys(this.cat_cache).length - 1) {
            this.page -= 1;
            this.getNewBatch();
            return;
        }
         // Remove current cat
         var elem = document.getElementById(this.curr_cat_id.toString());
         elem?.parentNode?.removeChild(elem);
         // Add new cat
         this.curr_cat_id += 1;
         console.log(this, this.curr_cat_id, this.cat_cache);
         this.div.appendChild(this.cat_cache[this.curr_cat_id % 10].div);
    }

    getNewBatch() {
        // Fetch 10 images and load them into the cache.
        // Display one
        fetchImages(this.page.toString(), this.per_page.toString()).then(data => {
            if (data) {
                let images = data["images"];
            
                for (let i = 1; i < images.length+1; i++) {
                    let cat = new Cat((this.curr_cat_id+i).toString(), images[i-1]["data"]) 
                    this.cat_cache[i] = cat;
                    console.log(cat, this.cat_cache);
                }

                // Set first cat from call as default cat
                this.div.appendChild(this.cat_cache[1].div);
                this.curr_cat_id += 1;
                this.description.innerText = "what waht";
                this.page += 1;
                if (this.page > 10) {
                    this.page = 1;
                }
            }
        });

}
}

async function fetchImages(page: string, limit:string) {
    const url = 'http://localhost:8000/images?' + 'page=' + page + "&" + "per_page=" + limit;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched images:', data);
        
        return data;
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}
 





export { Carousel };