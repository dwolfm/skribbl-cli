'use strict';

var readline = require('readline-sync').question;
var colors = require('colors');
var token = require('./lib/token.js');
var createUser = require('./lib/create_user.js');
var login = require('./lib/login.js');

var skribblURL = 'localhost:3000';
var userToken = null;

function menu(){
	console.log('skribble actions menu:'.cyan);
	console.log('---> q to quit'.red);
	console.log('---> s to start skribblin'.red);
	console.log('---> t to see your timeline'.red);
	console.log('---> b to browse storys'.red);
	var input = readline('---> '.green);
	handleUserInput(input, ['q', 's', 't', 'b', 'l'], menu);
	switch (input) {
		case 'q':
			return runQuit();
			break;
		case 's':
			return runStartSkribblin();
			break;
		case 't':
			return runTimeline();
			break;
		case 'b':
			return runBrowse();
			break;
		case 'l':
			return runLogout();
			break ;
	}
}

function checkForToken(){
	token.checkForToken(function(exists){
		if (exists) {
			token.gettoken(function(err, data){
			if (err) throw err;
				userToken = data;
				return menu();
			});
		} else {
			runLoginvsCreate();
		}
	});
}

function handleUserInput(input, validateArray, back){
	if (validateArray.indexOf(input) < 0) {
		console.log('srry yo, dat was not a valid input :(.'.blue);
		return back();
	}
	return;
}

function runLoginvsCreate(){
	console.log('yo dawg, you haven\'t loged in b4!'.rainbow);
	console.log('---> l for login'.red);
	console.log('---> c for create new account'.red);
	console.log('---> q to quit'.red);
	var input = readline('---> '.green);
	handleUserInput(input, ['l','c', 'q'], runLoginvsCreate);
	if (input == 'l') return runLogin();	
	if (input == 'q') return runQuit();
	return runCreateUser();
}

function runCreateUser(){
	console.log('what do you want your username to be?'.cyan);
	var username = readline('---> '.green);
	console.log('what is your email?'.cyan);
	var email = readline('---> '.green);
	runMakePassword(username, email);
}

function runMakePassword(uname, email){
	console.log('what do you want your password to be?'.cyan);
	var pass1 = readline('---> '.green);
	console.log('type your password again.'.cyan);
	var pass2 = readline('---> '.green);
	if (pass1 === pass2) {
		createUser(skribblURL, uname, email, pass1 , function(err, data){
			if (err) {
				console.log('errr: something went wrong'.red);
				console.log(data);
				return runCreateUser();
			}
			// login and save token
			return login(skribblURL, uname, pass1, handleLogin);
		});	
	} 
	console.log('passwords didnt match'.rainbow);
	runMakePassword(uname, email);
}

function handleLogin(err, data){
	if (err) {
		console.log('erororor: something went wrong lgin in'.red);
		console.log(data);
		return runLoginvsCreate(); 
	}
	if (!data.eat){
		console.log('yaw maing that username or pasword was incorrect');
		return runLoginvsCreate(); 
	}	
	token.settoken(data.eat, function(err){
		if (err) {
			console.log('eeek: there was an err storing ur token'.red);
			return runLoginvsCreate(); 
		}
		menu();
	});
}

function runLogin(){
	console.log('what is your usrename?'.cyan);
	var username = readline('---> '.green);
	console.log('what is your password?'.cyan);
	var passwd = readline('---> '.green);
	login(skribblURL, username, passwd, handleLogin);
}

function runStartSkribblin(){
	console.log('should fetch a skribbl story'.magenta);
	menu();
}

function runQuit(){
	console.log('bye, thank you!');
	return;
}

function runBrowse(){
	console.log('should fetch /api/story'.magenta);
	menu();
}

function runTimeline(){
	console.log('should fetch /api/timeline'.magenta);
	menu();
}

function runLogout(){
	console.log('should delete user token'.magenta);
	runQuit();
}
// start program
checkForToken();



