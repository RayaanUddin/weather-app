import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer,useJsApiLoader } from "@react-google-maps/api";
import "../styles/Routing.css";

const defaultCenter = { lat: 37.7749, lng: -122.4194 }; 

function Routing({setRoute}) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [start,setStart] = useState("")
  const [end,setEnd] = useState("")
 
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

useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {

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





const setRoutes = () => {
  const routeJSON = {
    origin:start || currentLocation,
    destination:end
  }
  setRoute(routeJSON)
  localStorage.setItem("route", JSON.stringify(routeJSON));

}



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
            
          
          <div className="buttonContainer">
            <button onClick={setRoutes} className="searchButton">
                      Search
            </button>
          </div>
        </div>
       
      </div>
      
      
      
      {errorCurrentLocation && <div>
        <div className="popup-overlay">
          <div className="popup">
          <h2>Your current location has not loaded properly, please close this popup and try again  </h2>
          <button className="buttons" onClick={() => setErrorCurrentLocation(false)}>Close</button>
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
      {/* {errorRoute && <div>
        <div className="popup-overlay">
          <div className="popup">
          <h2>This route is not available, please can you try a route that is more viable  </h2>
          <button className="buttons"onClick={() => setErrorCurrentLocation(false)}>Close</button>
          </div>
        </div>
      </div> } */}
      
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
              
      
      
    </div>
  );
}

export default Routing;
