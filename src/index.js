import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryListEL = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

const onInputElFill = event => {
  const value = event.target.value.trim();

  if (value.length > 0) {
    fetchCountries(value)
      .then(data => {
        if (data.length > 10) {
          Notiflix.Notify.warning(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        } else if (data.length >= 2 && data.length < 10) {
          countryInfoEl.innerHTML = '';
          createCountriesList(data);
          return;
        } else {
          countryListEL.innerHTML = '';
          createCounriesCard(data);
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  } else {
    countryInfoEl.innerHTML = '';
    countryListEL.innerHTML = '';
  }
};

const createCounriesCard = countriesInfo => {
  const countriesCard = countriesInfo.map(el => {
    const { flags, name, capital, population, languages } = el;
    const languagesString = Object.values(languages).join(', ');
    return `<div class="contry-info-header">
      <img src="${flags.svg}" alt="Country flag" height='30px'>
      <p><b>${name.official}</b></p>
    </div>
    <ul class="contry-info-list">
      <li class="contry-info-item">
        <p><b>Capital: </b>${capital}</p>
      </li>
      <li class="contry-info-item">
        <p><b>Population: </b>${population}</p>
      </li>
      <li class="contry-info-item">
        <p><b>Languages: </b>${languagesString}</p>
      </li>
    </ul>`;
  });

  return (countryInfoEl.innerHTML = countriesCard.join(''));
};

const createCountriesList = countriesNames => {
  const countriesList = countriesNames.map(el => {
    const { name, flags } = el;
    return `<li class="contry-list-item">
      <img src="${flags.svg}" alt="Country flag" height='25px'>
      <p>${name.official}</p>
    </li>`;
  });
  return (countryListEL.innerHTML = countriesList.join(''));
};

inputEl.addEventListener('input', debounce(onInputElFill, DEBOUNCE_DELAY));
