/**
 * Venue.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  // TODO: rename to "Address" model
  attributes: {
    address1: {
      type: 'string',
      required: true
    },
    address2: {
      type: 'string',
      required: false
    },
    city: {
      type: 'string',
      required: true
    },
    state: {
      // TODO: upgrade to 'state' model
      type: 'string',
      required: true
    },
    zipcode: {
      type: 'integer',
      required: true
    },
    name: {
      type: 'string',
      required: true
    },
    toString: function() {
      return this.address1 + ', ' + this.city;
    }
  }
};
