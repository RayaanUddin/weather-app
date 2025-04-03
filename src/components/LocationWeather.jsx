import * as unitConversion from "../utils/unitConversion";
import React from "react";
import "../styles/LocationWeather.css";

/**
 * LocationWeather Component
 * This component is used to display the weather information for a specific location.
 * It is used by LocationSearch.jsx to show the weather of previously searched locations.
 * @param forecast
 * @param unit
 * @param onClick
 * @returns {JSX.Element}
 * @constructor
 */
const LocationWeather = ({forecast, unit, onClick}) => {
  const isNight = forecast.weather[0].icon.includes('n');

  return (
    <button onClick={onClick} className={`location-weather ${isNight ? 'night-background' : 'day-background'}`}>
      <h1>{Math.round(unitConversion.convertTemperature(forecast.main.temp, unit))+unitConversion.getUnitSymbol_Temperature(unit)}</h1>
      <img src={require(`../assets/weather-icons/${forecast.weather[0].icon}.png`)} alt="weather icon"/>
      <p className="desc">{forecast.weather[0].description}</p>
      <p className="location">📍 {(forecast.name).charAt(0).toUpperCase() + (forecast.name).slice(1).toLowerCase()}</p>
    </button>
  )
}

export default LocationWeather;