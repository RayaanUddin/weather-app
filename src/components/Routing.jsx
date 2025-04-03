import React, { useState, useEffect } from "react";
import "../styles/Routing.css";
import locationIcon from "../assets/location-icons/location_on.png";

function Routing({setRoute,start,end,setStart,setEnd,coords}) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [isDestEmpty,setIsDestEmpty] = useState(false)
  const [toggleCurrent,setToggleCurrent] = useState(false)


// Gets the current location of the user
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
       
      }
    );
  }
}, []);

// sets the routes when searching for a route
const setRoutes = () => {
  if (end === "") {
    setIsDestEmpty(true)
    return;
  }
  const routeJSON = {
    origin:start || currentLocation,
    destination:end
  }
  setRoute(routeJSON)
  setDirections(routeJSON)
  localStorage.setItem("route", JSON.stringify(routeJSON));

}

// converts coords to address to display the current location of user
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


// toggle function for it to give the user a choice
const clickConvert = () => {
  if (toggleCurrent) {
    setToggleCurrent(false)
  }
  else {
    convertCoordsToAddress(currentLocation.lat,currentLocation.lng)
    setToggleCurrent(true)
  }

}

  return (
    <div>
      <div className="info">
            <div>
              <p className="searchHelper">Search Helper</p>
            </div>
            <div className="textHelp">
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
                    <p className="currentLocationHelperButton">Press the location button to see your current location,press again to close</p>
                    
                    {toggleCurrent ? <p className="currentLocation">Current Location: {locationName}</p>  : null}
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
          <div>
          {
              isDestEmpty && <div className="confirmations">
              <p className="disclaimers">Please enter a destination</p>
              <button className="confirmRoutes" onClick={() => setIsDestEmpty(false)}>Close</button>
            </div>
            }
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
