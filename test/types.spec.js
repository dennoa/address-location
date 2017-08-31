'use strict';

const expect = require('chai').expect;
const types = require('../lib').types;

describe('types', ()=> {

  const nonStandard = ['state', 'suburb', 'unit'];

  Object.keys(types).filter(type => nonStandard.indexOf(type) < 0).forEach(type => {
    it(`should identify ${type}`, () => {
      expect(types[type]).to.equal(type);
    });
  });

  it('should identify state as administrative_area_level_1', () => {
    expect(types.state).to.equal('administrative_area_level_1');
  });

  it('should identify suburb as locality', () => {
    expect(types.suburb).to.equal('locality');
  });

  it('should identify unit as subpremise', () => {
    expect(types.unit).to.equal('subpremise');
  });

});