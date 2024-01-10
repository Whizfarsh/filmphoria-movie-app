'use strict';

import { Movieapp } from './script.js';
import { API_Key } from './script.js';
import { imgPath } from './script.js';
import { movieSearchForm } from './script.js';

import { movieSearchInput } from './script.js';
// DOMs
const searchedQuery = document.getElementById('search-query');
const searchResults = document.querySelector('.search-results');

const movieSearchQuery = new URLSearchParams(window.location.search).get('q');

if (!movieSearchQuery) window.location.href = '/';

let page = 0;

class Searchmovies extends Movieapp {
  constructor() {
    super();
    movieSearchInput.forEach(inEls => {
      inEls.value = movieSearchQuery;
    });
    this._getSearchedMovies('afterbegin');
    this._loadMore();
  }

  _loadMore() {
    const searchSection = document.querySelector('.movie-search--section');
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
    let fildID;
    page += 1;
    const searchedDatas = await this._getTrending(
      `https://api.themoviedb.org/3/search/multi?query=${movieSearchQuery}&page=${page}&api_key=${API_Key}`
    );

    searchedDatas.results.forEach(datas => {
      this._searchHtmlRender(datas, positionRE);
    });
    this._movieClickedOn(searchedDatas, 'search-movies-details');
  }

  //
  _searchHtmlRender(datas, positionResult) {
    const titlecat = datas.media_type === 'movie' ? 'title' : 'name';
    const title = datas[titlecat];
    const { poster_path, media_type } = datas;
    if (media_type === 'person' || !poster_path) return;
    searchResults.insertAdjacentHTML(
      `${positionResult}`,
      `
      <div class="search-movies-details">
        <img
          class="search-movie-img"
          src="${imgPath}${poster_path}"
          alt=""
        />
      </div>
    `
    );
  }
}

const searchmovies = new Searchmovies();
