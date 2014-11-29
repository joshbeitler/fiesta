module.exports = {
  attributes: {
    name: {
      type: "string",
      required: true
    },
    email: {
      type: "email",
      required: false
    },
    phone: {
      type: "string",
      required: false
    },
    owner: {
      model: "event",
      required: true
    },
    sourceIp: {
      type: "string",
      required: false
    }
  },
  beforeCreate: function(event, next) {
    next(null, event);
  }
};