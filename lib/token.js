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
		data = JSON.parse(data);
		return callback(null, data);
	});
};

exports.settoken = function(token, author, callback){
	var data = {"token": token, "author": author}
	data = JSON.stringify(data);
	fs.writeFile('./data/token', data, function(err){
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
