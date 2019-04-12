const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator/check");

const {
  privateKey,
  refreshTokenPrivateKey,
  refreshTokenPublicKey
} = require("../utils/config");

const User = require("../models/users");
const errorHandler = require("../utils/error-handler");

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      error.errorHandler.createError("Validation failed", 422, errors);
      throw error;
    }

    const email = req.body.email;
    const senha = req.body.senha;
    const user = await User.findOne({ email }).select("+senha");

    if (!user) {
      const error = errorHandler.createError("E-mail não cadastrado", 401);
      throw error;
    }
    const isEqual = await bcrypt.compare(senha, user.senha);

    if (!isEqual) {
      const error = errorHandler.createError("Senha inválida", 401);
      throw error;
    }
    const token = await jwt.sign(
      {
        username: user.username,
        email: user.email
      },
      privateKey,
      { expiresIn: "1h", algorithm: "RS256" }
    );
    const refreshToken = await jwt.sign(
      {
        username: user.username,
        email: user.email
      },
      refreshTokenPrivateKey,
      { algorithm: "RS256" }
    );
    let expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    res.status(200).json({
      token,
      refreshToken,
      expiryDate: expiryDate.toString()
    });
    return; // return the promise for testing
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err; // return the promise for testing
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      error.errorHandler.createError("Validation failed", 422, errors);
      throw error;
    }

    const refreshToken = req.body.refreshToken;
    let decodedToken;

    try {
      decodedToken = await jwt.verify(refreshToken, refreshTokenPublicKey);
      if (!decodedToken) throw new Error();
    } catch (err) {
      err.message = "Token inválido";
      err.statusCode = 500;
      throw err;
    }

    const username = decodedToken.username;
    const user = await User.findOne({ username });
    if (!user) {
      const error = errorHandler.createError("Token inválido", 500);
      throw error;
    }

    const token = await jwt.sign(
      {
        username: user.username,
        email: user.email
      },
      privateKey,
      { expiresIn: "1h", algorithm: "RS256" }
    );
    let expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    res.status(200).json({
      token,
      expiryDate: expiryDate.toString()
    });
    return; // return the promise for testing
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err; // return the promise for testing
  }
};
