import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countrylist = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(handleSearch, DEBOUNCE_DELAY));

function handleSearch(evt) {
  evt.preventDefault();

  const searchValue = evt.target.value.toLowerCase().trim();

  fetchCountries(searchValue)
    .then(countriesData => {
      Notiflix.Loading.dots('loading...');

      if (countriesData === undefined) {
        return;
      }

      if (countriesData.length > 10) {
        Notiflix.Loading.remove();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );

        return;
      }
      if (countriesData.length >= 2 && countriesData.length < 10) {
        renderCauntriesCard(countriesData);
        Notiflix.Loading.remove();

        return;
      }
      if (countriesData.length === 1) {
        console.log(countriesData);

        countrylist.innerHTML = '';
        renderCountry(countriesData);
        renderUkraine(countriesData);
        Notiflix.Loading.remove();

        return;
      }
    })
    .catch(error => {
      if (searchValue.length === 0) {
        Notiflix.Notify.info('Please start typing');
        countryInfo.innerHTML = '';
        countrylist.innerHTML = '';
        return;
      }
      Notiflix.Notify.failure('Oops, there is no country with that name');
      Notiflix.Loading.remove();
    });
}

function renderCountry(countriesData) {
  const country = countriesData
    .map(elem => {
      const {
        name: { official },
        flags: { svg },
        capital,
        population,
        languages,
      } = elem;
      return `
       <div class='country'>

         <img src="${svg}" alt="flag ${official}" width='30px' height='20px'>
         <h1>${official}</h1>
         </div>
         <p>capital: ${capital.join('')}</p>
         <p> population: ${population}</p>
         <p>languages: ${Object.values(languages).join(', ')}</p>

        `;
    })
    .join('');

  countryInfo.innerHTML = country;
}

function renderCauntriesCard(countriesData) {
  countriesLyst = countriesData
    .map(elem => {
      const {
        name: { official },
        flags: { svg },
      } = elem;
      return `
    <div class='country'>

            <img src="${svg}" alt="flag ${official}" width='30px' height='20px'>
            <h1>${official}</h1>

           </div>
            </li>
    `;
    })
    .join('');
  countrylist.innerHTML = countriesLyst;
}

function renderUkraine(countriesData) {
  const ukraine = countriesData.map(elem => {
    if (elem.name.official === 'Ukraine') {
      const rendUkraine = '<p class="ukraine">Be brave like Ukraine!</p>';

      countryInfo.insertAdjacentHTML('beforeend', rendUkraine);

      Notiflix.Notify.success('Be brave like Ukraine!');
    }
  });
}
