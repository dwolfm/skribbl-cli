'use strict';
var fs = require('fs');

exports.checkForToken = function(callback){	
	fs.exists('./data/token', function(exists){
		callback(exists);
	});		
};

exports.gettoken = function(callback){
	fs.readFile('./data/token', function(err, data) {
		if (err) return; 
		return callback(null, data);
	});
};

exports.settoken = function(token, callback){
	fs.writeFile('./data/token', token, function(err){
		if (err) callback(err);
		callback(null);
	});
};

exports.deletetoken = function(callback){
	fs.unlink('./data/token', function(err){
		if (err) {
			console.log(err);
			callback(err);
		}
		callback(null);
	});
};


