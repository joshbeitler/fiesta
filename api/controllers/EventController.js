/**
 * EventController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  newDisp: function(req, res) {
    res.view('event/new', {
      active: 'new',
      wrap: false
    });
  },

  new: function(req, res) {
    var GeoPattern = require('geopattern');
    id = null;
    req.file('upload').upload({
      adapter: require('skipper-s3'),
      key: 'AKIAJVSH4YAMX6QSLLFQ',
      secret: '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',
      bucket: 'prototype-fiesta'
    }, function(_err, uploadedFiles) {
      Venue.create({
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.addressCity,
        state: req.body.addressState,
        zipcode: req.body.addressZip,
        name: req.body.venueName
      }).exec(function(verr, venue) {
        console.log(_err, uploadedFiles);
        var headerImg = (GeoPattern.generate(req.body.name)).toDataUri();;
        if (_err === null && uploadedFiles.length > 0) {
          headerImg = uploadedFiles[0].extra.Location;
        }

        Event.create({
          name: req.body.name,
          desc: req.body.desc,
          fee: req.body.fee,
          location: venue,
          owner: req.session.user,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          notes: req.body.notes,
          twitter: req.body.twitter,
          facebook: req.body.facebook,
          instagram: req.body.instagram,
          youtube: req.body.youtube,
          website: req.body.website,
          sponser: req.body.sponser,
          headerImg: headerImg,
          category: req.body.category
        }).exec(function(err, evt) {
          console.log(evt);
          id = evt.id;
          return res.redirect('/event/' + String(evt.id));
        });
      });
    });
  },

  edit: function(req, res) {
    Event.findOneById(req.param('id')).exec(function(err, event) {
      if (err) {
        return res.send(err, 500);
      } else {
        Pageview.find().populate("owner").where({
          owner: event.id
        }).exec(function(error, views) {
          console.log("EVENT OWNER");
          console.log(event.owner);
          console.log(error);
          if (req.session.user.id === event.owner) {
            res.view('event/edit', {
              evt: event,
              active: 'event',
              views: views
            });
          } else {
            res.redirect('/event/' + String(req.param('id')));
          }
        });
      }
    });
  },

  saveEdit: function(req, res) {
    var GeoPattern = require('geopattern');
    Event.findOneById(req.body.id).exec(function(err, event) {
      if (err) {
        return res.send(err, 500);
      } else {
        event.name = req.body.name;
        event.desc = req.body.desc;
        event.fee = req.body.fee;
        // TODO: change this back after stuff is fixed
        //event.location = req.body.location;
        event.startDate = req.body.startDate;
        event.endDate = req.body.endDate;
        event.notes = req.body.notes;
        event.website = req.body.website;
        event.twitter = req.body.twitter;
        event.instagram = req.body.instagram;
        event.facebook = req.body.facebook;
        event.youtube = req.body.youtube;
        event.sponser = req.body.sponser;
        //event.headerImg = (GeoPattern.generate(req.body.name)).toDataUri();
        event.save();
        res.redirect('/event/' + String(event.id));
      }
    });
  },

  delete: function(req, res) {
    Event.findOneById(req.param('id')).exec(function(err, event) {
      if (err) {
        return res.send(err, 500);
      } else {
        event.destroy();
        res.redirect('/');
      }
    });
  },

  display: function(req, res) {
    Event.findOneById(req.param('id'))
      .populate('owner')
      .populate('location').exec(function(error, event) {
        Attendee.find()
          .where({
            owner: event.id
          })
          .exec(function(err, att) {
            var moment = require('moment');
            currentdate = new Date(moment().valueOf());
            Pageview.create({
              date: currentdate,
              owner: event
            }).exec(function(e, r) {
              console.log(e);
              event.save();

              res.view('event/specific', {
                evt: event,
                attendees: att,
                active: 'event',
                wrap: false
              });
            });
          });
      });
  },

  dashboard: function(req, res) {
    Event.find()
      .exec(function(error, events) {
        Attendee.find()
          .populate('owner')
          .exec(function(_err, _atts) {
            Event.find()
              .populate('location')
              .where({
                owner: req.session.user.id
              })
              .exec(function(error, uevents) {
                var newAttendees = [];
                var myEvents = [];

                for (var i = 0; i < _atts.length; i++) {
                  if (_atts[i].email === req.session.user.email && _atts[i].owner.owner !== req.session.user.id) {
                    myEvents.push(_atts[i].owner);
                  }
                  if (_atts[i].owner.owner === req.session.user.id && _atts[i].email !== req.session.user.email) {
                    newAttendees.push(_atts[i]);
                  }
                }

                Event.find()
                .populate('location')
                .where({
                  category: 'art'
                })
                .exec(function(_error, _artevents) {
                  Event.find()
                  .populate('location')
                  .where({
                    category: 'business'
                  })
                  .exec(function(__error, _bizevents) {
                    Event.find()
                    .populate('location')
                    .where({
                      category: 'film'
                    })
                    .exec(function(___error, _filmevents) {
                      Event.find()
                      .populate('location')
                      .where({
                        category: 'food'
                      })
                      .exec(function(____error, _foodevents) {
                        Event.find()
                        .populate('location')
                        .where({
                          category: 'music'
                        })
                        .exec(function(____error, _musicevents) {
                          Event.find()
                          .populate('location')
                          .where({
                            category: 'tech'
                          })
                          .exec(function(_____error, _techevents) {
                            var moment = require('moment');
                            var satelize = require('satelize');

                            var ip = req.headers['x-forwarded-for'] || 
                              req.connection.remoteAddress || 
                              req.socket.remoteAddress ||
                              req.connection.socket.remoteAddress;

                            console.log(ip);

                            satelize.satelize({ip: String(ip)}, function(err, geoData) {
                              console.log(geoData);
                            });

                            res.view('home/index', {
                              events: myEvents,
                              userEvents: uevents,
                              active: 'dashboard',
                              history: newAttendees,
                              moment: moment,
                              artEvents: _artevents,
                              bizEvents: _bizevents,
                              filmEvents: _filmevents,
                              foodEvents: _foodevents,
                              musicEvents: _musicevents,
                              techEvents: _techevents,
                              wrap: false,
                              title: 'Fiesta - Dashboard'
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
          });
      });
  },

  search: function(req, res) {
    var query = req.param('search');
    console.log(query);
    Event.find().populate('owner').where({
      or: [{
        name: {
          contains: query
        }
      }, {
        desc: {
          contains: query
        }
      }]
    }).exec(function(err, results) {
      console.log(err);
      console.log(results);

      return res.view('home/search', {
        results: results,
        query: query
      });
    });
  },

  export: function(req, res) {
    Attendee.find().populate('owner').where({
      email: req.session.user.email
    }).exec(function(ee, rr) {
      var icalendar = require('ical-generator');
      var moment = require('moment');

      var cal = icalendar();
      cal.setDomain("codeforfood.net").setName("My Events");

      for (var i = 0; i < rr.length; i++) {
        console.log("event");
        date = new Date(rr[i].owner.date);
        newDate = moment(date).add('days', 1).toDate();

        cal.addEvent({
          start: date,
          end: newDate,
          summary: rr[i].owner.name,
          description: rr[i].owner.desc,
          location: rr[i].owner.location,
          url: rr[i].owner.website
        });
      }

      res.set({
        'Content-Disposition': 'attachment; filename="fiesta-exported.ical"'
      });
      res.send(cal.toString());
    });
  },

  all: function(req, res) {
    Event.find()
      .where({
        owner: req.session.user.id
      }).exec(function(error, events) {
        Attendee.find()
          .populate('owner')
          .exec(function(error, _atts) {

            //console.log("ATTEND");
            //console.log(_atts);
            var atten = [];
            for (var i = 0; i < _atts.length; i++) {
              if (_atts[i].email === req.session.user.email && _atts[i].owner.owner !== req.session.user.id) {
                atten.push(_atts[i].owner);
              }
            }
            //console.log(atten);
            res.view('event/all', {
              events: events,
              attens: atten,
              active: 'event'
            });
          });
      });
  },

  pay: function(req, res) {
    Event.findOneById(req.param('id')).exec(function(error, event) {
      console.log(error);
      var stripe = require("stripe")(
        "sk_test_5JRqRmG5IEb9BORuuoq38jId"
      );

      stripe.charges.create({
          amount: (Number(event.fee) * 100),
          currency: "usd",
          card: {
            number: req.body.cardNumber,
            exp_month: req.body.expMonth,
            exp_year: req.body.expYear,
            cvc: req.body.cvc
          },
          description: "RSVP'd to event"
        },
        function(err, charge) {
          console.log("payed");
          console.log(err);
          console.log(charge);
          sails.controllers.attendee.new(req, res);
        });
    });
  },

  _config: {}
};