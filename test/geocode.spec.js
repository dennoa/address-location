'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const unhandledReject = require('./unhandled-reject');
const googleApi = require('../lib/google/api');
const geocode = require('../lib').geocode;

describe('geocode', () => {
  const expectedError = 'Expected for testing';
  let options, result;
  
  beforeEach(() => {
    options = { key: 'my geocode api key' };
    result = { results: [{ formatted_address: '123 Fake St, Somewhere' }] };
    sinon.stub(googleApi, 'request').returns(Promise.resolve(result));
  });

  afterEach(() => {
    googleApi.request.restore();
  });

  it('should lookup address geocode information', done => {
    const address = '123 Fake St';
    geocode(options).find(address).then(data => {
      expect(data).to.deep.equal(result);
      expect(googleApi.request.firstCall.args[0]).to.deep.equal({
        method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        qs: { key: options.key, address },
      });
      done();
    });
  });

  it('should allow the default geocode url to be overridden', done => {
    const address = '123 Fake St';
    options.url = 'http://some-other-url';
    geocode(options).find(address).then(() => {
      expect(googleApi.request.firstCall.args[0].url).to.equal('http://some-other-url');
      done();
    });
  });

  it('should reject on any error', done => {
    googleApi.request.returns(unhandledReject(expectedError));
    geocode(options).find('123 Fake St').catch(err => {
      expect(err).to.equal(expectedError);
      done();
    });
  });

});
