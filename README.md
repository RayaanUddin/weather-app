# Weather Forecast App Documentation

## Overview
This React application fetches weather forecasts and displays weather conditions, a map, and gear recommendations for users. It allows users to view daily and hourly weather forecasts, switch between metric and imperial units, and check running conditions.

## Features
- Retrieves weather forecast data from OpenWeather API
- Displays 5-day weather forecast
- Hourly forecast visualization
- Provides gear recommendations based on weather conditions
- Caches data locally for performance improvement
- Uses Leaflet for map display
- Supports location retrieval via Geolocation API
- Sidebar menu for unit selection and location input

---

## Installation

1. Make sure your directory is the repository.
2. Set your API key in `.env`. This app requires Current & Forecasts data Subscription from [Open Weather Map](https://openweathermap.org/price). Students can get access for free.
3. Install the node modules required `npm install`.
4. Start your app locally to test `npm start`.
5. Want to make it public? Recommend looking into ngrok.


---

## Conclusion
This React weather app provides real-time weather data, caching for efficiency, and gear recommendations for users. The UI is structured using reusable components and styled with CSS. The app is interactive, allowing users to toggle units and select locations dynamically.

