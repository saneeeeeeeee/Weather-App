document.getElementById('cityInput').addEventListener('change', getWeather);

async function getWeather() {
  const cityName = document.getElementById('cityInput').value;

  if (!cityName) {
    alert('Please enter a city name');
    return;
  }

  try {
    const weatherData = await getWeatherData(cityName);
    displayWeatherInfo(weatherData);
    displayMap(weatherData.coord.lat, weatherData.coord.lon);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    alert('Error fetching weather data. Please try again.');
  }
}

async function getWeatherData(city) {
  const apiKey = 'your_api_key';
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

async function getAQIData(lat, lon) {
  const apiKey = 'your_api_key';
  const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch AQI data: ${response.status}`);
    }

    const aqiData = await response.json();
    return aqiData;
  } catch (error) {
    throw new Error(`Error fetching AQI data: ${error.message}`);
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
  displayAQIInfo(data.coord.lat, data.coord.lon);
  getNews(data.name);
}

async function displayAQIInfo(lat, lon) {
  try {
    const aqiData = await getAQIData(lat, lon);
    const aqiInfoContainer = document.getElementById('aqiInfo');
    aqiInfoContainer.innerHTML = `
      <h2>Air Quality Index (AQI)</h2>
      <p>AQI: ${aqiData.list[0].main.aqi}</p>
      <p>Particulate Matter (PM2.5): ${aqiData.list[0].components.pm2_5} µg/m³</p>
      <p>Particulate Matter (PM10): ${aqiData.list[0].components.pm10} µg/m³</p>
    `;
  } catch (error) {
    console.error('Error fetching AQI data:', error.message);
    const aqiInfoContainer = document.getElementById('aqiInfo');
    aqiInfoContainer.innerHTML = '<p>Error fetching AQI data. Please try again.</p>';
  }
}

async function getNews(city) {
  const apiKey = 'your_api_key';
  const newsApiUrl = `https://newsapi.org/v2/everything?q=${city}&apiKey=${apiKey}&pageSize=3`;

  try {
    const response = await fetch(newsApiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch news data: ${response.status}`);
    }

    const newsData = await response.json();
    displayNewsInfo(newsData.articles);
  } catch (error) {
    console.error('Error fetching news data:', error.message);
    const newsInfoContainer = document.getElementById('newsInfo');
    newsInfoContainer.innerHTML = '<p>Error fetching news data. Please try again.</p>';
  }
}

function displayNewsInfo(newsArticles) {
  const newsInfoContainer = document.getElementById('newsInfo');
  newsInfoContainer.innerHTML = '';

  newsArticles.forEach(article => {
    const truncatedTitle = truncateText(article.title, 50); 
    const truncatedDescription = truncateText(article.description, 100); 
    newsInfoContainer.innerHTML += `
      <div class="news-article">
        <h3>${truncatedTitle}</h3>
        <p>${truncatedDescription}</p>
        <a href="${article.url}" target="_blank">Read more</a>
      </div>
    `;
  });
}

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
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
