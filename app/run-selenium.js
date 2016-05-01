 /*
  * Made to accept userInfo input and state vars, and pass them along to dynamically run selenium script
  * 
  * ~ Currently not tested or workingv
  */

var state = require('./states/indiana.js');
var selenium = require('selenium-standalone');
var webdriverio = require('webdriverio');
var exec = require('child_process').exec;

var userInfo = {
	'county': 'Knox',
	'firstName': 'John',
	'lastName': 'Gregg',
	'birthdate': '09/06/1954'
};

var seleniumCallback = function(error, child) {
	if (error) {
		console.error(error);
	}

	try {
		var options = { desiredCapabilities: { browserName: 'phantomjs' } };
		var client = webdriverio.remote(options);
		state.verifyRegistration(client.init(), userInfo)
			.endAll()
			.then(function() {
				child.kill();
			});

	} catch (error) {
		console.log('Error ~ ', error);
		if (child) {
			child.kill();
		}
	}
};

var seleniumSetup = function(state, submittedUserInfo) {
	selenium.install({
		baseURL: 'https://selenium-release.storage.googleapis.com',
		drivers: {
			chrome: {
				arch: process.arch,
				baseURL: 'https://chromedriver.storage.googleapis.com'
			},
			ie: {
				arch: process.arch,
				baseURL: 'https://selenium-release.storage.googleapis.com'
			}
		}
	}, function() {
		if (submittedUserInfo) {
			userInfo = submittedUserInfo;
		}

		selenium.start({
			seleniumArgs: ["-Dphantomjs.binary.path=" + __dirname + "\\..\\node_modules\\phantomjs-prebuilt\\lib\\phantom\\bin\\phantomjs.exe"]
		},seleniumCallback);
	});
};

module.exports = {
	init: seleniumSetup
};
