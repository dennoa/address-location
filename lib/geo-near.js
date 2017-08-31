'use strict';

module.exports = model => {
  const withDefaults = options => Object.assign({
    location: { lat: 0, lng: 0 },
    maxDistance: 100,
    limit: 20,
    query: {},
  }, options);

  return options => new Promise((resolve, reject) => {
    const { location, maxDistance, limit, query } = withDefaults(options);
    model.aggregate([{
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
};
