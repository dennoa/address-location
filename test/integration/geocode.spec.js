'use strict';

const expect = require('chai').expect;
const geocode = require('../../lib').geocode;

xdescribe('geocode integration tests', () => {

  it('should lookup address information', done => {
    geocode({ key: 'your key' }).find('300 King St, Sydney NSW, 2000').then(data => {
      expect(data.results[0].formatted_address).to.equal('300 King St, Sydney NSW 2000, Australia');
      done();
    });
  });

});
