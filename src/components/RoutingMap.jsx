import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer } from "@react-google-maps/api";
import './styles/RoutingMap5.css'

const API_KEY = import.meta.env.VITE_API_KEY; 

const defaultCenter = { lat: 37.7749, lng: -122.4194 }; 

function RoutingMap({isNightMode}) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [start,setStart] = useState("")
  const [end,setEnd] = useState("")
  const [bestRoute,setBestRoute] = useState(null)
  const [currentLocationWeather,setCurrentLocationWeather] = useState(null)
  const [loadingDirections, setLoadingDirections] = useState(false);

  const [routeJSON,setRouteJSON] = useState(null)

  const [weatherConditions, setWeatherConditions] = useState({
    rain: false,
    wind: false,
    temperature: false,
});
// handles the filtering options for what the user wants
// can choose routes with no rain or more shadier areas  
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

// used for display on mobile devices using media queries
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


// gets the weather of the current location the user is in, if they start from there
const getWeather = async (lat, lon) => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  
  try {
      const response = await fetch(url);
      const data = await response.json();
      setCurrentLocationWeather( {
        condition: data.weather[0].main,  // Example: "Rain", "Clear", "Snow"
        windSpeed: data.wind.speed,       // Wind speed in m/s
        temperature: data.main.temp,      // Temperature in °C
    })
  } catch (error) {
      console.error("Weather API Error:", error);
      return null;
  }
};

// sends the route to local storage for the user to see on the main page
const confirmRoute = () => {
  localStorage.setItem("route", JSON.stringify(routeJSON));
}

// gets new weather based on the location they are in
useEffect(() => {
  if ((!start && !currentLocation) || !end) {
    return;
  }

  const getWeather = async (lat, lon) => {


    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${start || location}&appid=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return {
            condition: data.weather[0].main,  // Example: "Rain", "Clear", "Snow"
            windSpeed: data.wind.speed,       // Wind speed in m/s
            temperature: data.main.temp,      // Temperature in °C
        };
    } catch (error) {
        console.error("Weather API Error:", error);
        return null;
    }
  };

  getWeather()

},[start,location])


// this creates the directions based on the start and end locations 
// and checks all the viable routes based on the options picked by the user
const getRoute = () => {
  if (!window.google || !window.google.maps) {
      alert("Google Maps API not loaded.");
      return;
  }
  if ((!start && !currentLocation) || !end) {
      alert("Please provide both start and destination locations.");
      return;
  }

  setLoadingDirections(true);

  const directionsService = new google.maps.DirectionsService();
  directionsService.route(
      {
          origin: start || currentLocation,
          destination: end,
          travelMode: google.maps.TravelMode.WALKING,
          provideRouteAlternatives: true,
      },
      async (result, status) => {
          setLoadingDirections(false);
          if (status === google.maps.DirectionsStatus.OK) {
              let bestRoute = null;
              let bestWeatherScore = Infinity;

              for (let index = 0; index < result.routes.length; index++) {
                  const route = result.routes[index];
                  const midPoint = route.overview_path[Math.floor(route.overview_path.length / 2)];
                  const weatherCondition = await getWeather(midPoint.lat(), midPoint.lng());

                  let score = 0;
                  if (weatherConditions.rain && weatherCondition.condition === "Rain") score += 2;
                  if (weatherConditions.wind && weatherCondition.windSpeed > 10) score += 1; 
                  if (weatherConditions.temperature && (weatherCondition.temperature < 0 || weatherCondition.temperature > 35)) score += 2; // Extreme temp

                  if (score < bestWeatherScore) {
                      bestWeatherScore = score;
                      bestRoute = route; 
                  }
              }

              if (bestRoute) {
                  console.log(currentLocation)
                  setBestRoute(bestRoute); 
                  const routeJSONs = {
                    origin: start || currentLocation,
                    destination:end
                  }

                  setRouteJSON(routeJSONs)
                  
                  
                  console.log(bestRoute)

              }

              setDirections(result);
          } else {
              alert("Could not find route.");
          }
      }
  );
};

// gets the current location of user
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
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);


  return (
    <div style={isNightMode ? "night-background":"day-background"}>
       <div className="menu">
          <img className="menuImgs" src="https://s3-alpha-sig.figma.com/img/8119/7a04/8b094d76f25fbd27d9b66475657af1e0?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=R5ISqwcRTrWBN4NYEP-3t9Utdon2-OE-u8-MbJuEXZbqPSOpq1MYJtvFcNA7qSCUviIVs3lE3OucXfh5xgSvTRuy5WjxQtLDQwcJdggVGqsYZzeRCEkX6AZjNfyscQh-WU8WtCgkwhXyJ2vAy89BlvC-nBsHgsTB5i518gNQ42LhZNpKP4s~EAVyC3ujvj7aj87xc2~9wlvpUjp0B3Affx3Ohtw9e2cvyp5cXH1s0A2Jmq0RUYj0U7LR72iCls72cy0zMOTy1O7gVmdbYW1fsJlVHhH6QaI7FW8TshcaA9gR874pQyFIT~~aR~slbV61lCh0pa7AH5vXbMw7~G4-ew__" alt="" />
          <h3 className="menuName">Menu</h3>
       </div>
      <div className="boxContainer">
        <div className="stuff">
          <div className="inputBox">
            <div className="stuffImgs">
              <div className="images">
                <img className="location-icon" src="src/location_on.png" alt="feger" />
              </div>
              
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
          </div>
          <div className="buttonContainer">
            <button onClick={getRoute} className="searchButton">
                      Search
            </button>
          </div>
        </div>
       
      </div>
      <div className="mapContainer">
      {loadingDirections && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Loading route...</h2>
          </div>
        </div>
      )}
       
        <div className="mapGoogle">
          <LoadScript googleMapsApiKey={API_KEY}>
            <div className="mapGoogle">
              <GoogleMap
               mapContainerStyle={{
                width: window.innerWidth < 500 ? "80vw" : "72vw",
                height: window.innerWidth < 500 ? "450px" : "60vh",
                // Set max width for large screens
                margin: "0 auto",  // Centers the map horizontally
                border: "2px solid #ccc", // Optional border styling
                borderRadius: "8px",
                flexShrink:"0", // Optional rounded corners
                marginRight:window.innerWidth < 500 ? "3vw":"200px",
                marginLeft:window.innerWidth < 500 ? "-8px":"10px"
              }}
              center={currentLocation || defaultCenter} 
              zoom={10}
            >
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
            </div>
          </LoadScript>
        </div>
        {directions && <div className="confirmation">
          <p className="disclaimer">Disclaimer Message: E.g This is the most shaded route available. This may not be the route you will take. Confirm route?</p>
          <button className="confirmRoute" onClick={() => confirmRoute()}>Confirm</button>
        </div>}
      </div>
    </div>
  );
}

export default RoutingMap;
