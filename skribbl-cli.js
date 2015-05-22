'use strict';

var readline = require('readline-sync').question;
var colors = require('colors');
var token = require('./lib/token.js');
var createUser = require('./lib/routes/users_routes.js').createUser;
var login = require('./lib/routes/users_routes.js').loginUser;
var postSkribbl = require('./lib/routes/skribbl_routes.js').createSkribbl;
var storysBrowse = require('./lib/routes/story_routes.js').main;
var fetchSkribbl = require('./lib/routes/skribbl_routes.js').getSkribblTree;
var wordWrap = require('word-wrap');

var skribblURL = 'https://skribbl-app.herokuapp.com';
var userToken = null;
var userName = null;

checkForToken();

function menu(){
	console.log('skribble actions menu:'.cyan);
	console.log('---> q to quit'.red);
	console.log('---> s to start skribblin on existing srkibbl'.red);
	console.log('---> n to start a new skribbl'.red);
	console.log('---> t to see your timeline'.red);
	console.log('---> b to browse storys'.red);
	var input = readline('---> '.green);
	handleUserInput(input, ['q', 's', 't', 'b', 'l', 'n'], menu);
	switch (input) {
		case 'q':
			return runQuit();
		case 's':
			return runStartSkribblin();
		case 't':
			return runTimeline();
		case 'b':
			return runBrowse();
		case 'l':
			return runLogout();
		case 'n':
			return runCreateNewStory();
	}
}

function checkForToken(){
	token.checkForToken(function(exists){
		if (exists) {
			token.gettoken(function(err, data){
			if (err) throw err;
				userToken = data.token;
				userName = data.author;
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
	userName = username;
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
			login(skribblURL, uname, pass1, handleLogin);
		});	
		;
	}else { 
	console.log('passwords didnt match'.rainbow);
	runMakePassword(uname, email);
	}
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
	userToken = data.eat;
	token.settoken(data.eat, userName, function(err){
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
	userName = username;
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
	return 0;
}

function runBrowse(){
	console.log('should fetch /api/story'.magenta);
	storysBrowse(skribblURL, function(err, res){
		if (err){
			console.log('something went wrong'.blue);
			return menu();
		}
		handleBrowser(res, 0);
	});
}

function handleBrowser(res, startPos){
	console.log('chose a story!'.red);
	var printCount = startPos + 5;
	if (res.length < 0) {
		console.log('no storys were found, you should go write one :)'.blue);
		return menu();
	}
	if (res.length < printCount ) printCount = res.length;
	var optionsArry = ['m', 'q', 'b']
	for (var i = startPos; i < printCount; i++){
		console.log((i+1) + '   ' + res[i].story_name.blue + '\n        ' + res[i].content.substr(0, 42).trim() + '...'.green); 
		optionsArry.push(Number(i+1).toString());
	}	
	console.log('---> m to browse more storys'.red);
	console.log('---> b to return to menu'.red);
	console.log('---> [num] to read and fork story...'.red);
	var input = readline('---> '.green);
	if (optionsArry.indexOf(input) < 0) {
		console.log('yo that input didnt work'.blue);
		console.log(optionsArry);
		return handleBrowser(res, startPos);
	}
	if (input == 'q') {
		return runQuit();
	}
	if (input == 'm') {
		startPos = startPos + 5;
		if (printCount == res.length) {
			console.log('thats all she wrote, cant find any more storys'.blue);
			return handleBrowser(res, 0);
		}
		return handleBrowser(res, startPos);
	}
	var selectedStory = res[Number(input) -1];
	return handleRunSkribbl(selectedStory._id);
}

function handleRunSkribbl(skribblId){
	fetchSkribbl(skribblURL, skribblId, function(err, res){
		if (err) {
			console.log(err);
			console.log('sorry buba, something went afuss trying to get your skribbls'.magenta);
			return menu();
		}
		handkleSkribblChildren(res);

	});	
}

function handkleSkribblChildren(skribblTree){
	console.log();
	var first_skribbl = skribblTree[0];
	console.log('\t\t\tstory: '.green + first_skribbl.story_name.blue);
	console.log(wordWrap(first_skribbl.content, {indent: '     ', width: 60}));
	console.log();
	if (first_skribbl.children.length == 0) {
		console.log('you have foundyourself at the maximum depth o\' dis story'.blue);
		//console.log('---> f to fork and coninue the story'.red);
		//console.log('---> b to return to menu'.red);
	}
	var inputValidation = ['f', 'b']
	for (var i = 0; i < first_skribbl.children.length; i++){
		console.log( (i + 1) + '    ' + first_skribbl.children[i].content.substr(0, 40).trim() + '...'.green);
		inputValidation.push(Number(i+1).toString());
	}	
		console.log();
		console.log('---> f to fork and coninue the story'.red);
		console.log('---> b to return to menu'.red);
		var input = readline('---> '.green);
		if (inputValidation.indexOf(input) < 0) {
			console.log('yiksies, that wernt a choose');
			return handkleSkribblChildren(skribblTree);
		}
		if (input == 'f') {
			var parnt_id = first_skribbl._id;
			var stry_name = first_skribbl.story_name;
			var stry_id;
			if (first_skribbl.parent_skribbl == null) {
				stry_id = first_skribbl._id;
			} else {
				stry_id = first_skribbl.story_id;
			}
			var gnre = first_skribbl.genre;
			return handleForkAStory(stry_name, parnt_id, stry_id, gnre);
		}
		if (input == 'b') {
			return menu();
		}
		var selectedIndex = Number(input) - 1;
		return handleRunSkribbl(first_skribbl.children[selectedIndex]._id);
}



function runTimeline(){
	console.log('should fetch /api/timeline'.magenta);
	menu();
}

function runLogout(){
	token.deletetoken(function(err){
		if (err) {
			console.log('problem loging out');
			return menu();
		}
		console.log('you have loged out'.magenta);
		return runQuit();
	});
}

function runCreateNewStory(){
	var skribblObj = {};
	console.log('every storys gotta start somewhere eh'.magenta);	
	console.log('wuts the title of this story gunna be?');
	skribblObj.story_name = readline('---> '.green);
	console.log('wart genre gunna be dis soon too be page-turner?'.magenta);
	skribblObj.genre = readline('---> '.green);
	console.log('eh, whuteva... i guess that doesnt sound tooo clechie'.magenta);
	console.log('start ur story then!'.magenta);
	skribblObj.content = readline('---> '.green);
	skribblObj.parent_skribbl = null;
	console.log('username: ' + userName );
	console.log('token: ' + userToken);
	skribblObj.author = userName;
	postSkribbl( skribblURL, skribblObj, userToken, function(err, data){
		if (err) {
			console.log(err.response.res.body);
			console.log('yikes, sury buddy that didnt work'.blue);
			return menu();
		}
		console.log('lul, your gunna be a rock star!'.magenta);
		console.log(data);
		return menu();
	});
}

function handleForkAStory(story_name, parrent_id, story_id, genre){
	var skribblObj = {}
	skribblObj.story_name = story_name;
	skribblObj.story_id = story_id;
	skribblObj.parent_skribbl = parrent_id;
	skribblObj.author = userName;
	skribblObj.genre = genre;
	console.log('nows your chance to ruin this cute attempt at literature\ngo ahead... do your worst!'.red); 
	var input = readline('---> '.green);
	if (input == '') {
		console.log('awww sluuuug, i wont let you get away with not trying... write something'.blue);
		return handleForkAStory(story_name, parrent_id, story_id, genre);
	}
	skribblObj.content = input;
	postSkribbl(skribblURL, skribblObj, userToken, function(err, res) {
		if (err){
			console.log(err.response.res.body);
			console.log('fudge bro. ive faild you, that didnt quite work on my end'.blue);
			return menu();
		}
		console.log('wow, beautiful work homie, i can tell ur gunnz be a valuble member of the skribbl comunity'.blue);
		return menu();

	});
}

// start program
