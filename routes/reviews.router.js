const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const reviewsController = require("../controllers/reviews.controller.js");

const router = express.Router();

/* GET latest reviews from DB */
router.get("/latest", reviewsController.getLatestReviewsFromDB);

/* GET most reviewed movies from DB */
router.get("/popular", reviewsController.getMostReviewedMoviesFromDB);

/* GET movies of myMovies page. */
router.get("/:userId", reviewsController.getUserReviewsFromDB);

/* POST adding movie with review to myMovies page. */
router.post("/", reviewsController.addReviewToMovieListInDB);

/* POST/UPDATE movies of myMovies page. */
// TODO: refactor to api/movies/:id PADRÃO DA ARQUITETURA REST
router.get("/movies/:id/edit", reviewsController.getToUpdateMovieListInDB);
router.post("/movies/:id", reviewsController.postToUpdateMovieListInDB);

/* POST movies/reviews of myMovies page. */
router.post("/movies/:id/delete", reviewsController.deleteFromMovieListFromDB);

/* POST adding movie to watchlist section on myMovies page. */
/* router.post("/add-to-watchlist", reviewsController.addMovieToWatchListToDB);
 */
module.exports = router;
