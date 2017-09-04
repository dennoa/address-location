'use strict';

const api = require('./api');

const defaultUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

module.exports = options => {

  const opts = Object.assign({ url: defaultUrl }, options);
  
  const find = address => api.request({
    method: 'GET',
    url: opts.url,
    qs: {
      key: opts.key,
      address,
    }
  });
  
  return { find };
};
