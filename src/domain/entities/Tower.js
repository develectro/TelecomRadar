export class Tower {
  /**
   * @param {Object} data
   * @param {number|string} data.cellId - Unique cell identifier
   * @param {number} data.lat - Latitude
   * @param {number} data.lon - Longitude
   * @param {string} data.radio - Network type (LTE, 5G, UMTS, GSM)
   * @param {string} data.operator - Network operator ID or Name
   * @param {number} data.cellRange - Estimated coverage range in meters
   */
  constructor({ cellId, lat, lon, radio, operator, cellRange }) {
    this.cellId = cellId;
    this.lat = lat;
    this.lon = lon;
    this.radio = radio;
    this.operator = operator;
    this.cellRange = cellRange;
  }
}
