var supera = require('superagent');

module.exports = function(apiURL, uname, eemail, passwd,  callback){
	console.log(uname);

	supera.post(apiURL + '/api/users')
		.send({"username": uname , "email": eemail ,  "password": passwd})
		.end(function(err, res){
			if (err) {
				return callback(err, res.body);
			}
			console.log(null, res.body);
			return callback(null, res.body);
		});
};
