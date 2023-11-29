'use strict';

// API Variables
// const imgPath = 'https://image.tmdb.org/t/p/w1280/';
const imgPath = 'https://image.tmdb.org/t/p/original/';
const API_Key = 'a199ea0b8c593e3eb4678128a391bff7';

// DOM variables
const movies = document.querySelector('.movies');
const moviesContainer = document.querySelector('.movies-containers');
const showsContainer = document.querySelector('.shows-containers');
const moviesDetails = document.querySelectorAll('.movies-details');
const movieDetails = document.querySelectorAll('.movie-details');

let genreNames;
let rendrGen;

class Movieapp {
  constructor() {
    this._showTrending();
    this.featuresMoviesTvs();
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

    data.results.forEach(async datas => {
      //   const rendrGenIds = datas.genre_ids;
      rendrGen = [];
      const genIdArr = datas.genre_ids;
      const renderMediaType = datas.media_type;

      rendrGen = await this._getGenereNames(
        genIdArr,
        renderMediaType,
        rendrGen
      );

      //   ------------
      const html = inputELfunction(datas);
      elementContainer.insertAdjacentHTML('afterbegin', html);
      this._showedMoviesHoverEffect();
    });
  }
  async _showTrendingMovies() {
    await this._fetchWithRender(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_Key}`,
      moviesContainer,
      (datas, genreNames) => `<div class="movies-details">
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
                <p class="">${rendrGen.splice(0, 2).join(' , ')} |</p>
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
      (datas, genreNames) => `<div class="movies-details">
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
            <p class="">${rendrGen.splice(0, 2).join(' , ')} |</p>
            <p class="">${datas.media_type}</p>
          </div>
        </div>
        </div>`
    );
    this._leftToRightScroll(showsContainer);
  }

  async _getGenereNames(arrayOfIdNum, mediaType, genContainers) {
    const genres = arrayOfIdNum;

    const genreList = await this._getTrending(
      `https://api.themoviedb.org/3/genre/${mediaType}/list?api_key=${API_Key}`
    );

    await new Promise(resolve => setTimeout(resolve, 100));

    genres.forEach(value => {
      const findGenreObj = genreList.genres.find(genre =>
        Object.values(genre).includes(value)
      );
      if (findGenreObj) {
        genContainers.push(findGenreObj.name);
      }
    });
    return genContainers;
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

  // feature movies/tv shows
  async featuresMoviesTvs() {
    const mainHeader = document.querySelector('.main-header');
    const featureMovies = document.querySelector('.feature-movie');
    genreNames = [];
    const featureData = await this._getTrending(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${API_Key}`
    );
    console.log(featureData);

    const selectRandom = Math.floor(Math.random() * featureData.results.length);

    const genresArray = featureData.results[selectRandom].genre_ids;
    const featureMediaType = featureData.results[selectRandom].media_type;

    await this._getGenereNames(genresArray, featureMediaType, genreNames);

    const releaseDate =
      featureData.results[selectRandom].media_type === 'movie'
        ? 'release_date'
        : 'first_air_date';

    const title =
      featureData.results[selectRandom].media_type === 'movie'
        ? 'title'
        : 'name';

    mainHeader.style.background = `url(
        '${imgPath}/${featureData.results[selectRandom].backdrop_path}'
        ) center/cover no-repeat`;

    console.log(featureData.results[selectRandom].hasOwnProperty(releaseDate));

    //   render
    featureMovies.insertAdjacentHTML(
      'afterbegin',
      `
      <p class="feature-title">${
        featureData.results[selectRandom][title]
      } <span class="feature-category">${
        featureData.results[selectRandom].media_type
      }</span></p>
          <div class="feature-movie-info">
            <p class="feature-info movie-genere">${genreNames
              .slice(0, 3)
              .join(' | ')}</p>
            <p class="feature-info movie-year">${
              featureData.results[selectRandom][releaseDate].split('-')[0]
            }</p>
          </div>
          <p class="feature-description">
          ${featureData.results[selectRandom].overview.slice(0, 150)}
          </p>
          <div class="movie-actions">
          <button class="button btn-play">
            <ion-icon class="ion-icon" name="play-outline"></ion-icon>Play
          </button>
          <button class="button btn-list">
            <ion-icon class="ion-icon" name="add-outline"></ion-icon> my list
          </button>
        </div>
      `
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
// movie.featuresMoviesTvs();

// ==============
// user profile
document.querySelector('.users').addEventListener('click', () => {
  document.querySelector('.user-profile').classList.toggle('hidden');
});
