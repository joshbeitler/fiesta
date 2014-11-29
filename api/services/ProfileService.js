exports.get_gravatar = function(url) {
  var gravatar = require('gravatar');
  return gravatar.url(url, {
    s: '200',
    r: 'pg',
    d: 'mm'
  }, https = false);
};