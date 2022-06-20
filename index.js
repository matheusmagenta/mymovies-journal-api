if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const axios = require("axios");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
// app.use("/", indexRouter);
// app.use('/users', usersRouter);

app.listen(
  process.env.PORT,
  console.log(`now connected on port ${process.env.PORT}`)
);

/* if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/app/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "app", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
} */

// TODO: TESTING CONTROLLERS AND ROUTES
// testing
require("./config/routes")(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// database setup
mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected to database"));

module.exports = app;
