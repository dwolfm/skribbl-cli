'use strict';

var superagent = require('superagent');
var token      = require('../token.js');

module.exports = {
  timelineById: timelineById
};

function timelineById(rootURI, skribblID, callback) {
  superagent.request(rootURI)
    .get('/api/timeline/' + skribblID)
    .end(function(err, res) {
      if (err) return callback(err, null);
      callback(null, res.body);
    });
}
