'use strict';

module.exports = addressOrComponents => {

  const components = Array.isArray(addressOrComponents) ? addressOrComponents
    : (addressOrComponents || {}).address_components || [];

  function get(type) {
    for (let ac of components) {
      const cmpnt = ac || {};
      const types = cmpnt.types || [];
      for (let ct of types) {
        if (ct === type) {
          return cmpnt;
        }
      }
    }
  }

  function getName(type) {
    const cmpnt = get(type);
    return (cmpnt) ? cmpnt.short_name : undefined;
  }

  return { get, getName };
};
