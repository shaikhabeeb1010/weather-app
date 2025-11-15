// API Configuration
const API_KEY = 'ca1330cedb1bb29e9bc13b09b946daf0'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const errorMessage = document.getElementById('error-message');
const weatherContent = document.getElementById('weather-content');

// Weather icon mapping
const weatherIcons = {
    '01d': 'fas fa-sun',
    '01n': 'fas fa-moon',
    '02d': 'fas fa-cloud-sun',
    '02n': 'fas fa-cloud-moon',
    '03d': 'fas fa-cloud',
    '03n': 'fas fa-cloud',
    '04d': 'fas fa-cloud',
    '04n': 'fas fa-cloud',
    '09d': 'fas fa-cloud-rain',
    '09n': 'fas fa-cloud-rain',
    '10d': 'fas fa-cloud-sun-rain',
    '10n': 'fas fa-cloud-moon-rain',
    '11d': 'fas fa-bolt',
    '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake',
    '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog',
    '50n': 'fas fa-smog'
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Load default city weather (New York)
    getWeatherByCity('New York');
    
    // Event listeners
    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    locationBtn.addEventListener('click', getWeatherByLocation);
});

// Handle search functionality
function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    } else {
        showError('Please enter a city name');
    }
}

// Get weather by city name
async function getWeatherByCity(city) {
    showLoading();
    hideError();
    
    try {
        // Get current weather
        const currentWeatherResponse = await fetch(
            `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        
        if (!currentWeatherResponse.ok) {
            throw new Error('City not found');
        }
        
        const currentWeatherData = await currentWeatherResponse.json();
        
        // Get forecast data
        const forecastResponse = await fetch(
            `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );
        
        if (!forecastResponse.ok) {
            throw new Error('Forecast data not available');
        }
        
        const forecastData = await forecastResponse.json();
        
        displayWeather(currentWeatherData, forecastData);
        
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Get weather by user's location
function getWeatherByLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }
    
    showLoading();
    hideError();
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
                // Get current weather
                const currentWeatherResponse = await fetch(
                    `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
                );
                
                if (!currentWeatherResponse.ok) {
                    throw new Error('Weather data not available for your location');
                }
                
                const currentWeatherData = await currentWeatherResponse.json();
                
                // Get forecast data
                const forecastResponse = await fetch(
                    `${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
                );
                
                if (!forecastResponse.ok) {
                    throw new Error('Forecast data not available for your location');
                }
                
                const forecastData = await forecastResponse.json();
                
                displayWeather(currentWeatherData, forecastData);
                
            } catch (error) {
                showError(error.message);
            } finally {
                hideLoading();
            }
        },
        (error) => {
            hideLoading();
            showError('Unable to retrieve your location. Please enable location services.');
        }
    );
}

// Display weather data
function displayWeather(currentData, forecastData) {
    // Update current weather
    document.getElementById('location').textContent = `${currentData.name}, ${currentData.sys.country}`;
    document.getElementById('date').textContent = formatDate(currentData.dt * 1000);
    document.getElementById('temperature').textContent = `${Math.round(currentData.main.temp)}°C`;
    document.getElementById('description').textContent = currentData.weather[0].description;
    document.getElementById('feels-like').textContent = `${Math.round(currentData.main.feels_like)}°C`;
    document.getElementById('humidity').textContent = `${currentData.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${currentData.wind.speed} m/s`;
    document.getElementById('pressure').textContent = `${currentData.main.pressure} hPa`;
    
    // Update weather icon
    const weatherIcon = document.getElementById('weather-icon');
    const iconClass = weatherIcons[currentData.weather[0].icon] || 'fas fa-cloud';
    weatherIcon.innerHTML = `<i class="${iconClass}"></i>`;
    
    // Update forecast
    displayForecast(forecastData);
    
    // Show weather content
    weatherContent.style.display = 'block';
}

// Display 5-day forecast
function displayForecast(forecastData) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';
    
    // Group forecast by day and get one reading per day
    const dailyForecasts = {};
    
    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        if (!dailyForecasts[day] || item.dt_txt.includes('12:00:00')) {
            dailyForecasts[day] = {
                day: day,
                date: dateStr,
                temp: Math.round(item.main.temp),
                description: item.weather[0].description,
                icon: item.weather[0].icon
            };
        }
    });
    
    // Convert to array and limit to 5 days
    const forecastArray = Object.values(dailyForecasts).slice(0, 5);
    
    // Create forecast items
    forecastArray.forEach(day => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        
        const iconClass = weatherIcons[day.icon] || 'fas fa-cloud';
        
        forecastItem.innerHTML = `
            <div class="forecast-day">${day.day}</div>
            <div class="forecast-date">${day.date}</div>
            <div class="forecast-icon"><i class="${iconClass}"></i></div>
            <div class="forecast-temp">${day.temp}°C</div>
            <div class="forecast-desc">${day.description}</div>
        `;
        
        forecastContainer.appendChild(forecastItem);
    });
}

// Format date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Show loading state
function showLoading() {
    loadingElement.style.display = 'block';
    weatherContent.style.display = 'none';
}

// Hide loading state
function hideLoading() {
    loadingElement.style.display = 'none';
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorElement.style.display = 'block';
    weatherContent.style.display = 'none';
}

// Hide error message
function hideError() {
    errorElement.style.display = 'none';
}

// Demo function to show how the app works without API key
function demoWeather() {
    // This is a demo function that would be replaced with actual API calls
    console.log("Weather app functionality demonstration");
}