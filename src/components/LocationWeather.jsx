import * as unitConversion from "../utils/unitConversion";
import React from "react";
import "../styles/LocationWeather.css";

const LocationWeather = ({forecast, unit, onClick}) => {
  return (
    <button onClick={onClick} className={`location-weather`}>
      <h1>{Math.round(unitConversion.convertTemperature(forecast.main.temp, unit))+unitConversion.getUnitSymbol_Temperature(unit)}</h1>
      <img src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`} alt="weather icon"/>
      <p className="desc">{forecast.weather[0].description}</p>
      <p className="location">📍 {(forecast.name).charAt(0).toUpperCase() + (forecast.name).slice(1).toLowerCase()}</p>
    </button>
  )
}

export default LocationWeather;