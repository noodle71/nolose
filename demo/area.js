
/*
  Testing to send geolocation logs usefull for area maps
*/
const loggerFactory = require('./common/loggerFactory.js');
const log = loggerFactory({
  'tag': process.env.TAG
});

const length = 100;
const sides = 6;
const radius = 2;
const PI_X_2 = (2 * Math.PI);
const LATITUDE_TO_KM = 105;
const delta = 0.01;

function buildData() {
  const lat = randomList(randomLat);
  const lon = randomList(randomLon);
  const polygon = randomList(randomPath(lat, lon));
  const radius = randomList(() => 2);
  const val = randomList(() => getRandomInt(0, 100000));
  return val.reduce(geoDataReducer(lat, lon, polygon, radius, val), []);
}

function geoDataReducer(lat, lon, polygon, radius, val) {
  return function (p, c, i) {
    p.push(buildGeolocatedRow(lat, lon, polygon, radius, val, i));
    return p;
  };
}

function buildGeolocatedRow(lat, lon, polygon, radius, val, index) {
  return {
    'lat': lat[index],
    'lon': lon[index],
    'polygon': polygon[index],
    'radius': radius[index],
    'val': val[index]
  }
}

function randomList(cb) {
  return Array.from({ length }, cb);
}

function randomLat(limit = 90) {
  return getRandomInt(-limit, limit);
}

function randomLon(limit = 180) {
  return getRandomInt(-limit, limit);
}

function randomPath(lat, lon) {
  return (elem, i) => calcPolygonPath(sides, radius, lat[i], lon[i]);
}

function getRandomInt(min, max) {
  return Math.random() * (max - min + 1) + min;
}

function calcPolygonPath(sides, radius, xCenter, yCenter) {
  const r = radius / (Math.cos(yCenter + delta) * LATITUDE_TO_KM);
  return Array.from({ length: sides }, (elem, index) => {
    const p = (index / sides);
    const a = PI_X_2 * p;
    const lat = r * Math.cos(a) + xCenter + delta;
    const lng = r * Math.sin(a) + yCenter + delta;
    return `${lat};${lng}`;
  }).join('|');
}


const randomGeoData = buildData();

Promise.all(randomGeoData.map(d => {
  const l = JSON.stringify(d);
  console.log(l);
  return log.log(l);
}))
  .then(() => process.exit(0))
  .catch(() => process.exit(1));