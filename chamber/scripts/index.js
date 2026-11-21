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
    const temperature = document.createElement("p");
    const description = document.createElement("p");

    // Need to add classes to the tags for better CSS...
    currentWeather.classList.add("current-weather");

    // Populate the HTML with the weather info
    temperature.textContent = `Temperature: ${data.main.temp.toFixed(1)}°C`;
    description.textContent = `Conditions: ${data.weather[0].description}`;

    // Build the weather section
    currentWeather.appendChild(temperature);
    currentWeather.appendChild(description);
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
    forecastContainer.classList.add("forecast-container");
    forecastTitle.textContent = "Three-Day Forecast";

    forecastContainer.appendChild(forecastTitle);

    // Get Cordoba's local time using the API timezone
    const today = new Date();

    const localToday = new Date(
        today.getTime() + (data.city.timezone * 1000)
    );

    const todayDate = localToday.toISOString().split("T")[0];

    // Store the forecast for each day
    const dailyForecast = [];

    data.list.forEach((forecast) => {

        // Convert forecast timestamp to my local date and time
        const forecastDate = new Date(
            (forecast.dt + data.city.timezone) * 1000
        );

        const date = forecastDate.toISOString().split("T")[0];

        const hour = forecastDate.getUTCHours();

        // Skip today and select forecasts close to noon
        if (date > todayDate && hour === 12) {

            if (dailyForecast.length < 3) {
                dailyForecast.push(forecast);
            }
        }
    });

    // Create a card for each forecast day
    dailyForecast.forEach((forecast) => {

        const forecastCard = document.createElement("div");
        const forecastDate = document.createElement("h4");
        const forecastTemp = document.createElement("p");
        const forecastDescription = document.createElement("p");

        forecastCard.classList.add("forecast-card");

        // Format the forecast date
        const date = new Date(
            (forecast.dt + data.city.timezone) * 1000
        );

        forecastDate.textContent = date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
            timeZone: "UTC"
        });

        forecastTemp.textContent =
            `Temperature: ${forecast.main.temp.toFixed(1)}°C`;

        forecastDescription.textContent =
            forecast.weather[0].description;

        forecastCard.appendChild(forecastDate);
        forecastCard.appendChild(forecastTemp);
        forecastCard.appendChild(forecastDescription);

        forecastContainer.appendChild(forecastCard);
    });

    weatherInfo.appendChild(forecastContainer);
}


// Call weather functions
getWeather();
getForecast();


// BUSINESS SPOTLIGHTS
const companiesURL = "./scripts/cordoba-businesses.json";

// Select the HTML element
const spotlightContainer = document.querySelector("#spotlight-container");


// Select the company members for spotlights
async function getSpotlights() {
    try {
        const response = await fetch(companiesURL);

        if (response.ok) {
            const data = await response.json();

            console.log(data);

            // Select only Gold and Silver members
            const qualifiedCompanies = data.companies.filter(
                (company) =>
                    company.membershipLevel === "gold" ||
                    company.membershipLevel === "silver"
            );

            // Create a copy of the qualified companies
            const availableCompanies = [...qualifiedCompanies];

            // Select two or three random companies
            const numberOfSpotlights = Math.min(
                3,
                availableCompanies.length
            );

            const selectedCompanies = [];

            while (selectedCompanies.length < numberOfSpotlights) {

                const randomIndex = Math.floor(
                    Math.random() * availableCompanies.length
                );

                // Add the selected company
                selectedCompanies.push(
                    availableCompanies[randomIndex]
                );

                // Remove the selected company to avoid duplicates
                availableCompanies.splice(randomIndex, 1);
            }

            displaySpotlights(selectedCompanies);

        } else {
            throw new Error(await response.text());
        }

    } catch (error) {
        console.error("Spotlight error:", error);
    }
}


// Display tje spotlight cards
function displaySpotlights(companies) {

    spotlightContainer.innerHTML = "";

    companies.forEach((company) => {

        // Create the spotlight card...
        const card = document.createElement("article");
        card.classList.add("spotlight-card");

        // Create company elements///
        const companyName = document.createElement("h3");
        const portrait = document.createElement("img");
        const phone = document.createElement("p");
        const address = document.createElement("p");
        const website = document.createElement("p");
        const membership = document.createElement("p");

        // Poppulate the company information
        companyName.textContent = company.businessName;
        portrait.setAttribute("src", company.img);
        portrait.setAttribute("alt", `Logo of ${company.businessName}`);
        portrait.setAttribute("loading", "lazy");
        portrait.setAttribute("width", "150");
        portrait.setAttribute("height", "auto");

        phone.textContent = `PHONE: ${company.phone}`;
        address.textContent = `ADDRESS: ${company.address}`;

        // Create website link
        const websiteLink = document.createElement("a");
        websiteLink.setAttribute("href", `https://${company.url}`);
        websiteLink.setAttribute("target", "_blank");
        websiteLink.setAttribute("rel", "noopener noreferrer");
        websiteLink.textContent = company.url;

        website.textContent = "WEBSITE: ";
        website.appendChild(websiteLink);

        // Display membership level
        const membershipLevel =
            company.membershipLevel.charAt(0).toUpperCase() +
            company.membershipLevel.slice(1);

        membership.textContent = `MEMBERSHIP: ${membershipLevel}`;

        // Add membership class for CSS
        card.classList.add(company.membershipLevel);

        // Append elements to the card
        card.appendChild(companyName);
        card.appendChild(portrait);
        card.appendChild(phone);
        card.appendChild(address);
        card.appendChild(website);
        card.appendChild(membership);

        // Append card to spotlight container
        spotlightContainer.appendChild(card);
    });
}


// Call the spotlight function
getSpotlights();