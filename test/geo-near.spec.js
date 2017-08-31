'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const unhandledReject = require('./unhandled-reject');
const geoNear = require('../lib').geoNear;

describe('geo-near', () => {
  const expectedError = 'Expected for testing';
  let options, model, instance;

  beforeEach(() => {
    options = { location: { lat: 1, lng: 1 } };
    model = { aggregate: sinon.stub().yields(expectedError) };
    instance = geoNear(model);
  });

  it('should use the $geoNear aggregation for the search', done => {
    const expectedResults = [{ _id: '1' }];
    model.aggregate.yields(null, expectedResults);
    instance(options).then(results => {
      expect(results).to.deep.equal(expectedResults);
      expect(model.aggregate.firstCall.args[0]).to.deep.equal([{
        $geoNear: {
          near: { type: 'Point', coordinates: [options.location.lng, options.location.lat] },
          distanceField: 'distanceFromLocation',
          maxDistance: 100,
          limit: 20,
          query: {},
          spherical: true,
        }
      }]);
      done();
    });
  });

  it('should allow the max distance to be specified', done => {
    model.aggregate.yields(null, []);
    options.maxDistance = 10;
    instance(options).then(results => {
      expect(model.aggregate.firstCall.args[0][0].$geoNear.maxDistance).to.equal(options.maxDistance);
      done();
    });
  });

  it('should allow the limit to be specified', done => {
    model.aggregate.yields(null, []);
    options.limit = 1;
    instance(options).then(results => {
      expect(model.aggregate.firstCall.args[0][0].$geoNear.limit).to.equal(options.limit);
      done();
    });
  });

  it('should allow the query to be specified', done => {
    model.aggregate.yields(null, []);
    options.query = { id: '1' };
    instance(options).then(results => {
      expect(model.aggregate.firstCall.args[0][0].$geoNear.query).to.deep.equal(options.query);
      done();
    });
  });

});
