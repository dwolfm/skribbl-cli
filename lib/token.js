'use strict';
var fs = require('fs');

exports.checkForToken = function(callback){	
	fs.exists('./settings', function(exists){
		callback(exists);
	});		
};

exports.gettoken = function(callback){
	fs.readFile('./settings', function(err, data) {
		if (err) return; 
		data = JSON.parse(data);
		return callback(null, data);
	});
};

exports.settoken = function(token, author, callback){
	var data = {"token": token, "author": author};
	data = JSON.stringify(data);
	fs.writeFile('./settings', data, function(err){
		if (err) callback(err);
		callback(null);
	});
};

exports.deletetoken = function(callback){
	fs.unlink('./settings', function(err){
		if (err) {
			console.log(err);
			callback(err);
		}
		callback(null);
	});
};
