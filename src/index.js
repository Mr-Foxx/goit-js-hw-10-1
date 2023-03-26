import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countrylist = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const clearSearchBoxBtn = document.querySelector('#clear-search-box-btn');
const weatherContainer = document.querySelector('.weather-container');

searchBox.addEventListener('input', debounce(handleSearch, DEBOUNCE_DELAY));
clearSearchBoxBtn.addEventListener('click', () => {
  searchBox.value = '';
  handleClearForm();
  weatherContainer.innerHTML = '';
});

let lastSearchResults = [];

async function handleSearch(evt) {
  const searchValue = evt.target.value.toLowerCase().trim();

  handleClearForm();

  if (searchValue === '') {
    Notiflix.Notify.info('Please start typing');
    handleClearForm();
    return;
  }

  try {
    const countriesData = await fetchCountries(searchValue);

    console.log(countriesData);

    Notiflix.Loading.dots('loading...');

    if (countriesData.length > 10) {
      Notiflix.Loading.remove();
      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );

      return;
    }

    if (countriesData.length >= 2 && countriesData.length <= 10) {
      renderCauntriesCard(countriesData);
      renderClickCountry(countriesData);
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
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Oops, there is no country with that name');
    Notiflix.Loading.remove();
  }
}

function renderCountry(countriesData) {
  if (countriesData.length === 0) {
    return;
  }

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
      <div class="button-countainer">
      <button class="back-button">Back</button>
      <button class="current-wether">Current Weather</button>
    </div>
        `;
    })
    .join('');

  countrylist.innerHTML = country;

  const backButton = document.querySelector('.back-button');
  const currentWether = document.querySelector('.current-wether');

  backButton.addEventListener('click', backButtonClick);

  currentWether.addEventListener('click', () =>
    currentWetherBtn(countriesData)
  );
}

function renderCauntriesCard(countriesData) {
  lastSearchResults = countriesData;

  const countriesLyst = countriesData
    .map(elem => {
      const {
        name: { official },
        flags: { svg },
      } = elem;
      return `
    <div class='country'>

            <img src="${svg}" alt="flag ${official}" width='30' height='20'/>
            <h1>${official}</h1>

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

function renderClickCountry(countriesData) {
  document.addEventListener('click', event => {
    if (event.target.matches('h1')) {
      const selectedCountryName = event.target.textContent;
      const selectedCountry = countriesData.find(
        country => country.name.official === selectedCountryName
      );

      renderCountry([selectedCountry]);
    }
  });
}

async function currentWetherBtn(countriesData) {
  const capital = countriesData[0].capital;
  const watherData = await weatherFetch(capital);

  if (watherData) {
    const watherCapitalCurrent = `
        <h2>${watherData.location.name}, ${watherData.location.region}, ${watherData.location.country}</h2>
        <h2>Local time:<br> ${watherData.location.localtime}</h2>
        <h3> Current Wather: <br> ${watherData.current.condition.text}</h3>
        <img src='https:${watherData.current.condition.icon}' alt="${watherData.current.condition.text}">
         <p>Temp today: ${watherData.current.temp_c} </p>
        <p>feelslike:  ${watherData.current.feelslike_c} </p>
        <p>last updated:  ${watherData.current.last_updated} </p>
      `;
    weatherContainer.innerHTML = watherCapitalCurrent;
  }
}

function backButtonClick() {
  renderCauntriesCard(lastSearchResults);
  countryInfo.innerHTML = '';
  weatherContainer.innerHTML = '';
}

async function weatherFetch(countriesData) {
  const base_url = 'https://api.weatherapi.com/v1/forecast.json';
  const capital = countriesData;

  try {
    const response = await fetch(
      `${base_url}?key=0bf0e468e84a4f78877202940231303&q=${capital}&days=7`
    );

    if (!response.ok) {
      throw new Error(response.status);
    }

    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
}

// ======================
// function renderCC(countriesData) {
//   function showCountryDetails(country) {
//     const {
//       name: { official },
//       flags: { svg },
//       capital,
//       population,
//       languages,
//     } = country;

//     const countryHtml = `
//       <div class='country'>
//         <img src="${svg}" alt="flag ${official}" width='30' height='20'/>
//         <h1>${official}</h1>
//       </div>
//       <p>capital: ${capital}</p>
//       <p> population: ${population}</p>
//       <p>languages: ${Object.values(languages).join(', ')}</p>
// <button class='back-button'>Back</button>
//     `;
//     countrylist.innerHTML = countryHtml;

//     const backButton = document.querySelector('.back-button');
//     backButton.addEventListener('click', () => {
//       renderCauntriesCard(countriesData);
//     });
//   }

//   document.addEventListener('click', event => {
//     if (event.target.matches('h1')) {
//       const selectedCountryName = event.target.textContent;
//       const selectedCountry = countriesData.find(
//         country => country.name.official === selectedCountryName
//       );
//       showCountryDetails(selectedCountry);
//     }
//   });
// }

// ====================

// =================

// function renderCC(countriesData) {
//   document.addEventListener('click', onClickRenderCountri);

//   function onClickRenderCountri(event) {
//     if (event.target.matches('h1')) {
//       const selectedCountryName = event.target.textContent;

//       const selectedCountry = countriesData.find(
//         country => country.name.official === selectedCountryName
//       );

//       const {
//         name: { official },
//         flags: { svg },
//         capital,
//         population,
//         languages,
//       } = selectedCountry;

//       const countryHtml = `
//         <div class='country'>
//           <img src="${svg}" alt="flag ${official}" width='30' height='20'/>
//           <h1>${official}</h1>
//         </div>
//         <p>capital: ${capital}</p>
//         <p> population: ${population}</p>
//         <p>languages: ${Object.values(languages).join(', ')}</p>
//         <button class='back-button'>Back</button>
//       `;
//       countrylist.innerHTML = countryHtml;

//       const backButton = document.querySelector('.back-button');
//       backButton.addEventListener('click', () => {
//         renderCauntriesCard(countriesData);
//       });
//     }
//   }
// }

// =======================
// function renderCC(countriesData) {
//   document.addEventListener('click', event => {
//     if (event.target.matches('h1')) {
//       const selectedCountryName = event.target.textContent.trim();
//       const selectedCountry = countriesData.find(
//         country => country.name.official === selectedCountryName
//       );

//       if (selectedCountry) {
//         const {
//           name: { official },
//           flags: { svg },
//           capital,
//           population,
//           languages,
//         } = selectedCountry;

//         const countryHTML = `
//           <div class='country'>
//             <img src="${svg}" alt="flag ${official}" width='30' height='20'/>
//             <h1>${official}</h1>
//           </div>
//           <p>capital: ${capital}</p>
//           <p>population: ${population}</p>
//           <p>languages: ${Object.values(languages).join(', ')}</p>
//         `;

//         countryInfo.innerHTML = countryHTML;
//         countrylist.innerHTML = '';
//       }
//     }
//   });
// }

// =====================
// function renderCC(countriesData) {
//   document.addEventListener('click', event => {
//     if (event.target.matches('h1')) {
//       const countryName = event.target.textContent.trim();

//       const [countryInfoData] = countriesData.filter(
//         country => country.name.official === countryName
//       );

//       renderCountry([countryInfoData]);
//     }
//   });
// }

// =================

// function renderCC(countriesData) {
//   document.addEventListener('click', event => {
//     if (event.target.matches('h1')  {
//       const country = countriesData
//         .map(elem => {
//           const {
//             name: { official },
//             flags: { svg },
//             capital,
//             population,
//             languages,
//           } = elem;
//           return `
//        <div class='country'>

//          <img src="${svg}" alt="flag ${official}" width='30' height='20'/>
//          <h1>${official}</h1>
//          </div>
//          <p>capital: ${capital}</p>
//          <p> population: ${population}</p>
//          <p>languages: ${Object.values(languages).join(', ')}</p>

//         `;
//         })
//         .join('');

//       countrylist.innerHTML = country;
//     }
//   });
// }

// ===============

// window.addEventListener('click', el => {
//   if (el.target.nodeName !== 'H1') {
//     return;
//   }
// });

// ===========

// document.addEventListener('click', event => {
//   if (event.target.matches('h1') || event.target.matches('img')) {
//     const countryName = event.target.innerText;
//     // Тут можна додати функціонал, який потрібно виконати, коли вибрали країну
//     console.log(countryName);
//   }
// });
// ==============

// document.addEventListener('click', event => {
//   if (event.target.matches('h1') || event.target.matches('IMG')) {
//     console.log(countryName);
//   }
// });
