const apiUrl = 'https://api.weather.gov/points/32.842674,-117.257767';

let isDayView = true;

function fetchForecast() {

    const fetchTime = new Date(); 
    const formattedTime = fetchTime.toLocaleTimeString();

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const forecastUrl = data.properties.forecast;
            return fetch(forecastUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(forecastData => {
            const selectedOption = document.getElementById('timeSelector').value;
            let numberOfArticlesToShow = isDayView ? 1 : 1; 
            console.log("Weather forecast data received :", forecastData);
            const timeDisplay = document.getElementById('fetchTime');
            timeDisplay.textContent = `Data last fetched at: ${formattedTime}`;

            if (selectedOption === 'threeDay') {
                numberOfArticlesToShow = isDayView ? 3 : 3;
            } else if (selectedOption === 'week') {
                numberOfArticlesToShow = forecastData.properties.periods.length;
            }
            displayWeatherForecast(forecastData, numberOfArticlesToShow);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

function getImageFileName(forecast) {
  if (forecast.toLowerCase().includes('cloudy')) {
      return 'cloudy.webp';
  } else if (forecast.toLowerCase().includes('fog')) {
      return 'fog.webp';
  } else if (forecast.toLowerCase().includes('sunny')) {
      return 'sunny.webp';
  } else if (forecast.toLowerCase().includes('clear')) {
      return 'clear.webp';
  } else {
      return 'default.webp';
  }
}

function displayWeatherForecast(forecastData, numberOfArticlesToShow) {
  const weatherInfoDiv = document.getElementById('weatherInfo');
  let forecastHTML = '';

  const filteredForecasts = isDayView
      ? forecastData.properties.periods.filter(period => !period.name.includes('Night') && !period.name.includes('Tonight'))
      : forecastData.properties.periods.filter(period => period.name.includes('Night') || period.name.includes('Tonight'));

  for (let i = 0; i < numberOfArticlesToShow && i < filteredForecasts.length; i++) {
      const forecast = filteredForecasts[i];
      const imageName = getImageFileName(forecast.detailedForecast);
      forecastHTML += `
          <article id="${forecast.name}">
              <h3>${forecast.name}</h3>
              <img src="./img/${imageName}" alt="${forecast.name}">
              <p>${forecast.detailedForecast}</p>
          </article>
      `;
  }

  weatherInfoDiv.innerHTML = forecastHTML;
}

document.getElementById('timeSelector').addEventListener('change', fetchForecast);

document.getElementById('toggleButton').addEventListener('click', () => {
    isDayView = !isDayView;
    const toggleButtonText = isDayView ? 'Click to see Night time' : 'Click to see Day time';
    document.getElementById('toggleButton').textContent = toggleButtonText;
    fetchForecast();
});

fetchForecast();
