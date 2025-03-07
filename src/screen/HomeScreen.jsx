import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/HomeScreen.css"; // Import the CSS file

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

function HomeScreen() {
  const [location, setLocation] = useState(localStorage.getItem("location") || false);
  const [unit, setUnit] = useState(localStorage.getItem("unit") || "metric"); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [forecast, setForecast] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeather();
  }, [location, unit]);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!location) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          const api_call = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
          axios.get(api_call).then((response) => {
            setLocation(response.data.name);
          });
        })
      } else {
        setLocation("London");
      }
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast/daily`, {
        params: { q: location, cnt: 5, units: unit, appid: API_KEY },
      });
      localStorage.setItem("location", location);
      setForecast(response.data.list);
    } catch (err) {
      setError("Could not fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHourlyWeather = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://pro.openweathermap.org/data/2.5/forecast/hourly`, {
        params: { q: location, units: unit, appid: API_KEY },
      });
      const hourlyData = response.data.list.filter(
        (hour) => new Date(hour.dt * 1000).toDateString() === new Date(date * 1000).toDateString()
      );
      console.log(hourlyData)
      setHourlyForecast(hourlyData);
    } catch (err) {
      setError("Could not fetch hourly weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const input = event.target.location.value;
    if (input) setLocation(input);
  };

  const handleDayClick = (date) => {
    setSelectedDay(date);
    fetchHourlyWeather(date);
  };

  const toggleUnit = () => {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit); // Update the state
    localStorage.setItem("unit", newUnit); // Set the updated value in localStorage
  };

  return (
    <div className="container">
      <h1 className="title">Weather Forecast</h1>

      <form onSubmit={handleSearch} className="searchBar">
        <input type="text" name="location" placeholder="Enter city" className="input" />
        <button type="submit" className="button">Search</button>
      </form>

      <button onClick={toggleUnit} className="toggleButton">
        Switch to {unit === "metric" ? "Fahrenheit (°F)" : "Celsius (°C)"}
      </button>

      <h2 className="subtitle">7-Day Forecast for {location}</h2>
      <div className="forecastContainer">
        {forecast.map((day, index) => {
          const date = new Date(day.dt * 1000);
          const weekday = date.toLocaleDateString("en-US", { weekday: "long" });

          return (
            <div
              key={index}
              onClick={() => handleDayClick(day.dt)}
              className="forecastCard"
              style={{ backgroundColor: selectedDay === day.dt ? "#FFCC70" : "#FFD93D" }}
            >
              <h3>{weekday}</h3>
              <p>{day.weather[0].description}</p>
              <p>🌡️ High: {day.temp.max}°{unit === "metric" ? "C" : "F"}</p>
              <p>🌡️ Low: {day.temp.min}°{unit === "metric" ? "C" : "F"}</p>
              <p>💧 Precipitation: {day.pop * 100}%</p>
              <p>💨 Wind: {day.speed} {unit === "metric" ? "m/s" : "mph"} ({day.deg}°)</p>
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div className="hourlyContainer">
          <h2 className="subtitle">Hourly Forecast</h2>
          <div className="hourlyList">
            {hourlyForecast.map((hour, index) => (
              <div key={index} className="hourlyCard">
                <p>⏰ {new Date(hour.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                <p>🌡️ {hour.main.temp}°{unit === "metric" ? "C" : "F"}</p>
                <p>{hour.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeScreen;