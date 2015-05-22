'use strict';
var superagent = require('superagent');

var Storys = {};

Storys.main = function( apiUrl, callback ) {
  superagent.get( apiUrl + '/api/storys/' )
    .end(function( err, res ) {
      if ( err ) callback( err );
      callback( null, res.body );
    });
};

Storys.id = function( apiUrl, id, callback ) {
  superagent.get( apiUrl + '/api/storys/' + id )
    .end(function( err, res ) {
      if ( err ) callback( err );
      callback( null, res.body );
    });
};

Storys.random = function( apiUrl, opt, callback ) {
  superagent.get( apiUrl + '/api/storys/random/' + opt )
    .end(function( err, res ) {
      if ( err ) callback( err );
      callback( null, res.body );
    });
};

module.exports = Storys;
