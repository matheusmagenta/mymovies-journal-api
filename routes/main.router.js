const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const {
  getMovieInfoFromApiByID,
  getMoviesFromApiByQuery,
  getRecommendationFromApiByID,
  getStreamingFromApiByID,
  getTrendingMoviesFromApiWeek,
  getStreamingFilteredByService,
  getBestNetflixMovies,
  getDiscoverMovies,
} = require("../controllers/main.controller.js");
const { findOneAndDelete } = require("../models/movie.model.js");
const MovieSchema = require("../models/movie.model.js");

const router = express.Router();
const storage = []; // for testing purposes
const users = []; // for testing purposes

/* GET home page. */
router.get("/", function (req, res, next) {
  try {
    res.render("index");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = { router, users };
