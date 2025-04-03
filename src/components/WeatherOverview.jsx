import * as unitConversion from "../utils/unitConversion";
import {calculateRunningCondition} from "../utils/weatherUtil";
import "../styles/WeatherOverview.css";

/**
 * WeatherOverview Component
 * This component is used to display the weather overview for a selected day.
 * It includes the temperature, weather icon, description, location, and various metrics.
 * @param selectedMetricsToDisplay
 * @param forecastData
 * @param selectedDayIndex
 * @param unit
 * @param isNightMode
 * @returns {JSX.Element}
 * @constructor
 */
const WeatherOverview = ({selectedMetricsToDisplay, forecastData, selectedDayIndex, unit, isNightMode}) => {
  const allMetrics = [
    { name: 'Wind Speed', icon: 'wind.png', value: `${Math.round(unitConversion.convertSpeed(forecastData.list[selectedDayIndex].speed, unit))}`, unit: unitConversion.getUnitSymbol_Speed(unit) },
    { name: 'Precipitation', icon: 'precipitation.png', value: forecastData.list[selectedDayIndex].pop * 100, unit: '%' },
    { name: 'Gust', icon: 'gust.png', value: `${Math.round(unitConversion.convertSpeed(forecastData.list[selectedDayIndex].gust, unit))}`, unit: unitConversion.getUnitSymbol_Speed(unit) },
    { name: 'Humidity', icon: 'humidity.png', value: forecastData.list[selectedDayIndex].humidity, unit: '%' },
    { name: 'Sunrise', icon: 'sunrise.png', value: unitConversion.convertTimestampToTime(forecastData.list[selectedDayIndex].sunrise), unit: '' },
    { name: 'Air Pressure', icon: 'pressure.png', value: `${Math.round(unitConversion.convertPressure(forecastData.list[selectedDayIndex].pressure, unit))}`, unit: unitConversion.getUnitSymbol_Pressure(unit) },
    { name: 'Sunset', icon: 'sunset.png', value: unitConversion.convertTimestampToTime(forecastData.list[selectedDayIndex].sunset), unit: '' },
    { name: 'Feels Like', icon: 'temperatures.png', value: `${Math.round(unitConversion.convertTemperature(forecastData.list[selectedDayIndex].feels_like.day, unit))} / ${Math.round(unitConversion.convertTemperature(forecastData.list[selectedDayIndex].feels_like.night, unit))}`, unit: unitConversion.getUnitSymbol_Temperature(unit) },
    { name: 'Clouds', icon: 'clouds.png', value: forecastData.list[selectedDayIndex].clouds, unit: '%' },
  ];

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
      <img className="icon" src={require(`../assets/weather-icons/${forecastData.list[selectedDayIndex].weather[0].icon}.png`)} alt="weather icon"/>
      <p className="desc">{forecastData.list[selectedDayIndex].weather[0].description}</p>
      <p className="location">📍 {(forecastData.city.name).charAt(0).toUpperCase() + (forecastData.city.name).slice(1).toLowerCase()}</p>
      <div className="metrics">
        {allMetrics.map((metric) => {
          const isVisible = selectedMetricsToDisplay[metric.name];
          if (!isVisible) return null;
          return (
            <div className={`metric ${isNightMode ? 'night-background' : 'day-background'}`} key={metric.name}>
              <img src={require(`../assets/metric-icons/${metric.icon}`)} alt="icon" />
              <p>{metric.name}</p>
              <p>{metric.value} {metric.unit}</p>
            </div>
          );
        })}
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