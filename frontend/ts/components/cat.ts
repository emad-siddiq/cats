class Cat {

    div: HTMLElement;
    id: string;
    base64_img: string;
    
    constructor(id: string, base64_img: string) {
        this.base64_img = base64_img;
        this.div = this.createCatDiv();
        this.div.addEventListener("dblclick", this.addToFavorites.bind(this));
    }


    createCatDiv(): HTMLElement {
        let div = document.createElement("div");
        div.setAttribute("id", this.id);
        div.setAttribute("class", this.id);


        var image = new Image();
        image.src = 'data:image/jpg;base64,' + this.base64_img;
        image.style.objectFit = "cover";
        image.style.width = "90vw";
        image.style.height = "90vh";
        image.style.position = "absolute";
        image.style.top = "5vh";
        image.style.left = "5vw";


        div.appendChild(image);


        return div
    }
    
    addToFavorites() {
        console.log("Added to Favorites");
    }

}

export { Cat }