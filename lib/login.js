'use strict';

var supera = require('superagent');

module.exports = function(apiUrl, uname, password, callback){
	supera.get(apiUrl + '/api/users/)
		.auth(uname, password)
		.end(callback);
};
