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