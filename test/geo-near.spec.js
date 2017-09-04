'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const unhandledReject = require('./unhandled-reject');
const geoNear = require('../lib').geoNear;

describe('geo-near', () => {
  const expectedError = 'Expected for testing';
  let options, conditions, model;

  beforeEach(() => {
    model = { aggregate: sinon.stub().yields(expectedError) };
    options = { model };
    conditions = { location: { lat: 1, lng: 1 } };
  });

  it('should use the $geoNear aggregation for the search', done => {
    const expectedResults = [{ _id: '1' }];
    model.aggregate.yields(null, expectedResults);
    geoNear(options).find(conditions).then(results => {
      expect(results).to.deep.equal(expectedResults);
      expect(model.aggregate.firstCall.args[0]).to.deep.equal([{
        $geoNear: {
          near: { type: 'Point', coordinates: [conditions.location.lng, conditions.location.lat] },
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
    conditions.maxDistance = 10;
    geoNear(options).find(conditions).then(results => {
      expect(model.aggregate.firstCall.args[0][0].$geoNear.maxDistance).to.equal(conditions.maxDistance);
      done();
    });
  });

  it('should allow the limit to be specified', done => {
    model.aggregate.yields(null, []);
    conditions.limit = 1;
    geoNear(options).find(conditions).then(results => {
      expect(model.aggregate.firstCall.args[0][0].$geoNear.limit).to.equal(conditions.limit);
      done();
    });
  });

  it('should allow the query to be specified', done => {
    model.aggregate.yields(null, []);
    conditions.query = { id: '1' };
    geoNear(options).find(conditions).then(results => {
      expect(model.aggregate.firstCall.args[0][0].$geoNear.query).to.deep.equal(conditions.query);
      done();
    });
  });

});
