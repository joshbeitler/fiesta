/**
 * Event.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  attributes: {
    name: {
      type: "string",
      required: true,
      unique: false
    },
    desc: {
      type: "string",
      required: false,
      unique: false
    },
    fee: {
      type: "float",
      required: false,
      unique: false
    },
    location: {
      required: true,
      model: 'venue'
      // type: "string",
      // required: false,
      // unique: false
    },
    owner: {
      model: 'user',
      required: false
    },
    startDate: {
      type: "datetime",
      required: true
    },
    endDate: {
      type: "datetime",
      required: true
    },
    notes: {
      type: "text",
      required: true
    },
    website: {
      type: "string",
      required: false,
      defaultsTo: ''
    },
    twitter: {
      type: "string",
      required: false,
      defaultsTo: ''
    },
    instagram: {
      type: "string",
      required: false,
      defaultsTo: ''
    },
    facebook: {
      type: "string",
      required: false,
      defaultsTo: ''
    },
    youtube: {
      type: "string",
      required: false,
      defaultsTo: ''
    },
    sponser: {
      type: "string",
      required: false
    },
    headerImg: {
      type: "string",
      required: false,
      defaultsTo: ""
    },
    category: {
      type: "string",
      required: false
    },
    date: function() {
        var moment = require("moment");
        return moment(this.startDate).format('MMMM D') 
            + " - " 
            + moment(this.endDate).format('MMMM D');
    }
  },
  beforeCreate: function(event, next) {
    next(null, event);
  },
  afterDestroy: function(records, next) {
    Attendee.destroy({
      owner: _.pluck(records, 'id')
    }).exec(next);
  }
};