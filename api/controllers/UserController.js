/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
  register: function(req, res) {
    User.findOneByEmail(req.body.email).exec(function(err, user) {
      if (err) {
        console.log("User exists");
        return;
      } else {
        User.create({
          email: req.body.email,
          password: req.body.password,
          username: req.body.username,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          bio: req.body.bio
        }).exec(function(err, user) {
          console.log(err);
          console.log("created user", user);
          req.session.user = user;
          res.redirect('/');
        });
      }
    });
  },

  saveSettings: function(req, res) {
    User.findOneById(req.session.user.id).exec(function(err, user) {
      user.email = req.body.email;
      user.password = req.body.password;
      user.username = req.body.username;
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.bio = req.body.bio;
      user.save();
      req.session.user = user;
      return res.redirect('/');
    });
  },

  profile: function(req, res) {
    User.findOneById(req.session.user.id).exec(function(err, user) {
      var GeoPattern = require('geopattern');
      var pattern = GeoPattern.generate(user.username);
      res.view("profile/index", {
        pattern: pattern.toDataUrl()
      });
    });
  },

  login: function(req, res) {
    var bcrypt = require('bcryptjs');

    User.findOneByEmail(req.body.email).exec(function(err, user) {
      if (err) res.json({
        error: 'DB error'
      }, 500);

      if (user) {
        bcrypt.compare(req.body.password, user.password, function(err, match) {
          if (err) res.json({
            error: 'Server error'
          }, 500);

          if (match) {
            // password match
            req.session.user = user;
            res.redirect('/');
          } else {
            // invalid password
            if (req.session.user) req.session.user = null;
            res.json({
              error: 'Invalid password'
            }, 400);
          }
        });
      } else {
        res.json({
          error: 'User not found'
        }, 404);
      }
    });
  },

  logout: function(req, res) {
    req.session.user = null;
    res.redirect('/profile/login');
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {}


};