// WEATHER API
// Create the coordinates to add intot he URL
const latitude = -31.4201;
const longitude = -64.1888;
const apiKey = "87326162fa99e6fadafd5410784b23d4";

// Weather
const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

// Forecast
const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

// Select the HTML tag
const weatherInfo = document.querySelector("#weather-info");


// Send the Get request for current weather
async function getWeather() {
    try {
        const response = await fetch(weatherURL);

        if (response.ok) {
            const data = await response.json();

            console.log(data);
            displayWeather(data);
        } else {
            throw new Error(await response.text());
        }
    } catch (error) {
        console.error("Weather error:", error);
        weatherInfo.textContent = "Weather information is not available.";
    }
}


// Display the current weather
function displayWeather(data) {

    // Create elements in the HTML file
    const currentWeather = document.createElement("div");
    const weatherIcon = document.createElement("img");
    const weatherDetails = document.createElement("div");
    const weatherTitle = document.createElement("h3");
    const temperature = document.createElement("p");
    const description = document.createElement("p");

    // Need to add classes to the tags for better CSS...
    currentWeather.id = "current-weather";
    weatherIcon.classList.add("weather-icon");
    weatherDetails.classList.add("weather-details");
    temperature.classList.add("current-temperature");

    // Collect the icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    weatherIcon.width = 100;
    weatherIcon.height = 100;

    // Populate the HTML with the weather info
    weatherTitle.textContent = "Current Weather";
    temperature.textContent = `${data.main.temp.toFixed(1)}°C`;
    description.textContent = data.weather[0].description;

    // Build the weather section
    weatherDetails.appendChild(weatherTitle);
    weatherDetails.appendChild(temperature);
    weatherDetails.appendChild(description);
    currentWeather.appendChild(weatherIcon);
    currentWeather.appendChild(weatherDetails);

    weatherInfo.appendChild(currentWeather);

}


// Send the Get request for three day weather (forecast)
async function getForecast() {
    try {
        const response = await fetch(forecastURL);

        if (response.ok) {
            const data = await response.json();

            console.log(data);
            displayForecast(data);
        } else {
            throw new Error(await response.text());
        }
    } catch (error) {
        console.error("Forecast error:", error);
    }
}


// Display the three day forecast
function displayForecast(data) {

    // Create elements in the HTML file
    const forecastContainer = document.createElement("div");
    const forecastTitle = document.createElement("h3");

    // Populate the HTML with the forecast info
    forecastContainer.id = "forecast-container";

    // Review my local time using the API timezone
    const today = new Date();

    const localToday = new Date(
        today.getTime() + (data.city.timezone * 1000)
    );

    const todayDate = localToday.toISOString().split("T")[0];

    // Save an array with the forecast
    const dailyForecast = [];

    data.list.forEach((forecast) => {

        const forecastDate = new Date(
            (forecast.dt + data.city.timezone) * 1000
        );

        const date = forecastDate.toISOString().split("T")[0];
        const hour = forecastDate.getUTCHours();

        // Skip forecast for today.
        if (date > todayDate) {

            // Verify if the forecast exists
            const existingForecast = dailyForecast.find(
                (day) => day.date === date
            );

            // Select the forecast close to noon
            if (!existingForecast) {
                dailyForecast.push({
                    date: date,
                    hour: hour,
                    forecast: forecast
                });
            } else if (Math.abs(hour - 12) < Math.abs(existingForecast.hour - 12)) {
                existingForecast.hour = hour;
                existingForecast.forecast = forecast;
            }
        }
    });

    // Display only the next three days...
    dailyForecast.sort((a, b) => a.date.localeCompare(b.date));

    const selectedDays = dailyForecast.slice(0, 3);

    // Create a card for each forecast day
    selectedDays.forEach((day) => {

        const forecast = day.forecast;

        const forecastCard = document.createElement("article");
        const forecastDate = document.createElement("h4");
        const weatherIcon = document.createElement("img");
        const forecastTemp = document.createElement("p");
        const forecastDescription = document.createElement("p");

        forecastCard.classList.add("forecast-card");

        // Format the forecast date
        const date = new Date(`${day.date}T12:00:00Z`);

        forecastDate.textContent = date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
            timeZone: "UTC"
        });

        // Get the forecast icon
        const iconCode = forecast.weather[0].icon;

        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIcon.alt = forecast.weather[0].description;
        weatherIcon.width = 80;
        weatherIcon.height = 80;
        weatherIcon.loading = "lazy";

        // Populate the forecast information.
        forecastTemp.textContent = `${forecast.main.temp.toFixed(1)}°C`;
        forecastDescription.textContent = forecast.weather[0].description;

        // Build the forecast card
        forecastCard.appendChild(forecastDate);
        forecastCard.appendChild(weatherIcon);
        forecastCard.appendChild(forecastTemp);
        forecastCard.appendChild(forecastDescription);

        forecastContainer.appendChild(forecastCard);
    });

    // Add the forecast to the weather section
    weatherInfo.appendChild(forecastContainer);
}


// Call the functions
getWeather();
getForecast();