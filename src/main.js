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

loadBrnRef.addEventListener('click', e => {
  page += 1;
  galleryHandler(searchQuery, page);
});

formRef.addEventListener('submit', e => {
  e.preventDefault();
  galleryRef.innerHTML = '';
  searchQuery = formRef.searchQuery.value;
  galleryHandler(searchQuery, page);
});

function galleryHandler(searchQuery, page) {
  const serchData = requestHandler(searchQuery, page);
  serchData
    .then(result => {
      return result.data.hits;
    })
    .then(data => {
      const galleryItems = data.map(elem => {
        return createCard(elem);
      });
      galleryRef.append(...galleryItems);
    })
    .catch(error => {
      console.log(error);
    });
}
function imageCartHandler(data) {
  const cart = `<div class="photo-card">
    <img src="${data.webformatURL}" alt="${data.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>${data.likes} Likes</b>
      </p>
      <p class="info-item">
        <b>${data.views} Views</b>
      </p>
      <p class="info-item">
        <b>${data.comments}Comments</b>
      </p>
      <p class="info-item">
        <b>${data.downloads} Downloads</b>
      </p>
    </div>`;
  return cart;
}

function createCard(data) {
  // Create the main card container
  const card = document.createElement('div');
  card.classList.add('photo-card');

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
  likes.innerHTML = `<b>${data.likes} Likes</b>`;
  info.appendChild(likes);

  // Create the views element
  const views = document.createElement('p');
  views.classList.add('info-item');
  views.innerHTML = `<b>${data.views} Views</b>`;
  info.appendChild(views);

  // Create the comments element
  const comments = document.createElement('p');
  comments.classList.add('info-item');
  comments.innerHTML = `<b>${data.comments} Comments</b>`;
  info.appendChild(comments);

  // Create the downloads element
  const downloads = document.createElement('p');
  downloads.classList.add('info-item');
  downloads.innerHTML = `<b>${data.downloads} Downloads</b>`;
  info.appendChild(downloads);

  // Append the info container to the card
  card.appendChild(info);

  return card;
}
