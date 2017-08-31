'use strict';

const location = {
  type: 'object',
  description: 'Latitude and longitude',
  properties: {
    lat: {
      type: 'number',
      format: 'double'
    },
    lng: {
      type: 'number',
      format: 'double'
    }
  }
};

const address = {
  type: 'object',
  description: 'Uses google-like address format',
  properties: {
    address_components: {
      type: 'array',
      description: 'Refer to https://developers.google.com/maps/documentation/geocoding/intro#GeocodingResponses for details',
      items: {
        type: 'object',
        properties: {
          short_name: {
            type: 'string',
          },
          types: {
            type: 'array',
            description: 'Classifies the address component',
            items: {
              type: 'string'
            }
          }
        }
      }
    },
    formatted_address: {
      type: 'string',
      description: 'Full formatted address'
    },
    geometry: {
      type: 'object',
      properties: { location }
    },
    place_id: {
      type: 'string',
      description: 'The unique identifier for this place used by the google maps api and google places api'
    },
    types: {
      type: 'array',
      description: 'Classifies the address',
      items: {
        type: 'string'
      }
    },
    timezone_id: {
      type: 'string',
      description: 'Identifies the timezone relevant to this address'
    },
  }
};

module.exports = {
  definitions: {
    address,
    'address-location': location,
  }
};