'use strict';

import { Movieapp, genreNames, rendrGen } from './script.js';
import { API_Key } from './script.js';
import { imgPath } from './script.js';

// MOVIE SCRIPTS
const fpfId = new URLSearchParams(window.location.search).get('fpf');
const fpfMedia = new URLSearchParams(window.location.search).get('fpm');
const title = fpfMedia === 'movie' ? 'title' : 'name';

const tailerLink = 'https://www.youtube.com/watch?v=';
const notAvailableHtml = `<div class="not-available"><p>Trailer not available</p></div>`;

// reuseable functions
const renderNotAvailable = function (eltoinsert, position, html) {
  eltoinsert.insertAdjacentHTML(position, html);
};

// DOMs
const showInformation = document.querySelector('.show--information');
const videoTrailer = document.getElementById('video-trailer');
const titleContainer = document.querySelector('.movie-title-options');

// from class
class Movieinfo extends Movieapp {
  constructor() {
    super();
    this._getMovieById();
    this._getVideoTrailers();
    this._getSimilar();
  }

  async _getMovieById() {
    try {
      const getMovieDetails = await this._getTrending(
        `https://api.themoviedb.org/3/${fpfMedia}/${fpfId}?api_key=${API_Key}`
      );
      if (!getMovieDetails) throw new Error('Could\nt load Movies');
      this._showDetailsMenu(getMovieDetails);
      this._renderInformationTab(getMovieDetails);

      // console.log(getMovieDetails);
    } catch (err) {
      // console.log(err);
    }
  }

  // videos and trailers
  async _getVideoTrailers() {
    try {
      const mainTrailerEl = document.querySelector('.main-trailer');
      const otherTrailersElement = document.querySelector('.other-trailers');
      const videosMedia = await this._getTrending(
        `https://api.themoviedb.org/3/${fpfMedia}/${fpfId}/videos?api_key=${API_Key}`
      );

      if (!videosMedia) throw new Error('Unable to get Video Trailers');

      const videoMedialength = videosMedia.results.length;
      if (videoMedialength === 0) {
        mainTrailerEl.innerHTML = '';
        renderNotAvailable(mainTrailerEl, 'afterbegin', notAvailableHtml);
      } else if (videoMedialength <= 1) {
        mainTrailerEl.innerHTML = '';
        mainTrailerEl.insertAdjacentHTML(
          'afterbegin',
          `<iframe
        class="movie-video"
        src="https://www.youtube.com/embed/${videosMedia.results[0].key}?rel=0"
        frameborder="0"
        allowfullscreen
      ></iframe>`
        );
      } else {
        mainTrailerEl.insertAdjacentHTML(
          'afterbegin',
          `<iframe
        class="movie-video"
        src="https://www.youtube.com/embed/${videosMedia.results[0].key}?rel=0"
        frameborder="0"
        allowfullscreen
      ></iframe>`
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  _trailersToggle() {
    // other trailers open and close
    const openIcon = document.querySelector('.trailer-icon-open');
    const closeIcon = document.querySelector('.trailer-icon-close');
    const trailersEls = document.querySelectorAll('.trailer');

    const openTrailer = function (e) {
      const openIconParent = e.target.parentNode;
      openIconParent.style.width = '';
      openIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
      trailersEls.forEach(els => els.classList.remove('hidden'));
    };
    // openTrailer();
    closeIcon.addEventListener('click', function (e) {
      const closeIconParent = e.target.parentNode;
      closeIconParent.style.width = '3rem';
      closeIcon.classList.add('hidden');
      openIcon.classList.remove('hidden');
      trailersEls.forEach(els => els.classList.add('hidden'));
    });
    openIcon.addEventListener('click', openTrailer);
  }

  _otherTailersRendering(datas, elsfortrail) {
    datas.forEach((vids, i) => {
      if (i < 4) {
        // console.log(vids);
        elsfortrail.insertAdjacentHTML(
          `beforeend`,
          `<div class="trailer"><iframe style="width:100%;height:100%"
          src="https://www.youtube.com/embed/${vids.key}?rel=0"
          frameborder="0"
          allowfullscreen
        ></iframe></div>`
        );
      }
    });
  }

  // ========

  //start movie details
  _showDetailsMenu(datas) {
    const infoDetails = document.querySelector('.info--details');
    this.durationEls = document.querySelector('.duration');

    titleContainer.insertAdjacentHTML(
      'afterbegin',
      `<div class="title--ratings">
    <h6 class="title">${datas[title]}</h6>
  
  </div>
  <div class="movie--options">
    <button class="btn btn-movie-details btn-outline btn--active">
      <ion-icon name="share-social-outline"></ion-icon>
      Share
    </button>
  </div>`
    );

    if (fpfMedia === 'tv') {
      infoDetails.insertAdjacentHTML(
        'afterbegin',
        `<li class="info--option info--active" data-0="0">Information</li>
      <li class="info--option hidden" data-1="1">Episodes</li>
      <li class="info--option" data-2="2">Production company(ies)</li>`
      );
    }
    if (fpfMedia === 'movie') {
      infoDetails.insertAdjacentHTML(
        'afterbegin',
        `<li class="info--option info--active" data-0="0">Information</li>
      <li class="info--option hidden" data-1="1">Episodes</li>
      <li class="info--option" data-2="2">Production company(ies)</li>`
      );
    }
    this._informationUpdate(datas);
  }
  //
  _informationUpdate(datas) {
    const movieInfoLists = document.querySelectorAll('.info--option');
    const durationEls = document.querySelector('.duration');

    movieInfoLists.forEach((clickedEls, i) => {
      clickedEls.addEventListener('click', e => {
        movieInfoLists.forEach(els => els.classList.remove('info--active'));

        // add info active to the clicked element
        clickedEls.classList.add('info--active');

        //show
        const dataIndex = e.target.dataset[i];

        if (dataIndex === '0') {
          this._renderInformationTab(datas);
        }
        if (dataIndex === '1') {
          showInformation.innerHTML = '';
          showInformation.insertAdjacentHTML(
            'afterbegin',
            `
            <p class="info-decripttion">
            ipsum dolor sit amet, consectetur adipisicing elit. Vero quidem ad dolore aliquam, et magni ipsam similique esse. Aperiam vel dolore, voluptate adipisci quidem quaerat non maxime excepturi deleniti. Quo?
                    </p>
            `
          );
        }
        if (dataIndex === '2') {
          showInformation.innerHTML = '';
          showInformation.insertAdjacentHTML(
            'afterbegin',
            `
              <div class="movie-production-companies">
            </div>
            `
          );
          this._renderProductionCompany(datas);
        }
      });
    });
  }

  _updateDuration(datas) {
    const durationEls = document.querySelector('.duration');
    const releaseDate =
      fpfMedia === 'movie' ? 'release_date' : 'first_air_date';

    if (fpfMedia === 'tv') {
      durationEls.insertAdjacentHTML(
        'afterbegin',
        `
      <span>${
        datas[releaseDate].split('-')[0]
      }</span> <span id="separate-dot">&#x2022;</span><span>${
          datas.number_of_seasons
        } Seasons</span> <span id="separate-dot">&#x2022;</span> <span>${
          datas.number_of_episodes
        } Episodes in total</span>
      `
      );
    } else {
      durationEls.insertAdjacentHTML(
        'afterbegin',
        `
        <span>${
          datas[releaseDate].split('-')[0]
        }</span> <span id="separate-dot">&#x2022;</span> <span> ${this._getHoursandMinutes(
          datas.runtime
        )}</span>
      `
      );
    }
  }
  _renderInformationTab(datas) {
    showInformation.innerHTML = '';
    let posterimage = datas.backdrop_path
      ? datas.backdrop_path
      : datas.poster_path;
    showInformation.insertAdjacentHTML(
      'afterbegin',
      `
        <div class="overview--detail">
        <div class="poster--basic-info">
          <img
            src="${imgPath}${posterimage}"
            alt=""
          />
          <div class="movie-genre--rating">
            <p class="rating">
              <span>${datas.vote_average.toFixed(1)}</span> <span>${
        datas.vote_count
      } votes</span>
            </p>
            <p class="genre"></p>
            <p class="duration"> 
            </p>
          </div>
        </div>
        <p class="info-decripttion">
        ${datas.overview}
        </p>
      </div>
      <div class="other--details">
        <div class="production-details">
          <div class="location">
            <h6 class="hidden p-countries">Production Country(ies)</h6>
            <ul class="location-list">
            </ul>
          </div>
          <div class="language">
            <h6 class="hidden p-languages">Production Language(s)</h6>
            <ul class="language-list">
            </ul>
          </div>
        </div>
      </div>
      `
    );
    this._rendergenres(datas);
    this._updateProductionCol(datas);
    this._updateDuration(datas);
  }

  _updateProductionCol(datas) {
    const locationList = document.querySelector('.location-list');
    const languageList = document.querySelector('.language-list');

    if (datas.production_countries.length > 0) {
      document.querySelector('.p-countries').classList.remove('hidden');
      datas.production_countries.forEach(pcountries => {
        locationList.insertAdjacentHTML(
          'beforeend',
          `<li>${pcountries.name}</li>`
        );
      });
    }
    if (datas.spoken_languages.length > 0) {
      document.querySelector('.p-languages').classList.remove('hidden');
      datas.spoken_languages.forEach(plang => {
        languageList.insertAdjacentHTML(
          'beforeend',
          `<li>${plang.english_name}</li>`
        );
      });
    }
  }

  _rendergenres(datas) {
    const namesList = [];
    const genreEl = document.querySelector('.genre');
    datas.genres.forEach(genre => {
      namesList.push(genre.name);
    });
    for (let i = 0; i <= namesList.length; i++) {
      if (i < namesList.length - 1) {
        genreEl.insertAdjacentHTML(
          'beforeend',
          `<span>${namesList[i]} | </span>`
        );
      }
      if (i === namesList.length - 1) {
        genreEl.insertAdjacentHTML('beforeend', `<span>${namesList[i]}</span>`);
      }
    }
  }
  _renderProductionCompany(datas) {
    const movieCompanies = document.querySelector(
      '.movie-production-companies'
    );
    movieCompanies.innerHTML = '';
    if (datas.production_companies.length === 0) {
      renderNotAvailable(
        movieCompanies,
        'afterbegin',
        `<div class="company-not-available"><p>Cmpanies not available</p></div>`
      );
    } else {
      datas.production_companies.forEach(comp => {
        if (!comp.logo_path) {
          movieCompanies.insertAdjacentHTML(
            'afterbegin',
            `<div class="comp-details">
                      <p>${comp.name}</p>
            </div>`
          );
        } else {
          movieCompanies.insertAdjacentHTML(
            'afterbegin',
            `<div class="comp-details">
              <img
                      class="production-company"
                      src="${imgPath}${comp.logo_path}"
                      alt="${comp.name}" />
                      <p>${comp.name}</p>
            </div>`
          );
        }
      });
    }
  }
  // movie details end

  // movie similar
  async _getSimilar() {
    const similarContainer = document.querySelector('.movie-similars');
    try {
      let renderSimGen;

      const similarVids = await this._getTrending(
        `https://api.themoviedb.org/3/${fpfMedia}/${fpfId}/similar?api_key=${API_Key}`
      );
      // console.log(similarVids.results.sort());

      if (!similarVids || similarVids.results.length === 0)
        throw new Error(`Can't find similar movies`);
      similarContainer.insertAdjacentHTML(
        'afterbegin',
        `<h3>Similar movies</h3><div class="similar--movie-container"></div`
      );

      const similarMovieContainer = document.querySelector(
        '.similar--movie-container'
      );
      similarVids.results.forEach(async (simVid, i) => {
        if (i < 5) {
          renderSimGen = [];
          renderSimGen = await this._getGenereNames(
            simVid.genre_ids,
            fpfMedia,
            renderSimGen
          );
          // console.log(renderSimGen);
          // console.log(simVid);
          if (!simVid.poster_path) return;
          similarMovieContainer.insertAdjacentHTML(
            'afterbegin',
            `
            <div class="similar-movie-details">
            <img
              class="similar-movie-img"
              src="${imgPath}${simVid.poster_path}"
              alt=""
            />
            <div class="similar-movie-infos">
              <p id="m-title">${simVid[title]}</p>
              <div class="similar-movies--details">
                <p id="m-genre">${renderSimGen.splice(0, 2).join(' | ')}</p>
                
              </div>
            </div>
          </div>
          `
          );
          const similarMovieDetails = document.querySelector(
            '.similar-movie-details'
          );
          similarMovieDetails.addEventListener('click', () => {
            this._detailedInfo(simVid.id, fpfMedia);
          });
        }
      });
    } catch (err) {
      {
        similarContainer.innerHTML = '';
        similarContainer.insertAdjacentHTML(
          'afterbegin',
          `<p>${err.message}</p>`
        );
      }
    }
  }
}

const movieinfo = new Movieinfo();

// console.log(movieInfoLists);

// video button
// videoTrailer.play();
