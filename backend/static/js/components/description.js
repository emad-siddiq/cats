class Description {
    constructor() {
        this.div = this.createDescriptionDiv();
    }
    createDescriptionDiv() {
        let div = document.createElement("div");
        div.setAttribute("id", "description");
        div.setAttribute("class", "description");
        div.style.boxSizing = "border-box";
        div.style.position = "absolute";
        div.style.left = "2vw";
        div.style.top = "65vh";
        div.style.width = "70vw";
        div.style.height = "25vh";
        div.style.backgroundColor = "rgb(0, 0, 0, 0.2)";
        div.style.zIndex = "2";
        div.style.opacity = "0";
        div.addEventListener("mouseenter", () => {
            div.style.opacity = "1";
        });
        div.addEventListener("mouseleave", () => {
            div.style.opacity = "0";
        });
        div.innerText = "Description";
        return div;
    }
}
export { Description };
