'use strict';

const expect = require('chai').expect;
const timezone = require('../../lib').timezone;

xdescribe('timezone integration tests', () => {

  it('should lookup timezone information', done => {
    timezone({ key: 'your key' }).find({ lat: -33.8571965, lng: 151.2151398 }).then(data => {
      expect(data.timeZoneId).to.equal('Australia/Sydney');
      done();
    });
  });

});
