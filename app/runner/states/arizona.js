//TODO: Test this script once we have a valid test case
"use strict";

const _ = require('lodash');
const Q = require('q');
const help = require('../lib/utils.js');

let state = {
	NAME: 'Arizona',
	URL: "https://voter.azsos.gov/VoterView/RegistrantSearch.do",
	default: {
		//TODO: Get a valid test case
		'county':'',
		'firstName':'',
		'lastName':'',
		'birthdate':'',
		'voter-id':'',
		'dl-number':''
	},
	selectorMap: {
		'lastName':'#nameLast',
		'dobMonth':'#dobMonth',
		'dobDay':'#dobDay',
		'dobYear':'#dobYear',
		'county':'#county',
		'voter-id':'#voterId',
		'dl-number':'#DLN',
		'submit':'input.search-button',
		//TODO: Implement this once we have a valid test case
		'status': '#registrant > span:nth-of-type(4)',
		'expectedStatus': 'Active'
	},
	_init: function() {
		_.bindAll(this, 'verifyRegistration', 'manipulateData', 'script');
	},
	verifyRegistration: function(driver, user) {
		if (!driver || !user) {
			console.error(driver, user);
			throw new Error('required arguments missing, driver, user');
		}

		this.driver = driver;
		this.user = this.manipulateData(user);

		let script = this.script;
		return Q.promise(script);
	},

	manipulateData: function(u) {
		// If any UserInfo needs massaging...
		let splitDate = u.birthdate.split('/');

		u.dobMonth = splitDate[0];
		u.dobDay = splitDate[1];
		u.dobYear = splitDate[2];

		return u;
	},

	script: function(resolve, reject) {
		let d = this.driver;
		let i = this.selectorMap;
		let u = this.user;
		let URL = this.URL;

		help.goTo(d, URL);
		Object.keys(i)
			.forEach(function(key) {
				if (i[key] && u[key]) {
					help.setValue(d, i[key], u[key]);
				}
			});

		help.findElement(d, i['submit'])
			.then(function(element) {
				element.click();
				return help.findElement(d, i['status']); // Promise
			})
			.then(function(element) {
				return element.getText(); // Promise
			})
			.then(function(text) {
				let result = (text.trim() === i['expectedStatus']);
				(result) ? resolve('Active') : reject('Inactive');
			});
	}
};

state._init();

module.exports = state;
