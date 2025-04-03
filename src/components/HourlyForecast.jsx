import * as unitConversion from "../utils/unitConversion";
import React from "react";
import "../styles/HourlyForecast.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faAngleRight} from "@fortawesome/free-solid-svg-icons";

/**
 * HourlyForecast Component
 * This component is used to display the hourly forecast for a selected day.
 * It includes a date selector and a list of hourly weather data.
 * @param changeDay
 * @param unit
 * @param forecastData
 * @param selectedDayIndex
 * @param isNightMode
 * @returns {JSX.Element}
 * @constructor
 */
const HourlyForecast = ({changeDay, unit, forecastData, selectedDayIndex, isNightMode}) => {
  // Function to get the selected date
  const getSelectedDate = () => {
    let nextDay = new Date();
    nextDay.setDate(new Date().getDate() + selectedDayIndex);
    return nextDay;
  };

  // Function to get the ordinal suffix for the date
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <div className = "hourly-forecast">
      <div className={`display-day ${isNightMode ? "night-background" : "day-background"}`}>
        <h1>{getSelectedDate().toLocaleDateString("en-GB", {weekday: "long"})}</h1>
        <h2>{getSelectedDate().toLocaleDateString("en-GB", {day: "numeric", month: "short"})}</h2>
        <div className="change-day">
          <button onClick={() => changeDay(selectedDayIndex - 1)} disabled={selectedDayIndex <= 0} className={"left"}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <select onChange={(e) => changeDay(parseInt(e.target.value))} value={selectedDayIndex}>
            {Array.from({length: 5}).map((_, index) => {
              const date = new Date();
              date.setDate(date.getDate() + index);
              return (
                <option key={index} value={index}>
                  {date.toLocaleDateString("en-GB", { // Format the date in the format "Wed, 1st"
                    weekday: "short",
                    day: "numeric"
                  }) + getOrdinalSuffix(date.getDate())}
                </option>
              );
            })}
          </select>
          <button onClick={() => changeDay(selectedDayIndex + 1)} disabled={selectedDayIndex >= 4} className={"right"}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
      </div>
      <div className="hourly-scroll">
        {
          forecastData.list[selectedDayIndex].hourly.map((hour, index) => (
            <div key={index} className="hour-card">
              <p className={"time"}>
                {new Date(hour.dt * 1000).toLocaleTimeString([], {
                  hour: "2-digit", minute: "2-digit"
                })}
              </p>
              <img src={require(`../assets/weather-icons/${hour.weather[0].icon}.png`)} alt="weather icon"/>
              <p>
                {hour.weather[0].main}
              </p>
              <p>
                {Math.round(unitConversion.convertTemperature(hour.main.temp, unit, true))}{unitConversion.getUnitSymbol_Temperature(unit)}
              </p>
            </div>
            ))
        }
      </div>
    </div>
  )
}

export default HourlyForecast;