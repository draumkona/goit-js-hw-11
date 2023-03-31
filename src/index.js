import Notiflix from 'notiflix';
import axios from "axios";

const button = document.querySelector("#button");
const searchBox = document.querySelector("#searchBox");
const apiKey = "34852127-c965fcd32e5f56da9013a5883";

async function getImages(event) {
    try {
    event.preventDefault();
    const response = await axios.get(`https://pixabay.com/api/?key=${apiKey}&q=${searchBox.value}&image_type="photo"&orientation="horizontal"&safesearch="true"`);
    console.log(response); 
    if (!response) {
        console.log("404", data)
        }
    if (response.data.total === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
  } catch (error) {
    console.error(error);
  }
}





button.addEventListener("click", getImages)