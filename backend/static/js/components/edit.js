var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Cat } from "./cat.js";
class Edit {
    constructor(cat) {
        this.cat = cat;
        this.div = this.createEditDiv();
    }
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
        div.style.flexDirection = "row";
        div.style.alignContent = "flex-start";
        div.style.overflow = "scroll";
        div.style.scrollbarColor = "#390 #bada55";
        div.style.zIndex = "10";
        div.style.position = "absolute";
        div.style.boxShadow = "0px 2px 15px 0px rgba(0, 0, 0, .1)";
        div.style.fontSize = "40px";
        div.style.color = "white";
        div.style.padding = "10px 10px 10px 10px";
        div.style.backgroundColor = "#ADD8E6";
        console.log(this.cat);
        div.innerHTML = `<form onsubmit=\"return false;\"><label for=\"fname\">Edit the Other Details column for cat (see new updated copy from db in description):</label><br><textarea type=\"textarea\" id=\"edit-other-details\" name=\"edit-other-details\" value=\"${this.cat.other_details.slice(1)}\"></textarea><br><input style=\"font-size:24px;\"type=\"submit\" value=\"Submit\">`;
        let close = document.createElement("input");
        close.setAttribute("id", "close-edit");
        close.setAttribute("class", "close-edit");
        close.setAttribute("type", "submit");
        close.style.marginLeft = "85%";
        close.style.fontSize = "30px";
        close.value = "Close";
        close.addEventListener("click", () => {
            var _a;
            var elem = document.getElementById("edit");
            (_a = elem === null || elem === void 0 ? void 0 : elem.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(elem);
        });
        div.appendChild(close);
        div.addEventListener("submit", () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let val = document.getElementById("edit-other-details").value;
            updateOtherDetailsColumn(parseInt(this.cat.id), val);
            if (val.length === 0) {
                div.innerText = "No changes.";
                yield new Promise(r => setTimeout(r, 1000));
                var elem = document.getElementById("edit");
                (_a = elem === null || elem === void 0 ? void 0 : elem.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(elem);
            }
            let updatedItem = yield fetchSingleItem(this.cat.id);
            let newCat = new Cat(updatedItem["id"], updatedItem["data"], updatedItem["breed_id"], updatedItem["breed_name"], updatedItem["other_details"]);
            console.log(this.cat.id, this.cat, newCat.div);
            document.getElementById(this.cat.id).innerHTML = newCat.div.innerHTML;
            document.getElementById("description").innerHTML = newCat.description;
            div.innerText = "Updated Succesfully!";
            yield new Promise(r => setTimeout(r, 1000));
            var elem = document.getElementById("edit");
            (_b = elem === null || elem === void 0 ? void 0 : elem.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(elem);
        }));
        return div;
    }
}
function updateOtherDetailsColumn(id, new_text) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'http://127.0.0.1:8000/update-other-details';
        const data = {
            id: id,
            new_text: new_text
        };
        try {
            const response = yield fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                const jsonResponse = yield response.json();
                console.log('Success:', jsonResponse);
            }
            else {
                console.error('Error:', response.statusText);
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
function fetchSingleItem(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'http://localhost:8000/cats/' + id.toString();
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            console.log('Fetched item:', data);
            return data;
        }
        catch (error) {
            console.error('Error fetching breeds:', error);
        }
    });
}
export { Edit };
