import React, { useState, useEffect } from "react";

/**
 * GearRecommendation Component
 * This component provides gear recommendations based on the weather conditions.
 * @param weatherId
 * @returns {JSX.Element}
 * @constructor
 */
const GearRecommendation = ({ weatherId }) => {
  // Define the gear suggestions based on weather conditions
  const gearSuggestions = {
    thunderstorm: [
      { name: "Waterproof Jacket", img: "https://emojicdn.elk.sh/🧥" },
      { name: "Umbrella", img: "https://emojicdn.elk.sh/☂️" },
      { name: "Water-Resistant Shoes", img: "https://emojicdn.elk.sh/👟" },
    ],
    drizzle: [
      { name: "Raincoat", img: "https://emojicdn.elk.sh/🧥" },
      { name: "Umbrella", img: "https://emojicdn.elk.sh/☂️" },
      { name: "Quick-Dry Socks", img: "https://emojicdn.elk.sh/🧦" },
    ],
    rain: [
      { name: "Waterproof Jacket", img: "https://emojicdn.elk.sh/🧥" },
      { name: "Umbrella", img: "https://emojicdn.elk.sh/☂️" },
      { name: "Grip Running Shoes", img: "https://emojicdn.elk.sh/👟" },
    ],
    snow: [
      { name: "Thermal Jacket", img: "https://emojicdn.elk.sh/🧥" },
      { name: "Gloves", img: "https://emojicdn.elk.sh/🧤" },
      { name: "Winter Running Shoes", img: "https://emojicdn.elk.sh/🥾" },
    ],
    atmosphere: [
      { name: "Face Mask", img: "https://emojicdn.elk.sh/😷" },
      { name: "Sunglasses", img: "https://emojicdn.elk.sh/🕶️" },
      { name: "Scarf", img: "https://emojicdn.elk.sh/🧣" },
    ],
    clear: [
      { name: "Cap", img: "https://emojicdn.elk.sh/🧢" },
      { name: "Sunglasses", img: "https://emojicdn.elk.sh/🕶️" },
      { name: "Water Bottle", img: "https://emojicdn.elk.sh/🥤" },
    ],
    clouds: [
      { name: "Light Jacket", img: "https://emojicdn.elk.sh/🧥" },
      { name: "Tights", img: "https://emojicdn.elk.sh/🩳" },
      { name: "Running Gloves", img: "https://emojicdn.elk.sh/🧤" },
    ],
  };

  const [gear, setGear] = useState([]);

  // Set the gear based on the weather ID from OpenWeatherMap
  useEffect(() => {
    if (weatherId >= 200 && weatherId < 300) setGear(gearSuggestions.thunderstorm);
    else if (weatherId >= 300 && weatherId < 400) setGear(gearSuggestions.drizzle);
    else if (weatherId >= 500 && weatherId < 600) setGear(gearSuggestions.rain);
    else if (weatherId >= 600 && weatherId < 700) setGear(gearSuggestions.snow);
    else if (weatherId >= 700 && weatherId < 800) setGear(gearSuggestions.atmosphere);
    else if (weatherId === 800) setGear(gearSuggestions.clear);
    else if (weatherId > 800) setGear(gearSuggestions.clouds);
  }, [weatherId]);

  return (
    <ul>
      {gear.map((item, index) => (
        <li key={index}>
          <img src={item.img} alt={item.name}/>
          <span>{item.name}</span>
        </li>
      ))}
    </ul>
  );
};

export default GearRecommendation;