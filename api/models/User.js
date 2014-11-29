/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  attributes: {

    /* e.g.
  	nickname: 'string'
  	*/
    // email: 'string',
    // password: 'string'
    email: {
      type: 'email',
      required: true
    },
    password: {
      type: 'string',
      required: true,
      minLength: 8
    },
    username: {
      type: 'string',
      required: true
    },
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    phone: {
      type: 'string',
      required: false
    },
    bio: {
      type: 'string',
      required: false
    }
  },

  beforeCreate: function(user, next) {
    var bcrypt = require("bcryptjs");
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        console.log(err);
      }

      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          console.log(err);
        }

        user.password = hash;
        next(null, user);
      });
    });
  },

  fullName: function(user, next) {
    return user.firstName + " " + user.lastName;
  }

};