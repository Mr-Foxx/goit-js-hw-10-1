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
  // evt.preventDefault();

  const searchValue = evt.target.value.toLowerCase().trim();

  handleClearForm();

  if (searchValue === '') {
    Notiflix.Notify.info('Please start typing');
    handleClearForm();
    return;
  }

  fetchCountries(searchValue)
    .then(countriesData => {
      console.log(countriesData);
      Notiflix.Loading.dots('loading...');

      if (countriesData.length > 10) {
        Notiflix.Loading.remove();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );

        return;
      }
      console.log(countriesData.length);
      if (countriesData.length >= 2 && countriesData.length <= 10) {
        renderCauntriesCard(countriesData);
        Notiflix.Loading.remove();

        return;
      }
      if (countriesData.length === 1) {
        countrylist.innerHTML = '';
        renderCountry(countriesData);
        renderUkraine(countriesData);
        Notiflix.Loading.remove();

        return;
      }
    })
    .catch(error => {
      console.log('error', error);
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

         <img src="${svg}" alt="flag ${official}" width='30' height='20'/>
         <h1>${official}</h1>
         </div>
         <p>capital: ${capital}</p>
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
<li>
            <img src="${svg}" alt="flag ${official}" width='30' height='20'/>
            <h1>${official}</h1>
</li>
           </div>
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

function handleClearForm() {
  countryInfo.innerHTML = '';
  countrylist.innerHTML = '';
}
