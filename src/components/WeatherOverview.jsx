import * as unitConversion from "../utils/unitConversion";
import {calculateRunningCondition} from "../utils/weatherUtil";

const WeatherOverview = ({forecastData, selectedDayIndex, unit, isNightMode}) => {
  return (
    <>
      <h1>
        {selectedDayIndex === 0
          ? Math.round(unitConversion.convertTemperature(forecastData.list[selectedDayIndex].hourly[0].main.temp, unit))
          : Math.round(unitConversion.convertTemperature(forecastData.list[selectedDayIndex].temp.day, unit)) +
          " / " +
          Math.round(unitConversion.convertTemperature(forecastData.list[selectedDayIndex].temp.night, unit))}
        {unitConversion.getUnitSymbol_Temperature(unit)}
      </h1>
      <img className="weather-icon"
           src={`http://openweathermap.org/img/wn/${forecastData.list[selectedDayIndex].weather[0].icon}@2x.png`}
           alt="weather icon"/>
      <p className="weather-desc">{forecastData.list[selectedDayIndex].weather[0].description}</p>
      <p className="location">📍 {(forecastData.city.name).charAt(0).toUpperCase() + (forecastData.city.name).slice(1).toLowerCase()}</p>
      <div className="weather-details">
        <div className={`weather-detail-card ${isNightMode ? "night-background" : "day-background"}`}>
          <span>💨</span>
          <p>Wind</p>
          <p>{forecastData.list[selectedDayIndex].speed} km/h</p>
        </div>
        <div className={`weather-detail-card ${isNightMode ? "night-background" : "day-background"}`}>
          <span>🌧️</span>
          <p>Precipitation</p>
          <p>{forecastData.list[selectedDayIndex].pop * 100}%</p>
        </div>
        <div className={`weather-detail-card ${isNightMode ? "night-background" : "day-background"}`}>
          <span>☀️</span>
          <p>UV Index</p>
          <p>{forecastData.list[selectedDayIndex].uvi}</p>
        </div>
        <div className={`weather-detail-card ${isNightMode ? "night-background" : "day-background"}`}>
          <span>💧</span>
          <p>Humidity</p>
          <p>{forecastData.list[selectedDayIndex].humidity}%</p>
        </div>
      </div>
      <p className="condition">
        Running Condition:
        {
          (() => {
            const runningCondition = calculateRunningCondition(forecastData.list[selectedDayIndex].feels_like.day, forecastData.list[selectedDayIndex].speed, forecastData.list[selectedDayIndex].pop);
            return (
              <span className={runningCondition + " upper"}>{runningCondition}</span>
            );
          })()
        }
      </p>
    </>
  );
}

export default WeatherOverview;