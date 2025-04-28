# Weather Forecast App Documentation

## Overview
This React application fetches weather forecasts and displays weather conditions, a map, and gear recommendations for users. It allows users to view daily and hourly weather forecasts, switch between metric and imperial units, and check running conditions.

[Live Here](https://weather.rayaanuddin.com/)

## Features
- Retrieves weather forecast data from OpenWeather API
- Displays 5-day weather forecast
- Hourly forecast visualization
- Provides gear recommendations based on weather conditions
- Caches data locally for performance improvement
- Displays map with routing, with option to have multiple overlays (e.g. wind direction, humidity,...)
- Supports location retrieval via Geolocation API
- Switch between unit types (Metric & Imperial)
- Customise and select between multiple metric (e.g. pressure, gust,...) options to display on main page.
- Clearing data with confirmation
- Visual night and day difference


Here's a section you can include in your README file to guide users on how to set up the required environment variables for local production or deployment:

---

## Environment Variables Setup

To run the application, you need to configure the following environment variables:

- `REACT_APP_WEATHER_API_KEY`: Your API key for accessing the Weather API.
- `REACT_APP_GOOGLE_API_KEY`: Your API key for Google services.

### Local Development

1. Create a file named `.env` in the root directory of the project.
2. Add the following lines to the `.env` file:

   ```plaintext
   REACT_APP_WEATHER_API_KEY=your_weather_api_key_here
   REACT_APP_GOOGLE_API_KEY=your_google_api_key_here
   ```

3. Replace `your_weather_api_key_here` and `your_google_api_key_here` with your actual API keys.
4. Save the file. The app will automatically load these variables during development.

### Deployment on Vercel

If you're deploying this application on Vercel, you can set the environment variables directly in the Vercel dashboard:

1. Go to your project in the [Vercel Dashboard](https://vercel.com/dashboard).
2. Navigate to the **Settings** tab.
3. Scroll down to the **Environment Variables** section.
4. Add the following variables one by one:
   - Key: `REACT_APP_WEATHER_API_KEY`
     - Value: Your Weather API key.
   - Key: `REACT_APP_GOOGLE_API_KEY`
     - Value: Your Google API key.
5. Save the changes and redeploy your application.

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

