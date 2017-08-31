'use strict';

module.exports = {
  address_components: [{
    short_name: String,
    types: [String],
  }],
  formatted_address: String,
  geometry: {
    location: {
      lat: Number,
      lng: Number
    },
  },
  place_id: String,
  types: [String],
  timezone_id: String,
};
