require("dotenv").config();

const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

exports.registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // checks if user with email sent exists
    const user = await User.findOne({
      email: req.body.email,
    });
    // console.log("user: ", user);
    if (user) {
      return res.status(400).send("email already registered");
    }

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    if (newUser) {
      res.send({ message: "user created", data: newUser });
    }
  } catch (error) {
    return res.status(400).send("user not created");
  }
};

const generateAccessToken = (params = {}) => {
  // TODO: change access token secret to env constant

  return jwt.sign({ params }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10000",
  });
};

const generateRefreshToken = (params = {}) => {
  // TODO: change access token secret to env constant

  return jwt.sign({ params }, process.env.REFRESH_TOKEN_SECRET);
};

// TODO: refactor
// just for testing purposes. need to be in DB
let refreshTokens = [];

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email,
    });
    // console.log("user: ", user);
    if (!user) {
      return res.status(404).send({ message: "user do not found" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ message: "Invalid password! Try again!" });
    }
    const accessToken = generateAccessToken({
      id: user._id,
    });
    console.log("accessToken: ", accessToken);

    const refreshToken = generateRefreshToken({
      id: user._id,
    });
    console.log("refreshToken: ", refreshToken);

    refreshTokens.push(refreshToken);

    return res.send({
      data: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

exports.authenticateUser = async (req, res, next) => {
  // get auth header value
  const bearerHeader = req.headers["authorization"];
  // split at the space
  const bearerToken = bearerHeader && bearerHeader.split(" ")[1];
  if (bearerToken == null) return res.sendStatus(401);

  jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

exports.tokenUser = async (req, res, next) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  // check if there is a valid refreshToken: it was removed or it is still good?
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ id: user._id });
    res.send({ accessToken: accessToken });
  });
};

exports.logoutUser = async (req, res, next) => {
  console.log("BEFORE refreshTokens: ", refreshTokens);
  console.log("req.body: ", req.body);
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
  console.log("AFTER refreshTokens: ", refreshTokens);
};
