import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBars } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Header = ({ toggleMenu, isOpen }) => {
  return (
    <>
      <header>
        <button onClick={toggleMenu} className="menu-button" aria-label="Open menu">
          <FontAwesomeIcon icon={!isOpen ? faBars : faArrowLeft} className="menu-icon" />
        </button>
      </header>
    </>
  );
};

export default Header;