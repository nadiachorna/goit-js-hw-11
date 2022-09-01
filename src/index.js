import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import FetchApi from "./apiService";

axios.defaults.baseURL = 'https://pixabay.com/api/';

const newsFetchApi = new FetchApi();
const perPage = 40;

const refs = {
    form: document.querySelector('#search-form'),
    galleryContainer: document.querySelector('.gallery'),
    // loadBtn: document.querySelector('.load-more'),
    guard: document.querySelector('.js-guard')
}

refs.form.addEventListener('submit', onFormSubmit);
// refs.loadBtn.addEventListener('click', onLoadMore)

const options = {
    root: null,
    rootMargin: '200px',
    threshold: 1.0
}

const observer = new IntersectionObserver(onGalleryUpdate, options);

async function onFormSubmit(e) {
    e.preventDefault();
    // refs.loadBtn.classList.add('is-hidden');
    newsFetchApi.resetPage()

    newsFetchApi.query = e.currentTarget.elements.searchQuery.value;
    console.log(newsFetchApi.query);

    if (newsFetchApi.query === '') {
        onEmptySearch();
        return
    }
    try {
    const data = await newsFetchApi.fetchImages()
            clearGallery(data);
        newsFetchApi.resetPage();
        if (data.totalHits === 0) {
            uncorrectSearch();
        }
        else { 
        // refs.loadBtn.classList.remove('is-hidden')              
            numberOfImages(data);
            createGallery(data.hits);
            let lightbox = new SimpleLightbox('.gallery a').refresh();
        }
        observer.observe(refs.guard);
    }
    catch (error) {
        console.log(error.message)
    }
    
}

// function onLoadMore() {
//     newsFetchApi.incrementPage();
//     newsFetchApi.fetchImages()
//         .then(data => createGallery(data.hits));
//     let lightbox = new SimpleLightbox('.gallery a').refresh();
// }

function createGallery(data) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', createCardMarkup(data))
}

function createCardMarkup(data) {
    return data.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `
    <div class="photo-card">
    <a href="${largeImageURL}"> <img src="${webformatURL}" alt="${tags}" width="360" loading="lazy"/> </a>
  <div class="info">
    <p class="info-item">
      <b>Likes: </b><span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views: </b><span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments: </b><span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads: </b><span>${downloads}</span>
    </p>
  </div>
</div>`
  }).join('')
}

function clearGallery() {
    refs.galleryContainer.innerHTML = '';
}

function onEmptySearch() {
    Notiflix.Notify.warning("Please, enter something. The search field cannot be empty")
}

function numberOfImages(data) {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
}

function uncorrectSearch() {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
}

function endOfCollection() {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
}

function onGalleryUpdate(entries) {
    entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
                newsFetchApi.incrementPage();
            const data = await newsFetchApi.fetchImages()
                createGallery(data.hits);
            let lightbox = new SimpleLightbox('.gallery a').refresh();
            console.log(newsFetchApi.page)
            const numberOfPages = Math.ceil(data.totalHits / perPage);
            if (newsFetchApi.currentPage === numberOfPages) {
            endOfCollection()
        }
            }
        })
    }

