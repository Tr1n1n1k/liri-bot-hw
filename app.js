var majorKeyAlert = require('./keys.js');
var twitterAlert = require('./data/twitter_config.js');
var twitterKeys = majorKeyAlert.twitterKeys;

var request = require('request');
var spotify = require('spotify');
var fs = require('fs');

var userAction = process.argv[2];

var inputArray = process.argv;
var newUserInput = '';

for (var i = 3; i < inputArray.length; i++) {
  if (i > 3 && i < inputArray.length) {
    newUserInput = newUserInput + '+' + inputArray[i];
  } else {
    newUserInput += inputArray[i];
  }
}

console.log('Checking user input array: ' + newUserInput);

switch (userAction) {
  case 'check-my-tweets':
    tweets();
    break;
  case 'omdb-this-movie':
    omdb();
    break;
  case 'spotify-this-song':
    spot();
    break;
  case 'do-what-it-says':
    doIt();
    break;
  default:
    instructions();
}

function tweets() {
  var error = function(err, response, body) {
    console.log('ERROR [%s]', err);
  };
  var success = function(body) {
    var twitterReply = JSON.parse(body);
    for (var i = 0; i < twitterReply.length; i++) {
      console.log(twitterReply[i].text);
    }
  };

  var Twitter = require('twitter-node-client').Twitter;

  var twitter = new Twitter({
    consumer_key: twitterAlert.twitterKeys.consumer_key,
    consumer_secret: twitterAlert.twitterKeys.consumer_secret,
    access_token_key: twitterAlert.twitterKeys.access_token_key,
    access_token_secret: twitterAlert.twitterKeys.access_token_secret
  });

  twitter.getUserTimeline(
    {
      screen_name: 'MrMarcReno',
      count: '10'
    },
    error,
    success
  );
  if (!error) {
    console.log(success);
  }
}

function omdb() {
  if (newUserInput === '') {
    newUserInput = 'Mr. Nobody';
  }

  var queryBase = 'http://www.omdbapi.com/?t=';
  var queryURL = queryBase + newUserInput;

  request(queryURL, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('Title: ' + JSON.parse(body).Title);
      console.log('Year: ' + JSON.parse(body).Year);
      console.log('IMDB Rating: ' + JSON.parse(body).imdbRating);
      console.log('Country Produced: ' + JSON.parse(body).Country);
      console.log('Language: ' + JSON.parse(body).Language);
      console.log('Plot: ' + JSON.parse(body).Plot);
      console.log('Actors: ' + JSON.parse(body).Actors);
      console.log('RT Rating: ' + JSON.parse(body).Ratings[1].Value);
    }
  });
}

function spot() {
  if (newUserInput === '') {
    newUserInput = 'In Da Club';
  }
  spotify.search(
    {
      type: 'track',
      query: newUserInput
    },
    function(err, data) {
      if (err) {
        console.log('Error occurred: ' + err);
        return;
      }

      console.log('Song Name: ' + data.tracks.items[0].name);
      console.log('Artist(s) Name: ' + data.tracks.items[0].artists[0].name);
      console.log(
        'Link to Song: ' + data.tracks.items[0].external_urls.spotify
      );
      console.log('Album Name: ' + data.tracks.items[0].album.name);
    }
  );
}

function doIt() {
  fs.readFile('random.txt', 'utf8', function(error, data) {
    if (error) throw error;

    instructionArray = data.split(',');

    userAction = instructionArray[0];
    newUserInput = instructionArray[1];

    switch (userAction) {
      case 'check-my-tweets':
        tweets();
        break;
      case 'omdb-this-movie':
        omdb();
        break;
      case 'spotify-this-song':
        spot();
        break;
      case 'do-what-it-says':
        doIt();
        break;
      default:
        instructions();
    }
  });
}

function instructions() {
  console.log('Hi there! This Node.js app has limited functionality.');
  console.log('You can do four things:');
  console.log(
    "1) Query movie titles on OMDB using the action term 'omdb-this-movie' followed by the movie title."
  );
  console.log(
    "2) Query song titles on Spotify using the action term 'spotify-this-song' followed by the song title."
  );
  console.log(
    "3) Check you last 10 tweets using the action term 'check-my-tweets'."
  );
  console.log(
    "4) Run some random instruction using the action term 'do-what-it-says'."
  );
  console.log(
    "The syntax would look something like this 'node liri.js omdb-this-movie scarface'"
  );
  console.log('Thanks for playing!');
}
