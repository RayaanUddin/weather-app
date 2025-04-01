import React, { useEffect, useState } from "react";
import "./styles/reset.css";
import "./styles/App.css";
import SunCalc from "suncalc";
import SideBar from "./components/SideBar";
import Map from "./components/Map";
import GearRecommendation from "./components/GearRecommendation";
import WeatherOverview from "./components/WeatherOverview";
import HourlyForecast from "./components/HourlyForecast";
import { weatherData } from "./utils/weatherUtil";
import * as unitConversion from "./utils/unitConversion";
import { getCurrentCoords } from "./utils/getCurrentCoords";
import Header from "./components/Header";

const defaultCoords = { lat: 51.5074, lon: 0.1278 };
const CACHE_EXPIRY_HOURS = 1; // Cache expires after 1 hour

function isNight(lat, lon, date) {
  const now = new Date();
  const sunTimes = SunCalc.getTimes(now, lat, lon);
  return now < sunTimes.sunrise || now > sunTimes.sunset;
}

/*localStorage.clear();*/

function App() {
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
  const [isOpen, setIsOpen] = useState(false);

  const isCacheValid = (storedData) => {
    if (!storedData) return false;
    const { timestamp } = storedData;
    const now = new Date().getTime();
    return now - timestamp < CACHE_EXPIRY_HOURS * 60 * 60 * 1000; // Check if cache is still valid
  };

  //Passed as a prop into sidebar and WeatherOverview. Settings inside sidebar toggles this, WeatherOverview will read these states.
  const [selectedMetricsToDisplay, setSelectedMetricsToDisplay] = useState({
    "Gust": false, "Precipitation": true, "Sunrise": false,
    "Air Pressure": true, "Sunset": false, "Feels Like": false,
    "Clouds": false, "Wind Speed": true, "Humidity": true,
  });

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

  // Fetch weather when coords change
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
  }, [coords]);

  return (
    <div className={`App ${isNightMode ? "night-background" : "day-background"}`}>
      <Header toggleMenu={() => setIsOpen(!isOpen)} isOpen={isOpen} setCoords={setCoords}/>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <SideBar selectedMetricsToDisplay={selectedMetricsToDisplay} setSelectedMetricsToDisplay={setSelectedMetricsToDisplay} setCoords={setCoords} unit={unit} setUnit={setUnit} toggleMenu={() => setIsOpen(!isOpen)} />
      </div>
      <div className="grid-container">
        <div className="weather-card">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            forecastData && (
              <WeatherOverview selectedMetricsToDisplay={selectedMetricsToDisplay} forecastData={forecastData} selectedDayIndex={selectedDayIndex} unit={unit} isNightMode={isNightMode} />
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
              <Map op="TA2" lat={coords.lat} lon={coords.lon} />
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
                <GearRecommendation weatherId={forecastData.list[selectedDayIndex].weather[0].id} />
              )
            )
          }
        </div>

        <div className="hourly-card">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            forecastData && (
              <HourlyForecast
                changeDay={(newIndex) => {
                  setSelectedDayIndex(newIndex);
                  console.log(newIndex);
                }}
                unit={unit}
                forecastData={forecastData}
                selectedDayIndex={selectedDayIndex}
                isNightMode={isNightMode}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;