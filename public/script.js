document.getElementById('cityInput').addEventListener('change', getWeather);

async function getWeather() {
  const cityName = document.getElementById('cityInput').value;

  if (!cityName) {
    alert('Please enter a city name');
    return;
  }

  try {
    const weatherData = await getWeatherData(cityName);
    const coordinates = await getCoordinates(cityName);

    displayWeatherInfo(weatherData);
    displayCoordinates(coordinates);
    displayMap(coordinates.lat, coordinates.lon);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    alert('Error fetching data. Please try again.');
  }
}

async function getCoordinates(city) {
  const apiKey = 'e8f51a9fa61247068a52126b455436ce';
  const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch coordinates: ${response.status}`);
    }

    const data = await response.json();

    if (data.results.length === 0) {
      throw new Error(`No results found for the city: ${city}`);
    }

    const { lat, lng } = data.results[0].geometry;
    return { lat, lon: lng };
  } catch (error) {
    throw new Error(`Error fetching coordinates: ${error.message}`);
  }
}

function displayCoordinates(coordinates) {
  const weatherInfoContainer = document.getElementById('weatherInfo');
  const coordinatesInfo = `<p>Coordinates:<br>${coordinates.lat}, ${coordinates.lon}</p>`;
  weatherInfoContainer.insertAdjacentHTML('beforeend', coordinatesInfo);
}

async function getWeatherData(city) {
  const apiKey = '3c67792002e48dddd8dfb152ed2e1b1a';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.status}`);
    }

    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    throw new Error(`Error fetching weather data: ${error.message}`);
  }
}

function displayWeatherInfo(data) {
  const weatherInfoContainer = document.getElementById('weatherInfo');
  weatherInfoContainer.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>Temperature: ${kelvinToCelsius(data.main.temp)}°C</p>
    <p>Feels Like: ${kelvinToCelsius(data.main.feels_like)}°C</p>
    <p>Description: ${data.weather[0].description}</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Pressure: ${data.main.pressure} hPa</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
    <p>Country Code: ${data.sys.country}</p>
    ${data.rain ? `<p>Rain (last 3 hours): ${data.rain['3h']} mm</p>` : ''}
  `;
}

function displayMap(lat, lon) {
  const mapContainer = document.getElementById('map');
  mapContainer.innerHTML = `<iframe
    width="100%"
    height="300"
    frameborder="0"
    scrolling="no"
    marginheight="0"
    marginwidth="0"
    src="https://www.openstreetmap.org/export/embed.html?bbox=${lon-2},${lat-2},${lon+2},${lat+2}&layer=mapnik">
  </iframe>`;
}

function kelvinToCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(2);
}
