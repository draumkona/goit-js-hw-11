'use strict'
import Notiflix from 'notiflix';
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector("#search-form");
const searchBox = document.querySelector("#searchBox");
const gallery = document.querySelector(".gallery");
const loadMore = document.querySelector(".load-more");
const apiKey = "34852127-c965fcd32e5f56da9013a5883";
let perPageParam;
let totalHits;
let hits;



const getData = async q => {
  try {
    const response = await axios.get(`https://pixabay.com/api/?key=${apiKey}&q=${searchBox.value}&image_type=photo&orientation=horizontal&safesearch=true&page=${perPageParam}&per_page=40`);
    totalHits = response.data.totalHits;
    hits = response.data.hits;

    if (searchBox.value === '') {
      Notiflix.Notify.info("Search field cannot be empty.");
      loadMore.classList.add("is-hidden");
      return;
    }
    
    checkAmount(totalHits);
    return hits;
  
    } catch (error) {
        console.error(error);
    }
};
    
function checkAmount(totalHits) {
  const totalPages = Math.ceil(totalHits / 40);

  if (totalHits === 0) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    return;
  }
  if (perPageParam === 1 && searchBox.value !== "") {
    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    loadMore.classList.remove("is-hidden");
    return;
  }
  if (totalPages === perPageParam) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    loadMore.classList.add("is-hidden");
    return;
  }
  if (totalPages >= perPageParam) {
    loadMore.classList.remove("is-hidden");
  }
  
}

const drawGallery = hits => {
  const galleryOfImg = hits.map(
    ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      const imgCard = document.createElement('div');
      imgCard.classList.add('photo-card');
      imgCard.innerHTML = ` <a class="photo-card__fullsize" href="${largeImageURL}"><img src="${webformatURL}" class="web-image" alt="${tags}" loading="lazy" /></a>
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
  </div>`
      return imgCard;
    }
  );
  gallery.append(...galleryOfImg);
  
  new SimpleLightbox('.gallery a', {
    captionPosition: 'outside',
    captionsData: 'alt',
    captionDelay: '250',
  });
}

const eventHandler = ev => {
  ev.preventDefault();
  perPageParam = 1;

  getData(`${searchBox.value}`)
    .then(hits => {
      gallery.innerHTML = "";
      drawGallery(hits)
      perPageParam ++
    })
    .catch(err => {
      gallery.innerHTML = "";
      console.log(err);
  })
}

const moreImages = (e) => {
  e.preventDefault();
  perPageParam ++
  getData(`${searchBox.value}`)
    .then(hits => {
      drawGallery(hits)

      const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
      })
    })
    .catch(err => {
          gallery.innerHTML = "";
          console.log(err);
        })
}

searchForm.addEventListener("submit", eventHandler);
loadMore.addEventListener("click", moreImages);