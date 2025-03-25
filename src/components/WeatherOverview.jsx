import * as unitConversion from "../utils/unitConversion";
import {calculateRunningCondition} from "../utils/weatherUtil";
import "../styles/WeatherOverview.css";
import {getUnitSymbol_Speed} from "../utils/unitConversion";

const WeatherOverview = ({forecastData, selectedDayIndex, unit, isNightMode}) => {
  return (
    <div className="weather-overview">
      <h1>
        {selectedDayIndex === 0
          ? Math.round(unitConversion.convertTemperature(forecastData.list[selectedDayIndex].hourly[0].main.temp, unit))
          : (
            <>
              {Math.round(unitConversion.convertTemperature(forecastData.list[selectedDayIndex].temp.day, unit))}
              <sup style={{ fontSize: "0.5em" }}>
                {"/"+Math.round(unitConversion.convertTemperature(forecastData.list[selectedDayIndex].temp.night, unit))}
              </sup>
            </>
          )
        }
        {unitConversion.getUnitSymbol_Temperature(unit)}
      </h1>
      <img className="icon"
           src={require(`../assets/weather-icons/${forecastData.list[selectedDayIndex].weather[0].icon}.png`)}
           alt="weather icon"/>
      <p className="desc">{forecastData.list[selectedDayIndex].weather[0].description}</p>
      <p className="location">📍 {(forecastData.city.name).charAt(0).toUpperCase() + (forecastData.city.name).slice(1).toLowerCase()}</p>
      <div className="metrics">
        <div className={`metric ${isNightMode ? "night-background" : "day-background"}`}>
          <img src={require("../assets/metric-icons/wind.png")} alt="icon" />
          <p>Wind</p>
          <p>{Math.round(unitConversion.convertSpeed(forecastData.list[selectedDayIndex].speed, unit)*100)/100+" "+unitConversion.getUnitSymbol_Speed(unit)}</p>
        </div>
        <div className={`metric ${isNightMode ? "night-background" : "day-background"}`}>
          <img src={require("../assets/metric-icons/precipitation.png")} alt="icon" />
          <p>Precipitation</p>
          <p>{forecastData.list[selectedDayIndex].pop * 100}%</p>
        </div>
        <div className={`metric ${isNightMode ? "night-background" : "day-background"}`}>
          <img src={require("../assets/metric-icons/pressure.png")} alt="icon" />
          <p>Pressure</p>
          <p>{forecastData.list[selectedDayIndex].pressure}</p>
        </div>
        <div className={`metric ${isNightMode ? "night-background" : "day-background"}`}>
          <img src={require("../assets/metric-icons/humidity.png")} alt="icon" />
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
    </div>
  );
}

export default WeatherOverview;