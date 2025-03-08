# Weather Forecast App Documentation

## Overview
This React application fetches weather forecasts and displays weather conditions, a map, and gear recommendations for users. It allows users to view daily and hourly weather forecasts, switch between metric and imperial units, and check running conditions.

## Features
- Retrieves weather forecast data from OpenWeather API
- Displays 5-day weather forecast
- Hourly forecast visualization
- Provides gear recommendations based on weather conditions
- Caches data locally for performance improvement
- Uses Leaflet for map display
- Supports location retrieval via Geolocation API
- Sidebar menu for unit selection and location input

---

## Project Structure
### **Components**
- `SideBar.js`: Sidebar component for selecting location and unit preference.
- `GearRecommendation.js`: Suggests running gear based on weather conditions.
- `App.js`: Main component managing state and API calls.
- `styles/`: Contains CSS files for styling the app.

### **State Variables**
- `isOpen`: Manages sidebar visibility.
- `forecastData`: Stores weather forecast data.
- `unit`: Stores selected temperature unit (metric or imperial).
- `selectedDayIndex`: Tracks the selected day for forecast display.
- `loading`: Indicates if data is being fetched.
- `error`: Stores error messages if API call fails.
- `coords`: Stores latitude and longitude of the selected location.

---

## Key Functions
### **Location Handling**
```js
const getUserLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const newCoords = { lat: position.coords.latitude, lon: position.coords.longitude };
      localStorage.setItem("coords", JSON.stringify(newCoords));
      setCoords(newCoords);
    },
    () => {
      localStorage.setItem("coords", JSON.stringify(defaultCoords));
      setCoords(defaultCoords);
    }
  );
};
```
- Retrieves user’s geolocation and stores it in localStorage.
- Uses default coordinates (London) if geolocation fails.

### **Fetching Weather Data**
```js
const fetchWeather = async () => {
  setLoading(true);
  setError(null);
  
  try {
    let storedData = JSON.parse(localStorage.getItem("forecastData"));
    let savedCoords = JSON.parse(localStorage.getItem("coords"));
    
    if (storedData && savedCoords && savedCoords.lat === coords.lat && isCacheValid(storedData)) {
      setForecastData(storedData.data);
      setLoading(false);
      return;
    }
    
    const { lat, lon } = coords;
    const dailyResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast/daily`, {
      params: { lat, lon, cnt: 5, units: "standard", appid: process.env.REACT_APP_WEATHER_API_KEY },
    });
    
    const hourlyResponse = await axios.get(`https://pro.openweathermap.org/data/2.5/forecast/hourly`, {
      params: { lat, lon, units: "standard", appid: process.env.REACT_APP_WEATHER_API_KEY },
    });
    
    const hourlyByDay = groupHourlyByDay(hourlyResponse.data.list);
    dailyResponse.data.list = dailyResponse.data.list.map((day) => {
      let date = new Date(day.dt * 1000).toISOString().split("T")[0];
      return { ...day, hourly: hourlyByDay[date] || [] };
    });
    
    localStorage.setItem("forecastData", JSON.stringify({ data: dailyResponse.data, timestamp: new Date().getTime() }));
    setForecastData(dailyResponse.data);
  } catch (err) {
    setError("Could not fetch weather data.");
  } finally {
    setLoading(false);
  }
};
```
- Fetches daily and hourly weather data from OpenWeather API.
- Caches data in `localStorage` for faster access.

### **Unit Conversion**
```js
const getTemperature = (temp, unit, round=false) => {
  if (unit === "metric") {
    temp -= 273.15;
  } else if (unit === "imperial") {
    temp = (temp - 273.15) * (9/5) + 32;
  }
  return round ? Math.round(temp) : temp;
};
```
- Converts temperature from Kelvin to Celsius or Fahrenheit.

### **Running Condition Calculation**
```js
const calculateRunningCondition = (temp, wind, precipitation) => {
  temp = temp - 273.15;
  if (temp >= 10 && temp <= 20 && wind < 15 && precipitation === 0) {
    return "good";
  } else if (temp >= 5 && temp <= 25 && wind < 25 && precipitation < 40) {
    return "fair";
  } else {
    return "poor";
  }
};
```
- Determines whether the weather is **good**, **fair**, or **poor** for running.

### **Sidebar Menu Toggle**
```js
const toggleMenu = () => setIsOpen(!isOpen);
```
- Toggles the sidebar visibility.

---

## UI Components
### **Header**
```js
<header>
  <button onClick={toggleMenu} className="menu-button" aria-label="Open menu">
    <FontAwesomeIcon icon={faBars} className="menu-icon" />
  </button>
</header>
```
- Displays a menu button to toggle the sidebar.

### **Sidebar**
```js
<div className={`sidebar ${isOpen ? "open" : ""}`}>
  {<SideBar setCoords={setCoords} unit={unit} setUnit={setUnit} toggleMenu={toggleMenu} />}
</div>
```
- Contains location selection and unit toggle options.

### **Weather Data Display**
```js
<h1>
  {selectedDayIndex === 0
    ? getTemperature(forecastData.list[selectedDayIndex].hourly[0].main.temp, unit, true)
    : getTemperature(forecastData.list[selectedDayIndex].temp.day, unit, true) + " / " +
      getTemperature(forecastData.list[selectedDayIndex].temp.night, unit, true)}
  {getUnitSymbol()}
</h1>
```
- Shows temperature for the selected day.

### **Hourly Forecast**
```js
forecastData.list[selectedDayIndex].hourly.map((hour, index) => (
  <div key={index} className="hour-card">
    <p>{new Date(hour.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}</p>
    <img src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} alt="weather icon" />
    <p>{hour.weather[0].main}</p>
    <p>{getTemperature(hour.main.temp, unit, true)}{getUnitSymbol()}</p>
  </div>
))
```
- Displays hourly forecast cards.

---

## Conclusion
This React weather app provides real-time weather data, caching for efficiency, and gear recommendations for users. The UI is structured using reusable components and styled with CSS. The app is interactive, allowing users to toggle units and select locations dynamically.

