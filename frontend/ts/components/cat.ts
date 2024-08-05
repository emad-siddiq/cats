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
        this.div = this.createCatImgDiv();
        this.id = id;
        this.breed_id = breed_id;
        this.breed_name = breed_name;
        this.other_details = other_details.slice(1,-1).split(",").join(" ");

        this.description = this.getDescription()
    }

    getDescription():string {
        return "Breed Name: " + this.breed_name + "\nOther Details: " + this.other_details;
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