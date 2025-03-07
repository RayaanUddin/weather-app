import React, { useState, useEffect } from "react";
import './styles/reset.css'
import './styles/App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import HomeScreen from "./screen/HomeScreen";
import SideBarScreen from "./screen/SideBarScreen";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  return (
    <React.Fragment>
      <header>
        <button
          onClick={toggleMenu}
          className="menu-button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <FontAwesomeIcon icon={!isOpen ? faBars : faArrowLeft} className="menu-icon" />
        </button>
      </header>
      <div className="App">
        {isOpen && <div className="sidebar"><SideBarScreen/></div>}
        <HomeScreen/>
      </div>
    </React.Fragment>
  );
}

export default App;
