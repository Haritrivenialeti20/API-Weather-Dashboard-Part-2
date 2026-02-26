// API Configuration
const API_KEY = 'demo'; // Replace with actual API key for production
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const errorMessage = document.getElementById('error-message');
const loading = document.getElementById('loading');
const weatherDisplay = document.getElementById('weather-display');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');

// Show Error Message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    weatherDisplay.classList.remove('show');
}

// Clear Error Message
function clearError() {
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
}

// Show Loading Spinner
function showLoading() {
    loading.classList.add('show');
    weatherDisplay.classList.remove('show');
    clearError();
}

// Hide Loading Spinner
function hideLoading() {
    loading.classList.remove('show');
}

// Display Weather Data
function displayWeather(data) {
    cityName.textContent = data.name + ', ' + data.sys.country;
    temperature.textContent = Math.round(data.main.temp) + '°C';
    description.textContent = data.weather[0].description;
    humidity.textContent = 'Humidity: ' + data.main.humidity + '%';
    
    weatherDisplay.classList.add('show');
    clearError();
}

// Get Weather Data using Async/Await
async function getWeather(city) {
    // Show loading state
    showLoading();
    
    // Disable button while loading
    searchBtn.disabled = true;
    
    try {
        // Make API call using axios with await
        const response = await axios.get(BASE_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric'
            }
        });
        
        // Display weather data on success
        displayWeather(response.data);
        
    } catch (error) {
        // Handle different types of errors
        if (error.response && error.response.status === 404) {
            showError('City not found! Please check the city name and try again.');
        } else if (error.response && error.response.status === 401) {
            showError('Invalid API key. Please check your configuration.');
        } else if (error.code === 'ECONNABORTED') {
            showError('Request timeout. Please check your internet connection.');
        } else {
            showError('An error occurred while fetching weather data. Please try again.');
        }
    } finally {
        // Always re-enable the button
        searchBtn.disabled = false;
    }
}

// Handle Search
function handleSearch() {
    const city = cityInput.value.trim();
    
    // Input validation
    if (!city) {
        showError('Please enter a city name!');
        return;
    }
    
    // Call getWeather with the city name
    getWeather(city);
    
    // Clear the input field
    cityInput.value = '';
}

// Event Listener for Search Button Click
searchBtn.addEventListener('click', handleSearch);

// Event Listener for Enter Key
cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

// Focus management - focus input on page load
cityInput.focus();

// Initial welcome message
showError('Enter a city name above to get started!');
