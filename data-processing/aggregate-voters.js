var request = require('request');
var mongoose = require('mongoose');
require('./models/rawPoliticalStrategies');
mongoose.connect('mongodb://localhost/voters');





var makeRawPoliticalStrategy = function(inputHtml, inputVoterNum) {
    var RawPoliticalStrategy = mongoose.model('RawPoliticalStrategy');

    var rawPoliticalStrategy = new RawPoliticalStrategy({
      voterNum: inputVoterNum,
      html: inputHtml
    });

    rawPoliticalStrategy.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Saved Voter HTML: ' + inputVoterNum);
      }
    });
};




var scrapePoliticalStrategies = function(voterNum, callback) {
    request('http://www.politicalstrategies.com/voter/' + voterNum, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body, voterNum);
        }
    });
};


var scrapeAllPoliticalStrategies = function(firstVoter, lastVoter) {
    for (i = firstVoter; i <= lastVoter; i++) {
        scrapePoliticalStrategies(i, makeRawPoliticalStrategy);
    }
}

// Max is around 57000000, around half the total number of registered voters in the US
scrapeAllPoliticalStrategies(1,100000);


// https://iservices.intelius.com/premier/search.php?componentId=1&qf=Anthony&qn=Erjavec&qcs=Cleveland%2C+OH
