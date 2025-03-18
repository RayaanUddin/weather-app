const weatherLayers = {
  Clouds: "CL",
  Precipitation: "PA0",
  Temperature: "TA2",
  Wind: "WND",
  Humidity: "HRD0",
};

export const getWeatherLayers = () => weatherLayers;

/**
 * Get the API URL for the weather layer
 * @param {string} layer
 * @param {boolean} fill_bounds
 * @param {number} opacity
 * @returns {string}
 */
export const getLayerAPI = (layer:string, fill_bounds:boolean = true, opacity:number = 0.6) => {
  return `http://maps.openweathermap.org/maps/2.0/weather/${layer}/{z}/{x}/{y}?appid=${process.env.REACT_APP_WEATHER_API_KEY}&fill_bound=${fill_bounds}&opacity=${opacity}`;
};