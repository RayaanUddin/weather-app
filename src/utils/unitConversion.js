export const UnitType = {
  METRIC: "metric",
  IMPERIAL: "imperial",
};

/**
 * Convert temperature from Kelvin to Celsius or Fahrenheit
 * @param {number} temp Temperature in Kelvin
 * @param {UnitType} unit Unit type
 * @returns {number} Converted temperature
 */
export const convertTemperature = (temp:number, unit:UnitType):number => {
  if (unit === UnitType.METRIC) {
    return temp - 273.15;
  } else if (unit === UnitType.IMPERIAL) {
    return (temp - 273.15) * 9 / 5 + 32;
  } else {
    console.error("Invalid unit type");
    return temp;
  }
}

/**
 * Convert wind speed from m/s to km/h or mph
 * @param {number} speed Wind speed in m/s
 * @param {UnitType} unit Unit type
 * @returns {number} Converted wind speed
 */
export const convertWindSpeed = (speed:number, unit:UnitType):number => {
  if (unit === UnitType.METRIC) {
    return speed * 3.6;
  } else if (unit === UnitType.IMPERIAL) {
    return speed * 2.237;
  } else {
    console.error("Invalid unit type");
    return speed;
  }
}
