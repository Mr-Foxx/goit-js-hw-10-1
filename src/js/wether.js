// ==============Готовий пошук погоди===============

const weatherContainer = document.querySelector('.weather-container');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');

const base_url = 'https://api.weatherapi.com/v1/forecast.json';
const API_KEY = '0bf0e468e84a4f78877202940231303';

function fetchWeather(capital) {
  return fetch(`${base_url}?key=${API_KEY}&q=${capital}&days=7`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      return data;
    });
}

function renderCurrentWeather(weatherData) {
  const currentWeatherHTML = `
    <div class="weather-info">
  <h2>${weatherData.location.name}, ${weatherData.location.region}, ${weatherData.location.country}</h2>
      <h3>Local time: ${weatherData.location.localtime}</h3>
      <h3>Current Weather: ${weatherData.current.condition.text}</h3>
      <img src="https:${weatherData.current.condition.icon}" alt="${weatherData.current.condition.text}" width="50px">
      <p>Temperature today: ${weatherData.current.temp_c}°C</p>
      <p>Feels like: ${weatherData.current.feelslike_c}°C</p>
       <p>Last updated: ${weatherData.current.last_updated}</p>
    </div>
  `;
  weatherContainer.innerHTML = currentWeatherHTML;
}

function searchWeather(event) {
  event.preventDefault();
  const city = searchInput.value.trim();
  if (city) {
    fetchWeather(city)
      .then(weatherData => {
        renderCurrentWeather(weatherData);
        renderWeatherList(weatherData);
        searchInput.value = '';
      })
      .catch(error => {
        console.error(error);
      });
  }
}

searchForm.addEventListener('submit', searchWeather);

// ==================================================

//  при завантажування відображається температурв Київ

// const watherContainer = document.querySelector('.wather-container');

// function weatherFetch() {
//   const base_url = 'https://api.weatherapi.com/v1/forecast.json';
//   const capital = 'Kiev';
//   return fetch(
//     `${base_url}?key=0bf0e468e84a4f78877202940231303&q=${capital}&days=7`
//   )
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(response.status);
//       }
//       return response.json();
//     })
//     .then(data => {
//       console.log(data);
//       renderWeather(data);
//       return data;
//     });
// }

// function renderWeather(resposeWather) {
//   const watherCapitalCurrent = `

//     <div class="wather-info-capital">
//       <h2>${resposeWather.location.name}, ${resposeWather.location.region}, ${resposeWather.location.country}</h2>
//     <h2>Local time:<br> ${resposeWather.location.localtime}</h2>
//         <h3> Current Wather: <br> ${resposeWather.current.condition.text}</h3>
//         <img src="https:${resposeWather.current.condition.icon}" alt="${resposeWather.current.condition.text}"  width='50px'>
//         <p>Temp today: ${resposeWather.current.temp_c} </p>
//         <p>feelslike:  ${resposeWather.current.feelslike_c} </p>
//         <p>last updated:  ${resposeWather.current.last_updated} </p>
//     </div>

//     `;

//   watherContainer.innerHTML = watherCapitalCurrent;
// }
// weatherFetch();
