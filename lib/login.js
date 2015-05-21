var supera = require('superagent');
var token = require('./token.js');

module.exports = function(apiUrl, uname, password, callback){
	supera.get(apiUrl + '/api/login')
		.auth(uname, password)
		.end(function(err, res){
			if (err) return callback(err); 
			return callback(null, res.body);
		});
};
