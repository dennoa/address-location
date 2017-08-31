'use strict';

const get = require('../get');
const api = require('./api');
const util = require('../util');

const defaultUrl = 'https://maps.googleapis.com/maps/api/timezone/json';

const toSeconds = dt => Math.round(dt.getTime() / 1000);

module.exports = options => {

  const opts = Object.assign({ url: defaultUrl }, options);
  
  function lookupLocation(location, atDate) {
    if (!location || !util.isSpecified(location.lat) || !util.isSpecified(location.lng)) {
      return Promise.resolve({ timeZoneId: null });
    }
    return api.request({
      method: 'GET',
      url: opts.url,
      qs: {
        key: opts.key,
        location: `${location.lat},${location.lng}`,
        timestamp: toSeconds(atDate),
      }
    });
  }

  function lookup(addressOrLocation, atDate = new Date()) {
    const location = (addressOrLocation && util.isSpecified(addressOrLocation.geometry)) ? get.location(addressOrLocation) : addressOrLocation;
    return lookupLocation(location, atDate);
  }
  
  const update = address => lookup(address).then(timezone => {
    if (address) {
      address.timezone_id = timezone.timeZoneId;
    }
    return address;
  });
  
  return { lookup, update };
};
