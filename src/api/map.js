const weatherLayers = {
  Clouds: "CL",
  Temperature: "TA2",
  Wind: "WND",
  Humidity: "HRD0",
  Precipitation: "PA0",
};

export const getWeatherLayers = () => weatherLayers;

/**
 * Get the API URL for the weather layer
 * @param {string} layer
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {boolean} fill_bounds
 * @param {number} opacity
 * @returns {string}
 */
export const getLayerAPI = (layer: string, x: number, y: number, z: number, fill_bounds: boolean = true, opacity: number = 0.8) => {
  const fillBoundsParam = fill_bounds ? '&fill_bound=true' : '';
  const opacityParam = opacity ? `&opacity=${opacity}` : '&opacity=0.8'; // Default to 0.8 if opacity is not provided

  return `https://maps.openweathermap.org/maps/2.0/weather/${layer}/${z}/${x}/${y}?appid=${process.env.REACT_APP_WEATHER_API_KEY}${fillBoundsParam}${opacityParam}`;
};