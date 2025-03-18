import {fetchForecast, fetchHourlyForecast} from "../api/forecast";

/**
 * Gets the weather data for the application. Application runs on 5 days hence gets the 5 days data
 * plus its hourly data and formats it.
 * @param location
 * @returns {Promise<*|Error>}
 */
export const weatherData = async (location:string|{lat:number, lon:number}) => {
  try {
    const dailyResponse = await fetchForecast(location, "standard", 5);
    const hourlyResponse = await fetchHourlyForecast(location, "standard", null);
    const hourlyByDay = hourlyResponse.data.list.reduce((acc, hour) => {
      let date = new Date(hour.dt * 1000).toISOString().split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(hour);
      return acc;
    }, {});
    dailyResponse.data.list = dailyResponse.data.list.map((day) => {
      let date = new Date(day.dt * 1000).toISOString().split("T")[0];
      return { ...day, hourly: hourlyByDay[date] || [] };
    });
    return dailyResponse.data;
  } catch (err) {
    console.error(err);
    return new Error(err);
  }
};

/**
 * Calculate the running condition based on the temperature, wind speed, and precipitation
 * @param temp Temperature in Kelvin
 * @param wind Wind speed in m/s
 * @param precipitation Precipitation in mm
 * @returns {string} The calculated running condition: "good", "fair", or "poor"
 */
export const calculateRunningCondition = (temp: number, wind: number, precipitation: number): string => {
  if (temp < -273.15 || wind < 0 || precipitation < 0) {
    return "Invalid input";
  }

  if (temp >= 283.15 && temp <= 293.15 && wind < 15 && precipitation === 0) { // Good condition: Mild temperature, light wind, and no precipitation
    return "good";
  } else if (temp >= 278.15 && temp <= 298.15 && wind < 25 && precipitation < 40) { // Fair condition: Moderate temperature, moderate wind, and slight precipitation
    return "fair";
  } else { // Poor condition: Anything outside the above thresholds
    return "poor";
  }
};