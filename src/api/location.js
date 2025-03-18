import axios from "axios";

/**
 * Check if the location is valid and return the coordinates
 * @param {string} location Location to validate
 * @returns {Promise<[boolean, {lat:number, lon:number} | null]>}
 */
export const locationCoords = async (location: string): Promise<[boolean, { lat: number, lon: number } | null]> => {
  try {
    const response = await axios.get("https://api.openweathermap.org/geo/1.0/direct", {
      params: { q: location, limit: 1, appid: process.env.REACT_APP_WEATHER_API_KEY },
    });

    if (response.data.length === 0) {
      console.error("No results found for location:", location);
      return [false, null];
    }

    return [true, { lat: response.data[0].lat, lon: response.data[0].lon }];
  } catch (error) {
    console.error("Error fetching location coordinates:", error);
    return [false, null];
  }
};