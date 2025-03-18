import axios from "axios";


/**
 * Fetches the current weather data for the specified location given in city or coordinates
 * @website: https://openweathermap.org/current
 * @param {string | {lat:number, lon:number}} location Location to fetch weather for
 * @param {string} unit Unit of measurement
 * @returns {Promise<axios.AxiosResponse<any>>}
 * @example const response = await fetchCurrentForecast("London", "metric");
 */
export const fetchCurrentForecast = async (location:string | {lat:number, lon:number}, unit:string = "standard") => {
  const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
  if (typeof location === "string") { // If location is a string, it's a city name
    return await axios.get(baseUrl, {
      params: {q: location, units: unit, appid: process.env.REACT_APP_WEATHER_API_KEY},
    });
  } else { // If location is an object, it's a lat/lon object
    return await axios.get(baseUrl, {
      params: { lat: location.lat, lon:location.lon, units: unit, appid: process.env.REACT_APP_WEATHER_API_KEY },
    });
  }
}

/**
 * Fetches the weather forecast for next 16 days or if specified, for a specific location given in city or coordinates
 * @website: https://openweathermap.org/forecast16
 * @param {string | {lat:number, lon:number}} location Location to fetch forecast for
 * @param {string} unit Unit of measurement
 * @param {number} cnt Number of days(1-17) to forecast
 * @returns {Promise<axios.AxiosResponse<any>>}
 * @example const response = await fetchForecast("London", "metric", 5);
 */
export const fetchForecast = async (location:string | {lat:number, lon:number}, unit:string = "standard", cnt:number = null) => {
  const baseUrl = "https://api.openweathermap.org/data/2.5/forecast/daily";
  if (typeof location === "string") { // If location is a string, it's a city name
    return await axios.get(baseUrl, {
      params: {q: location, units: unit, cnt: cnt, appid: process.env.REACT_APP_WEATHER_API_KEY},
    });
  } else { // If location is an object, it's a lat/lon object
    return await axios.get(baseUrl, {
      params: {lat: location.lat, lon: location.lon, units: unit, cnt: cnt, appid: process.env.REACT_APP_WEATHER_API_KEY},
    });
  }
}

/**
 * Fetches the weather forecast per hour for the next 4 days or if specified, for a specific location given in city or coordinates
 * @website: https://openweathermap.org/api/hourly-forecast
 * @param {string | {lat:number, lon:number}} location Location to fetch forecast for
 * @param {string} unit Unit of measurement
 * @param {number} cnt Number of hours(max 96hrs) to forecast
 * @returns {Promise<axios.AxiosResponse<any>>}
 * @example const response = await fetchHourlyForecast("London", "metric", 5);
 */
export const fetchHourlyForecast = async (location:string | {lat:number, lon:number}, unit:string = "standard", cnt:number = null) => {
  const baseUrl = "https://pro.openweathermap.org/data/2.5/forecast/hourly";
  if (typeof location === "string") { // If location is a string, it's a city name
    return await axios.get(baseUrl, {
      params: {q: location, units: unit, cnt: cnt, appid: process.env.REACT_APP_WEATHER_API_KEY},
    });
  } else { // If location is an object, it's a lat/lon object
    return await axios.get(baseUrl, {
      params: {lat: location.lat, lon: location.lon, units: unit, cnt: cnt, appid: process.env.REACT_APP_WEATHER_API_KEY},
    });
  }
}