'use strict';

module.exports = {
  address: {
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
  },
  coordinates: { type: [Number], index: '2dsphere' },
};
