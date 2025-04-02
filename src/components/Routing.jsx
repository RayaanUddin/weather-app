import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer,useJsApiLoader } from "@react-google-maps/api";
import "../styles/Routing.css";
import locationIcon from "../assets/location-icons/location_on.png";
const defaultCenter = { lat: 37.7749, lng: -122.4194 }; 

function Routing({setRoute,start,end,setStart,setEnd,coords}) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [locationName, setLocationName] = useState("");
  
 
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY, // Replace with your API key
  });
  const isDisabled = !start.trim() || !end.trim();

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
        // setErrorCurrentLocation(true)

      }
    );
  }
}, []);


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
  setDirections(routeJSON)
  localStorage.setItem("route", JSON.stringify(routeJSON));

}
const convertCoordsToAddress = (lat, lng) => {
  if (!window.google) return;

  const geocoder = new window.google.maps.Geocoder();
  const latlng = { lat, lng };

  geocoder.geocode({ location: latlng }, (results, status) => {
    if (status === "OK" && results[0]) {
      setLocationName(results[0].formatted_address);
    } else {
      console.error("Geocoding failed:", status);
    }
  });
};



const clickConvert = () => {
  convertCoordsToAddress(currentLocation.lat,currentLocation.lng)
  setEnd(locationName)
}


  return (
    <div>
      <div className="info">
            <div>
              <p className="searchHelper">Search Helper</p>
            </div>
            <div>
              <p>When writing your locations, please be as specific as possible e.g Stratford,London,UK instead of Stratford,UK if you are focusing on London, otherwise you would pick the town Stratford in the Midlands</p>
              <br />
              <p>If you leave the enter starting point box empty, then it would automatically make your current location the start location</p>
              <br />
              <p>Make sure you capitalise the first letter of your words e.g Mile End</p>
            </div>
      </div>
          
      <div className="boxContainer">
        <div className="stuff">
          
            <div className="stuffImgs">
              <div className="currentLocation">
                {start === "" ? <><div>
                    <p className="currentLocationHelper">Your Current Location is being used as a start location.</p>
                    <p className="currentLocationHelperButton">Press the location button to see where you are currently</p>
                    
                    {locationName ? <p className="currentLocation">Current Location: {locationName}</p>  : null}
                  </div></>:null}
              </div>
              <div className="mapBox">
                <div className="location" onClick={() => clickConvert()}>
                    <img src={locationIcon} alt="erge" style={{ cursor: "pointer" }} />
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
            </div>
          
          <div className="buttonContainer">
            <button onClick={setRoutes} className="searchButton" >
                      Search
            </button>
          </div>
        </div>
        
      </div>
      {directions  && <div className="confirmationClass">
        <div className="confirmation">
          <p className="disclaimer">Disclaimer: This is the most shaded route, but your actual path may vary.</p>
          <button className="confirmRoute" onClick={() => setDirections(null)}>Close</button>
        </div>
        
        </div>}
       
    </div>
  );
}

export default Routing;
