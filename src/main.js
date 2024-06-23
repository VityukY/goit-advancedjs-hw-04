import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { requestHandler } from './js/api';

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const loadBrnRef = document.querySelector('.load-more');

let page = 1;
let searchQuery = '';
const lightbox = new SimpleLightbox('.gallery a', {});

loadBrnRef.addEventListener('click', e => {
  page += 1;
  galleryHandler(searchQuery, page);
});

formRef.addEventListener('submit', e => {
  e.preventDefault();
  page = 1;
  loadBrnRef.classList.add('hidden');
  galleryRef.innerHTML = '';
  searchQuery = formRef.searchQuery.value;
  if (searchQuery == '') {
    iziToast.warning({
      title: 'No request',
      message: 'Please add query for request',
    });
    return;
  }
  galleryHandler(searchQuery, page);
});

function galleryHandler(searchQuery, page) {
  const serchData = requestHandler(searchQuery, page);
  serchData
    .then(result => {
      if (result.data.totalHits == 0) {
        throw error;
      }
      if (page == 1) {
        iziToast.success({
          title: 'Success',
          message: `Hooray! We found ${result.data.totalHits} images.`,
        });
      }
      return result.data;
    })
    .then(data => {
      const galleryItems = data.hits.map(elem => {
        return createCard(elem);
      });
      galleryRef.append(...galleryItems);
      lightbox.refresh();

      if (galleryItems.length > 0) {
        const firstItem = galleryItems[0];
        const headerHeight = 120;
        const topPosition = firstItem.offsetTop - headerHeight;
        window.scrollTo({
          top: topPosition,
          behavior: 'smooth',
        });
      }
      if (endHitsCheker(data.totalHits, galleryRef)) {
        loadBrnRef.classList.remove('hidden');
      } else {
        iziToast.warning({
          title: 'End of list',
          message: "We're sorry, but you've reached the end of search results.",
        });
        loadBrnRef.classList.add('hidden');
      }
    })
    .catch(error => {
      loadBrnRef.classList.add('hidden');
      iziToast.error({
        title: 'No matches',
        message: 'No matches with you request',
      });
    });
}

function endHitsCheker(totalHits, galleryRef) {
  let childNodes = galleryRef.childNodes;
  let numberOfChildNodes = childNodes.length;
  if (totalHits == numberOfChildNodes) {
    return false;
  }
  return true;
}

function createCard(data) {
  // Create the main card container
  const card = document.createElement('a');
  card.classList.add('photo-card');
  card.href = data.largeImageURL;

  // Create the image element
  const img = document.createElement('img');
  img.src = data.webformatURL;
  img.alt = data.tags;
  img.loading = 'lazy';
  // Append the image to the card
  card.appendChild(img);

  // Create the info container
  const info = document.createElement('div');
  info.classList.add('info');

  // Create the likes element
  const likes = document.createElement('p');
  likes.classList.add('info-item');
  likes.innerHTML = `<b>${data.likes}<br>Likes</br>`;
  info.appendChild(likes);

  // Create the views element
  const views = document.createElement('p');
  views.classList.add('info-item');
  views.innerHTML = `<b>${data.views}<br>Views</b>`;
  info.appendChild(views);

  // Create the comments element
  const comments = document.createElement('p');
  comments.classList.add('info-item');
  comments.innerHTML = `<b>${data.comments}<br>Comments</b>`;
  info.appendChild(comments);

  // Create the downloads element
  const downloads = document.createElement('p');
  downloads.classList.add('info-item');
  downloads.innerHTML = `<b>${data.downloads}<br>Downloads</b>`;
  info.appendChild(downloads);

  // Append the info container to the card
  card.appendChild(info);

  return card;
}
