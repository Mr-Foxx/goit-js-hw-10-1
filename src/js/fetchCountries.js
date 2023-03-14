function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,flags,capital,population,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
  // .then(data => {
  //   console.log(data);
  //   return data;
  // });
}

export { fetchCountries };
