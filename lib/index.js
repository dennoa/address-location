'use strict';

const component = require('./component');
const geoNear = require('./geo-near');
const get = require('./get');
const google = require('./google');
const schema = require('./schema');
const swagger = require('./swagger');
const types = require('./types');

module.exports = Object.assign({
  component,
  geoNear,
  get,
  google,
  schema,
  swagger,
  types,
}, google);
