const { validationResult } = require("express-validator/check");
const bcrypt = require("bcrypt");

const User = require("../models/users");
const errorHandler = require("../utils/error-handler");

// Criar Usuário
exports.createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      error = errorHandler.createError("Validation Failed", 422, errors);
      throw error;
    }

    const username = req.body.username;
    const email = req.body.email;
    const senha = await bcrypt.hash(req.body.senha, 10);

    const hasUser = await User.findOne({ email });
    if (hasUser) {
      error = errorHandler.createError("E-mail em uso", 422);
      throw error;
    }

    const user = new User({
      username,
      email,
      senha
    });

    const result = await user.save();
    res.status(201).json({
      _id: result._id,
      username: result.username,
      email: result.email
    });
    return;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
