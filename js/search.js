'use strict';

import { Movieapp } from './script.js';
import { API_Key } from './script.js';
import { imgPath } from './script.js';
import { movieSearchForm } from './script.js';

import { movieSearchInput } from './script.js';
import { showsContainer } from './script.js';
import { moviesDetails } from './script.js';
import { genreNames } from './script.js';
import { rendrGen } from './script.js';

// ${rendrGen.splice(0, 2).join(' , ')}
console.log(movieSearchInput);
// DOMs
const searchedQuery = document.getElementById('search-query');
const searchResults = document.querySelector('.search-results');

const movieSearchQuery = new URLSearchParams(window.location.search).get('q');

movieSearchInput.value = movieSearchQuery;
console.log(movieSearchInput.value);
// movieSearchInput.value = movieSearchValue;

let page = 0;

class Searchmovies extends Movieapp {
  constructor() {
    super();
    movieSearchInput.value = movieSearchQuery;
    this._getSearchedMovies('afterbegin');
    this._loadMore();
  }

  _loadMore() {
    const searchSection = document.querySelector('.movie-search--section');
    // this._getSearchedMovies('beforeend');
    // ======================
    window.addEventListener('scroll', e => {
      if (!getSearchResultEnd(searchSection)) return;
      this._getSearchedMovies('beforeend');
    });
    const getSearchResultEnd = function (el) {
      const searchResultsSize = el.getBoundingClientRect();
      return (
        searchResultsSize.bottom >= window.innerHeight &&
        searchResultsSize.bottom - 1 <= window.innerHeight + 1
      );
    };
    // ================
  }

  async _getSearchedMovies(positionRE) {
    page += 1;
    const searchedDatas = await this._getTrending(
      `https://api.themoviedb.org/3/search/multi?query=${movieSearchQuery}&page=${page}&api_key=${API_Key}`
    );

    searchedDatas.results.forEach(datas => {
      this._searchHtmlRender(datas, positionRE);
    });
  }

  //
  _searchHtmlRender(datas, positionResult) {
    // console.log(datas);
    const titlecat = datas.media_type === 'movie' ? 'title' : 'name';
    const title = datas[titlecat];
    const { poster_path, media_type, vote_average } = datas;
    if (media_type === 'person') return;
    searchResults.insertAdjacentHTML(
      `${positionResult}`,
      `
      <div class="search-movies-details">
        <img
          class="search-movie-img"
          src="${imgPath}${poster_path}"
          alt=""
        />
        <div class="search-movie-detail">
          <p class="movie-title">${title}</p>
          <div class="movie-info">
            <p class="movie-rating">
              <ion-icon class="rating-icon" name="star"></ion-icon> ${Math.floor(
                vote_average
              )} |
            </p>
            <p class="">Comedy |</p>
            <p class="">${media_type}</p>
          </div>
        </div>
      </div>
    `
    );
  }
}

const searchmovies = new Searchmovies();
