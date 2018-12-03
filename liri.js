
require("dotenv").config();


import Spotify from "node-spotify-api";

import { spotify as _spotify } from "./keys";

import { get } from "axios";

import moment from "moment";

import { readFile } from "fs";

var spotify = new Spotify(_spotify);


var retrieveArtistNames = function(artist) {
  return artist.name;
};

var retrieveSpotify = function(songName) {
  if (songName === undefined) {
    songName = "What's my age again";
  }

  spotify.search(
    {
      type: "track",
      query: songName
    },
    function(err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }

      var songs = data.tracks.items;

      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log("artist(s): " + songs[i].artists.map(retrieveArtistNames));
        console.log("song name: " + songs[i].name);
        console.log("preview song: " + songs[i].preview_url);
        console.log("album: " + songs[i].album.name);
        console.log("-----------------------------------");
      }
    }
  );
};

var retrieveBands = function(artist) {
  var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

  get(queryURL).then(
    function(result) {
      var jsonData = result.data;

      if (!jsonData.length) {
        console.log("No results found for " + artist);
        return;
      }

      console.log("Upcoming concerts for " + artist + ":");

      for (var i = 0; i < jsonData.length; i++) {
        var show = jsonData[i];


        console.log(
          show.venue.city +
            "," +
            (show.venue.region || show.venue.country) +
            " at " +
            show.venue.name +
            " " +
            moment(show.datetime).format("MM/DD/YYYY")
        );
      }
    }
  );
};

var retrieveMovie = function(movieName) {
  if (movieName === undefined) {
    movieName = "Mr Nobody";
  }

  var detailLink =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

  get(detailLink).then(
    function(result) {
      var jsonData = result.data;

      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
      console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
    }
  );
};
var doWhatItSays = function() {
  readFile("random.txt", "utf8", function(error, data) {
    console.log(data);

    var arrangedObservations = data.split(",");

    if (arrangedObservations.length === 2) {
      setup(arrangedObservations[0], arrangedObservations[1]);
    } else if (arrangedObservations.length === 1) {
      setup(arrangedObservations[0]);
    }
  });
};


var setup = function(caseData, functionData) {
  switch (caseData) {
  case "concert-this":
    retrieveBands(functionData);
    break;
  case "spotify-this-song":
    retrieveSpotify(functionData);
    break;
  case "movie-this":
    retrieveMovie(functionData);
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log("LIRI doesn't know that");
  }
};

var deploy = function(argOne, argTwo) {
  setup(argOne, argTwo);
};


deploy(process.argv[2], process.argv.slice(3).join(" "));
