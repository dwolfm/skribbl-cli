'use strict';

var superagent = require('superagent');
var token      = require('../token.js');

module.exports = {
  readDownToSkribble: readDownToSkribble
  readDownToRandom:   readDownToRandom
};

// Return string of the story down to requested skribbl
function readDownToSkribble(rootURI, skribblID, callback) {
  superagent.get(rootURI + '/api/reading/' + skribblID)
    .end(function(err, res) {
      if (err) return callback(err, null);
      callback(null, res.body);
    });
}

function readDownToRandom(rootURI, callback) {
  superagent.get(rootURI + '/api/reading/random')
    .end(function(err, res) {
      if (err) return callback(err, null);
      callback(null, res.body);
    });
}
