'use strict';
var fs = require('fs');

exports.checkForToken = function(callback){	
	fs.exists('../data/token', function(exists){
		callback(exists);
	});		
};

exports.gettoken = function(callback){
	fs.readfile('../data/token', function(err, data) {
		if (err) return callback(err, null);
		return callback(null, data);
	});
};

exports.settoken = function(token, callback){
	fs.writefile('../data/token', token, function(err){
		if (err) callback(err);
		callback(null);
	});
};

exports.settoken = function(token, callback){
	fs.writefile('../data/token', token, function(err){
		if (err) callback(err);
		callback(null);
	});
};
