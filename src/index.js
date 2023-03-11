import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countrylist = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// searchBox.addEventListener('input', handleSearch);
searchBox.addEventListener('input', debounce(handleSearch, DEBOUNCE_DELAY));

let serchValue = '';

function handleSearch(evt) {
  evt.preventDefault();

  const serchValue = evt.target.value.tolowerCase().trim();

  fetchCountries(serchValue).then(renderCountry);
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
    <li>

     <img src="${svg}" alt="flag ${official}" width='30px' height='20px'>
         <h1>${official}</h1>

    </li>
    `;
    })
    .join('');
  countrylist.innerHTML = countriesLyst;
}

// =======================
// function handleSearch(evt) {
//   evt.preventDefault();

//   const searchValue = evt.target.value.trim();

//   fetchCountries(searchValue).then(countriesData => {
//     if (countriesData.length >= 2 && countriesData.length <= 10) {
//       renderCauntriesCard(countriesData);
//       countryInfo.innerHTML = '';
//     } else if (countriesData.length === 1) {
//       renderCountry(countriesData);
//     } else {
//       Notiflix.Notify.info(
//         'Too many matches found. Please enter a more specific name.'
//       );
//       countryInfo.innerHTML = '';
//       countrylist.innerHTML = '';
//     }
//   });
// }
