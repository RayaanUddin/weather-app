export const UnitType = {
  METRIC: "metric",
  IMPERIAL: "imperial",
};

/*@param {UnitType} unit Unit type*/
/**
 * Convert temperature from Kelvin to Celsius or Fahrenheit
 * @param {number} temp Temperature in Kelvin
 * @param {string} unit Unit type ("metric" or "imperial")
 * @returns {number} Converted temperature
 */
/*export const convertTemperature = (temp:number, unit:UnitType):number => {*/
export const convertTemperature = (temp, unit) => {
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
 * Get temperature unit by Unit Type
 * @param {UnitType} unit
 * @return {string}
 */
/*export const getUnitSymbol_Temperature = (unit:UnitType) => {*/
export const getUnitSymbol_Temperature = (unit) => {
  return unit === UnitType.METRIC ? "°C" : "°F";
}

/**
 * Get speed unit by Unit Type
 * @param {UnitType} unit
 * @return {string}
 */
/*export const getUnitSymbol_Speed = (unit:UnitType) => {*/
export const getUnitSymbol_Speed = (unit) => {
  return unit === UnitType.METRIC ? "km/h" : "mph";
}

/**
 * Convert speed from m/s to km/h or mph
 * @param {number} speed Wind speed in m/s
 * @param {UnitType} unit Unit type
 * @returns {number} Converted wind speed
 */
/*export const convertSpeed = (speed:number, unit:UnitType):number => {*/
export const convertSpeed = (speed, unit) => {
  if (unit === UnitType.METRIC) {
    return speed * 3.6;
  } else if (unit === UnitType.IMPERIAL) {
    return speed * 2.237;
  } else {
    console.error("Invalid unit type");
    return speed;
  }
}

/**
 * Get pressure unit by Unit Type
 * @param {UnitType} unit
 * @return {string}
 */
/*export const getUnitSymbol_Pressure = (unit:UnitType) => {*/
export const getUnitSymbol_Pressure = (unit) => {
  return unit === UnitType.METRIC ? "hPa" : "inHg";
}

/**
 * Convert pressure from hPa to imHg, or leave it as hPa.
 * @param {number} pressure Pressure in hPa
 * @param {UnitType} unit Unit type
 * @returns {number} Converted pressure
 */
/*export const convertPressure = (pressure:number, unit:UnitType) => {*/
export const convertPressure = (pressure, unit) => {
  if (unit === UnitType.METRIC) {
    return pressure;
  } else if (unit === UnitType.IMPERIAL) {
    return pressure * 0.621;
  } else {
    console.error("Invalid unit type");
    return pressure;
  }
}

/**
 * Convert unix timestamp into 24h time.
 * @param {number} timestamp Unix timestamp
 * @returns {number} Converted time (24h time)
 */
/*export const convertTimestampToTime = (timestamp:string) => {*/
export const convertTimestampToTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${minutes}`;
}