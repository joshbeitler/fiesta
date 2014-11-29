/**
 * EventController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  new: function(req, res) {
    //console.log("ATTENDEE STARTED");
    if (req.body.email === undefined && req.body.phone === undefined) {
      // ERROR \\
    }

    var ip = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    var success = true
    Event.findOneById(req.body.id).exec(function(_err, _event) {
      Attendee.find()
        .populate('owner')
        .exec(function(_error, _atts) {
          if (_atts.length > 0) {
            for (var i = 0; i < _atts.length; i++) {
              if (_atts[i].owner.id === _event.id) { //console.log("MADE IT");
                if ((_atts[i].email !== '' && _atts[i].email !== 'undefined' && _atts[i].email === req.body.email) ||
                  _atts[i].phone !== '' && _atts[i].phone !== 'undefined' && _atts[i].phone === req.body.phone) {
                  success = false;
                  res.redirect('/event/' + String(req.body.id));
                  break;
                }
              }
            }
          }
          if (success) {
            Attendee.create({
              name: req.body.name,
              email: req.body.email,
              phone: req.body.phone,
              owner: _event,
              sourceIp: ip
            }).exec(function(err, evt) {
              console.log(err);

              // QR code
              var qr = require('qr-encode');
              var dataURI = qr("1F3sAm6ZtwLAUnj7d38pGFxtP3RVEvtsbV", {
                type: 6,
                size: 6,
                level: 'Q'
              });

              // Notify!
              var mandrill = require('node-mandrill')('SqYOpMLd5CG4ey5bpz_LQw');
              mandrill('/messages/send', {
                message: {
                  to: [{
                    email: req.body.email,
                    name: req.body.name
                  }],
                  images: [{
                    type: 'image/gif',
                    name: 'qr-code',
                    content: dataURI.split(',').pop()
                  }],
                  from_email: 'noreply@codeforfood.net',
                  subject: "Your ticket for " + _event.name,
                  html: "<table><tr><td>Event Name</td><td>" + _event.name + "</tr><tr><td>Event Owner</td><td>" + _event.owner + "</td></tr><tr><td>QR Code</td><td><img src='cid:qr-code'></td></tr></table>",
                  text: "Your ticket is attached"
                }
              }, function(error, response) {
                //uh oh, there was an error
                if (error) console.log(JSON.stringify(error));
                //everything's good, lets see what mandrill said
                else console.log(response);
              });

              res.redirect('/event/' + String(req.body.id));
            });
          }
        });
    });
  },

  _config: {}
};