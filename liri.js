require("dotenv").config();
var fs = require("fs");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var axios = require("axios");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

var artist = process.argv.slice(3).join(" ");
var songName = process.argv.slice(3).join(" ");
var movieName = process.argv.slice(3).join(" ");
var userInput = process.argv[2];

function concert() {
    if (artist === "") {
        console.log("~~~~~~~~~~~~~~~~~~")
        console.log("Please enter an artist you'd like to see in concert after 'concert-this'.");
        return;
    }
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function(response) {
        if (response.data[0] === undefined) {
            console.log("~~~~~~~~~~~~~~~~~~")
            console.log("Sorry, no upcoming dates.  Try another artist.")
        };
    
        for (var i = 0; i < response.data.length; i++) {
        console.log("~~~~~~~~~~~~~~~~~~")
        console.log(response.data[i].venue.name);
        console.log(response.data[i].venue.city + ", " + response.data[i].venue.country);
        console.log(moment(response.data[i].datetime).format("MM/DD/YYYY"));
        }
    })
    .catch(function(error) {
        if (error.response) {
        console.log(error.response)
        }
    })
};

function song() {
    if (songName === "") {
        songName = "The Sign";
    }
    spotify.search({ type: 'track', query: songName }, function(err, response) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        console.log("~~~~~~~~~~~~~~~~~~")
        console.log("Artist: " + response.tracks.items[0].artists[0].name + "\n"); 
        console.log("Song name: " + response.tracks.items[0].name + "\n");
        console.log("Album name: " + response.tracks.items[0].album.name + "\n");
        console.log("Preview URL: " + response.tracks.items[0].preview_url);

      });
};

function movie() {
    if (movieName === "") {
        movieName = "Mr. Nobody"
    }

    axios.get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy")
    .then(function(response) {
        console.log("~~~~~~~~~~~~~~~~~~")
        console.log(response.data.Title + "\n");
        console.log("Released in " + response.data.Year + ".\n");
        console.log("IMDB rating: " + response.data.Ratings[0].Value);
        console.log("Rotten Tomatoes rating: " + response.data.Ratings[1].Value + "\n");
        console.log("Produced in " + response.data.Country + ".\n");
        console.log("Languages: " + response.data.Language + "\n");
        console.log("Plot summary: " + response.data.Plot + "\n");
        console.log("Starring: " + response.data.Actors);
    })
    .catch(function(error) {
        if (error.response) {
            console.log(error.response)
        }
    })
}

function doWhat() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        var randNum = Math.floor(Math.random() * 3);
        if (randNum === 0) {
        songName = dataArr[1];
        song();
        } else if (randNum === 1) {
            movieName = dataArr[3];
            movie();
        } else if (randNum === 2) {
            artist = dataArr[5];
            concert();
        }
    })
}








switch(userInput) {
    case "concert-this":
        concert();
        break;
    case "spotify-this-song":
        song();
        break;
    case "movie-this":
        movie();
        break;
    case "do-what-it-says":
        doWhat();
        break;
    default:
        console.log("\nPlease use a valid command: \n\n concert-this \n spotify-this-song \n movie-this \n do-what-it-says")
};

