# address-location
Support for physical addresses.

    npm install --save address-location

## Schema with support for geoNear
Use the schema as part of yoor mongoose schema definition.

    const addressLocation = require('address-location');
    const mongoose = require('mongoose');

    const schema = new mongoose.Schema({
      address: addressLocation.schema.address,
      coordinates: addressLocation.schema.coordinates,
    });

   const model = mongoose.model('MyModel', schema);

You can then do $geoNear aggregations like this:

    const options = { model, location: { lat: -33.8571965, lng: 151.2151398 } };
    addressLocation.geoNear(options).then(results => {
      // results is an array of documents from the model collection
    });

### geoNear options

* model is required. It is the mongoose model with a 2dsphere index (coordinates) that can be used with the $geoNear aggregation.
* location specifies the lat/lng at the center of the search. It defaults to 0, 0.
* maxDistance specifies the maximum distance in metres from the location. It defaults to 100.
* limit specifies the maximum number of documents to retrieve. It defaults to 20.
* query specifies other conditions to be applied to the match. It defaults to {}.

## Geocode
Use the google geocode api to lookup an address. You are probably going to do this from the browser, but if you need to do it from Node then you can use:

    addressLocation.geocode({ key: 'your api key' }).lookup('some address').then(data => {
      // data is from the google api and contains results[] and status
    });

## Timezone
Use the google timezone api to lookup timezone information for an address or location.

    addressLocation.timezone({ key: 'your api key' }).lookup({ lat: -33.8571965, lng: 151.2151398 }).then(data => {
      // data is from the google api and contains the timezoneId for the address (plus some other stuff)
    });

    // address must be in addressLocation.address.schema format - the lat/lng will be extracted from it for the timezone lookup
    addressLocation.timezone({ key: 'your api key' }).lookup(address).then(data => {
      // data is from the google api and contains the timezoneId for the address (plus some other stuff)
    });

## Get specific address components
Once you have an address in addressLocation.address.schema format, you can extract address components:

    const locality = address => addressLocation.component(address).get(addressLocation.types.locality);
    const localityName = address => addressLocation.component(address).getName(addressLocation.types.locality);
    //expect(locality.short_name).to.equal(localityName);

There are also some specific helper methods to extract commonly required parts of the address:

    const coordinates = addressLocation.get.coordinates(address); // => [lng, lat]
    const location = addressLocation.get.location(address); // => { lat, lng }
    const line1 = addressLocation.get.addressLine1(address);
    const postcode = addressLocation.get.postcode(address);
    const state = addressLocation.get.state(address);
    const suburb = addressLocation.get.suburb(address);

