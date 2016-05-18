const selenium = require('selenium-standalone');
const webdriverio = require('webdriverio');
const statePath = '../main/states/';
var phantomPath = require('phantomjs-prebuilt').path;

// States that are commented out don't yet have submission scripts

var getPath = function(stateName) {
    return statePath + stateName + '.js';
}

const alabama = require(getPath('alabama));
//const alaska = require(getPath('alaska'));
//const arizona = require(getPath('arizona'));
//const arkansas = require(getPath('arkansas'));
//const california = require(getPath('california'));
//const colorado = require(getPath('colorado'));
//const connecticut = require(getPath('connecticut'));
//const delaware = require(getPath('delaware'));
//const florida = require(getPath('florida'));
//const georgia = require(getPath('georgia'));
//const hawaii = require(getPath('hawaii'));
//const idaho = require(getPath('idaho'));
//const illinois = require(getPath('illinois'));
const indiana = require(getPath('indiana'));
//const iowa = require(getPath('iowa'));
const kansas = require(getPath('kansas'));
const kentucky = require(getPath('kentucky'));
//const louisiana = require(getPath('louisiana'));
//const maine = require(getPath('maine'));
//const massachusetts = require(getPath('massachusetts'));
//const michigan = require(getPath('michigan'));
//const minnesota = require(getPath('minnesota'));
//const missouri = require(getPath('missouri'));
const montana = require(getPath('montana'));
//const nebraska = require(getPath('nebraska'));
//const nevada = require(getPath('nevada'));
//const newHampshire = require(getPath('new-hampshire'));
//const newJersey = require(getPath('new-jersey'));
//const newMexico = require(getPath('new-mexico'));
//const newYork = require(getPath('new-york'));
//const northCarolina = require(getPath('north-carolina'));
//const northDakota = require(getPath('north-dakota'));
//const ohio = require(getPath('ohio'));
//const oklahoma = require(getPath('oklahoma'));
const oregon = require(getPath('oregon'));
//const pennsylvania = require(getPath('pennsylvania'));
//const rhodeIsland = require(getPath('rhode-island'));
//const southCarolina = require(getPath('south-carolina'));
//const southDakota = require(getPath('south-dakota'));
//const tennessee = require(getPath('tennessee'));
//const texas = require(getPath('texas'));
//const utah = require(getPath('utah'));
//const vermont = require(getPath('vermont'));
//const virginia = require(getPath('virginia'));
//const washington = require(getPath('washington'));
const westVirginia = require(getPath('west-virginia'));
//const wisconsin = require(getPath('wisconsin'));
//const wyoming = require(getPath('wyoming'));


var runTests = function() {
    
    var seleniumRunner = {
        install: function() {
            // Runs selenium.install, then triggers start
            var complete = seleniumRunner.start;
            var settings = {
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
            };
            selenium.install(settings, complete);
        },
        start: function() {
            // Runs selenium.start, then hooks into afterStart
            var afterStart = seleniumRunner.afterStart;
            selenium.start(afterStart);
        },
        error: function(error, child, caller) {
            // If error occurs during start, show error and kill child
            if (typeof error !== "string") {
                error = error.toString();
            }
            if (child) {
                child.kill();
            }
            console.log("From " + caller + " - " + error);
        },
        afterStart: function(error, child) {
            // After starting selenium, try to run chosen state's script
            if (error) {
                seleniumRunner.error(error, child, "seleniumRunner.afterStart");
            } else {
                
                
                
                /* Passing Tests */
                runStateTest(alabama, child);
                runStateTest(indiana);
                runStateTest(kansas);
                runStateTest(kentucky);
                runStateTest(montana);
                runStateTest(oregon);
                runStateTest(westVirginia);
                //*/
            }
            
            //child.kill();
        }
    };
    
    seleniumRunner.install();
};

var runStateTest = function(state, child) {
    try {
        var client = webdriverio.remote({
            'desiredCapabilities': { 
                'browserName': 'phantomjs',
                'phantomjs.binary.path': phantomPath
            } 
        });
        
        state.verifyRegistration(client.init(), state.user)
            .then(
                function() { console.log(state.name + '\t\tpassed') },
                function() { console.log(state.name + '\t\tfailed') },
                function() { console.log(state.name + '\t\tprogress')}
            );
    }
    catch (error) {
        seleniumRunner.error(error, child);
    }
    
};


console.log('Running State Tests...');
runTests();
