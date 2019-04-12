const { validationResult } = require("express-validator/check");
const ObjectId = require("mongoose").Types.ObjectId;

const errorHandler = require("../utils/error-handler");
const Ferramenta = require("../models/tools");

// GET /tools
exports.getFerramentas = async (req, res, next) => {
  try {
    const tag = req.query ? req.query.tag : null;
    const query = tag ? { tags: { $all: tag } } : null;
    const ferramentas = await Ferramenta.find(query);
    if (!ferramentas) {
      const error = errorHandler.createError(
        "Nenhuma ferramenta encontrada",
        404
      );
      throw error;
    }
    res.status(200).json(ferramentas);
    return;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

// GET /tools/:idFerramenta
exports.getFerramenta = async (req, res, next) => {
  try {
    const idFerramenta = req.params.idFerramenta;

    if (!ObjectId.isValid(idFerramenta)) {
      const error = errorHandler.createError("ID inválido", 422);
      throw error;
    }
    const ferramenta = await Ferramenta.findById(idFerramenta);
    if (!ferramenta) {
      error = errorHandler.createError("Nenhuma ferramenta encontrada", 404);
      throw error;
    }
    res.status(200).json(ferramenta);
    return;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

// POST /tools
exports.createFerramenta = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errorHandler.createError("Validation failed", 422, errors);
      throw error;
    }

    const title = req.body.title;
    const link = req.body.link;
    const description = req.body.description;
    const tags = req.body.tags;

    const ferramenta = new Ferramenta({
      title,
      link,
      description,
      tags
    });

    await ferramenta.save();
    res.status(201).json(ferramenta);
    return;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

// PUT /tools/:idFerramenta
exports.updateFerramenta = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errorHandler.createError("Validation failed", 422, errors);
      throw error;
    }

    const idFerramenta = req.params.idFerramenta;
    if (!ObjectId.isValid(idFerramenta)) {
      const error = errorHandler.createError("ID inválido", 422);
      throw error;
    }

    const ferramenta = await Ferramenta.findById(idFerramenta);

    if (!ferramenta) {
      error = errorHandler.createError("Nenhuma ferramenta encontrada", 404);
      throw error;
    }

    ferramenta.set(req.body);
    await ferramenta.save();
    res.status(200).json(ferramenta);
    return;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

// DELETE /tools/:idFerrmanta
exports.deleteFerramenta = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      error = errorHandler.createError("Validation failed", 422, errors);
      throw error;
    }

    const idFerramenta = req.params.idFerramenta;
    if (!ObjectId.isValid(idFerramenta)) {
      error = errorHandler.createError("ID inválido.", 422);
      throw error;
    }

    const ferramenta = await Ferramenta.findById(idFerramenta);
    if (!ferramenta) {
      error = errorHandler.createError("Ferramenta não encontrada", 404);
      throw error;
    }

    await Ferramenta.findOneAndDelete(idFerramenta);
    res.status(200).json();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
