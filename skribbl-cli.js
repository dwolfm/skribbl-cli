'use strict';

var readline = require('readline-sync').question;
var colors = require('colors');
var createUser = require('./lib/create_user.js');
var settings = require('./lib/settings.js');

var skribblURL = 'localhost:3000';
var userToken = null;

function menu(){
	console.log('skribble actions menu:'.cyan);
	console.log('---> q to quit'.red);
	console.log('---> s to start skribblin'.red);
	console.log('---> t to see your timeline'.red);
	console.log('---> b to browse storys'.red);
	readline('---> '.green);
}

menu();

function checkForToken(){
	settings.checkForToken(function(exists){
	if (exists) {
	settings.gettoken(function(err, data){
			if (err) throw err;
			console.log('user token returned ' + data);
			userToken = data;
			return menu();
		});
	}
		settings.gettoken();
	});
}

function login(){
	console.log('what is your usrename?'.cyan);
	readline('---> '.green);
	console.log('what is your password?'.cyan);
	readline('---> '.green);
}

// check user token 
// 		on fail prompt login or create user
//		on success login

// create user
// - propt unique username
// - prompt unique email
// - prompt password
// 		on fail retry
//		on success try login

// login 
// - if comeing from create user
// - send username password
// - if login in with pre existing acount
// - prompt for username 
// - prompt for password
// 		on fail tell user 
// 		on success store token

// menu
// - prompt user if the want to fetch story, browse, or profile
// 		on fetch story go to requset /api/skribbl
// 		on brows go to /api/story
// 		on profile go to /api/timeline

// request skribble start
// - ask for skribbl start
// 		on fail tell user && re ask
// 		on succes print first level && options
// - ask user to keep reading or fork
// 		on fork ask user for some writing
// 				on fail make user retry
// 				on success request return to menu
// 		on read further print next and repete prompt




//createUser(skribblURL, 'garsdlfkbol', 'lullskdjfwat@wart.glob', 'hahah', function(err, data){
	//if (err) console.log(data);
	//console.log('donezies');
//});
