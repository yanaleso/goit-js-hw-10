import {fetchCountries} from "./js/fetchCountries";
import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),  
}

refs.input.addEventListener("input", debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';

  const countryName = refs.input.value.trim();

  if (countryName) {
    fetchCountries(countryName).then(checkCountryArray).catch((error) => {
    Notify.failure('Oops, there is no country with that name');
    console.log(error)
  });
  }
}

function checkCountryArray(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');

    return;
  }

  renderCountryList(countries);
}

function renderCountryList(countries) {
  const countriesArr = countries;

  const markup = countriesArr
    .map(({flags, name}) => {
      return `<li class="country-item"><img src="${flags.svg}" alt="${name.official}" width="30" height="20">
      <span>${name.official}</span>
        </li>`;
    })
    .join("");
  refs.countryList.insertAdjacentHTML('afterbegin', markup);
  
  if (countriesArr.length === 1) {
    renderCountryCard(countriesArr);
  } 
}

function renderCountryCard(countriesArr) {
  const flag = document.querySelector('img');
  const cardTitle = document.querySelector('span');

  flag.classList.add("flag");
  cardTitle.classList.add("card-title");

  const languageList = Object.values(countriesArr[0].languages).join(', ');

  const markupCardInfo = `
    <ul>
      <li><b>Capital:</b> ${countriesArr[0].capital}</li>
      <li><b>Population:</b> ${countriesArr[0].population}</li>
      <li><b>Languages:</b> ${languageList}</li>
    </ul>`;
  
  refs.countryInfo.insertAdjacentHTML('afterbegin', markupCardInfo);
}