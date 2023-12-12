class WeatherComponent extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        this.isDayView = true;
        this.apiUrl = 'https://api.weather.gov/points/32.842674,-117.257767';
        
        const style = document.createElement('style');
        style.textContent = `  
            section {
                background-color: black;
                color: white;
                padding: 0.5rem;
                border: white 2px solid;
                margin: 1rem;
                border-radius: 0.5rem;
            }

            article {
                background-color: black;
                color: white;
                margin: 1rem;
                border-radius: 0.5rem;
                border: 2px solid white;
                padding: 0 1rem;
                flex: 1 0 30%;
            }

            #weatherInfo {
                display: flex;
                flex-wrap: wrap;
            }

            img {
                width: 100px;
                height: auto;
                border-radius: 50%;
            }

            p {
                color: white;
            }

            button {
                background-color: #333;
                color: white;
                border: none;
                border-radius: 0.5rem;
                padding: 0.5rem;
                margin: 0.5rem;
                cursor: pointer;
            }

            select {
                background-color: #333;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                color: white;
                border: none;
                border-radius: 0.5rem;
                padding: 0.35rem;
                margin: 0.5rem;
                cursor: pointer;
            }
        `;

        const container = document.createElement('div');
        container.innerHTML = `
            <h1>Weather Information</h1>
            <p id="fetchTime"></p>
            <button id="toggleButton">Click to see Night time</button>
            <select id="timeSelector">
              <option value="today">Today</option>
              <option value="threeDay">Three Day</option>
              <option value="week">Week</option>
            </select>
            <div id="weatherInfo"></div>
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(container);
    }



    connectedCallback() {
        this.shadowRoot.getElementById('timeSelector').addEventListener('change', () => this.fetchForecast());
        this.shadowRoot.getElementById('toggleButton').addEventListener('click', () => this.toggleDayNightView());
        this.fetchForecast();
    }

    fetchForecast() {
        const fetchTime = new Date(); 
        const formattedTime = fetchTime.toLocaleTimeString();

        fetch(this.apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const forecastUrl = data.properties.forecast;
                console.log("Weather data received :", data);
                return fetch(forecastUrl);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(forecastData => {
                const selectedOption = this.shadowRoot.getElementById('timeSelector').value;
                let numberOfArticlesToShow = this.isDayView ? 1 : 1; 
                // console.log("Weather forecast data received :", forecastData);
                const timeDisplay = this.shadowRoot.getElementById('fetchTime');
                timeDisplay.textContent = `Data last fetched at: ${formattedTime}`;

                if (selectedOption === 'threeDay') {
                    numberOfArticlesToShow = this.isDayView ? 3 : 3;
                } else if (selectedOption === 'week') {
                    numberOfArticlesToShow = forecastData.properties.periods.length;
                }
                this.displayWeatherForecast(forecastData, numberOfArticlesToShow);
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }

    toggleDayNightView() {
        this.isDayView = !this.isDayView;
        const toggleButtonText = this.isDayView ? 'Click to see Night time' : 'Click to see Day time';
        this.shadowRoot.getElementById('toggleButton').textContent = toggleButtonText;
        this.fetchForecast();
    }

    displayWeatherForecast(forecastData, numberOfArticlesToShow) {
        const weatherInfoDiv = this.shadowRoot.getElementById('weatherInfo');
        let forecastHTML = '';

        const filteredForecasts = this.isDayView
            ? forecastData.properties.periods.filter(period => !period.name.includes('Night') && !period.name.includes('Tonight'))
            : forecastData.properties.periods.filter(period => period.name.includes('Night') || period.name.includes('Tonight'));

        for (let i = 0; i < numberOfArticlesToShow && i < filteredForecasts.length; i++) {
            const forecast = filteredForecasts[i];
            const imageName = this.getImageFileName(forecast.detailedForecast);
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

    getImageFileName(forecast) {
        if (forecast.toLowerCase().includes('cloudy')) {
            return 'cloudy.webp';
        } else if (forecast.toLowerCase().includes('fog')) {
            return 'fog.webp';
        } else if (forecast.toLowerCase().includes('sunny')) {
            return 'sunny.webp';
        } else if (forecast.toLowerCase().includes('clear')) {
            return 'clear.webp'
        } else {
            return 'default.webp';
        }
    }
}

customElements.define('weather-component', WeatherComponent);