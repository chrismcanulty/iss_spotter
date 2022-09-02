const { nextISSTimesForMyLocation } = require('./iss');

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});

// Once index has array of flyover times, it can loop through the data and print out the string

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log('It worked! Returned IP:' , ip);
// });

// fetchCoordsByIP("174.6.124.37", (error, data) => {
//   if (error) {
//     console.log('Error fetch details:', error);
//   } else {
//     console.log(data);
//   }
// })

// const coordsTest = { latitude: 49.2827291, longitute: -123.1207375};

// fetchISSFlyOverTimes(coordsTest, (error, data) => {
//   if (error) {
//     console.log('Error fetch details:', error);
//   } else {
//     console.log(data);
//   }
// });
