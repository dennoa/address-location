'use strict';

const request = require('request');

const isError = (res, body) => ((res.statusCode >= 400) || (body && body.status && (body.status.toUpperCase() !== 'OK')));

const apiRequest = options => new Promise((resolve, reject) => {
  request(Object.assign({ json: true }, options), (err, res, body) => {
    if (err) {
      return reject(err);
    }
    if (isError(res, body)) {
      return reject({ statusCode: res.statusCode, body });
    }
    resolve(body);
  });
});

module.exports = {
  request: apiRequest
};
