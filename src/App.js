import React, { useEffect, useState } from "react";
import "./styles/reset.css";
import "./styles/App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SunCalc from "suncalc";
import SideBar from "./components/SideBar";
import Map from "./components/Map";
import GearRecommendation from "./components/GearRecommendation";
import {weatherData} from "./utils/weatherUtil"
import * as unitConversion from "./utils/unitConversion";
import {getCurrentCoords} from "./utils/getCurrentCoords";
const defaultCoords = { lat: 51.5074, lon: 0.1278 };
const CACHE_EXPIRY_HOURS = 1; // Cache expires after 1 hour

localStorage.clear();

function isNight(lat, lon, date) {
  const now = new Date();
  const sunTimes = SunCalc.getTimes(now, lat, lon);
  return now < sunTimes.sunrise || now > sunTimes.sunset;
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [forecastData, setForecastData] = useState(null);
  const [unit, setUnit] = useState(
    Object.values(unitConversion.UnitType).includes(localStorage.getItem("unit")) ? localStorage.getItem("unit") : unitConversion.UnitType.METRIC
  );
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(
    JSON.parse(localStorage.getItem("coords")) || false
  );
  const [isNightMode, setIsNightMode] = useState(false);

  const isCacheValid = (storedData) => {
    if (!storedData) return false;
    const { timestamp } = storedData;
    const now = new Date().getTime();
    return now - timestamp < CACHE_EXPIRY_HOURS * 60 * 60 * 1000; // Check if cache is still valid
  };

  // Get coordinates on initial load
  useEffect(() => {
    if (!coords) {
      console.log("No coordinates found in local storage. Getting user location...");
      getCurrentCoords().then(coords => {
        if (coords) {
          setCoords(coords);
          localStorage.setItem("coords", JSON.stringify(coords));
        } else {
          setCoords(defaultCoords);
          localStorage.setItem("coords", JSON.stringify(defaultCoords));
        }
      })
    }
  }, []);

  // Fetch weather when coords or unit change
  useEffect(() => {
    if (coords) {
      setIsNightMode(isNight(coords.lat, coords.lon));
      setLoading(true);
      setError(null);
      let storedData = JSON.parse(localStorage.getItem("forecastData"));
      let savedCoords = JSON.parse(localStorage.getItem("coords"));
      console.log(storedData);
      if (storedData && storedData.data && storedData.data.cod === "200" && savedCoords && savedCoords.lat === coords.lat && savedCoords.lon === coords.lon && isCacheValid(storedData)) {
        console.log("Using cached weather data.");
        setForecastData(storedData.data);
        setLoading(false);
      } else {
        console.log("Fetching new weather data...");
        weatherData(coords).then((data) => {
          setForecastData(data);
          setLoading(false);
          localStorage.setItem("forecastData", JSON.stringify({ data: data, timestamp: new Date().getTime() }));
          localStorage.setItem("coords", JSON.stringify(coords));
        }).catch((err) => {
          setError("Could not fetch weather data. Please try again later.");
          setLoading(false);
        });
      }
    }
    console.log(forecastData);
  }, [coords, unit]);

  const getUnitSymbol = () => {
    return unit === "metric" ? "°C" : "°F";
  }

  const calculateRunningCondition = (temp, wind, precipitation) => {
    temp = temp - 273.15; // Convert Kelvin to °C (Easy to understand)

    if (temp >= 10 && temp <= 20 && wind < 15 && precipitation === 0) {
      return "good";
    } else if (temp >= 5 && temp <= 25 && wind < 25 && precipitation < 40) {
      return "fair";
    } else {
      return "poor";
    }
  };

  const getSelectedDate = () => {
    let nextDay = new Date();
    nextDay.setDate(new Date().getDate() + selectedDayIndex);
    return nextDay;
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const changeDay = (event) => {
    setSelectedDayIndex(parseInt(event.target.value));
  };

  return (
    <div className={`App ${isNightMode ? "night-background" : "day-background"}`}>
      <header>
        <button onClick={toggleMenu} className="menu-button" aria-label="Open menu">
          <FontAwesomeIcon icon={!isOpen ? faBars : faArrowLeft} className="menu-icon"/>
        </button>
      </header>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <SideBar setCoords={setCoords} unit={unit} setUnit={setUnit} toggleMenu={toggleMenu}/>
      </div>

      <div className="grid-container">
        <div className="weather-card">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            forecastData && (
              <>
                <h1>
                  {selectedDayIndex === 0
                    ? Math.round(unitConversion.convertTemperature(forecastData.list[selectedDayIndex].hourly[0].main.temp, unit))
                    : Math.round(unitConversion.convertTemperature(forecastData.list[selectedDayIndex].temp.day, unit)) +
                    " / " +
                    Math.round(unitConversion.convertTemperature(forecastData.list[selectedDayIndex].temp.night, unit))}
                  {getUnitSymbol()}
                </h1>
                <img className="weather-icon"
                     src={`http://openweathermap.org/img/wn/${forecastData.list[selectedDayIndex].weather[0].icon}@2x.png`}
                     alt="weather icon"/>
                <p className="weather-desc">{forecastData.list[selectedDayIndex].weather[0].description}</p>
                <p
                  className="location">📍 {(forecastData.city.name).charAt(0).toUpperCase() + (forecastData.city.name).slice(1).toLowerCase()}</p>
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
                      let temp = forecastData.list[selectedDayIndex].temp.day;
                      if (selectedDayIndex === 0) {
                        temp = forecastData.list[selectedDayIndex].hourly[0].main.temp;
                      }
                      const runningCondition = calculateRunningCondition(temp, forecastData.list[selectedDayIndex].speed, forecastData.list[selectedDayIndex].pop);
                      return (
                        <span className={runningCondition + " upper"}>{runningCondition}</span>
                      );
                    })()
                  }
                </p>
              </>
            )
          )}
        </div>

        <div className="map-card">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            forecastData && (
              <Map op = "TA2" lat={coords.lat} lon={coords.lon}/>
            )
          )}
        </div>

        <div className="gear-card">
          <h1>Gear Recommendation</h1>
          {
            loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              forecastData && (
                <GearRecommendation weatherId={forecastData.list[selectedDayIndex].weather[0].id}/>
              )
            )
          }
        </div>

        <div className="hourly-forecast">
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
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : forecastData && (
              forecastData.list[selectedDayIndex].hourly.map((hour, index) => (
                <div key={index} className="hour-card">
                  <p>
                    {new Date(hour.dt * 1000).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                  <img src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} alt="weather icon"/>
                  <p>
                    {hour.weather[0].main}
                  </p>
                  <p>
                    {Math.round(unitConversion.convertTemperature(hour.main.temp, unit, true))}{getUnitSymbol()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
