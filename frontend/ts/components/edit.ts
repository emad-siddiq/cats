import { Cat } from "./cat.js";

// The Edit Menu pops up when the edit button is pressed on a cat image that is in view
// It allows for the other_detail column of the cats postgres table to be edited from the browser

class Edit {
    div: HTMLElement;
    cat: Cat;

    constructor(cat: Cat) {
        this.cat = cat;
        this.div = this.createEditDiv();
    }  
    // Create a Div that pops up in the center of the screen to edit other details of the cat image in focus
    createEditDiv() {
        let div = document.createElement("div");
        div.setAttribute("id", "edit");
        div.setAttribute("class", "edit");
        div.style.boxSizing = "border-box";
        div.style.position = "absolute";

        div.style.left = "25vw";
        div.style.top = "40vh";
        div.style.width = "50vw";
        div.style.height = "40vh";
        div.style.display = "flex";
        div.style.flexWrap = "wrap";
        div.style.flexDirection ="row";
        div.style.alignContent = "flex-start";
        div.style.overflow = "scroll";
        div.style.scrollbarColor = "#390 #bada55";
        div.style.zIndex = "10";
        div.style.position = "absolute";
        div.style.boxShadow = "0px 2px 15px 0px rgba(0, 0, 0, .1)";
        div.style.fontSize = "40px";
        div.style.color = "white";
        div.style.padding = "10px 10px 10px 10px"
        div.style.backgroundColor = "#ADD8E6";

        console.log(this.cat);

        div.innerHTML = `<form onsubmit=\"return false;\"><label for=\"fname\">Edit the Other Details column for cat (see new updated copy from db in description):</label><br><textarea type=\"textarea\" id=\"edit-other-details\" name=\"edit-other-details\" value=\"${this.cat.other_details.slice(1)}\"></textarea><br><input style=\"font-size:24px;\"type=\"submit\" value=\"Submit\">`
        

        // Add a Button to close the Edit window 
        let close = document.createElement("input");
        close.setAttribute("id", "close-edit");
        close.setAttribute("class", "close-edit");
        close.setAttribute("type", "submit");
        close.style.marginLeft = "85%";
        close.style.fontSize = "30px";
        close.value = "Close";
        close.addEventListener("click", () => {
            var elem = document.getElementById("edit");
            elem?.parentNode?.removeChild(elem);
        })
        div.appendChild(close);

        // On Submit, update the value 
        div.addEventListener("submit", async () => {
            let val = (<HTMLInputElement>document.getElementById("edit-other-details")).value;
            // In case of empty submission
            if (val.length === 0) {
                div.innerText = "No changes.";
                await new Promise(r => setTimeout(r, 1000));
                var elem = document.getElementById("edit");
                elem?.parentNode?.removeChild(elem);
            }
           

            // Update Column in Postgres cats table
            updateOtherDetailsColumn(parseInt(this.cat.id), val);

            
            // 
            let updatedItem = await fetchSingleItem(this.cat.id);
            let newCat = new Cat(
                updatedItem["id"],
                updatedItem["data"],
                updatedItem["breed_id"],
                updatedItem["breed_name"],
                updatedItem["other_details"]
                ) 
      
            document.getElementById(this.cat.id).innerHTML = newCat.div.innerHTML;
            document.getElementById("description").innerHTML = newCat.description;
            div.innerText = "Updated Succesfully!";
            await new Promise(r => setTimeout(r, 1000));
            var elem = document.getElementById("edit");
            elem?.parentNode?.removeChild(elem);

            
            
            
        })

       
        return div;
    }

    
 

}


async function updateOtherDetailsColumn(id: number, new_text: string) {
    const url = 'http://127.0.0.1:8000/update-other-details'; 
    const data = {
        id: id,
        new_text: new_text
    };

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log('Success:', jsonResponse);
        } else {
            console.error('Error:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


async function fetchSingleItem(id) {
    const url = 'http://localhost:8000/cats/' + id.toString();

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched item:', data);
        
        return data;
    } catch (error) {
        console.error('Error fetching breeds:', error);
    }
}







export { Edit };
