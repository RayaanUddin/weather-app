import * as unitConversion from "../utils/unitConversion";
import React from "react";
import "../styles/HourlyForecast.css";

const HourlyForecast = ({changeDay, unit, forecastData, selectedDayIndex, isNightMode}) => {

  const getSelectedDate = () => {
    let nextDay = new Date();
    nextDay.setDate(new Date().getDate() + selectedDayIndex);
    return nextDay;
  };

  return (
    <div className = "hourly-forecast">
      <div className={`display-day ${isNightMode ? "night-background" : "day-background"}`}>
        <h1>{getSelectedDate().toLocaleDateString("en-GB", {weekday: "long"})}</h1>
        <h2>{getSelectedDate().toLocaleDateString("en-GB", {day: "numeric", month: "short"})}</h2>
        <select className="change-day" onChange={changeDay} value={selectedDayIndex}>
          {Array.from({length: 5}).map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() + index);
            return (
              <option key={index} value={index}>
                {date.toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </option>
            );
          })}
        </select>
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