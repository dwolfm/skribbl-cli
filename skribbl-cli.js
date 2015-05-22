#!/usr/bin/env node
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
var randomStoryFetch = require('./lib/routes/story_routes.js').random;
var fetchTimeline = require('./lib/routes/timeline_routes.js').timelineById;

var skribblURL = 'https://skribbl-app.herokuapp.com';
var userToken = null;
var userName = null;

checkForToken();

function menu(){
	console.log();
	console.log('               skribbl actions menu:               '.black.bold.bgMagenta);
	console.log('---> q to quit                                     '.black.bold.bgCyan);
	console.log('---> s to start skribblin on existing srkibbl      '.black.bold.bgCyan);
	console.log('---> n to start a new skribbl                      '.black.bold.bgCyan);
	console.log('---> t to see your timeline                        '.black.bold.bgCyan);
	console.log('---> b to browse storys                            '.black.bold.bgCyan);
	console.log();
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
	console.log('---> l for login'.cyan);
	console.log('---> c for create new account'.cyan);
	console.log('---> q to quit'.cyan);
	console.log();
	var input = readline('---> '.green);
	handleUserInput(input, ['l','c', 'q'], runLoginvsCreate);
	if (input == 'l') return runLogin();	
	if (input == 'q') return runQuit();
	return runCreateUser();
}

function runCreateUser(){
	console.log('what do you want your username to be?'.cyan);
	console.log();
	var username = readline('---> '.green);
	userName = username;
	console.log('what is your email?'.cyan);
	console.log();
	var email = readline('---> '.green);
	runMakePassword(username, email);
}

function runMakePassword(uname, email){
	console.log('what do uu not want ur password to not be?'.cyan);
	console.log();
	var pass1 = readline('---> '.green);
	console.log('yo betta tyype your password again foe da numa one\nverificationanashon dat you know what you dun typesed.'.cyan);
	console.log();
	var pass2 = readline('---> '.green);
	if (pass1 === pass2) {
		createUser(skribblURL, uname, email, pass1 , function(err, data){
			if (err) {
				console.log('errr: something went wrong'.cyan);
				return runCreateUser();
			}
			// login and save token
			login(skribblURL, email, pass1, handleLogin);
		});	
	}else { 
	console.log('dem friggin passwords aint match'.rainbow);
	runMakePassword(uname, email);
	}
}

function handleLogin(err, data){
	if (err) {
		console.log('erororor: something went wrong lgin in'.cyan);
		return runLoginvsCreate(); 
	}
	if (!data.eat){
		console.log('yaw maing that username or pasword was incorrect');
		return runLoginvsCreate(); 
	}	
	userToken = data.eat;
	token.settoken(data.eat, userName, function(err){
		if (err) {
			console.log('eeek: there was an err barrying ur login deets'.cyan);
			return runLoginvsCreate(); 
		}
		menu();
	});
}

function runLogin(){
	console.log('wat is your email?'.cyan);
	console.log();
	var username = readline('---> '.green);
	userName = username;
	console.log('what is your numba one topsy sekret  password?'.cyan);
	console.log();
	var passwd = readline('---> '.green);
	console.log('eau yea, seu um, like what is your email?'.cyan);
	console.log();
	var email = readline('---> '.green);
	login(skribblURL, email, passwd, handleLogin);
}

function runStartSkribblin(){
	randomStoryFetch(skribblURL, '', function(err, res){
		if (err){
			console.log('dawg nabbit, that didnt work'.magenta);
			return menu();
		}
		return handleRunSkribbl(res[0]._id);
	});
}

function runQuit(){
	console.log('bye, thank you!');
	return 0;
}

function runBrowse(){
	storysBrowse(skribblURL, function(err, res){
		if (err){
			console.log('ithink some something went wrong'.blue);
			return menu();
		}
		handleBrowser(res, 0);
	});
}

function handleBrowser(res, startPos){
	console.log('chose a story!'.cyan);
	var printCount = startPos + 5;
	if (res.length < 0) {
		console.log('no storys were found, you should go write one :)'.blue);
		return menu();
	}
	if (res.length < printCount ) printCount = res.length;
	var optionsArry = ['m', 'q', 'b'];
	for (var i = startPos; i < printCount; i++){
		console.log((i+1) + '   ' + res[i].story_name.blue + '\n        ' + res[i].content.substr(0, 42).trim() + '...'.green); 
		optionsArry.push(Number(i+1).toString());
	}	
	console.log('---> m to browse more storys'.cyan);
	console.log('---> b to return to menu'.cyan);
	console.log('---> [num] to read and fork story...'.cyan);
	console.log();
	var input = readline('---> '.green);
	if (optionsArry.indexOf(input) < 0) {
		console.log('yo that input didnt work'.blue);
		console.log(optionsArry);
		return handleBrowser(res, startPos);
	}
	if (input == 'q') {
		return runQuit();
	}
	if (input == 'b'){
		return menu();
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
	if (first_skribbl.children.length === 0) {
		console.log('you have foundyourself at the maximum depth o\' dis story'.blue);
		//console.log('---> f to fork and coninue the story'.cyan);
		//console.log('---> b to return to menu'.cyan);
	}
	var inputValidation = ['f', 'b'];
	for (var i = 0; i < first_skribbl.children.length; i++){
		console.log( (i + 1) + '    ' + first_skribbl.children[i].content.substr(0, 40).trim() + '...'.green);
		inputValidation.push(Number(i+1).toString());
	}	
		console.log();
		console.log('---> f to fork and coninue the story'.cyan);
		console.log('---> b to return to menu'.cyan);
	console.log();
		var input = readline('---> '.green);
		if (inputValidation.indexOf(input) < 0) {
			console.log('yiksies, that wernt a choose');
			return handkleSkribblChildren(skribblTree);
		}
		if (input == 'f') {
			var parnt_id = first_skribbl._id;
			var stry_name = first_skribbl.story_name;
			var stry_id;
			if (first_skribbl.parent_skribbl === null) {
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
	fetchTimeline(skribblURL, userName, function(err, res){
		if (err) {
			console.log('sorry to inform you, i know this might be hard on the ears\nbut you dont exists'.magenta);
			return menu();
		}
		console.log('heres all your posts'.blue);
		return handleBrowser(res, 0);
	});
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
	console.log();
	skribblObj.story_name = readline('---> '.green);
	console.log('wart genre gunna be dis soon too be page-turner?'.magenta);
	console.log();
	skribblObj.genre = readline('---> '.green);
	console.log('eh, whuteva... i guess that doesnt sound tooo clechie'.magenta);
	console.log('start ur story then!'.magenta);
	console.log();
	skribblObj.content = readline('---> '.green);
	skribblObj.parent_skribbl = null;
	skribblObj.author = userName;
	postSkribbl( skribblURL, skribblObj, userToken, function(err, data){
		if (err) {
			console.log('yikes, sury buddy that didnt work'.blue);
			return menu();
		}
		console.log('lul, your gunna be a rock star!'.magenta);
		console.log(data);
		return menu();
	});
}

function handleForkAStory(story_name, parrent_id, story_id, genre){
	var skribblObj = {};
	skribblObj.story_name = story_name;
	skribblObj.story_id = story_id;
	skribblObj.parent_skribbl = parrent_id;
	skribblObj.author = userName;
	skribblObj.genre = genre;
	console.log('nows your chance to ruin this cute attempt at literature\ngo ahead... do your worst!'.cyan); 
	console.log();
	var input = readline('---> '.green);
	if (input === '') {
		console.log('awww sluuuug, i wont let you get away with not trying... write something'.blue);
		return handleForkAStory(story_name, parrent_id, story_id, genre);
	}
	skribblObj.content = input;
	postSkribbl(skribblURL, skribblObj, userToken, function(err, res) {
		if (err){
			console.log('fudge bro. ive faild you, that didnt quite work on my end'.blue);
			return menu();
		}
		console.log('wow, beautiful work homie, i can tell ur gunnz be a valuble member of the skribbl comunity'.blue);
		return menu();

	});
}


// start program
