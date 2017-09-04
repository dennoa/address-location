'use strict';

const defaultConditions = {
  location: { lat: 0, lng: 0 },
  maxDistance: 100,
  limit: 20,
  query: {},
};

module.exports = options => {
  
  const find = conditions => new Promise((resolve, reject) => {
    const { location, maxDistance, limit, query } = Object.assign({}, defaultConditions, conditions);
    options.model.aggregate([{
      $geoNear: {
        near: { type: 'Point', coordinates: [location.lng, location.lat] },
        distanceField: 'distanceFromLocation',
        maxDistance,
        limit,
        query,
        spherical: true,
      }
    }], (err, results) => {
      return (err) ? reject(err) : resolve(results);
    });
  });

  return { find };
};
