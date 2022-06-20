const express = require("express");
const router = express.Router();

const searchRouter = require("../routes/search.router");
const reviewsRouter = require("../routes/reviews.router");
const usersRouter = require("../routes/user.router");

module.exports = (app) => {
  app.use("/api/search", searchRouter);
  app.use("/api/reviews", reviewsRouter);
  app.use("/api/users", usersRouter);

  app.get("/", function (req, res) {
    res.set("content-type", "text/html");
    res.send("Great! It works. Welcome to MERN API!");
  });
};
