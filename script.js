'use strict';

// API Variables
const imgPath = 'https://image.tmdb.org/t/p/w500/';
const API_Key = 'a199ea0b8c593e3eb4678128a391bff7';

// DOM variables
const movies = document.querySelector('.movies');
const moviesContainer = document.querySelector('.movies-containers');
const showsContainer = document.querySelector('.shows-containers');
const moviesDetails = document.querySelectorAll('.movies-details');
const movieDetails = document.querySelectorAll('.movie-details');

class Movieapp {
  constructor() {
    this._showTrending();
  }
  _mouseForEnter(e) {
    const theEl = e.target
      .closest('.movies-details')
      .querySelector('.movie-details');
    theEl.style.transform = 'translateY(0)';
    theEl.style.opacity = 1;
  }

  _mouseForLeave(e) {
    const theEl = e.target
      .closest('.movies-details')
      .querySelector('.movie-details');
    // theEl.style.backgroundColor = '';
    theEl.style.transform = '';
    theEl.style.opacity = 0;
  }

  async _getTrending(url) {
    const res = await fetch(url);
    const data = await res.json();
    this.data = data;
    return data;
  }
  _showTrending() {
    this._showTrendingMovies();
    this._showTrendingTvs();
  }

  async _fetchWithRender(url, elementContainer, inputELfunction) {
    const data = await this._getTrending(url);
    data.results.forEach(datas => {
      const html = inputELfunction(datas);
      elementContainer.insertAdjacentHTML('afterbegin', html);
      this._showedMoviesHoverEffect();
    });
  }
  async _showTrendingMovies() {
    await this._fetchWithRender(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_Key}`,
      moviesContainer,
      datas => `<div class="movies-details">
           <img
             class="movie-img"
             src="${imgPath}/${datas.poster_path}"
             alt=""
           />
           <div class="movie-details">
             <p class="movie-title">${datas.title}</p>
              <div class="movie-info">
                <p class="movie-rating">
                  <ion-icon class="rating-icon" name="star"></ion-icon> ${Math.floor(
                    datas.vote_average
                  )} |
                </p>
                <p class="">Action |</p>
                <p class="">${datas.media_type}</p>
              </div>
            </div>
            </div>`
    );
    this._leftToRightScroll(moviesContainer);
  }
  async _showTrendingTvs() {
    await this._fetchWithRender(
      `https://api.themoviedb.org/3/trending/tv/day?api_key=${API_Key}`,
      showsContainer,
      datas => `<div class="movies-details">
        <img
          class="movie-img"
          src="${imgPath}/${datas.poster_path}"
          alt=""
        />
        <div class="movie-details">
          <p class="movie-title">${datas.name}</p>
          <div class="movie-info">
            <p class="movie-rating">
              <ion-icon class="rating-icon" name="star"></ion-icon> ${Math.floor(
                datas.vote_average
              )} |
            </p>
            <p class="">Action |</p>
            <p class="">${datas.media_type}</p>
          </div>
        </div>
        </div>`
    );
    this._leftToRightScroll(showsContainer);
  }

  _showedMoviesHoverEffect() {
    document
      .querySelectorAll('.movies-details')
      .forEach(hoverEL =>
        hoverEL.addEventListener('mouseenter', this._mouseForEnter.bind(this))
      );
    document
      .querySelectorAll('.movies-details')
      .forEach(hoverEL =>
        hoverEL.addEventListener('mouseleave', this._mouseForLeave.bind(this))
      );
  }

  // scrolling container to left and right
  _leftToRightScroll(containerElement) {
    let startX;
    let scrollLeft;

    containerElement.addEventListener('touchstart', e => {
      startX = e.touches[0].pageX - containerElement.offsetLeft;
      scrollLeft = containerElement.scrollLeft;
    });

    containerElement.addEventListener('touchmove', e => {
      if (!startX) return;
      const x = e.touches[0].pageX - containerElement.offsetLeft;
      const scrollTiming = (x - startX) * 1.5; // Adjust this multiplier to control scrolling speed
      containerElement.scrollLeft = scrollLeft - scrollTiming;
    });

    containerElement.addEventListener('touchend', () => {
      startX = null;
    });
  }
}

const movie = new Movieapp();

// ==============
// user profile
document.querySelector('.users').addEventListener('click', () => {
  document.querySelector('.user-profile').classList.toggle('hidden');
});
