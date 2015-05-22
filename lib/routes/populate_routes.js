'use strict';

var superagent = require('superagent');
var token      = require('../token.js');

module.exports = {
  populateDB: populateDB
};

function populateDB(rootURI, number, callback) {
  superagent.get(rootURI + '/api/populate/number')
    .end(function(err, res) {
      if (err) return callback(err, null);
      callback(null, res.body);
    });
}


