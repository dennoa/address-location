'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const unhandledReject = require('./unhandled-reject');
const googleApi = require('../lib/google/api');
const timezone = require('../lib').timezone;

describe('timezone', () => {
  const expectedError = 'Expected for testing';
  let options, result;
  
  beforeEach(() => {
    options = { key: 'my timezone api key' };
    result = { dstOffset: 0, rawOffset: 36000, status: 'OK', timeZoneId: 'Australia/Sydney', timeZoneName: 'Australian Eastern Standard Time' };
    sinon.stub(googleApi, 'request').returns(Promise.resolve(result));
  });

  afterEach(() => {
    googleApi.request.restore();
  });

  it('should lookup timezone information', done => {
    const location = { lat: -33.8571965, lng: 151.2151398 };
    const atDate = new Date();
    timezone(options).find(location, atDate).then(data => {
      expect(data).to.deep.equal(result);
      expect(googleApi.request.firstCall.args[0]).to.deep.equal({
        method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/timezone/json',
        qs: { key: options.key, location: '-33.8571965,151.2151398', timestamp: Math.round(atDate.getTime()/1000) },
      });
      done();
    });
  });

  it('should default to the current time', done => {
    const location = { lat: -33.8571965, lng: 151.2151398 };
    const now = new Date();
    timezone(options).find(location).then(() => {
      expect(googleApi.request.firstCall.args[0].qs.timestamp).to.be.closeTo(Math.round(now.getTime()/1000), 2);
      done();
    });
  });

  it('should allow the default timezone url to be overridden', done => {
    const location = { lat: -33.8571965, lng: 151.2151398 };
    options.url = 'http://some-other-url';
    timezone(options).find(location).then(() => {
      expect(googleApi.request.firstCall.args[0].url).to.equal('http://some-other-url');
      done();
    });
  });

  it('should return a null timezoneId when no location is specified', done => {
    timezone(options).find().then(data => {
      expect(data).to.deep.equal({ timeZoneId: null });
      done();
    });
  });

  it('should return a null timezoneId when no latitude is specified', done => {
    timezone(options).find({ lng: 1 }).then(data => {
      expect(data).to.deep.equal({ timeZoneId: null });
      done();
    });
  });

  it('should return a null timezoneId when no longitude is specified', done => {
    timezone(options).find({ lat: 1 }).then(data => {
      expect(data).to.deep.equal({ timeZoneId: null });
      done();
    });
  });

  it('should reject on any error', done => {
    googleApi.request.returns(unhandledReject(expectedError));
    timezone(options).find({ lat: -33.8571965, lng: 151.2151398 }).catch(err => {
      expect(err).to.equal(expectedError);
      done();
    });
  });

  it('should update the timezone_id on the address', done => {
    const tz = { timeZoneId: 'Australia/Sydney' };
    const address = { geometry: { location: { lat: 10, lng: 20 } } };
    timezone(options).update(address).then(updated => {
      expect(updated.timezone_id).to.equal(result.timeZoneId);
      done();
    });
  });

  it('should respond with any error encountered looking up the timezone information', done => {
    googleApi.request.returns(unhandledReject(expectedError));
    timezone(options).update({ geometry: { location: { lat: 10, lng: 20 } } }).catch(err => {
      expect(err).to.equal(expectedError);
      done();
    });
  });

  it('should update the timezone_id on the address when there is no location information', done => {
    const address = { geometry: {} };
    timezone(options).update(address).then(updated => {
      expect(updated.timezone_id).to.equal(null);
      done();
    });
  });

  it('should update the timezone_id on the address when there is no geometry information', done => {
    const address = {};
    timezone(options).update(address).then(updated => {
      expect(updated.timezone_id).to.equal(null);
      done();
    });
  });

  it('should not update the timezone_id on the address when there is no address information', done => {
    timezone(options).update().then(updated => {
      expect(typeof updated).to.equal('undefined');
      done();
    });
  });

});
