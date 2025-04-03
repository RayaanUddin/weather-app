import axios from "axios";

/**
 * Check if the location is valid and return the coordinates
 * @param {string} location Location to validate
 * @returns {Promise<[boolean, {lat:number, lon:number} | null]>}
 * @deprecated
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

/**
 * Gets the location name based on the given coordinates.
 * Uses the OpenWeatherMap reverse geocoding endpoint.
 *
 * @param {Object} coords - An object with latitude and longitude.
 * @param {number} coords.lat - The latitude.
 * @param {number} coords.lon - The longitude.
 * @param {number} [limit=1] - Maximum number of location results to return.
 * @returns {Promise<[boolean, string|null]>} Returns a tuple where the first value indicates success and the second is the location name.
 * @deprecated
 */
export const getLocationByCoords = async (coords:{lat:number, lon:number}, limit = 1) => {
  try {
    const response = await axios.get("https://api.openweathermap.org/geo/1.0/reverse", {
      params: {
        lat: coords.lat,
        lon: coords.lon,
        limit,
        appid: process.env.REACT_APP_WEATHER_API_KEY,
      },
    });

    if (response.data.length === 0) {
      console.error("No location found for coordinates:", coords);
      return [false, null];
    }

    // Use the name from the first result.
    const locationName = response.data[0].name;
    return [true, locationName];
  } catch (error) {
    console.error("Error fetching location by coordinates:", error);
    return [false, null];
  }
};

/**
 * Converts coordinates to an address using Google Maps Geocoding API.
 * @param coords - An object with latitude and longitude.
 * @return {Promise<string>} - A promise that resolves with the formatted address.
 */
export const convertCoordsToAddress = async (coords: { lat: number; lon: number }): Promise<string | null> => {
  if (!window.google) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    const latLng = new window.google.maps.LatLng(coords.lat, coords.lon);

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        resolve(results[0].formatted_address);
      } else {
        console.error("Geocoding failed:", status);
        reject("Geocoding failed");
      }
    });
  });
};
