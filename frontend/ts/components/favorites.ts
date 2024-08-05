import { Cat } from "./cat.js"

class Favorites {
    favorites: Array<String>;
    div: HTMLElement;
    first_fav: boolean;

    constructor() {
        this.favorites = [];
        this.div = this.createFavoritesDiv();
        this.first_fav = true;
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
        div.style.display = "flex";
        div.style.flexWrap = "wrap";
        div.style.flexDirection ="row";
        div.style.alignContent = "flex-start";
        div.style.overflow = "scroll";
        div.style.scrollbarColor = "#390 #bada55";

        div.style.position = "absolute";
        div.style.boxShadow = "0px 2px 15px 0px rgba(0, 0, 0, .1)";
        div.style.fontSize = "40px";
        div.style.color = "gray";

        div.innerText = "Favorites\n ... \nDouble click\n  \n on a cat to add it to favorites. \n Double click on it here in favorites to unlike."

        return div;
    }

    addToFavorites(cat: Cat) {
        console.log(cat);
        if (this.favorites.indexOf(cat.id.toString()) > -1) {
            return;
        }
        let favImageDiv = document.createElement("div");
        favImageDiv.setAttribute("id", "fav-" + cat.id);
        favImageDiv.setAttribute("class", "fav-" + cat.id);
        favImageDiv.style.width = "21vw";
        favImageDiv.style.height = "20vw";
        favImageDiv.style.padding = "10 10 10 10";


        var image = new Image();
        image.src = 'data:image/jpg;base64,'+ cat.base64_img;
        image.style.objectFit = "cover";
        image.style.width = "100%";
        image.style.maxHeight ="100%";

        image.style.height = "100%";
        favImageDiv.appendChild(image);
        this.favorites.push(cat.id.toString());
        console.log("Added to Favorites", this.favorites);

        favImageDiv.addEventListener("dblclick", (e) => {
            this.removeFromFavorites(cat.id);
            this.favorites = this.favorites.filter(e => e !== cat.id);
        })
        if (this.first_fav) {
            this.div.innerText = "";
            this.first_fav = false;
        }
        this.div.appendChild(favImageDiv);
    }

    removeFromFavorites(cat_id: string) {
        let id = "fav-" + cat_id.toString();
        console.log("ID TO REMOVE", id, this.favorites.indexOf(cat_id.toString()));
        let idx = this.favorites.indexOf(cat_id.toString());
        if (idx === -1) {
            console.log("Not found in favs");
            return;
        }
        this.favorites.splice(idx, 1);
        var elem = document.getElementById(id);
        console.log(elem);
        elem?.parentNode?.removeChild(elem);
    }


}


export { Favorites };
