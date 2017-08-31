'use strict';

const expect = require('chai').expect;
const get = require('../lib').get;

describe('get address parts', ()=> {

  const testAddress = {
    address_components : [
      { short_name : '10', types : [ 'subpremise' ] },
      { short_name : '12', types : [ 'street_number' ] },
      { short_name : 'Princes Hwy', types : [ 'route' ] },
      { short_name : 'Wolli Creek', types : [ 'locality', 'political' ] },
      { short_name : 'Rockdale', types : [ 'administrative_area_level_2', 'political' ] },
      { short_name : 'NSW', types : [ 'administrative_area_level_1', 'political' ] },
      { short_name : 'AU', types : [ 'country', 'political' ] },
      { short_name : '2205', types : [ 'postal_code' ] }
    ],
  };

  it('should return address line 1 for an address with a subpremise', () => {
    expect(get.addressLine1(testAddress)).to.equal('10/12 Princes Hwy');
  });

  it('should return address line 1 for an address without a subpremise', () => {
    const testAddr = { address_components: [].concat(testAddress.address_components) };
    testAddr.address_components.splice(0, 1);
    expect(get.addressLine1(testAddr)).to.equal('12 Princes Hwy');
  });

  it('should return address line 1 for an address without a subpremise or street number', () => {
    const testAddr = { address_components: [].concat(testAddress.address_components) };
    testAddr.address_components.splice(0, 2);
    expect(get.addressLine1(testAddr)).to.equal('Princes Hwy');
  });

  it('should return an address line 1 of undefined where no subpremise, street number or route exists', () => {
    const testAddr = { address_components: [].concat(testAddress.address_components) };
    testAddr.address_components.splice(0, 3);
    expect(typeof get.addressLine1(testAddr)).to.equal('undefined');
  });

  it('should return the suburb for an address', () => {
    expect(get.suburb(testAddress)).to.equal('Wolli Creek');
  });

  it('should return the postcode for an address', () => {
    expect(get.postcode(testAddress)).to.equal('2205');
  });

  it('should return the state for an address', () => {
    expect(get.state(testAddress)).to.equal('NSW');
  });

  it('should get location coordindates', () => {
    const location = { lat: 10, lng: 20 };
    const address = { geometry: { location } };
    expect(get.coordinates(address)).to.deep.equal([location.lng, location.lat]);
  });

  ['lat', 'lng'].forEach(key => {
    it(`should not get coordinates when no ${key} has been provided`, () => {
      const location = { lat: 10, lng: 20 };
      delete location[key];
      const address = { geometry: { location } };
      expect(get.coordinates(address)).to.deep.equal([]);
    });
  });

  it('should not get coordindates when no location has been provided', () => {
    const address = { geometry: { } };
    expect(get.coordinates(address)).to.deep.equal([]);
  });

  it('should not get coordindates when no geometry has been provided', () => {
    const address = { geometry: { } };
    expect(get.coordinates(address)).to.deep.equal([]);
  });

  it('should not get coordindates when no address has been provided', () => {
    expect(get.coordinates()).to.deep.equal([]);
  });

});