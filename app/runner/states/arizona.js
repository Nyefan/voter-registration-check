//this state has not yet been tested
const Q = require('q');
const URL = "https://voter.azsos.gov/VoterView/RegistrantSearch.do";
const NAME = 'Arizona';
const INFO = {
    'lastName':'#nameLast',
    'dobMonth':'#dobMonth',
    'dobDay':'#dobDay',
    'dobYear':'#dobYear',
    'county':'#county',
    'voter-id':'#voterId',
    'dl-number':'#DLN',
    'submit':'input[type="submit"]',
    // I have no way to test this yet
    //'status': '#registrant > span:nth-of-type(4)',
    //'expectedStatus':'ACTIVE'
};

var user = {
    'county':'',
    'firstName':'',
    'lastName':'',
    'birthdate':'',
    'voter-id':'',
    'dl-number':'',
    'expectedParty':'Democratic'
};

var verifyRegistration = function(client, user) {
	try {
		if (user && typeof user['birthdate'] === "string") {
			var splitBirth = user['birthdate'].split('/');
			user['dobYear'] = splitBirth[2];
			user['dobDay'] = splitBirth[1];
			user['dobMonth'] = splitBirth[0];
		}
	}
	catch(error) {
		console.error(error);
	}

	return Q.promise(function(resolve, reject) {
		client
			.url(URL)
                        .selectByVisibleText(INFO['county'], user['county'])
			.setValue(INFO['lastName'], user['lastName'])
			.selectByValue(INFO['dobMonth'], user['dobMonth'])
                        .selectByValue(INFO['dobYear'], user['dobYear'])
                        .selectByValue(INFO['dobDay'], user['dobDay'])
                        .setValue(INFO['voter-id'], user['voter-id'])
                        .setValue(INFO['dl-number'], user['dl-number'])
			.click(INFO['submit'])
			.waitForExist(INFO['status'], 5000)
			.getText(INFO['status'])
			.then(function(value) {
				resolve(INFO['expectedStatus'] === value.trim());
			});
	});
};

module.exports = {
	verifyRegistration:verifyRegistration,
        user:user,
        name:NAME
};
