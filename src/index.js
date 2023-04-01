import Notiflix from 'notiflix';
import axios from "axios";
//import SimpleLightbox from "simplelightbox";
//import "simplelightbox/dist/simple-lightbox.min.css";

const button = document.querySelector("#button");
const searchBox = document.querySelector("#searchBox");
const galleryofIMG = document.querySelector(".gallery");
const loadMore = document.querySelector(".load-more");
const apiKey = "34852127-c965fcd32e5f56da9013a5883";
let perPageParam;

async function getImages(event) {
  galleryofIMG.innerHTML = "";
  perPageParam = 1;
    try {
        event.preventDefault();
        if (searchBox.value === '') {
          Notiflix.Notify.info("Search field cannot be empty.");
          loadMore.classList.add("is-hidden");
          return;
        }
        const response = await axios.get(`https://pixabay.com/api/?key=${apiKey}&q=${searchBox.value}&image_type=photo&orientation=horizontal&safesearch=true&page=${perPageParam}&per_page=40`);
        console.log(response);
        if (response.data.total === 0) {
          Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        } else {
          Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
          const arrayOfPhotos = response.data.hits;
          imgData(arrayOfPhotos);
        }
    } catch (error) {
        console.error(error);
    }
};
    
    

function imgData(arrayOfPhotos) {
    arrayOfPhotos.map(
        ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        galleryofIMG.innerHTML += `<div class="photo-card">
  <img src="${webformatURL}" class="web-image" alt="${Object.values(tags).join('')}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes:</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views:</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments:</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b> ${downloads}
    </p>
  </div>
</div>`
      },
      loadMore.classList.remove('is-hidden')
  )
};

const moreImages = () => {
  perPageParam += 1;
  console.log(perPageParam);
}

button.addEventListener("click", getImages);
loadMore.addEventListener("click", moreImages);