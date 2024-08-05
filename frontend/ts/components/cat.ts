import { Description } from "./description";

class Cat {

    div: HTMLElement;
    id: string;
    base64_img: string;
    description: string;
    breed_id: string;
    breed_name: string;
    other_details: string;

    constructor(id: string, base64_img: string, breed_id: string, breed_name: string, other_details: string) {

        this.base64_img = base64_img;
        this.id = id;
        this.breed_id = breed_id;
        this.breed_name = breed_name;
        this.other_details = other_details.slice(1,-1).split(",").join(" ");
        this.div = this.createCatImgDiv();

        this.description = this.getDescription()
    }

    getDescription():string {
        return "Breed Name: " + this.breed_name + "\nOther Details: " + this.other_details;
    }


    createCatImgDiv(): HTMLElement {
    

        let div = document.createElement("div");
        div.setAttribute("id", this.id.toString());
        div.setAttribute("class", this.id.toString());
        var image = new Image();
        image.src = 'data:image/jpg;base64,' + this.base64_img;
        image.style.objectFit = "cover";
        image.style.width = "70vw";
        image.style.height = "80vh";
        image.style.position = "absolute";
        image.style.top = "10vh";
        image.style.left = "2vw";

        div.appendChild(image);

    


        return div;
    }
    

}

export { Cat }