'use strict';

const component = require('./component');
const types = require('./types');
const util = require('./util');

const location = address => ((address || {}).geometry || {}).location;

function coordinates(address) {
  const loc = location(address) || {};
  return (util.isSpecified(loc.lat) && util.isSpecified(loc.lng)) ? [loc.lng, loc.lat] : [];
}

function getUnit(cmp) {
  const unit = cmp.getName(types.unit);
  return (unit) ? `${unit}/` : '';
}

function addressLine1(address) {
  const cmp = component(address);
  const unit = getUnit(cmp);
  const streetNumber = cmp.getName(types.street_number) || '';
  const route = cmp.getName(types.route) || '';
  const line1 = `${unit}${streetNumber} ${route}`.trim();
  return (line1.length > 0) ? line1 : undefined;
}

const postcode = address => component(address).getName(types.postal_code);
const state = address => component(address).getName(types.state);
const suburb = address => component(address).getName(types.suburb);

module.exports = {
  coordinates,
  location,
  addressLine1,
  postcode,
  state,
  suburb,
};
