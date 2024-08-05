import { Description } from "./description";

class Cat {

    div: HTMLElement;
    id: string;
    base64_img: string;
    description: string;

    constructor(id: string, base64_img: string, description: string) {
        this.base64_img = base64_img;
        this.div = this.createCatImgDiv();
        this.id = id;
        this.description = description;
    }


    createCatImgDiv(): HTMLElement {
    


        var image = new Image();
        image.src = 'data:image/jpg;base64,' + this.base64_img;
        image.style.objectFit = "cover";
        image.style.width = "70vw";
        image.style.height = "80vh";
        image.style.position = "absolute";
        image.style.top = "10vh";
        image.style.left = "2vw";


    


        return image;
    }
    

}

export { Cat }