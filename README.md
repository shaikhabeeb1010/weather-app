# Weather Forecast App

A responsive, modern weather application that provides real-time weather data and 5-day forecasts for any location worldwide.

## Features

- **Current Weather**: Temperature, humidity, wind speed, pressure, and "feels like" temperature
- **5-Day Forecast**: Weather predictions for the next 5 days
- **Location-Based Weather**: Automatically detect user's location for local weather
- **City Search**: Search for weather in any city worldwide
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Weather Icons**: Visual representation of weather conditions

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Responsive Design)
- JavaScript (ES6+)
- OpenWeatherMap API
- Font Awesome Icons

## Setup Instructions

### 1. Get API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to the "API Keys" section
4. Copy your default API key

### 2. Configure the App

1. Open `js/script.js`
2. Replace `'your_api_key_here'` with your actual OpenWeatherMap API key:
```javascript
const API_KEY = 'your_actual_api_key_here';