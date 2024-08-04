import { Cat } from "./cat.js"

class Favorites {
    favorites: Array<String>;
    div: HTMLElement;

    constructor() {
        this.favorites = [];
        this.div = this.createFavoritesDiv();
    }  
    createFavoritesDiv() {
        let div = document.createElement("div");
        div.setAttribute("id", "favorites");
        div.setAttribute("class", "favorites");
        div.style.boxSizing = "border-box";
        div.style.left = "75vw";
        div.style.top = "10vh";
        div.style.width = "22vw";
        div.style.height = "80vh";
        div.style.position = "absolute";
        div.style.backgroundColor = "green";

        div.innerText = "Favorites";
        return div;
    }

    addToFavorites(cat: Cat) {
        console.log(cat);
        if (this.favorites.indexOf(cat.id.toString()) > -1) {
            return;
        }
        console.log("Added to Favorites");
        var image = new Image();
        image.src = 'data:image/jpg;base64,'+ cat.base64_img;
        image.style.objectFit = "cover";
        image.style.width = "8vw";
        image.style.height = "16vh";
        this.favorites.push(cat.id.toString());

        this.div.appendChild(image);
    }


}



export { Favorites };
