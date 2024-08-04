var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Cat } from "./components/cat.js";
function fetchImages() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'http://localhost:8000/images';
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            console.log('Fetched images:', data);
            return data;
        }
        catch (error) {
            console.error('Error fetching images:', error);
        }
    });
}
// Example usage
fetchImages().then(data => {
    if (data) {
        // Process the data as needed
        let images = data["images"];
        for (let image of images) {
            new Cat(image["data"]);
        }
    }
});
