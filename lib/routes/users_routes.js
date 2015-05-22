'use strict';

var superagent = require('superagent');
var token      = require('../token.js');

module.exports = {
  createUser: createUser,
  loginUser:  loginUser,
  deleteUser: deleteUser
};


// Create user
function createUser(rootURI, username, email, password, callback) {
  superagent.post(rootURI + '/api/users')
    .send({"username": username , "email": email ,  "password": password})
    .end(function(err, res){
      if (err) return callback(err, res.body);
      callback(null, res.body);
    });
}

// Login User
function loginUser(rootURI, email, password, callback) {
  superagent.get(rootURI + '/api/login')
    .auth(email, password)
    .end(function(err, res){
      if (err) return callback(err, null);
      callback(null, res.body);
    });
}

// Delete User
function deleteUser(rootURI, username, token, callback) {
  superagent.request(rootURI)
    .del('/api/users/username')
    .set('eat', token)
    .end(function(err, res) {
      if (err) return callback(err, null);
      callback(null, res.body);
    });
}
