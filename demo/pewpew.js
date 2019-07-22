/*
  Testing to send geolocation logs usefull for pew pew maps
*/
const cities = require('./data/cities.js');
const loggerFactory = require('./common/loggerFactory.js');
const logger = loggerFactory({
  'tag': process.env.TAG
});

const length = 100000;
const len = cities.length;

module.exports = buildData();

function buildData() {
  return randomList(() => {
    const from = getRandomLoc();
    const to = getRandomLoc();
    return {
      from_lng: from[0],
      from_lat: from[1],
      from_label: from[2],
      to_lng: to[0],
      to_lat: to[1],
      to_label: to[2],
      v: getRandomInt(1, 100),
      c: (Math.floor(Math.random() * 1000) % 2) == 0 ? '#00FF00' : null
    };
  });
}

function getRandomLoc() {
  const i = Math.floor(getRandomInt(0, len));
  const coord = [parseFloat(cities[i].lng), parseFloat(cities[i].lat), cities[i].name];
  return coord;
}

function randomList(cb) {
  return Array.from({
    length
  }, cb);
}

function getRandomInt(min, max) {
  return (Math.random() * (+max - +min) + +min);
}

const randomGeoData = buildData();

Promise.all(randomGeoData.map(d => {
    const l = JSON.stringify(d);
    console.log(l);
    return logger.log(l);
  }))
  .then((d) => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });