'use strict';

// Allow unhandled promise rejections in unit tests - e.g. Promise.reject(expectedError) becomes unhandledReject(expectedError)
function unhandledReject(reason) {
  const p = Promise.reject(reason);
  p.catch(() => {});
  return p;
}

module.exports = unhandledReject;
