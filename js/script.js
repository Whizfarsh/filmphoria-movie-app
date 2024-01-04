'use strict';

export const imgPath = 'https://image.tmdb.org/t/p/original/';
export const API_Key = 'a199ea0b8c593e3eb4678128a391bff7';

// // DOM variables
export const movies = document.querySelector('.movies');
export const moviesContainer = document.querySelector('.movies-containers');
export const showsContainer = document.querySelector('.shows-containers');
export const moviesDetails = document.querySelectorAll('.movies-details');
export const movieDetails = document.querySelectorAll('.movie-details');
export const movieSearchForm = document.querySelectorAll('.movie-search');
export let movieSearchInput = document.querySelectorAll('.search-input');
const mobileSearchIcon = document.querySelector('#mobile-search-icon');

export let genreNames;
export let rendrGen;

export class Movieapp {
  constructor() {
    this._showTrending();
    this.featuresMoviesTvs();
    this._mobileMenuToggles();
    this._mobileMenu();
    this._userProfile();

    movieSearchForm.forEach(inputElments => {
      if (inputElments.parentNode.classList.contains('hidden')) return;
      inputElments.addEventListener('submit', e => {
        e.preventDefault();
        movieSearchInput = inputElments.querySelector('.search-input');
        this._movieSearched();
      });
    });
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

  // convert movie duration to hours and minutes
  _getHoursandMinutes(inMinutes) {
    const theHour = Math.floor(inMinutes / 60);
    const theMinutes = inMinutes % 60;

    const timeDuration = `${theHour}hr ${theMinutes}min`;

    return timeDuration;
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
      if (!elementContainer) return;
      elementContainer.insertAdjacentHTML('afterbegin', html);

      const selectedDetailElement =
        elementContainer.querySelector('.movies-details');
      selectedDetailElement.addEventListener('click', () => {
        this._detailedInfo(datas.id, datas.media_type);
      });

      this._showedMoviesHoverEffect();
    });
  }
  async _showTrendingMovies() {
    try {
      if (!moviesContainer) return;
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
                <p class="">${rendrGen.splice(0, 1).join(' , ')} |</p>
                <p class="">${datas.media_type}</p>
              </div>
            </div>
            </div>`
      );
      this._leftToRightScroll(moviesContainer);
    } catch (err) {}
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
            <p class="">${rendrGen.splice(0, 1).join(' , ')} |</p>
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
    // console.log(featureData);

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

    if (!mainHeader) return;
    mainHeader.style.background = `url(
        '${imgPath}/${featureData.results[selectRandom].backdrop_path}'
        ) center/cover no-repeat`;

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

    mainHeader.addEventListener('click', () => {
      this._detailedInfo(
        featureData.results[selectRandom].id,
        featureData.results[selectRandom].media_type
      );
    });
  }

  // scrolling container to left and right
  _leftToRightScroll(containerElement) {
    let startX;
    let scrollLeft;

    if (!containerElement) return;
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

  //   // search
  async _movieSearched() {
    const movieSearchValue = movieSearchInput.value;
    console.log(movieSearchValue);
    // movieSearchInput.value = '';
    this._searchedWindow(movieSearchValue);
  }

  // search redirection function
  _searchedWindow(input) {
    window.location.href = `../p/search.html?q=${encodeURIComponent(input)}`;
  }

  // show deails function
  _detailedInfo(id, thetype) {
    const newTab = window.open();
    newTab.location.href = `../p/movie.html?fpm=${encodeURIComponent(
      thetype
    )}&fpf=${encodeURIComponent(id)}`;
  }

  // show search box
  _showSearchForm() {
    if (!mobileSearchIcon) return;
    mobileSearchIcon.addEventListener('click', e => {
      e.preventDefault();
      document
        .querySelector('#mobile-search-icon')
        .closest('.ion-icon')
        .classList.add('hidden');
      document
        .querySelector('#mobile-search-icon')
        .closest('.mobile--menu')
        .querySelector('.movie-search')
        .classList.remove('hidden');
    });
  }
  _mobileMenuToggles() {
    document.addEventListener('click', e => {
      e.preventDefault();
      const eParent = e.target.parentNode;
      const formInputSelection = mobileSearchIcon
        .closest('.mobile--menu')
        .querySelector('.movie-search');
      const searchIconSelection = document
        .querySelector('#mobile-search-icon')
        .closest('.ion-icon');
      if (
        !eParent.classList.contains('mobile--menu') &&
        e.target.classList != 'search-input'
      ) {
        if (formInputSelection.classList.contains('hidden')) return;
        formInputSelection.classList.add('hidden');
        searchIconSelection.classList.remove('hidden');
      }
      if (
        eParent.classList.contains('mobile--menu') &&
        e.target.classList != 'search-input'
      ) {
        if (
          !formInputSelection.classList.contains('hidden') &&
          e.target.classList.contains('mb-menu')
        ) {
          formInputSelection.classList.add('hidden');
          searchIconSelection.classList.remove('hidden');
        }
        this._showSearchForm();
      }
    });
  }

  // mobile menu handler
  _mobileMenu() {
    document.querySelector('.mb-menu').addEventListener('click', () => {
      document.querySelector('.mobile-menus--lists').style.transform =
        'translateX(0rem)';
      document.querySelector('.MDs-menu-close').style.transform = '30rem';
    });
    document.querySelector('.MDs-menu-close').addEventListener('click', () => {
      document.querySelector('.mobile-menus--lists').style.transform = '';
    });
  }

  _userProfile() {
    // user profile
    document.querySelector('.users').addEventListener('click', () => {
      document.querySelector('.user-profile').classList.toggle('hidden');
    });
  }

  // movie clicked
  _movieClickedOn(datas, elToQuery) {
    const moviesDetails = document.querySelectorAll(`.${elToQuery}`);

    // elToQuery = searchMoviesDetails;
    moviesDetails.forEach((clickedFilms, i) => {
      clickedFilms.addEventListener('click', () => {
        const id = datas.results[i].id;
        const mediaType = datas.results[i].media_type;
        // console.log(id, mediaType);
        this._detailedInfo(id, mediaType);
      });
    });
  }
}
const movie = new Movieapp();
