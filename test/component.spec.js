'use strict';

const expect = require('chai').expect;
const component = require('../lib').component;

describe('component', ()=> {

  const address = {
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

  address.address_components.forEach(ac => {
    const ct = ac.types[0];
    it(`should get the address component for a type of ${ct}`, () => {
      expect(component(address).get(ct)).to.deep.equal(ac);
    });
    it(`should get the short_name for a type of ${ct}`, () => {
      expect(component(address).getName(ct)).to.equal(ac.short_name);
    });
  });

  it('should return an undefined short_name for a type that cannot be found in the address', () => {
    expect(typeof component(address).getName('floor')).to.equal('undefined');
  });

  it('should return an undefined short_name for an unspecified address', () => {
    expect(typeof component().getName('floor')).to.equal('undefined');
    expect(typeof component(null).getName('floor')).to.equal('undefined');
  });

  it('should return an undefined short_name for a non-object (e.g. string) address parameter', () => {
    expect(typeof component('123 Fake St').getName('street_number')).to.equal('undefined');
  });

  it('should return an undefined short_name for an address with no components', () => {
    expect(typeof component({}).getName('street_number')).to.equal('undefined');
    expect(typeof component({ address_components: null }).getName('street_number')).to.equal('undefined');
    expect(typeof component({ address_components: [] }).getName('street_number')).to.equal('undefined');
  });

  it('should return an undefined short_name for an address with no component types', () => {
    expect(typeof component({ address_components: [{ short_name: 'barry' }] }).getName('street_number')).to.equal('undefined');
    expect(typeof component({ address_components: [{ short_name: 'barry', types: null }] }).getName('street_number')).to.equal('undefined');
    expect(typeof component({ address_components: [{ short_name: 'barry', types: [] }] }).getName('street_number')).to.equal('undefined');
  });

});