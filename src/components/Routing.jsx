import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer,useJsApiLoader } from "@react-google-maps/api";
import "../styles/Routing.css";

const defaultCenter = { lat: 37.7749, lng: -122.4194 }; 

function Routing() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [start,setStart] = useState("")
  const [end,setEnd] = useState("")
  const [bestRoute,setBestRoute] = useState(null)
  const [currentLocationWeather,setCurrentLocationWeather] = useState(null)
  const [loadingDirections, setLoadingDirections] = useState(false);
  const [loadMap,setLoadMap] = useState(false)
  const [routeJSON,setRouteJSON] = useState(null)
  const [errorMap,setErrorMap] = useState(false)
  const [errorLocation,setErrorLocation] = useState(false)
  const [errorCurrentLocation,setErrorCurrentLocation] = useState(false)
  const [errorWeather,setErrorWeather] = useState(false)
  const [errorRoute,setErrorRoute] = useState(false)
  const [loadingMap,setLoadingMap] = useState(true)
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY, // Replace with your API key
  });

  const [weatherConditions, setWeatherConditions] = useState({
    rain: false,
    wind: false,
    temperature: false,
});

const handleCheckboxChange = (e) => {
  const { name, checked } = e.target;
  setWeatherConditions((prev) => ({
      ...prev,
      [name]: checked,
  }));
};
const [mapSize, setMapSize] = useState({
  width: window.innerWidth < 500 ? "80vw" : "72vw",
  height: window.innerWidth < 500 ? "450px" : "60vh",
  marginRight:window.innerWidth < 500 ? "3vw":"120px"
});

useEffect(() => {
  const handleResize = () => {
    setMapSize({
      width: window.innerWidth < 500 ? "90vw" : "80vw",
      height: window.innerWidth < 500 ? "450px" : "50vh",
      marginRight:window.innerWidth < 500 ? "3vw":"200px"
    });
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);





const confirmRoute = () => {
  localStorage.setItem("route", JSON.stringify(routeJSON));
  setDirections(null)
}


const getWeather = async () => {


    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${start || currentLocation}&appid=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data)
        return {
            condition: data.weather[0].main,  // Example: "Rain", "Clear", "Snow"
            windSpeed: data.wind.speed,       // Wind speed in m/s
            temperature: data.main.temp,      // Temperature in °C
        };
    } catch (error) {
        console.error("Weather API Error:", error);
        setErrorWeather(true)
        return null;
    }
  };


const getRoute = () => {
  if (!window.google || !window.google.maps) {
      setErrorMap(true)
     
      return;
  }
  if ((!start && !currentLocation) || !end) {
      setErrorLocation(true)
     
      return;
  }

  setLoadingDirections(true);

  if (window.google && window.google.maps) {
    setErrorMap(false)
    
  }
  if ((start || currentLocation) && end) {
    setErrorLocation(false)
  }

  setLoadingMap(false)
  const directionsService = new window.google.maps.DirectionsService();
  directionsService.route(
      {
          origin: start || currentLocation,
          destination: end,
          travelMode: window.google.maps.TravelMode.WALKING,
          provideRouteAlternatives: true,
      },
      async (result, status) => {
          setLoadingDirections(false);
          if (status === window.google.maps.DirectionsStatus.OK) {
              let bestRoute = null;
              let bestWeatherScore = Infinity;
  
              for (let index = 0; index < result.routes.length; index++) {
                  const route = result.routes[index];
                  const pathPoints = route.overview_path;
  
                  // Sample multiple points along the route
                  const sampleCount = 5; // Number of points to check
                  const sampledPoints = [];
                  const firstPoints = pathPoints.slice(0, 2); 
                  sampledPoints.push(...firstPoints);

                  for (let i = 1; i <= sampleCount; i++) {
                      const pointIndex = Math.floor((i / (sampleCount + 1)) * pathPoints.length);
                      sampledPoints.push(pathPoints[pointIndex]);
                  }
                  const lastPoints = pathPoints.slice(-2); 
                  sampledPoints.push(...lastPoints);
                  let totalScore = 0;
                  for (const point of sampledPoints) {
                      const weatherCondition = await getWeather(point.lat(), point.lng());
                      
                      let score = 0;
                      if (weatherConditions.rain && weatherCondition.condition === "Rain") score += 2;
                      if (weatherConditions.wind && weatherCondition.windSpeed > 10) score += 1;
                      if (weatherConditions.temperature && (weatherCondition.temperature < 0 || weatherCondition.temperature > 35)) score += 2;
  
                      totalScore += score;
                  }
  
                  const avgScore = totalScore / sampleCount; // Average weather score
  
                  if (avgScore < bestWeatherScore) {
                      bestWeatherScore = avgScore;
                      bestRoute = route;
                  }
              }
  
              if (bestRoute) {
                  console.log(currentLocation);
                  setBestRoute(bestRoute);
                  setRouteJSON({
                      origin: start || currentLocation,
                      destination: end
                  });
                  console.log(bestRoute);
              }
  
              setDirections(result);
          } else {
              setErrorRoute(true);
              alert("Could not find route.");
          }
      }
  );
};

  
useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position.coords.latitude)
          console.log(position.coords.longitude)
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error)
          setErrorCurrentLocation(true)

        }
      );
    }
  }, []);


  return (
    <div>
      
       
      <div className="boxContainer">
        <div className="stuff">
          
            <div className="stuffImgs">
             
              <div className="maps">
                <input
                          type="text"
                          placeholder="Enter Starting Point"
                          value={start}
                          onChange={(e) => setStart(e.target.value)}
              
                      />
                <input
                          type="text"
                          placeholder="Enter Destination"
                          value={end}
                          onChange={(e) => setEnd(e.target.value)}
                          
                      />
              </div>
            </div>
            <div className="filters">
                      <label style={{ fontSize: "18px" }}>
                          <input className="checks"
                          type="checkbox"
                          name="rain"
                          checked={weatherConditions.rain}
                          onChange={handleCheckboxChange}
                          />
                          Avoid muddy areas
                      </label>
                      <label style={{ fontSize: "18px" }}>
                          <input className="checks"
                          type="checkbox"
                          name="wind"
                          checked={weatherConditions.wind}
                          onChange={handleCheckboxChange}
                          />
                          Avoid windy areas
                      </label>
                      <label style={{ fontSize: "18px" }}>
                          <input className="checks"
                          type="checkbox"
                          name="temperature"
                          checked={weatherConditions.temperature}
                          onChange={handleCheckboxChange}
                          />
                          Avoid sunny areas
                      </label>
            </div>
          
          <div className="buttonContainer">
            <button onClick={getRoute} className="searchButton">
                      Search
            </button>
          </div>
        </div>
       
      </div>
      <div className="mapContainer">
      {!isLoaded && <div className="popup-overlay">
          <div className="popup">
            <h2>Loading Map..  </h2>
            
          </div>
        </div>
      }
      
      {loadingDirections && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Loading route...</h2>
          </div>
        </div>
      )}
      
      {errorCurrentLocation && <div>
        <div className="popup-overlay">
          <div className="popup">
          <h2>Your current location has not loaded properly, please close this popup and try again  </h2>
          <button className="buttons" onClick={() => setErrorCurrentLocation(false)}>Close</button>
          </div>
        </div>
      </div> }
      {errorMap && <div>
        <div className="popup-overlay">
          <div className="popup">
          <h2>Your google maps has not loaded properly, please close this popup and try again  </h2>
          <button className="buttons" onClick={() => setErrorMap(false)}>Close</button>
          </div>
        </div>
      </div> }
      
      {errorWeather && <div>
        <div className="popup-overlay">
          <div className="popup">
          <h2>The weather has not loaded,there may be no weather available for this location, please can you pick a new route otherwise refresh the page  </h2>
          <button  className="buttons" onClick={() => setErrorWeather(false)}>Close</button>
          </div>
        </div>
      </div> }
      {errorRoute && <div>
        <div className="popup-overlay">
          <div className="popup">
          <h2>This route is not available, please can you try a route that is more viable  </h2>
          <button className="buttons"onClick={() => setErrorCurrentLocation(false)}>Close</button>
          </div>
        </div>
      </div> }
      
      {errorLocation && <div>
        <div className="popup-overlay">
          <div className="popup">
            {(!start && !currentLocation) ? <div>
              <h2>Your start location is empty. Please close the popup, refresh the page and add one</h2>
              <button className="buttons" onClick={() => setErrorLocation(false)}>Close</button>
            </div>:<div>
              <h2>Your end location is empty. Please close the popup, refresh the page and add one </h2>
              <button className="buttons" onClick={() => setErrorLocation(false)}>Close</button>
            </div> }
          </div>
        </div>
      </div> }
       
      <div className="mapGoogle">
              {
                isLoaded &&
                <GoogleMap
                mapContainerStyle={{
                  width: window.innerWidth < 500 ? "8vw" : "97%",
                  height: window.innerWidth < 500 ? "450px" : "60vh",
                  
                  margin: "0 auto",  // Centers the map horizontally
                  border: "2px solid #ccc", // Optional border styling
                  borderRadius: "8px",
                  flexShrink:"0", // Optional rounded corners

              }}
              center={currentLocation || defaultCenter} 
              zoom={10}
            >
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
              }
      </div>
          
        
        {directions && <div className="confirmation">
          <p className="disclaimer">Disclaimer: This is the most shaded route, but your actual path may vary. <br /> Confirm route?</p>
          <button className="confirmRoute" onClick={() => confirmRoute()}>Confirm</button>
        </div>}
      </div>
    </div>
  );
}

export default Routing;
