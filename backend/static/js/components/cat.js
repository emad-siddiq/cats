class Cat {
    constructor(base64_img) {
        this.base64_img = base64_img;
        this.div = this.createCatDiv();
        document.body.addEventListener("dblclick", this.addToFavorites.bind(this));
        document.getElementById("cats").appendChild(this.div);
    }
    createCatDiv() {
        let div = document.createElement("div");
        div.setAttribute("id", this.id);
        div.setAttribute("class", this.id);
        var image = new Image();
        image.src = 'data:image/jpg;base64,' + this.base64_img;
        div.appendChild(image);
        return div;
    }
    addToFavorites() {
        console.log("Added to Favorites");
    }
}
export { Cat };
