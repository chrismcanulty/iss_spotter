/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

const fetchMyIP = function(callback) {
  request(`https://api.ipify.org?format=json`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    // if (data.length === 0) {
    //   callback("IP address not found", null)
    //   // console.log("Breed not found!");
    //   return;
    // }
    callback(null, data.ip);
  // console.log(data[0].description);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  // http://ipwho.is/[IP address]
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    // if (response.statusCode !== 200) {
    //   const msg = `Status Code ${response.statusCode} when fetching geo coordinates. Response: ${body}`;
    //   callback(Error(msg), null);
    //   return;
    // }

    let data = JSON.parse(body);

    // check if "success" is true or not
    if (!data.success) {
      const message = `Success status was ${data.success}. Server message says: ${data.message} when fetching for IP ${data.ip}`;
      callback(Error(message), null);
      return;
    }
    // if (data.length === 0) {
    //   callback("IP address not found", null)
    //   // console.log("Breed not found!");
    //   return;
    // }
    const lat = data.latitude;
    const long = data.longitude;
    const coords = { "latitude": lat, "longitude": long};
    callback(null, coords);
  // console.log(data[0].description);
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching fly over times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const passes = JSON.parse(body).response;

    // check if "success" is true or not
    // if (!data.message === "success") {
    //   const message = `Success status was ${data.message}. Server message says: ${data.message} when fetching for fly over times`;
    //   callback(Error(message), null);
    //   return;
    // }
    // take coords from fetchCoordsByIP function
    callback(null, passes);

  // pass back array of objects inside the response property
  });
};

// iss.js

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
 const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };

// https://iss-pass.herokuapp.com/json/?lat=49.2827291&lon=-123.1207375
