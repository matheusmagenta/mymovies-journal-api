const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const MovieSchema = require("../models/movie.model.js");

const searchController = require("../controllers/search.controller.js");

const router = express.Router();

/* GET movie card details page. */
router.get("/movies/:id", searchController.getMovieCardById);

/* GET search by query. */
router.get("/search/:query", searchController.searchByQuery);

/* GET trending movies this week */
router.get("/trending", searchController.getTrendingMoviesFromApi);

module.exports = router;
